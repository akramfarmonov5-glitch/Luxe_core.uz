import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { CartItem } from '../types';
import { config } from '../config';
import { t, getLang, localizeText, getProductUrl, getSitePageUrl } from '../i18n';
import { ensureUser } from './profile';
import { clearPersistedCart, hydrateCart, persistCart } from '../cartStore';

/**
 * Savat CRUD amallari (qo'shish / ko'rish / +/- / o'chirish).
 *
 * Checkout oqimi (telefon → ism → manzil → promo → to'lov → yakunlash)
 * `bot/src/handlers/checkout.ts` ga ajratildi. Eski import yo'llari
 * buzilmasligi uchun checkout funksiyalari shu yerdan qayta eksport qilinadi.
 */
export {
    handleCheckout,
    handleCheckoutInput,
    handleSkipPromo,
    handlePayCard,
    handlePayCash,
    handleCardPaidConfirm,
    isInCheckoutMode,
    clearCheckoutMode,
    setBotInstance,
} from './checkout';

export async function getUserCart(userId: number): Promise<CartItem[]> {
    return hydrateCart(userId);
}

export async function handleAddToCart(ctx: Context) {
    const userId = ctx.from?.id || 0;
    try {
        await ctx.answerCallbackQuery(`✅ ${t(userId, 'cart_added')}`);
        const data = ctx.callbackQuery?.data;
        if (!data) return;

        const parts = data.replace('addcart:', '').split(':');
        const productId = parseInt(parts[0]);
        const mult = Math.max(1, parseInt(parts[1] || '1') || 1);
        if (!userId || isNaN(productId)) return;

        const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (!product) return;

        const productName = localizeText(product.name, getLang(userId));
        const step = Number(product.itemsPerPackage) > 1 ? Number(product.itemsPerPackage) : 100;
        const addQty = step * mult;
        const cart = await getUserCart(userId);
        const existing = cart.find(i => i.productId === productId);

        if (existing) {
            existing.quantity += addQty;
            existing.name = productName;
            existing.itemsPerPackage = step;
        } else {
            cart.push({
                productId: product.id,
                name: productName,
                price: product.price,
                quantity: addQty,
                image: product.image,
                itemsPerPackage: step,
            });
        }

        await persistCart(userId, cart);

        // Register user
        await ensureUser(userId, ctx.from?.first_name);

        await ctx.reply(
            `🛒 *${productName}* (+${addQty} ${t(userId, 'product_pcs')}) ${t(userId, 'cart_added')}\n\n` +
            `Savatda: ${cart.length} xil, ${cart.reduce((s, i) => s + i.quantity, 0)} ${t(userId, 'product_pcs')}`,
            {
                parse_mode: 'Markdown',
                reply_markup: new InlineKeyboard()
                    .text(`🛒 ${t(userId, 'btn_cart')} (${cart.length})`, 'show_cart')
                    .text(t(userId, 'btn_checkout'), 'checkout')
                    .row()
                    .webApp(t(userId, 'btn_buy_on_site'), getProductUrl(config.SITE_URL, product.id, userId))
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

    const cart = await getUserCart(userId);
    if (cart.length === 0) {
        await ctx.reply(t(userId, 'cart_empty'), {
            reply_markup: new InlineKeyboard()
                .webApp(t(userId, 'btn_shop'), getSitePageUrl(config.SITE_URL, '', userId))
                .row()
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
        .webApp(t(userId, 'btn_checkout_site'), getSitePageUrl(config.SITE_URL, '', userId))
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
    const cart = await getUserCart(userId);
    const item = cart.find(i => i.productId === productId);
    if (item) {
        const step = item.itemsPerPackage && item.itemsPerPackage > 1 ? item.itemsPerPackage : 100;
        item.quantity += step;
        await persistCart(userId, cart);
    }
    await ctx.answerCallbackQuery(t(userId, 'cart_updated'));
    await handleShowCart(ctx);
}

export async function handleCartMinus(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const data = ctx.callbackQuery?.data || '';
    const productId = parseInt(data.replace('cart_minus:', ''));
    const cart = await getUserCart(userId);
    const idx = cart.findIndex(i => i.productId === productId);
    if (idx >= 0) {
        const step = cart[idx].itemsPerPackage && cart[idx].itemsPerPackage! > 1 ? cart[idx].itemsPerPackage! : 100;
        if (cart[idx].quantity > step) {
            cart[idx].quantity -= step;
        } else {
            cart.splice(idx, 1);
        }
        await persistCart(userId, cart);
    }
    await ctx.answerCallbackQuery(t(userId, 'cart_updated'));
    await handleShowCart(ctx);
}

export async function handleCartDelete(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const data = ctx.callbackQuery?.data || '';
    const productId = parseInt(data.replace('cart_del:', ''));
    const cart = await getUserCart(userId);
    const idx = cart.findIndex(i => i.productId === productId);
    if (idx >= 0) cart.splice(idx, 1);
    await persistCart(userId, cart);
    await ctx.answerCallbackQuery(t(userId, 'cart_removed'));
    await handleShowCart(ctx);
}

export async function handleClearCart(ctx: Context) {
    const userId = ctx.from?.id || 0;
    if (ctx.callbackQuery) await ctx.answerCallbackQuery(t(userId, 'cart_cleared'));
    await clearPersistedCart(userId);
    await ctx.reply(t(userId, 'cart_cleared'));
}
