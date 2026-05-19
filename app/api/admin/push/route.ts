import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId } from '@/lib/checkout.server';
import { isAdminUser } from '@/lib/admin';
import { getServiceSupabaseClient } from '@/lib/checkout.server';

export async function POST(req: NextRequest) {
  try {
    // 1. Validate if user is authenticated and is an admin
    const authHeader = req.headers.get('authorization');
    const userId = await getAuthenticatedUserId(authHeader);
    const isAdmin = await isAdminUser(userId);
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 403 });
    }

    const { title, body, imageUrl, clickUrl } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Notification title and body are required' }, { status: 400 });
    }

    // 2. Fetch all stored FCM tokens
    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Service Supabase client not available' }, { status: 500 });
    }

    const { data: devices, error: dbErr } = await supabase
      .from('user_devices')
      .select('fcm_token');

    if (dbErr) {
      throw dbErr;
    }

    const tokens = (devices || []).map(d => d.fcm_token).filter(Boolean);

    if (tokens.length === 0) {
      return NextResponse.json({ success: true, sentCount: 0, message: 'No registered devices found' });
    }

    // 3. Initialize Firebase Admin and broadcast
    const serviceAccountStr = process.env.FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT;
    if (!serviceAccountStr) {
      console.warn("FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT environment variable is missing.");
      return NextResponse.json({ 
        success: false, 
        message: 'Firebase Admin SDK credentials are not configured in environment variables. FCM could not send push notifications.',
        tokensCount: tokens.length
      }, { status: 501 });
    }

    const admin = await import('firebase-admin');
    
    if (admin.apps.length === 0) {
      try {
        const serviceAccount = JSON.parse(serviceAccountStr);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } catch (parseErr: any) {
        console.error("Failed to parse or initialize Firebase Admin SDK:", parseErr);
        return NextResponse.json({ 
          error: `Failed to initialize Firebase Admin SDK: ${parseErr.message}` 
        }, { status: 500 });
      }
    }

    // Setup multicast payload for FCM v1
    const messagePayload = {
      tokens: tokens,
      notification: {
        title: title,
        body: body,
        ...(imageUrl ? { imageUrl } : {})
      },
      data: {
        title: title,
        body: body,
        ...(imageUrl ? { image: imageUrl } : {}),
        url: clickUrl || '/'
      }
    };

    const response = await admin.messaging().sendEachForMulticast(messagePayload);
    
    // 4. Identify and delete expired tokens dynamically
    const expiredTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const errCode = resp.error?.code;
        if (
          errCode === 'messaging/invalid-registration-token' || 
          errCode === 'messaging/registration-token-not-registered'
        ) {
          expiredTokens.push(tokens[idx]);
        }
      }
    });

    if (expiredTokens.length > 0) {
      await supabase
        .from('user_devices')
        .delete()
        .in('fcm_token', expiredTokens);
      console.log(`Successfully cleaned up ${expiredTokens.length} expired FCM registration tokens from database.`);
    }

    return NextResponse.json({
      success: true,
      sentCount: response.successCount,
      failedCount: response.failureCount,
      cleanedUpCount: expiredTokens.length
    });

  } catch (error: any) {
    console.error('API Admin Push Error:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
