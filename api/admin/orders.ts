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

/**
 * Create a Supabase client using the admin user's JWT token.
 */
const getSupabaseWithAuth = (accessToken: string) => {
  const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

  if (!url) {
    throw new Error('SUPABASE_URL muhit o\'zgaruvchisi topilmadi');
  }

  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }

  if (!anonKey) {
    throw new Error('SUPABASE_ANON_KEY muhit o\'zgaruvchisi topilmadi');
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Avtorizatsiya tokeni topilmadi' });
    }

    const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
    const anonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

    if (!url || !anonKey) {
      return res.status(500).json({ error: 'Server konfiguratsiya xatosi (Supabase URL/Key missing)' });
    }

    const authClient = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data: userData, error: authError } = await authClient.auth.getUser(token);

    if (authError || !userData?.user) {
      return res.status(401).json({ error: 'Sessiya yaroqsiz. Qayta login qiling.' });
    }

    const user = userData.user;
    const allowedEmails = (getEnv('ADMIN_EMAILS') || getEnv('VITE_ADMIN_EMAILS') || '')
      .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    const isAdmin = user.app_metadata?.role === 'admin' ||
      (allowedEmails.length > 0 && !!user.email && allowedEmails.includes(user.email.toLowerCase()));

    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin huquqi yo\'q' });
    }

    const supabase = getSupabaseWithAuth(token);

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders fetch error:', JSON.stringify(error));
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ data: data || [] });
    }

    if (req.method === 'PATCH') {
      const body = parseBody(req);
      const { id, status } = body;
      if (!id || !status) {
        return res.status(400).json({ error: 'id va status kerak' });
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ data });
    }

    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Admin orders handler error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Server xatosi' });
  }
}
