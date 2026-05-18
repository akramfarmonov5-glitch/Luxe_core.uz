import { Context, Bot } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { CartItem } from '../types';
import { config } from '../config';
import { t } from '../i18n';
import { notifyAdmin } from './admin';
import { getUserProfile, ensureUser } from './profile';
import { createTelegramOrder, quoteTelegramCart, type CheckoutQuote } from '../orderApi';

// In-memory storage
const carts = new Map<number, CartItem[]>();
const checkoutState = new Map<number, {
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

export function getUserCart(userId: number): CartItem[] {
    return carts.get(userId) || [];
}

export function isInCheckoutMode(userId: number): boolean {
    return checkoutState.has(userId);
}

export function clearCheckoutMode(userId: number) {
    checkoutState.delete(userId);
}

export async function handleAddToCart(ctx: Context) {
    const userId = ctx.from?.id || 0;
    try {
        await ctx.answerCallbackQuery(`✅ ${t(userId, 'cart_added')}`);
        const data = ctx.callbackQuery?.data;
        if (!data) return;

        const productId = parseInt(data.replace('addcart:', ''));
        if (!userId || isNaN(productId)) return;

        const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (!product) return;

        const cart = getUserCart(userId);
        const existing = cart.find(i => i.productId === productId);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
            });
        }

        carts.set(userId, cart);

        // Register user
        await ensureUser(userId, ctx.from?.first_name);

        await ctx.reply(
            `🛒 *${product.name}* ${t(userId, 'cart_added')}\n\n` +
            `Savatda: ${cart.length} xil, ${cart.reduce((s, i) => s + i.quantity, 0)} dona`,
            {
                parse_mode: 'Markdown',
                reply_markup: new InlineKeyboard()
                    .text(`🛒 ${t(userId, 'btn_cart')} (${cart.length})`, 'show_cart')
                    .row()
                    .text(t(userId, 'btn_home'), 'home'),
            }
        );
    } catch (err) {
        console.error('Add to cart error:', err);
    }
}

export async function handleShowCart(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;

    const cart = getUserCart(userId);
    if (cart.length === 0) {
        await ctx.reply(t(userId, 'cart_empty'), {
            reply_markup: new InlineKeyboard()
                .text(t(userId, 'btn_categories'), 'show_categories')
                .text(t(userId, 'btn_home'), 'home'),
        });
        return;
    }

    let total = 0;
    let text = t(userId, 'cart_title') + '\n\n';
    const kb = new InlineKeyboard();

    cart.forEach((item, i) => {
        const sum = item.price * item.quantity;
        total += sum;
        text += `${i + 1}. *${item.name}*\n`;
        text += `   ${item.quantity} x ${Number(item.price).toLocaleString('uz-UZ')} = *${Number(sum).toLocaleString('uz-UZ')} UZS*\n\n`;

        kb.text('➖', `cart_minus:${item.productId}`)
            .text(`${item.quantity}`, 'noop')
            .text('➕', `cart_plus:${item.productId}`)
            .text('🗑', `cart_del:${item.productId}`)
            .row();
    });

    text += `\n${t(userId, 'cart_total')} ${Number(total).toLocaleString('uz-UZ')} UZS*`;

    kb.text(t(userId, 'btn_checkout'), 'checkout')
        .text(t(userId, 'btn_clear_cart'), 'clear_cart')
        .row()
        .text(t(userId, 'btn_home'), 'home');

    await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: kb,
    });
}

export async function handleCartPlus(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const data = ctx.callbackQuery?.data || '';
    const productId = parseInt(data.replace('cart_plus:', ''));
    const cart = getUserCart(userId);
    const item = cart.find(i => i.productId === productId);
    if (item) {
        item.quantity += 1;
        carts.set(userId, cart);
    }
    await ctx.answerCallbackQuery(t(userId, 'cart_updated'));
    await handleShowCart(ctx);
}

export async function handleCartMinus(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const data = ctx.callbackQuery?.data || '';
    const productId = parseInt(data.replace('cart_minus:', ''));
    const cart = getUserCart(userId);
    const idx = cart.findIndex(i => i.productId === productId);
    if (idx >= 0) {
        if (cart[idx].quantity > 1) {
            cart[idx].quantity -= 1;
        } else {
            cart.splice(idx, 1);
        }
        carts.set(userId, cart);
    }
    await ctx.answerCallbackQuery(t(userId, 'cart_updated'));
    await handleShowCart(ctx);
}

export async function handleCartDelete(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const data = ctx.callbackQuery?.data || '';
    const productId = parseInt(data.replace('cart_del:', ''));
    const cart = getUserCart(userId);
    const idx = cart.findIndex(i => i.productId === productId);
    if (idx >= 0) cart.splice(idx, 1);
    carts.set(userId, cart);
    await ctx.answerCallbackQuery(t(userId, 'cart_removed'));
    await handleShowCart(ctx);
}

export async function handleClearCart(ctx: Context) {
    const userId = ctx.from?.id || 0;
    if (ctx.callbackQuery) await ctx.answerCallbackQuery(t(userId, 'cart_cleared'));
    carts.delete(userId);
    await ctx.reply(t(userId, 'cart_cleared'));
}

export async function handleCheckout(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;

    const cart = getUserCart(userId);
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
            await ctx.reply(t(userId, 'checkout_promo'), { parse_mode: 'Markdown' });
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

        await ctx.reply(t(userId, 'checkout_promo'), { parse_mode: 'Markdown' });
        return;
    }

    if (state.step === 'promo') {
        const cart = getUserCart(userId);
        const promoCode = isPromoSkipped(text) ? undefined : text;

        try {
            const quote = await quoteTelegramCart(cart, promoCode, userId);

            if (promoCode && quote.promoStatus !== 'valid') {
                await ctx.reply(quote.promoStatus === 'expired' ? t(userId, 'promo_expired') : t(userId, 'promo_invalid'));
                await ctx.reply(t(userId, 'checkout_promo'), { parse_mode: 'Markdown' });
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
        return;
    }

    if (state.step === 'card_confirm') {
        if (!isCardConfirmation(text)) {
            await ctx.reply(t(userId, 'checkout_card_confirm_again'), { parse_mode: 'Markdown' });
            return;
        }

        await finalizeOrder(ctx, userId, state, 'card');
        return;
    }
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

    await ctx.reply(cardInfo, { parse_mode: 'Markdown' });
}

export async function handlePayCash(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;
    const state = checkoutState.get(userId);
    if (!state) return;

    await finalizeOrder(ctx, userId, state, 'cash');
}

async function finalizeOrder(ctx: Context, userId: number, state: any, paymentMethod: 'cash' | 'card') {
    const cart = getUserCart(userId);

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

        carts.delete(userId);
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
