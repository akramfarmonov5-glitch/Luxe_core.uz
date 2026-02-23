import { Context, Bot } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { CartItem } from '../types';
import { config } from '../config';
import { t } from '../i18n';
import { handlePromoCheck } from './promo';
import { notifyAdmin } from './admin';
import { getUserProfile, ensureUser } from './profile';

// In-memory storage
const carts = new Map<number, CartItem[]>();
const checkoutState = new Map<number, {
    step: string;
    phone?: string;
    name?: string;
    address?: string;
    promo?: string;
    discount?: number;
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

        // +/- buttons for each item
        kb.text(`➖`, `cart_minus:${item.productId}`)
            .text(`${item.quantity}`, 'noop')
            .text(`➕`, `cart_plus:${item.productId}`)
            .text(`🗑`, `cart_del:${item.productId}`)
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

// Cart quantity handlers
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

    // Try to use saved profile data
    const profile = await getUserProfile(userId);
    if (profile?.phone && profile?.name) {
        // Skip phone/name steps if already saved
        checkoutState.set(userId, {
            step: 'address',
            phone: profile.phone,
            name: profile.name,
            address: profile.address || undefined,
        });
        if (profile.address) {
            // Ask for promo directly
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

    // STEP 1: Phone
    if (state.step === 'phone') {
        let phone = text.replace(/[\s\-\(\)]/g, '');
        if (!phone.startsWith('+')) phone = '+' + phone;
        state.phone = phone;
        state.step = 'name';
        checkoutState.set(userId, state);
        await ctx.reply(t(userId, 'checkout_name'));
        return;
    }

    // STEP 2: Name
    if (state.step === 'name') {
        state.name = text;
        state.step = 'address';
        checkoutState.set(userId, state);
        await ctx.reply(t(userId, 'checkout_address'));
        return;
    }

    // STEP 3: Address
    if (state.step === 'address') {
        state.address = text;
        state.step = 'promo';
        checkoutState.set(userId, state);

        // Save profile data
        await supabase.from('bot_users').upsert({
            telegram_id: userId,
            name: state.name,
            phone: state.phone,
            address: state.address,
        }, { onConflict: 'telegram_id' });

        await ctx.reply(t(userId, 'checkout_promo'), { parse_mode: 'Markdown' });
        return;
    }

    // STEP 4: Promo code
    if (state.step === 'promo') {
        const cart = getUserCart(userId);
        let total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
        let discount = 0;
        let promoText = '';

        if (text.toLowerCase() !== 'yo\'q' && text.toLowerCase() !== 'нет' && text.toLowerCase() !== 'yoq' && text.length > 0) {
            const promo = await handlePromoCheck(text);
            if (promo.valid) {
                discount = promo.discount;
                const discountAmount = Math.round(total * discount / 100);
                total -= discountAmount;
                promoText = `\n🎟 Promo: *${text.toUpperCase()}* (-${discount}%, -${discountAmount.toLocaleString('uz-UZ')} UZS)`;
            } else {
                if (promo.message === 'expired') {
                    await ctx.reply(t(userId, 'promo_expired'));
                } else {
                    await ctx.reply(t(userId, 'promo_invalid'));
                }
                await ctx.reply(t(userId, 'checkout_promo'), { parse_mode: 'Markdown' });
                return;
            }
        }

        state.promo = promoText ? text : undefined;
        state.discount = discount;
        state.step = 'payment';
        checkoutState.set(userId, state);

        // Show payment options
        const { paymentKeyboard } = require('../keyboards');
        await ctx.reply(t(userId, 'checkout_payment'), {
            parse_mode: 'Markdown',
            reply_markup: paymentKeyboard(userId),
        });
        return;
    }

    // STEP 5: Card payment confirmation
    if (state.step === 'card_confirm') {
        await finalizeOrder(ctx, userId, state, 'Kartadan kartaga');
        return;
    }
}

// Payment callbacks
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

    await finalizeOrder(ctx, userId, state, 'Naqd to\'lov');
}

async function finalizeOrder(ctx: Context, userId: number, state: any, paymentMethod: string) {
    const cart = getUserCart(userId);
    let total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    let promoText = '';

    if (state.discount && state.discount > 0) {
        const discountAmount = Math.round(total * state.discount / 100);
        total -= discountAmount;
        promoText = `\n🎟 Promo: *${state.promo?.toUpperCase()}* (-${state.discount}%, -${discountAmount.toLocaleString('uz-UZ')} UZS)`;
    }

    try {
        const orderId = `LC${Date.now().toString(36).toUpperCase()}`;
        const { error } = await supabase
            .from('orders')
            .insert({
                id: orderId,
                customerName: state.name || '',
                phone: state.phone || '',
                total: total,
                status: 'Kutilmoqda',
                date: new Date().toISOString().split('T')[0],
                paymentMethod: paymentMethod,
                items: cart,
                telegram_user_id: userId,
            });

        if (error) throw error;

        carts.delete(userId);
        clearCheckoutMode(userId);

        let itemsText = '';
        cart.forEach(i => {
            itemsText += `  • ${i.name} x${i.quantity}\n`;
        });

        await ctx.reply(
            `${t(userId, 'checkout_success')}\n\n` +
            `📋 Buyurtma: *#${orderId}*\n` +
            `👤 Ism: ${state.name}\n` +
            `📱 Tel: ${state.phone}\n` +
            `📍 Manzil: ${state.address || '-'}\n` +
            `💳 To'lov: ${paymentMethod}\n` +
            `💰 Jami: *${Number(total).toLocaleString('uz-UZ')} UZS*${promoText}\n\n` +
            `📦 Mahsulotlar:\n${itemsText}\n` +
            t(userId, 'continue_msg'),
            {
                parse_mode: 'Markdown',
                reply_markup: new InlineKeyboard()
                    .text(t(userId, 'btn_home'), 'home'),
            }
        );

        if (botInstance) {
            await notifyAdmin(botInstance, orderId, state.name || '', state.phone || '', total, cart, userId, paymentMethod, state.address);
        }
    } catch (err) {
        console.error('Checkout error:', err);
        clearCheckoutMode(userId);
        await ctx.reply(t(userId, 'checkout_error'));
    }
}
