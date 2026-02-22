import { createClient } from '@supabase/supabase-js';
import { methodNotAllowed, parseBody } from '../_utils';

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

/**
 * Create a Supabase client using the admin user's JWT token.
 * This ensures RLS policies like is_admin_user() work correctly
 * even without a service role key.
 */
const getSupabaseWithAuth = (accessToken: string) => {
  const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

  if (!url) {
    throw new Error('SUPABASE_URL muhit o\'zgaruvchisi topilmadi');
  }

  // If we have service role key, use it (bypasses RLS)
  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }

  // Otherwise, use anon key but set the user's session
  // so RLS is_admin_user() can check auth.jwt()
  if (!anonKey) {
    throw new Error('SUPABASE_ANON_KEY muhit o\'zgaruvchisi topilmadi');
  }

  const client = createClient(url, anonKey, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  return client;
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
    // 1. Extract and verify admin token
    const token = getBearerToken(req);
    if (!token) {
      res.status(401).json({ error: 'Avtorizatsiya tokeni topilmadi' });
      return;
    }

    // 2. Verify the user is admin using anon key client
    const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
    const anonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

    if (!url || !anonKey) {
      console.error('Missing Supabase env:', { url: !!url, anonKey: !!anonKey });
      res.status(500).json({ error: 'Server konfiguratsiya xatosi' });
      return;
    }

    const authClient = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data: userData, error: authError } = await authClient.auth.getUser(token);

    if (authError || !userData?.user) {
      res.status(401).json({ error: 'Sessiya yaroqsiz. Qayta login qiling.' });
      return;
    }

    const user = userData.user;
    const allowedEmails = (getEnv('ADMIN_EMAILS') || getEnv('VITE_ADMIN_EMAILS') || '')
      .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    const isAdmin = user.app_metadata?.role === 'admin' ||
      (allowedEmails.length > 0 && !!user.email && allowedEmails.includes(user.email.toLowerCase()));

    if (!isAdmin) {
      res.status(403).json({ error: 'Admin huquqi yo\'q' });
      return;
    }

    // 3. Create Supabase client with admin auth
    const supabase = getSupabaseWithAuth(token);

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders fetch error:', JSON.stringify(error));
        // If RLS blocks, return empty instead of error for better UX
        if (error.code === '42501' || error.message?.includes('permission')) {
          res.status(200).json({ data: [] });
          return;
        }
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
        res.status(400).json({ error: 'id va status kerak' });
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Order update error:', JSON.stringify(error));
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(200).json({ data });
      return;
    }

    methodNotAllowed(res, ['GET', 'PATCH']);
  } catch (err: any) {
    console.error('Admin orders handler error:', err?.message || err);
    res.status(500).json({ error: err?.message || 'Server xatosi' });
  }
}
