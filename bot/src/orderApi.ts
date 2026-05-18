import { config } from './config';
import type { CartItem } from './types';

export type BotPaymentMethod = 'cash' | 'card';

export interface CheckoutQuote {
    subtotal: number;
    discountAmount: number;
    deliveryFee: number;
    total: number;
    appliedPromo: string | null;
    promoValid: boolean;
    promoStatus: 'none' | 'valid' | 'invalid' | 'expired';
    minimumOrderAmount: number;
    meetsMinimumOrderAmount: boolean;
}

export interface CreatedTelegramOrder extends CheckoutQuote {
    orderId: string;
    paymentMethod: string;
    items: Array<{
        id: number;
        name: string;
        quantity: number;
        price: number;
    }>;
}

export async function quoteTelegramCart(
    cart: CartItem[],
    promoCode: string | undefined,
    telegramUserId: number,
): Promise<CheckoutQuote> {
    return postToStore<CheckoutQuote>('/api/checkout/quote', {
        source: 'telegram-bot',
        telegramUserId,
        promoCode,
        items: toApiItems(cart),
    });
}

export async function createTelegramOrder(input: {
    cart: CartItem[];
    telegramUserId: number;
    firstName: string;
    phone: string;
    address: string;
    promoCode?: string;
    paymentMethod: BotPaymentMethod;
}): Promise<CreatedTelegramOrder> {
    return postToStore<CreatedTelegramOrder>('/api/orders', {
        source: 'telegram-bot',
        telegramUserId: input.telegramUserId,
        firstName: input.firstName,
        phone: input.phone,
        address: input.address,
        promoCode: input.promoCode,
        paymentMethod: input.paymentMethod,
        items: toApiItems(input.cart),
    });
}

function toApiItems(cart: CartItem[]) {
    return cart.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
    }));
}

async function postToStore<T>(path: string, body: Record<string, unknown>): Promise<T> {
    if (!config.BOT_INTERNAL_SECRET) {
        throw new Error('BOT_INTERNAL_SECRET is missing');
    }

    const response = await fetch(`${config.SITE_URL.replace(/\/$/, '')}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-bot-secret': config.BOT_INTERNAL_SECRET,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json() as { error?: string };
    if (!response.ok) {
        throw new Error(data.error || 'Store API request failed');
    }

    return data as T;
}
