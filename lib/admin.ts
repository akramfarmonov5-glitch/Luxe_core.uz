import { supabase } from './supabaseClient';
import { createClient } from '@supabase/supabase-js';

export async function isAdminUser(userId?: string | null): Promise<boolean> {
  if (!userId) {
    return false;
  }

  let dbClient = supabase;

  // On the server-side (Node.js API routes), use the service role client to bypass RLS blocks
  if (typeof window === 'undefined') {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceRoleKey) {
      try {
        dbClient = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false }
        });
      } catch (err) {
        console.warn('Failed to create server-side service role client in isAdminUser:', err);
      }
    }
  }

  const { data, error } = await dbClient
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Admin role lookup failed:', error.message);
    return false;
  }

  return Boolean(data);
}
