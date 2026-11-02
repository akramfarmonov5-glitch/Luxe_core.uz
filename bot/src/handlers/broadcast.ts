import { Bot, Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { config } from '../config';
import { localizeText, getProductUrl } from '../i18n';

// /broadcast ID — send single product to channel
export async function handleBroadcast(ctx: Context) {
    const userId = ctx.from?.id;
    if (userId !== config.ADMIN_ID) {
        await ctx.reply('⛔ Bu komanda faqat admin uchun.');
        return;
    }

    const text = ctx.message?.text || '';
    const productId = parseInt(text.split(' ')[1]);

    if (isNaN(productId)) {
        await ctx.reply(
            '📢 *Broadcast buyrug\'i:*\n\n' +
            '`/broadcast ID` — mahsulotni kanalga yuborish\n' +
            '`/broadcastall` — barcha mahsulotlarni kanalga yuborish\n\n' +
            'Masalan: `/broadcast 1`',
            { parse_mode: 'Markdown' }
        );
        return;
    }

    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error || !product) {
            await ctx.reply(`❌ ID=${productId} mahsulot topilmadi.`);
            return;
        }

        await sendProductToChannel(ctx, product);
        await ctx.reply(`✅ "${localizeText(product.name, 'uz')}" kanalga yuborildi!`);
    } catch (err) {
        console.error('Broadcast error:', err);
        await ctx.reply('❌ Broadcast xatolik.');
    }
}

// /broadcastall — send all products
export async function handleBroadcastAll(ctx: Context) {
    const userId = ctx.from?.id;
    if (userId !== config.ADMIN_ID) {
        await ctx.reply('⛔ Bu komanda faqat admin uchun.');
        return;
    }

    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error || !products || products.length === 0) {
            await ctx.reply('❌ Mahsulotlar topilmadi.');
            return;
        }

        await ctx.reply(`📢 ${products.length} ta mahsulot kanalga yuborilmoqda...`);

        let sent = 0;
        for (const product of products) {
            try {
                await sendProductToChannel(ctx, product);
                sent++;
                // Avoid rate limits
                await new Promise(r => setTimeout(r, 1500));
            } catch (err) {
                console.error(`Broadcast error for product ${product.id}:`, err);
            }
        }

        await ctx.reply(`✅ ${sent}/${products.length} ta mahsulot kanalga yuborildi!`);
    } catch (err) {
        console.error('BroadcastAll error:', err);
        await ctx.reply('❌ Broadcast xatolik.');
    }
}

async function sendProductToChannel(ctx: Context, product: any) {
    const productName = localizeText(product.name, 'uz');
    const shortDesc = localizeText(product.shortDescription || product.description, 'uz');
    const price = Number(product.price).toLocaleString('uz-UZ');
    const minQty = Number(product.itemsPerPackage) > 1 ? Number(product.itemsPerPackage) : 100;
    const packSum = (Number(product.price || 0) * minQty).toLocaleString('uz-UZ');
    const stock = product.stock && product.stock > 0 ? '✅ Omborda mavjud' : '❌ Tugagan';

    const caption =
        `🏷 *${productName}*\n\n` +
        `💰 1 dona ulgurji narxi: *${product.formattedPrice || price + ' UZS'}*\n` +
        `📦 Min. buyurtma: *${minQty} dona* (${packSum} UZS)\n` +
        `🏷 ${stock}\n` +
        `${shortDesc ? `\n📝 ${shortDesc}\n` : ''}` +
        `\n🛒 Buyurtma berish uchun botga yozing yoki saytga kiring!`;

    const kb = new InlineKeyboard()
        .url('🛒 Saytda xarid', getProductUrl(config.SITE_URL, product.id))
        .url('🤖 Botda xarid', `https://t.me/${(await ctx.api.getMe()).username}?start=product_${product.id}`);

    if (product.images && product.images.length > 1) {
        // Send media group (first 4 images)
        const mediaGroup = product.images.slice(0, 4).map((img: string, i: number) => ({
            type: 'photo' as const,
            media: img,
            caption: i === 0 ? caption : undefined,
            parse_mode: i === 0 ? 'Markdown' as const : undefined,
        }));

        await ctx.api.sendMediaGroup(config.CHANNEL_ID, mediaGroup);
        // Send keyboard separately
        await ctx.api.sendMessage(config.CHANNEL_ID, `👆 *${productName}* — sotib olish uchun bosing:`, {
            parse_mode: 'Markdown',
            reply_markup: kb,
        });
    } else {
        await ctx.api.sendPhoto(config.CHANNEL_ID, product.image || 'https://via.placeholder.com/400', {
            caption,
            parse_mode: 'Markdown',
            reply_markup: kb,
        });
    }
}
