import { parseBody, serverSupabase } from '../admin/_utils';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = parseBody(req);
  const phone = (body.phone || '').trim();
  if (!phone) {
    res.status(400).json({ error: 'Phone is required' });
    return;
  }

  const { data, error } = await serverSupabase
    .from('orders')
    .select('id, status, total, date, created_at, paymentMethod')
    .eq('phone', phone)
    .order('created_at', { ascending: false });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(200).json({ data: data || [] });
}
