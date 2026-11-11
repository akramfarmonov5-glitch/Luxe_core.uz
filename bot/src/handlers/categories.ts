import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { categoriesKeyboard } from '../keyboards';
import { t, getLang, localizeText, getProductUrl, getSitePageUrl } from '../i18n';
import { config } from '../config';

function cleanMd(text: string): string {
    return String(text || '').replace(/[*_`\[\]]/g, '');
}

function resolveBotImageUrl(img?: string): string {
    const raw = String(img || '').trim();
    if (!raw) return 'https://via.placeholder.com/400';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    const base = (config.SITE_URL || 'https://luxe-core.uz').replace(/\/+$/, '');
    return `${base}${raw.startsWith('/') ? raw : `/${raw}`}`;
}

async function fetchProductsByCategorySlug(slug: string) {
    const [{ data: allProducts, error }, { data: categories }] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name, slug'),
    ]);

    if (error || !allProducts) return [];

    const matchedCat = (categories || []).find((c: any) => {
        const cSlugUz = localizeText(c.slug, 'uz');
        const cSlugRu = localizeText(c.slug, 'ru');
        return cSlugUz === slug || cSlugRu === slug || String(c.id) === slug;
    });

    const targetSlug = slug.toLowerCase();
    const matchedNameUz = matchedCat ? localizeText(matchedCat.name, 'uz').toLowerCase() : '';

    return allProducts.filter((p: any) => {
        const pCat = localizeText(p.category, 'uz').toLowerCase();
        const pCatRaw = typeof p.category === 'string' ? p.category.toLowerCase() : '';
        if (pCat === targetSlug || pCatRaw === targetSlug) return true;
        if (matchedCat && String(p.categoryId) === String(matchedCat.id)) return true;
        if (matchedNameUz && (pCat === matchedNameUz || pCatRaw === matchedNameUz)) return true;
        // Handle toy-va-sarpo vs toy-qutilari alias
        if ((targetSlug.includes('toy') && pCat.includes('toy')) || (targetSlug.includes('kraft') && pCat.includes('kraft'))) {
            return true;
        }
        return false;
    });
}

export async function handleCategories(ctx: Context) {
    const userId = ctx.from?.id || 0;
    try {
        if (ctx.callbackQuery) await ctx.answerCallbackQuery().catch(() => {});
        const { data: categories, error } = await supabase
            .from('categories')
            .select('id, name, slug, image')
            .order('id');

        if (error || !categories || categories.length === 0) {
            await ctx.reply(t(userId, 'no_categories'));
            return;
        }

        await ctx.reply(
            t(userId, 'categories_title'),
            {
                parse_mode: 'Markdown',
                reply_markup: categoriesKeyboard(categories, userId),
            }
        );
    } catch (err) {
        console.error('Categories error:', err);
        await ctx.reply(t(userId, 'error'));
    }
}

export async function handleCategorySelect(ctx: Context) {
    const userId = ctx.from?.id || 0;
    try {
        await ctx.answerCallbackQuery().catch(() => {});
        const data = ctx.callbackQuery?.data;
        if (!data) return;

        const slug = data.replace('cat:', '');
        const products = await fetchProductsByCategorySlug(slug);

        if (!products || products.length === 0) {
            await ctx.reply(t(userId, 'no_products'));
            return;
        }

        await sendProductCard(ctx, products, 0, `catpage:${slug}`, userId);
    } catch (err) {
        console.error('Category select error:', err);
        await ctx.reply(t(userId, 'error'));
    }
}

export async function handleCategoryPage(ctx: Context) {
    const userId = ctx.from?.id || 0;
    try {
        await ctx.answerCallbackQuery().catch(() => {});
        const data = ctx.callbackQuery?.data;
        if (!data) return;

        const parts = data.split(':');
        const slug = parts[1];
        const page = parseInt(parts[2]) || 0;

        const products = await fetchProductsByCategorySlug(slug);
        if (!products || products.length === 0) return;

        await sendProductCard(ctx, products, page, `catpage:${slug}`, userId, true);
    } catch (err) {
        console.error('Category page error:', err);
    }
}

export async function sendProductCard(
    ctx: Context,
    products: any[],
    page: number,
    prefix: string,
    userId: number,
    edit = false
) {
    const totalPages = products.length;
    const p = products[page];
    if (!p) return;

    const lang = getLang(userId);
    const productName = cleanMd(localizeText(p.name, lang));
    const shortDesc = cleanMd(localizeText(p.shortDescription || p.description, lang));
    const price = Number(p.price).toLocaleString('uz-UZ');
    const minQty = Number(p.itemsPerPackage) > 1 ? Number(p.itemsPerPackage) : 100;
    const packSum = (Number(p.price || 0) * minQty).toLocaleString('uz-UZ');
    const stockText = p.stock && p.stock > 0 ? t(userId, 'product_stock_yes') : t(userId, 'product_stock_no');

    const caption =
        `🏷 *${productName}*\n\n` +
        `${t(userId, 'product_price')} *${cleanMd(p.formattedPrice || price + ' UZS')}*\n` +
        `${t(userId, 'product_min_order')} *${minQty} ${t(userId, 'product_pcs')}* (${packSum} UZS)\n` +
        `${t(userId, 'product_status')} ${stockText}\n` +
        `${shortDesc ? `\n📝 ${shortDesc}` : ''}`;

    const kb = new InlineKeyboard();

    // Navigation
    if (page > 0) kb.text('◀️', `${prefix}:${page - 1}`);
    if (totalPages > 1) kb.text(`${page + 1}/${totalPages}`, 'noop');
    if (page < totalPages - 1) kb.text('▶️', `${prefix}:${page + 1}`);
    if (totalPages > 1) kb.row();

    // Primary CTA: Open product directly inside Telegram WebApp
    const productUrl = getProductUrl(config.SITE_URL, p, userId);
    kb.webApp(t(userId, 'btn_buy_on_site'), productUrl).row();

    // Quick wholesale pack buttons (1x, 5x, 10x)
    const unitLabel = t(userId, 'product_pcs');
    kb.text(`🛒 +1x (${minQty} ${unitLabel})`, `addcart:${p.id}:1`)
      .text(`📦 +5x (${minQty * 5})`, `addcart:${p.id}:5`)
      .text(`📦 +10x (${minQty * 10})`, `addcart:${p.id}:10`)
      .row();

    kb.url(t(userId, 'btn_view_site'), productUrl).row();

    // If browsing a category, allow opening the whole category on the website
    if (prefix.startsWith('catpage:')) {
        const slug = prefix.replace('catpage:', '');
        kb.webApp(t(userId, 'btn_open_category_site'), getSitePageUrl(config.SITE_URL, `/category/${slug}`, userId)).row();
    }

    kb.text(t(userId, 'btn_categories'), 'show_categories');
    kb.text(t(userId, 'btn_home'), 'home');

    // Check if product has multiple images
    const hasMultipleImages = p.images && Array.isArray(p.images) && p.images.length > 1;
    const mainPhotoUrl = resolveBotImageUrl(p.image);

    if (hasMultipleImages && !edit) {
        // Send media gallery (first time only)
        const mediaGroup = p.images.slice(0, 4).map((img: string, i: number) => ({
            type: 'photo' as const,
            media: resolveBotImageUrl(img),
            caption: i === 0 ? caption : undefined,
            parse_mode: i === 0 ? 'Markdown' as const : undefined,
        }));

        try {
            await ctx.replyWithMediaGroup(mediaGroup);
            // Send inline keyboard separately 
            await ctx.reply(`👆 *${productName}*`, {
                parse_mode: 'Markdown',
                reply_markup: kb,
            });
        } catch {
            // Fallback to single photo
            await ctx.replyWithPhoto(mainPhotoUrl, {
                caption,
                parse_mode: 'Markdown',
                reply_markup: kb,
            });
        }
    } else if (edit && ctx.callbackQuery?.message) {
        try {
            if (ctx.callbackQuery.message.photo) {
                await ctx.editMessageMedia({
                    type: 'photo',
                    media: mainPhotoUrl,
                    caption,
                    parse_mode: 'Markdown',
                }, { reply_markup: kb });
            } else {
                await ctx.deleteMessage();
                await ctx.replyWithPhoto(mainPhotoUrl, {
                    caption,
                    parse_mode: 'Markdown',
                    reply_markup: kb,
                });
            }
        } catch {
            await ctx.replyWithPhoto(mainPhotoUrl, {
                caption,
                parse_mode: 'Markdown',
                reply_markup: kb,
            });
        }
    } else {
        try {
            await ctx.replyWithPhoto(mainPhotoUrl, {
                caption,
                parse_mode: 'Markdown',
                reply_markup: kb,
            });
        } catch {
            await ctx.reply(caption, {
                parse_mode: 'Markdown',
                reply_markup: kb,
            });
        }
    }
}
