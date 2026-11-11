import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { formatPhoneNumber } from '@/lib/phoneUtils';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { getErrorMessage } from '@/lib/errors';

// Use server-side Supabase client with Service Role Key to bypass RLS policies.
// Klient lazy yaratiladi — env sozlanmagan bo'lsa build vaqtida yiqilmaydi.
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

const MAX_FCM_TOKEN_LENGTH = 4096;
const MAX_NAME_LENGTH = 120;
const MAX_DEVICE_INFO_LENGTH = 300;

export async function POST(req: NextRequest) {
  // Service-role klient ishlatilgani uchun endpoint suiiste'molga ochiq edi:
  // endi IP bo'yicha rate-limit + qattiq validatsiya qo'llanadi.
  const rateLimit = await checkRateLimit(`devices:${getClientIp(req)}`, 10, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.' }, { status: 429 });
  }

  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Service is not configured' }, { status: 503 });
    }

    const body = await req.json().catch(() => ({}));
    const rawToken = body?.fcmToken;
    const rawName = body?.name;
    const rawPhone = body?.phone;
    const rawDeviceInfo = body?.deviceInfo;

    if (typeof rawToken !== 'string' || rawToken.trim().length < 20) {
      return NextResponse.json({ error: 'FCM Token is required' }, { status: 400 });
    }

    const fcmToken = rawToken.trim();
    if (fcmToken.length > MAX_FCM_TOKEN_LENGTH || /\s/.test(fcmToken)) {
      return NextResponse.json({ error: 'Invalid FCM Token' }, { status: 400 });
    }

    const name = typeof rawName === 'string' ? rawName.trim().slice(0, MAX_NAME_LENGTH) : '';
    const deviceInfo = typeof rawDeviceInfo === 'string'
      ? rawDeviceInfo.trim().slice(0, MAX_DEVICE_INFO_LENGTH)
      : null;

    let leadId: string | null = null;

    // Lid faqat to'liq telefon raqami berilganda yaratiladi.
    // Aks holda `leads` jadvali "lead_<timestamp>" yozuvlari bilan to'lib ketardi.
    const phoneDigits = typeof rawPhone === 'string' ? rawPhone.replace(/\D/g, '') : '';
    const hasUsablePhone = phoneDigits.length >= 9 && phoneDigits.length <= 15;

    if (hasUsablePhone) {
      const cleanPhone = formatPhoneNumber(String(rawPhone));

      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existingLead) {
        leadId = existingLead.id;
      } else {
        const newLeadId = `lead_${Date.now()}`;
        const { error: leadErr } = await supabase.from('leads').insert({
          id: newLeadId,
          name: name || 'Push Foydalanuvchisi',
          phone: cleanPhone,
          last_message: 'FCM push-reklama orqali obuna bo\'ldi'
        });
        if (!leadErr) {
          leadId = newLeadId;
        } else {
          console.error('Error auto-creating lead for FCM device:', leadErr);
        }
      }
    }

    // Upsert token in user_devices (on conflict update lead_id and device_info)
    const { error } = await supabase
      .from('user_devices')
      .upsert({
        fcm_token: fcmToken,
        lead_id: leadId,
        device_info: deviceInfo,
      }, { onConflict: 'fcm_token' });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('API Devices Error:', getErrorMessage(error));
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
