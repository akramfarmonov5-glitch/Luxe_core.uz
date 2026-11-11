import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomUUID } from 'node:crypto';
import { getAuthenticatedUserId, getServiceSupabaseClient } from '@/lib/checkout.server';
import { isAdminUser } from '@/lib/admin';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES_PER_REQUEST = 1;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};
const UPLOAD_FOLDER = 'luxecore';
const STORAGE_BUCKET = 'products';

type ServiceSupabaseClient = NonNullable<ReturnType<typeof getServiceSupabaseClient>>;

async function uploadToSupabaseStorage(supabase: ServiceSupabaseClient, file: File) {
  const ext = EXT_BY_MIME[file.type] || 'bin';
  const objectPath = `uploads/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadOptions = {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  };

  let { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath, buffer, uploadOptions);

  if (uploadError && /bucket not found/i.test(uploadError.message)) {
    const { error: bucketError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
      allowedMimeTypes: Array.from(ALLOWED_MIME_TYPES),
    });

    if (bucketError && !/already exists/i.test(bucketError.message)) {
      return NextResponse.json(
        { error: `Storage bucket yaratishda xatolik: ${bucketError.message}` },
        { status: 502 },
      );
    }

    ({ error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(objectPath, buffer, uploadOptions));
  }

  if (uploadError) {
    return NextResponse.json(
      { error: `Storage ga yuklashda xatolik: ${uploadError.message}` },
      { status: 502 },
    );
  }

  const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
  if (!publicData?.publicUrl) {
    return NextResponse.json({ error: 'Rasmning public URL manzili olinmadi' }, { status: 502 });
  }

  return NextResponse.json({ url: publicData.publicUrl, storage: 'supabase' });
}

function getCloudinaryConfig() {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Admin panel uchun rasm yuklash.
 *
 * MUHIM: avval brauzer to'g'ridan-to'g'ri Cloudinary'ga `unsigned_preset` bilan
 * yuklardi — ya'ni istalgan odam (login qilmasdan) akkauntga fayl yuklashi
 * mumkin edi. Endi yuklash faqat admin uchun va imzolangan (signed) so'rov bilan.
 */
export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId(req.headers.get('authorization'));
  const isAdmin = await isAdminUser(userId);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 403 });
  }

  const cloudinary = getCloudinaryConfig();
  const supabase = cloudinary ? null : getServiceSupabaseClient();

  if (!cloudinary && !supabase) {
    return NextResponse.json(
      { error: 'Rasm yuklash xizmati sozlanmagan (Cloudinary yoki Supabase Storage kalitlari kerak)' },
      { status: 503 },
    );
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('file');
    const file = files[0];

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 });
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json({ error: 'Faqat bitta fayl yuboriladi' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Faqat JPEG, PNG, WEBP, AVIF yoki GIF rasmlar qabul qilinadi' },
        { status: 400 },
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Rasm hajmi 10MB dan oshmasligi kerak' }, { status: 400 });
    }

    if (!cloudinary) {
      if (!supabase) {
        return NextResponse.json({ error: 'Storage xizmati mavjud emas' }, { status: 503 });
      }
      return await uploadToSupabaseStorage(supabase, file);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    // Cloudinary imzosi: parametrlar alifbo tartibida + api_secret, SHA-1.
    const signature = createHash('sha1')
      .update(`folder=${UPLOAD_FOLDER}&timestamp=${timestamp}${cloudinary.apiSecret}`)
      .digest('hex');

    const uploadBody = new FormData();
    uploadBody.append('file', file);
    uploadBody.append('api_key', cloudinary.apiKey);
    uploadBody.append('timestamp', String(timestamp));
    uploadBody.append('folder', UPLOAD_FOLDER);
    uploadBody.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/upload`,
      { method: 'POST', body: uploadBody },
    );

    const data = (await response.json().catch(() => ({}))) as {
      secure_url?: string;
      error?: { message?: string };
    };

    if (!response.ok || !data?.secure_url) {
      console.error('Cloudinary upload failed:', data?.error?.message || response.status);
      return NextResponse.json(
        { error: data?.error?.message || 'Rasm yuklashda xatolik yuz berdi' },
        { status: 502 },
      );
    }

    // Optimallashgan URL (q_auto, f_auto, w_1200) — sayt tezligi uchun.
    const optimizedUrl = data.secure_url.replace('/upload/', '/upload/q_auto,f_auto,w_1200/');

    return NextResponse.json({ url: optimizedUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('API Admin Upload Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
