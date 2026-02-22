import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

const getBearerToken = (req: any): string | null => {
  const rawAuth = req.headers?.authorization || req.headers?.Authorization;
  if (!rawAuth || typeof rawAuth !== 'string') return null;
  const parts = rawAuth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};

const parseBody = (req: any): any => {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
};

const getAdminSupabase = (token: string) => {
  const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

  if (!url) throw new Error('SUPABASE_URL topilmadi');

  if (serviceKey) {
    return createClient(url, serviceKey, { auth: { persistSession: false } });
  }

  return createClient(url, anonKey || '', {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
};

const verifyAdmin = async (req: any, res: any): Promise<{ token: string } | null> => {
  const token = getBearerToken(req);
  if (!token) { res.status(401).json({ error: 'No token' }); return null; }

  const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
  const anonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');
  if (!url || !anonKey) { res.status(500).json({ error: 'Server config missing' }); return null; }

  const authClient = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data: { user }, error } = await authClient.auth.getUser(token);
  if (error || !user) { res.status(401).json({ error: 'Invalid session' }); return null; }

  const allowedEmails = (getEnv('ADMIN_EMAILS') || getEnv('VITE_ADMIN_EMAILS') || '')
    .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  const isAdmin = user.app_metadata?.role === 'admin' ||
    (allowedEmails.length > 0 && !!user.email && allowedEmails.includes(user.email.toLowerCase()));

  if (!isAdmin) { res.status(403).json({ error: 'Forbidden' }); return null; }
  return { token };
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const auth = await verifyAdmin(req, res);
    if (!auth) return;
    const supabase = getAdminSupabase(auth.token);

    if (req.method !== 'PUT') {
      res.setHeader('Allow', 'PUT');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = parseBody(req);
    const payload = { id: 'main', ...body };

    const { data, error } = await supabase
      .from('hero_content')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ data });
  } catch (err: any) {
    console.error('Admin hero error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
}
