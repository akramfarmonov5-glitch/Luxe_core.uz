import { methodNotAllowed, parseBody, requireAdmin, serverSupabase } from './_utils';

export default async function handler(req: any, res: any) {
  const user = await requireAdmin(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { data, error } = await serverSupabase
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ data: data || [] });
    return;
  }

  if (req.method === 'POST') {
    const body = parseBody(req);
    const { data, error } = await serverSupabase
      .from('blog_posts')
      .insert([body])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ data });
    return;
  }

  if (req.method === 'PUT') {
    const body = parseBody(req);
    const id = body.id;
    if (!id) {
      res.status(400).json({ error: 'Invalid blog id' });
      return;
    }

    const { id: _id, ...patch } = body;
    const { data, error } = await serverSupabase
      .from('blog_posts')
      .update(patch)
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

  if (req.method === 'DELETE') {
    const body = parseBody(req);
    const id = body.id;
    if (!id) {
      res.status(400).json({ error: 'Invalid blog id' });
      return;
    }

    const { error } = await serverSupabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ ok: true });
    return;
  }

  methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE']);
}
