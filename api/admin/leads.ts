import { methodNotAllowed, requireAdmin, serverSupabase } from './_utils';

export default async function handler(req: any, res: any) {
  const user = await requireAdmin(req, res);
  if (!user) return;

  if (req.method !== 'GET') {
    methodNotAllowed(res, ['GET']);
    return;
  }

  const { data, error } = await serverSupabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ data: data || [] });
}
