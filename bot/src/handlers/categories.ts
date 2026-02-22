import { Context } from 'grammy';
import { supabase } from '../supabase';
import { categoriesKeyboard } from '../keyboards';

export async function handleCategories(ctx: Context) {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('id, name, slug, image')
            .order('name');

        if (error || !categories || categories.length === 0) {
            await ctx.reply('📂 Hozircha kategoriyalar mavjud emas.');
            return;
        }

        await ctx.reply(
            '📂 *Kategoriyalarni tanlang:*',
            {
                parse_mode: 'Markdown',
                reply_markup: categoriesKeyboard(categories),
            }
        );
    } catch (err) {
        console.error('Categories error:', err);
        await ctx.reply('❌ Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
}

export async function handleCategorySelect(ctx: Context) {
    try {
        await ctx.answerCallbackQuery();
        const data = ctx.callbackQuery?.data;
        if (!data) return;

        const slug = data.replace('cat:', '');

        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', slug)
            .order('created_at', { ascending: false });

        if (error || !products || products.length === 0) {
            await ctx.reply(`Bu kategoriyada hozircha mahsulotlar yo'q.`);
            return;
        }

        // Show first product
        await sendProductCard(ctx, products, 0, `catpage:${slug}`);
    } catch (err) {
        console.error('Category select error:', err);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

export async function handleCategoryPage(ctx: Context) {
    try {
        await ctx.answerCallbackQuery();
        const data = ctx.callbackQuery?.data;
        if (!data) return;

        // catpage:slug:pageNum
        const parts = data.split(':');
        const slug = parts[1];
        const page = parseInt(parts[2]) || 0;

        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', slug)
            .order('created_at', { ascending: false });

        if (error || !products || products.length === 0) return;

        await sendProductCard(ctx, products, page, `catpage:${slug}`, true);
    } catch (err) {
        console.error('Category page error:', err);
    }
}

async function sendProductCard(
    ctx: Context,
    products: any[],
    page: number,
    prefix: string,
    edit = false
) {
    const ITEMS_PER_PAGE = 1;
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const p = products[page];
    if (!p) return;

    const price = Number(p.price).toLocaleString('uz-UZ');
    const stock = p.stock && p.stock > 0 ? '✅ Mavjud' : '❌ Tugagan';

    const caption =
        `🏷 *${p.name}*\n\n` +
        `💰 Narxi: *${p.formattedPrice || price + ' UZS'}*\n` +
        `📦 Holat: ${stock}\n` +
        `${p.shortDescription ? `\n📝 ${p.shortDescription}` : ''}`;

    const { InlineKeyboard } = require('grammy');
    const kb = new InlineKeyboard();

    // Navigation
    if (page > 0) kb.text('◀️', `${prefix}:${page - 1}`);
    kb.text(`${page + 1}/${totalPages}`, 'noop');
    if (page < totalPages - 1) kb.text('▶️', `${prefix}:${page + 1}`);
    kb.row();

    // Actions
    kb.text('🛒 Savatga', `addcart:${p.id}`);
    kb.url('🌐 Saytda', `https://luxe-core-uz-three.vercel.app/#product/${p.id}`);
    kb.row();
    kb.text('🏠 Bosh menyu', 'home');

    if (edit && ctx.callbackQuery?.message) {
        try {
            // Try editing existing message
            if (ctx.callbackQuery.message.photo) {
                await ctx.editMessageMedia({
                    type: 'photo',
                    media: p.image || 'https://via.placeholder.com/400',
                    caption,
                    parse_mode: 'Markdown',
                }, { reply_markup: kb });
            } else {
                // Delete old and send new
                await ctx.deleteMessage();
                await ctx.replyWithPhoto(p.image || 'https://via.placeholder.com/400', {
                    caption,
                    parse_mode: 'Markdown',
                    reply_markup: kb,
                });
            }
        } catch {
            await ctx.replyWithPhoto(p.image || 'https://via.placeholder.com/400', {
                caption,
                parse_mode: 'Markdown',
                reply_markup: kb,
            });
        }
    } else {
        await ctx.replyWithPhoto(p.image || 'https://via.placeholder.com/400', {
            caption,
            parse_mode: 'Markdown',
            reply_markup: kb,
        });
    }
}
