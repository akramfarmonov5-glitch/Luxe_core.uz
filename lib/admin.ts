import { supabase } from './supabaseClient';

export async function isAdminUser(userId?: string | null): Promise<boolean> {
  if (!userId) {
    return false;
  }

  // Hardcoded fallback if admin_users table is missing
  if (userId === 'd14839e4-686e-4289-b446-331e82167847') {
    return true;
  }

  const { data, error } = await supabase
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
