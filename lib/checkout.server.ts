import { randomUUID } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { MOCK_PRODUCTS } from '../constants';
import { getLocalizedText } from './i18nUtils';
import type { Product } from '../types';

export const MIN_ORDER_AMOUNT = 500_000;
export const FREE_DELIVERY_THRESHOLD = 2_000_000;
export const DELIVERY_FEE = 40_000;

const FALLBACK_PROMO_RULES: Record<string, number> = {
  PAKET2026: 0.1,
  ADMIN: 0.5,
};

export type CheckoutItemInput = {
  id: number;
  quantity: number;
};

export type PromoStatus = 'none' | 'valid' | 'invalid' | 'expired';

export type CheckoutPricing = {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  appliedPromo: string | null;
  promoValid: boolean;
  promoStatus: PromoStatus;
  minimumOrderAmount: number;
  meetsMinimumOrderAmount: boolean;
};

let serviceClient: SupabaseClient | null = null;
let publicClient: SupabaseClient | null = null;

export function getServiceSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  if (!serviceClient) {
    serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return serviceClient;
}

function getPublicSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  if (!publicClient) {
    publicClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return publicClient;
}

export function normalizeCheckoutItems(rawItems: unknown): CheckoutItemInput[] {
  if (!Array.isArray(rawItems)) {
    throw new Error('Items must be an array');
  }

  const quantitiesById = new Map<number, number>();

  rawItems.forEach((item) => {
    const id = Number((item as any)?.id);
    const quantity = Number((item as any)?.quantity);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid product id');
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Invalid product quantity');
    }

    quantitiesById.set(id, (quantitiesById.get(id) || 0) + quantity);
  });

  if (quantitiesById.size === 0) {
    throw new Error('At least one item is required');
  }

  return [...quantitiesById.entries()].map(([id, quantity]) => ({ id, quantity }));
}

export async function loadCheckoutProducts(items: CheckoutItemInput[]): Promise<Product[]> {
  const ids = [...new Set(items.map((item) => item.id))];
  const supabase = getServiceSupabaseClient() || getPublicSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', ids);

    if (error) {
      throw error;
    }

    const products = (data || []).map((product) => ({
      ...product,
      formattedPrice: new Intl.NumberFormat('uz-UZ').format(Number(product.price || 0)) + ' UZS',
      shortDescription: product.description || '',
      specs: product.specifications || [],
      videoUrl: product.videoUrl || '',
    })) as Product[];

    // The storefront intentionally falls back to mock data while a fresh project
    // is still empty. Mirror that behavior server-side so checkout cannot drift.
    if (products.length === 0) {
      const fallbackProducts = MOCK_PRODUCTS.filter((product) => ids.includes(product.id));
      if (fallbackProducts.length === ids.length) {
        return fallbackProducts;
      }
    }

    if (products.length !== ids.length) {
      throw new Error('One or more products were not found');
    }

    return products;
  }

  const fallbackProducts = MOCK_PRODUCTS.filter((product) => ids.includes(product.id));
  if (fallbackProducts.length !== ids.length) {
    throw new Error('One or more products were not found');
  }

  return fallbackProducts;
}

export async function calculateCheckoutPricing(
  items: CheckoutItemInput[],
  products: Product[],
  promoCode?: string | null,
): Promise<CheckoutPricing> {
  const productsById = new Map(products.map((product) => [product.id, product]));

  const subtotal = items.reduce((sum, item) => {
    const product = productsById.get(item.id);
    if (!product) {
      throw new Error('Product lookup failed');
    }

    if (product.stock !== undefined && product.stock !== null && item.quantity > product.stock) {
      throw new Error(`${getLocalizedText(product.name, 'uz')} uchun yetarli stock mavjud emas`);
    }

    return sum + Number(product.price || 0) * item.quantity;
  }, 0);

  const { normalizedPromo, promoRate, promoStatus } = await resolvePromoRate(promoCode);
  const discountAmount = promoRate ? Math.round(subtotal * promoRate) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const deliveryFee = discountedSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  return {
    subtotal,
    discountAmount,
    deliveryFee,
    total: discountedSubtotal + deliveryFee,
    appliedPromo: promoRate ? normalizedPromo : null,
    promoValid: normalizedPromo ? Boolean(promoRate) : false,
    promoStatus,
    minimumOrderAmount: MIN_ORDER_AMOUNT,
    meetsMinimumOrderAmount: subtotal >= MIN_ORDER_AMOUNT,
  };
}

async function resolvePromoRate(promoCode?: string | null) {
  const normalizedPromo = promoCode?.trim().toUpperCase() || '';
  if (!normalizedPromo) {
    return {
      normalizedPromo,
      promoRate: undefined as number | undefined,
      promoStatus: 'none' as const,
    };
  }

  const supabase = getServiceSupabaseClient() || getPublicSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('discount_percent, active, expires_at')
      .eq('code', normalizedPromo)
      .maybeSingle();

    if (!error && data) {
      if (!data.active) {
        return { normalizedPromo, promoRate: undefined, promoStatus: 'invalid' as const };
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { normalizedPromo, promoRate: undefined, promoStatus: 'expired' as const };
      }

      const discountPercent = Number(data.discount_percent);
      if (Number.isFinite(discountPercent) && discountPercent > 0) {
        return {
          normalizedPromo,
          promoRate: discountPercent / 100,
          promoStatus: 'valid' as const,
        };
      }
    }

    if (!error && !data && !FALLBACK_PROMO_RULES[normalizedPromo]) {
      return { normalizedPromo, promoRate: undefined, promoStatus: 'invalid' as const };
    }
  }

  const fallbackPromoRate = FALLBACK_PROMO_RULES[normalizedPromo];
  if (fallbackPromoRate) {
    return {
      normalizedPromo,
      promoRate: fallbackPromoRate,
      promoStatus: 'valid' as const,
    };
  }

  return {
    normalizedPromo,
    promoRate: undefined,
    promoStatus: 'invalid' as const,
  };
}

export function createOrderId(prefix = 'ORD') {
  return `${prefix}-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export function normalizePhone(phone: unknown) {
  return String(phone || '').replace(/\D/g, '');
}

export async function getAuthenticatedUserId(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    return null;
  }

  const supabase = getPublicSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return null;
  }

  return data.user?.id || null;
}

export function toOrderItems(items: CheckoutItemInput[], products: Product[]) {
  const productsById = new Map(products.map((product) => [product.id, product]));

  return items.map((item) => {
    const product = productsById.get(item.id);
    if (!product) {
      throw new Error('Product lookup failed');
    }

    return {
      id: product.id,
      name: getLocalizedText(product.name, 'uz'),
      quantity: item.quantity,
      price: Number(product.price || 0),
    };
  });
}
