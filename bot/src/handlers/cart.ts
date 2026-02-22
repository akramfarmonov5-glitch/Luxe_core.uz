import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { CartItem } from '../types';

// In-memory cart storage (per user)
const carts = new Map<number, CartItem[]>();
const checkoutState = new Map<number, { step: string; phone?: string }>();

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
    try {
        await ctx.answerCallbackQuery('✅ Savatga qo\'shildi!');
        const data = ctx.callbackQuery?.data;
        if (!data) return;

        const productId = parseInt(data.replace('addcart:', ''));
        const userId = ctx.from?.id;
        if (!userId || isNaN(productId)) return;

        // Fetch product
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
            `🛒 *${product.name}* savatga qo'shildi!\n\n` +
            `Savatda: ${cart.length} xil, ${cart.reduce((s, i) => s + i.quantity, 0)} dona`,
            {
                parse_mode: 'Markdown',
                reply_markup: new InlineKeyboard()
                    .text(`🛒 Savatni ko'rish (${cart.length})`, 'show_cart')
                    .row()
                    .text('🏠 Davom etish', 'home'),
            }
        );
    } catch (err) {
        console.error('Add to cart error:', err);
    }
}

export async function handleShowCart(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();

    const userId = ctx.from?.id;
    if (!userId) return;

    const cart = getUserCart(userId);
    if (cart.length === 0) {
        await ctx.reply('🛒 Savatingiz bo\'sh.', {
            reply_markup: new InlineKeyboard()
                .text('📂 Kategoriyalar', 'show_categories')
                .text('🏠 Bosh menyu', 'home'),
        });
        return;
    }

    let total = 0;
    let text = '🛒 *Savatingiz:*\n\n';
    cart.forEach((item, i) => {
        const sum = item.price * item.quantity;
        total += sum;
        text += `${i + 1}. *${item.name}*\n`;
        text += `   ${item.quantity} x ${Number(item.price).toLocaleString('uz-UZ')} = *${Number(sum).toLocaleString('uz-UZ')} UZS*\n\n`;
    });

    text += `\n💰 *Jami: ${Number(total).toLocaleString('uz-UZ')} UZS*`;

    await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
            .text('✅ Buyurtma berish', 'checkout')
            .text('🗑 Tozalash', 'clear_cart')
            .row()
            .text('🏠 Bosh menyu', 'home'),
    });
}

export async function handleClearCart(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery('🗑 Savat tozalandi');
    const userId = ctx.from?.id;
    if (!userId) return;
    carts.delete(userId);
    await ctx.reply('🗑 Savat tozalandi.');
}

export async function handleCheckout(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();

    const userId = ctx.from?.id;
    if (!userId) return;

    const cart = getUserCart(userId);
    if (cart.length === 0) {
        await ctx.reply('🛒 Savat bo\'sh, avval mahsulot qo\'shing.');
        return;
    }

    checkoutState.set(userId, { step: 'phone' });
    await ctx.reply(
        '📱 Buyurtma berish uchun telefon raqamingizni yuboring:\n_(Masalan: +998901234567)_',
        { parse_mode: 'Markdown' }
    );
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
        state.phone = phone;
        state.step = 'name';
        checkoutState.set(userId, state);
        await ctx.reply('👤 Ismingizni kiriting:');
        return;
    }

    if (state.step === 'name') {
        const customerName = text;
        const phone = state.phone || '';
        const cart = getUserCart(userId);

        if (cart.length === 0) {
            clearCheckoutMode(userId);
            await ctx.reply('❌ Savat bo\'sh.');
            return;
        }

        const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

        // Create order in Supabase
        try {
            const orderId = `LC${Date.now().toString(36).toUpperCase()}`;
            const { error } = await supabase
                .from('orders')
                .insert({
                    id: orderId,
                    customerName: customerName,
                    phone: phone,
                    total: total,
                    status: 'Kutilmoqda',
                    date: new Date().toISOString().split('T')[0],
                    paymentMethod: 'Naqd',
                    items: cart,
                });

            if (error) throw error;

            // Clear
            carts.delete(userId);
            clearCheckoutMode(userId);

            let itemsText = '';
            cart.forEach(i => {
                itemsText += `  • ${i.name} x${i.quantity}\n`;
            });

            await ctx.reply(
                `✅ *Buyurtma qabul qilindi!*\n\n` +
                `📋 Buyurtma: *#${orderId}*\n` +
                `👤 Ism: ${customerName}\n` +
                `📱 Tel: ${phone}\n` +
                `💰 Jami: *${Number(total).toLocaleString('uz-UZ')} UZS*\n\n` +
                `📦 Mahsulotlar:\n${itemsText}\n` +
                `Tez orada siz bilan bog'lanamiz! 🚀`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: new InlineKeyboard()
                        .text('🏠 Bosh menyu', 'home'),
                }
            );
        } catch (err) {
            console.error('Checkout error:', err);
            clearCheckoutMode(userId);
            await ctx.reply('❌ Buyurtma berishda xatolik. Qaytadan urinib ko\'ring.');
        }
    }
}
