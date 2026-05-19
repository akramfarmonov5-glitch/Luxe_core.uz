import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const { fcmToken, name, phone, deviceInfo } = await req.json();

    if (!fcmToken) {
      return NextResponse.json({ error: 'FCM Token is required' }, { status: 400 });
    }

    let leadId = null;

    // If phone number is supplied, check if lead exists or create a new lead
    if (phone) {
      const cleanPhone = phone.replace(/\s+/g, '');
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
    const { data, error } = await supabase
      .from('user_devices')
      .upsert({
        fcm_token: fcmToken,
        lead_id: leadId,
        device_info: deviceInfo || null,
      }, { onConflict: 'fcm_token' })
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API Devices Error:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
