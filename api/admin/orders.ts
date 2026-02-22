import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
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

    if (!url || !anonKey) {
      res.status(500).json({ error: 'Missing Supabase Config' });
      return;
    }

    // Just test if we can create a client
    const supabase = createClient(url, anonKey);

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(1);

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(200).json({ status: "success", count: data?.length || 0 });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Crash', stack: err?.stack });
  }
}
