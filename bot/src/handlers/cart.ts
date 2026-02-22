import { Context, Bot } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { CartItem } from '../types';
import { t } from '../i18n';
import { handlePromoCheck } from './promo';
import { notifyAdmin } from './admin';

// In-memory storage
const carts = new Map<number, CartItem[]>();
const checkoutState = new Map<number, { step: string; phone?: string; name?: string; promo?: string; discount?: number }>();

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
    cart.forEach((item, i) => {
        const sum = item.price * item.quantity;
        total += sum;
        text += `${i + 1}. *${item.name}*\n`;
        text += `   ${item.quantity} x ${Number(item.price).toLocaleString('uz-UZ')} = *${Number(sum).toLocaleString('uz-UZ')} UZS*\n\n`;
    });

    text += `\n${t(userId, 'cart_total')} ${Number(total).toLocaleString('uz-UZ')} UZS*`;

    await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
            .text(t(userId, 'btn_checkout'), 'checkout')
            .text(t(userId, 'btn_clear_cart'), 'clear_cart')
            .row()
            .text(t(userId, 'btn_home'), 'home'),
    });
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

    checkoutState.set(userId, { step: 'phone' });
    await ctx.reply(t(userId, 'checkout_phone'), { parse_mode: 'Markdown' });
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
        state.step = 'promo';
        checkoutState.set(userId, state);
        await ctx.reply(t(userId, 'checkout_promo'), { parse_mode: 'Markdown' });
        return;
    }

    // STEP 3: Promo code
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

        // Create order
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
                    paymentMethod: 'Naqd',
                    items: cart,
                });

            if (error) throw error;

            // Clear state
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
                `💰 Jami: *${Number(total).toLocaleString('uz-UZ')} UZS*${promoText}\n\n` +
                `📦 Mahsulotlar:\n${itemsText}\n` +
                t(userId, 'continue_msg'),
                {
                    parse_mode: 'Markdown',
                    reply_markup: new InlineKeyboard()
                        .text(t(userId, 'btn_home'), 'home'),
                }
            );

            // Notify admin
            if (botInstance) {
                await notifyAdmin(botInstance, orderId, state.name || '', state.phone || '', total, cart, userId);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            clearCheckoutMode(userId);
            await ctx.reply(t(userId, 'checkout_error'));
        }
    }
}
