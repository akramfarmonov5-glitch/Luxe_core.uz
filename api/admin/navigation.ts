import { methodNotAllowed, parseBody, requireAdmin, serverSupabase } from '../_utils';

export default async function handler(req: any, res: any) {
  const user = await requireAdmin(req, res);
  if (!user) return;

  if (req.method !== 'PUT') {
    methodNotAllowed(res, ['PUT']);
    return;
  }

  const body = parseBody(req);
  const payload = { id: 'main', ...body };

  const { data, error } = await serverSupabase
    .from('navigation_settings')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(200).json({ data });
}
