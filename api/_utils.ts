import { createClient } from '@supabase/supabase-js';

type AnyObject = Record<string, any>;

const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
const supabaseServiceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

const serverKey = supabaseServiceRoleKey || supabaseAnonKey;

if (!supabaseUrl || !serverKey) {
  // eslint-disable-next-line no-console
  console.warn('Supabase server API env missing. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

export const serverSupabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serverKey || 'placeholder'
);

const authSupabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || serverKey || 'placeholder'
);

const getBearerToken = (req: AnyObject): string | null => {
  const rawAuth = req.headers?.authorization || req.headers?.Authorization;
  if (!rawAuth || typeof rawAuth !== 'string') return null;
  const parts = rawAuth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};

const getAllowedEmails = (): string[] => {
  const raw = getEnv('ADMIN_EMAILS') || getEnv('VITE_ADMIN_EMAILS') || '';
  return raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
};

export const parseBody = (req: AnyObject): AnyObject => {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body as AnyObject;
};

export const requireAdmin = async (req: AnyObject, res: AnyObject): Promise<AnyObject | null> => {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  const { data, error } = await authSupabase.auth.getUser(token);
  if (error || !data?.user) {
    res.status(401).json({ error: 'Invalid session' });
    return null;
  }

  const user = data.user;
  const allowedEmails = getAllowedEmails();
  const isRoleAdmin = user.app_metadata?.role === 'admin';
  const isAllowedEmail =
    !!user.email && allowedEmails.includes(user.email.toLowerCase());

  const isAdmin = allowedEmails.length > 0 ? (isAllowedEmail || isRoleAdmin) : isRoleAdmin;
  if (!isAdmin) {
    res.status(403).json({ error: 'Admin access denied' });
    return null;
  }

  return user;
};

export const methodNotAllowed = (res: AnyObject, methods: string[]) => {
  res.setHeader('Allow', methods.join(', '));
  res.status(405).json({ error: 'Method not allowed' });
};
