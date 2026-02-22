import { createClient } from '@supabase/supabase-js';
import { methodNotAllowed, parseBody, requireAdmin } from '../_utils';

const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

/**
 * Create a Supabase client that bypasses RLS.
 * Prefers service role key; if not set, falls back to anon key with auth.admin.
 */
const getAdminSupabase = () => {
  const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');
  const key = serviceKey || anonKey;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  // Service role key bypasses RLS automatically
  return createClient(url, key, {
    auth: { persistSession: false },
  });
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
    const user = await requireAdmin(req, res);
    if (!user) return;

    const supabase = getAdminSupabase();

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders fetch error:', error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(200).json({ data: data || [] });
      return;
    }

    if (req.method === 'PATCH') {
      const body = parseBody(req);
      const id = body.id;
      const status = body.status;
      if (!id || !status) {
        res.status(400).json({ error: 'id and status are required' });
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Order update error:', error);
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(200).json({ data });
      return;
    }

    methodNotAllowed(res, ['GET', 'PATCH']);
  } catch (err: any) {
    console.error('Admin orders handler error:', err);
    res.status(500).json({ error: err?.message || 'Server xatosi' });
  }
}
