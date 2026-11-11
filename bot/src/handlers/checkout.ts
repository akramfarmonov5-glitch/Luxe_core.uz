import { Bot, Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { config } from '../config';
import { t } from '../i18n';
import { notifyAdmin } from './admin';
import { getUserProfile } from './profile';
import { createTelegramOrder, quoteTelegramCart, type CheckoutQuote } from '../orderApi';
import { clearPersistedCart, hydrateCart } from '../cartStore';

/**
 * Telegram bot checkout oqimi (savat → telefon/ism/manzil → promo → to'lov).
 *
 * `cart.ts` dan ajratildi: savat CRUD amallari u yerda qoladi, bu fayl esa
 * faqat buyurtmani yakunlash bilan shug'ullanadi. Savat ma'lumoti
 * `cartStore` orqali (bazadan) olinadi — tsiklik import yo'q.
 */

export const checkoutState = new Map<number, {
    step: string;
    phone?: string;
    name?: string;
    address?: string;
    promo?: string;
    quote?: CheckoutQuote;
    paymentMethod?: string;
}>();

let botInstance: Bot | null = null;
export function setBotInstance(bot: Bot) { botInstance = bot; }

export function isInCheckoutMode(userId: number): boolean {
    return checkoutState.has(userId);
}

export function clearCheckoutMode(userId: number) {
    checkoutState.delete(userId);
}

function promoPromptKeyboard(userId: number) {
    return new InlineKeyboard()
        .text(t(userId, 'btn_skip_promo'), 'checkout_skip_promo')
        .row()
        .text(t(userId, 'btn_home'), 'home');
}

function cardConfirmKeyboard(userId: number) {
    return new InlineKeyboard()
        .text(t(userId, 'btn_paid_confirm'), 'checkout_card_paid')
        .row()
        .text(t(userId, 'btn_home'), 'home');
}

export async function handleCheckout(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;

    const cart = await hydrateCart(userId);
    if (cart.length === 0) {
        await ctx.reply(t(userId, 'cart_empty'));
        return;
    }

    const profile = await getUserProfile(userId);
    if (profile?.phone && profile?.name) {
        checkoutState.set(userId, {
            step: 'address',
            phone: profile.phone,
            name: profile.name,
            address: profile.address || undefined,
        });
        if (profile.address) {
            checkoutState.get(userId)!.step = 'promo';
            await ctx.reply(t(userId, 'checkout_promo'), {
                parse_mode: 'Markdown',
                reply_markup: promoPromptKeyboard(userId),
            });
        } else {
            await ctx.reply(t(userId, 'checkout_address'));
        }
    } else {
        checkoutState.set(userId, { step: 'phone' });
        await ctx.reply(t(userId, 'checkout_phone'), { parse_mode: 'Markdown' });
    }
}

export async function handleCheckoutInput(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const state = checkoutState.get(userId);
    if (!state) return;

    const text = ctx.message?.text?.trim() || '';

    if (state.step === 'phone') {
        let phone = text.replace(/[\s\-\(\)]/g, '');
        if (!phone.startsWith('+')) phone = '+' + phone;

        if (!/^\+998\d{9}$/.test(phone)) {
            await ctx.reply(
                t(userId, 'phone_invalid') + '\n' + t(userId, 'checkout_phone'),
                { parse_mode: 'Markdown' }
            );
            return;
        }

        state.phone = phone;
        state.step = 'name';
        checkoutState.set(userId, state);
        await ctx.reply(t(userId, 'checkout_name'));
        return;
    }

    if (state.step === 'name') {
        state.name = text;
        state.step = 'address';
        checkoutState.set(userId, state);
        await ctx.reply(t(userId, 'checkout_address'));
        return;
    }

    if (state.step === 'address') {
        state.address = text;
        state.step = 'promo';
        checkoutState.set(userId, state);

        await supabase.from('bot_users').upsert({
            telegram_id: userId,
            name: state.name,
            phone: state.phone,
            address: state.address,
        }, { onConflict: 'telegram_id' });

        await ctx.reply(t(userId, 'checkout_promo'), {
            parse_mode: 'Markdown',
            reply_markup: promoPromptKeyboard(userId),
        });
        return;
    }

    if (state.step === 'promo') {
        await processPromoStep(ctx, userId, state, isPromoSkipped(text) ? undefined : text);
        return;
    }

    if (state.step === 'card_confirm') {
        if (!isCardConfirmation(text)) {
            await ctx.reply(t(userId, 'checkout_card_confirm_again'), {
                parse_mode: 'Markdown',
                reply_markup: cardConfirmKeyboard(userId),
            });
            return;
        }

        await finalizeOrder(ctx, userId, state, 'card');
        return;
    }
}

async function processPromoStep(ctx: Context, userId: number, state: any, promoCode: string | undefined) {
    const cart = await hydrateCart(userId);
    try {
        const quote = await quoteTelegramCart(cart, promoCode, userId);

        if (promoCode && quote.promoStatus !== 'valid') {
            await ctx.reply(quote.promoStatus === 'expired' ? t(userId, 'promo_expired') : t(userId, 'promo_invalid'));
            await ctx.reply(t(userId, 'checkout_promo'), {
                parse_mode: 'Markdown',
                reply_markup: promoPromptKeyboard(userId),
            });
            return;
        }

        if (!quote.meetsMinimumOrderAmount) {
            await ctx.reply(
                t(userId, 'checkout_minimum').replace('{amount}', formatPrice(quote.minimumOrderAmount)),
                { parse_mode: 'Markdown' },
            );
            return;
        }

        state.promo = quote.appliedPromo || undefined;
        state.quote = quote;
        state.step = 'payment';
        checkoutState.set(userId, state);

        const { paymentKeyboard } = require('../keyboards');
        await ctx.reply(
            `${t(userId, 'checkout_payment')}\n\n${formatQuoteSummary(userId, quote)}`,
            {
                parse_mode: 'Markdown',
                reply_markup: paymentKeyboard(userId),
            },
        );
    } catch (err) {
        console.error('Quote error:', err);
        await ctx.reply(t(userId, 'checkout_error'));
    }
}

export async function handleSkipPromo(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;
    const state = checkoutState.get(userId);
    if (!state || state.step !== 'promo') return;

    await processPromoStep(ctx, userId, state, undefined);
}

export async function handleCardPaidConfirm(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;
    const state = checkoutState.get(userId);
    if (!state || state.step !== 'card_confirm') return;

    await finalizeOrder(ctx, userId, state, 'card');
}

export async function handlePayCard(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;
    const state = checkoutState.get(userId);
    if (!state) return;

    state.step = 'card_confirm';
    state.paymentMethod = 'Kartadan kartaga';
    checkoutState.set(userId, state);

    const cardInfo = t(userId, 'checkout_card_info')
        .replace('{card}', config.CARD_NUMBER)
        .replace('{holder}', config.CARD_HOLDER);

    await ctx.reply(cardInfo, {
        parse_mode: 'Markdown',
        reply_markup: cardConfirmKeyboard(userId),
    });
}

export async function handlePayCash(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;
    const state = checkoutState.get(userId);
    if (!state) return;

    await finalizeOrder(ctx, userId, state, 'cash');
}

async function finalizeOrder(ctx: Context, userId: number, state: any, paymentMethod: 'cash' | 'card') {
    const cart = await hydrateCart(userId);

    try {
        const order = await createTelegramOrder({
            cart,
            telegramUserId: userId,
            firstName: state.name || '',
            phone: state.phone || '',
            address: state.address || '',
            promoCode: state.promo,
            paymentMethod,
        });

        await clearPersistedCart(userId);
        clearCheckoutMode(userId);

        let itemsText = '';
        order.items.forEach(i => {
            itemsText += `  • ${i.name} x${i.quantity}\n`;
        });

        const promoText = order.appliedPromo
            ? `\n🎟 Promo: *${order.appliedPromo}* (-${formatPrice(order.discountAmount)})`
            : '';
        const deliveryText = order.deliveryFee > 0
            ? `\n🚚 Yetkazib berish: *${formatPrice(order.deliveryFee)}*`
            : `\n🚚 Yetkazib berish: *${t(userId, 'checkout_delivery_free')}*`;

        await ctx.reply(
            `${t(userId, 'checkout_success')}\n\n` +
            `📋 Buyurtma: *#${order.orderId}*\n` +
            `👤 Ism: ${state.name}\n` +
            `📱 Tel: ${state.phone}\n` +
            `📍 Manzil: ${state.address || '-'}\n` +
            `💳 To'lov: ${order.paymentMethod}\n` +
            `💰 Jami: *${formatPrice(order.total)}*${promoText}${deliveryText}\n\n` +
            `📦 Mahsulotlar:\n${itemsText}\n` +
            t(userId, 'continue_msg'),
            {
                parse_mode: 'Markdown',
                reply_markup: new InlineKeyboard()
                    .text(t(userId, 'btn_home'), 'home'),
            }
        );

        if (botInstance) {
            await notifyAdmin(
                botInstance,
                order.orderId,
                state.name || '',
                state.phone || '',
                order.total,
                order.items,
                userId,
                order.paymentMethod,
                state.address,
            );
        }
    } catch (err) {
        console.error('Checkout error:', err);
        clearCheckoutMode(userId);
        await ctx.reply(t(userId, 'checkout_error'));
    }
}

function isPromoSkipped(value: string) {
    const normalized = value.trim().toLowerCase();
    return normalized === '' || normalized === 'yo\'q' || normalized === 'yoq' || normalized === 'нет';
}

function isCardConfirmation(value: string) {
    const normalized = value.trim().toLowerCase();
    return normalized === 'tayyor' || normalized === 'готово';
}

function formatQuoteSummary(userId: number, quote: CheckoutQuote) {
    const lines = [
        `${t(userId, 'checkout_subtotal')} *${formatPrice(quote.subtotal)}*`,
    ];

    if (quote.appliedPromo) {
        lines.push(`${t(userId, 'checkout_discount')} *-${formatPrice(quote.discountAmount)}*`);
    }

    lines.push(
        quote.deliveryFee > 0
            ? `${t(userId, 'checkout_delivery_fee')} *${formatPrice(quote.deliveryFee)}*`
            : `${t(userId, 'checkout_delivery_fee')} *${t(userId, 'checkout_delivery_free')}*`,
    );
    lines.push(`${t(userId, 'checkout_confirmed_total')} *${formatPrice(quote.total)}*`);

    return lines.join('\n');
}

function formatPrice(value: number) {
    return `${Number(value).toLocaleString('uz-UZ')} UZS`;
}
