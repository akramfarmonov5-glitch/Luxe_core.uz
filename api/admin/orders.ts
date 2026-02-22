import { methodNotAllowed, parseBody, requireAdmin, serverSupabase } from '../_utils';

export default async function handler(req: any, res: any) {
  const user = await requireAdmin(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { data, error } = await serverSupabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
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

    const { data, error } = await serverSupabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ data });
    return;
  }

  methodNotAllowed(res, ['GET', 'PATCH']);
}
