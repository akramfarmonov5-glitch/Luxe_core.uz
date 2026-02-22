import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

const parseBody = (req: any): any => {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = parseBody(req);
    const phone = (body.phone || '').trim();
    if (!phone) return res.status(400).json({ error: 'Phone is required' });

    const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
    const key = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

    if (!url || !key) return res.status(500).json({ error: 'Server config missing' });

    const supabase = createClient(url, key, { auth: { persistSession: false } });

    const { data, error } = await supabase
      .from('orders')
      .select('id, status, total, date, created_at, paymentMethod')
      .eq('phone', phone)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json({ data: data || [] });
  } catch (err: any) {
    console.error('Track error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
}
