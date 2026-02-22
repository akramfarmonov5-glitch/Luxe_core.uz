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
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
};

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
    const anonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');
    const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

    if (!url) return res.status(500).json({ error: 'SUPABASE_URL is missing' });

    // Auth Check
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: 'No token' });

    const authSupabase = createClient(url, anonKey || serviceKey || '');
    const { data: { user }, error: authError } = await authSupabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Role Check
    const allowedEmails = (getEnv('ADMIN_EMAILS') || getEnv('VITE_ADMIN_EMAILS') || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    const isRoleAdmin = user.app_metadata?.role === 'admin';
    const isAllowedEmail = !!user.email && allowedEmails.includes(user.email.toLowerCase());
    const isAdmin = allowedEmails.length > 0 ? (isAllowedEmail || isRoleAdmin) : isRoleAdmin;

    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Use Service Role if available for RLS bypass, otherwise use anon key with User's JWT context
    const dbSupabase = serviceKey
      ? createClient(url, serviceKey, { auth: { persistSession: false } })
      : createClient(url, anonKey || '', {
        auth: { persistSession: false },
        global: { headers: { Authorization: `Bearer ${token}` } }
      });

    if (req.method === 'GET') {
      const { data, error } = await dbSupabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ data: data || [] });
    }

    if (req.method === 'PATCH') {
      const body = parseBody(req);
      const { id, status } = body;
      if (!id || !status) return res.status(400).json({ error: 'Missing id or status' });

      const { data, error } = await dbSupabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ data });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Admin Orders Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
