import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getAuthenticatedUserId } from '@/lib/checkout.server';
import { isAdminUser } from '@/lib/admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const userId = await getAuthenticatedUserId(authHeader);
    const isAdmin = await isAdminUser(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 403 });
    }

    revalidateTag('global-data', 'max');
    revalidatePath('/', 'layout');
    revalidatePath('/catalog.xml');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Revalidation error' }, { status: 500 });
  }
}
