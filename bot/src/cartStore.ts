import { supabase } from './supabase';
import type { CartItem } from './types';

/**
 * Savat saqlash qatlami.
 *
 * Savat `bot_users.cart` (jsonb) ustunida saqlanadi, xotiradagi `Map` esa
 * faqat tezkor kesh. Shu tufayli Render restart / deploy / uyqu holatidan
 * keyin ham foydalanuvchining savati tiklanadi.
 *
 * Agar `cart` ustuni hali qo'llanmagan bo'lsa (migratsiya ishlatilmagan),
 * xatolar `console.warn` bilan yutiladi va bot xotiradagi savat bilan
 * ishlashda davom etadi.
 */

const cache = new Map<number, CartItem[]>();
const hydrated = new Set<number>();

function isCartItem(value: unknown): value is CartItem {
    if (!value || typeof value !== 'object') return false;
    const item = value as Partial<CartItem>;
    return (
        Number.isFinite(Number(item.productId)) &&
        Number(item.productId) > 0 &&
        Number(item.quantity) > 0
    );
}

export function getCachedCart(userId: number): CartItem[] | undefined {
    return hydrated.has(userId) ? cache.get(userId) || [] : undefined;
}

export function setCachedCart(userId: number, cart: CartItem[]): void {
    cache.set(userId, cart);
    hydrated.add(userId);
}

/** Savatni bazadan (yoki keshdan) yuklash. */
export async function hydrateCart(userId: number): Promise<CartItem[]> {
    const cached = getCachedCart(userId);
    if (cached) return cached;

    try {
        const { data, error } = await supabase
            .from('bot_users')
            .select('cart')
            .eq('telegram_id', userId)
            .maybeSingle();

        if (error) {
            // Ustun yo'q bo'lsa ham bot ishlashda davom etadi.
            console.warn('Cart hydrate error:', error.message);
            setCachedCart(userId, []);
            return [];
        }

        const raw = Array.isArray((data as any)?.cart) ? ((data as any).cart as unknown[]) : [];
        const cart = raw.filter(isCartItem) as CartItem[];
        setCachedCart(userId, cart);
        return cart;
    } catch (err: any) {
        console.warn('Cart hydrate error:', err?.message || err);
        setCachedCart(userId, []);
        return [];
    }
}

/** Savatni bazaga yozish (xato bo'lsa ham bot to'xtamaydi). */
export async function persistCart(userId: number, cart: CartItem[]): Promise<void> {
    setCachedCart(userId, cart);

    try {
        // `upsert` — foydalanuvchi qatori hali yaratilmagan bo'lsa ham
        // savat yo'qolmaydi (birinchi "savatga qo'shish" holati).
        const { error } = await supabase
            .from('bot_users')
            .upsert({ telegram_id: userId, cart }, { onConflict: 'telegram_id' });

        if (error) {
            console.warn('Cart persist error:', error.message);
        }
    } catch (err: any) {
        console.warn('Cart persist error:', err?.message || err);
    }
}

/** Savatni tozalash (buyurtma yakunlanganda yoki "savatni bo'shatish"). */
export async function clearPersistedCart(userId: number): Promise<void> {
    cache.delete(userId);
    hydrated.add(userId);

    try {
        const { error } = await supabase
            .from('bot_users')
            .update({ cart: [] })
            .eq('telegram_id', userId);

        if (error) {
            console.warn('Cart clear error:', error.message);
        }
    } catch (err: any) {
        console.warn('Cart clear error:', err?.message || err);
    }
}
