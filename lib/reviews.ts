import { supabase } from './supabaseClient';
import type { Review } from '../types';

function normalizeReviews(reviews: unknown[] | null | undefined): Review[] {
  return (reviews || []) as Review[];
}

function isMissingApprovalColumn(errorMessage?: string) {
  return Boolean(errorMessage?.includes('is_approved'));
}

export async function loadApprovedReviews(limit?: number): Promise<Review[]> {
  let query = supabase
    .from('product_reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  let { data, error } = await query;

  if (isMissingApprovalColumn(error?.message)) {
    let fallbackQuery = supabase
      .from('product_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      fallbackQuery = fallbackQuery.limit(limit);
    }

    ({ data, error } = await fallbackQuery);
  }

  if (error) {
    console.warn('Could not load approved reviews:', error.message);
    return [];
  }

  return normalizeReviews(data);
}

export async function loadApprovedProductReviews(productId: number): Promise<Review[]> {
  let { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (isMissingApprovalColumn(error?.message)) {
    ({ data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false }));
  }

  if (error) {
    console.warn('Could not load approved product reviews:', error.message);
    return [];
  }

  return normalizeReviews(data);
}
