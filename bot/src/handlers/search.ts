import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { t, getLang, localizeText, getProductUrl } from '../i18n';
import { config } from '../config';

const searchState = new Map<number, boolean>();

export function setSearchMode(userId: number) { searchState.set(userId, true); }
export function isInSearchMode(userId: number): boolean { return searchState.has(userId); }
export function clearSearchMode(userId: number) { searchState.delete(userId); }

export async function handleSearchPrompt(ctx: Context) {
    const userId = ctx.from?.id || 0;
    setSearchMode(userId);
    await ctx.reply(t(userId, 'search_prompt'), { parse_mode: 'Markdown' });
}

export async function handleSearchQuery(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const query = ctx.message?.text?.trim();
    if (!query) return;

    clearSearchMode(userId);

    try {
        const { data: allProducts, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        const q = query.toLowerCase();
        const products = (allProducts || []).filter((p: any) => {
            const nameUz = localizeText(p.name, 'uz').toLowerCase();
            const nameRu = localizeText(p.name, 'ru').toLowerCase();
            const rawName = typeof p.name === 'string' ? p.name.toLowerCase() : JSON.stringify(p.name || '').toLowerCase();
            const cat = localizeText(p.category, 'uz').toLowerCase();
            return nameUz.includes(q) || nameRu.includes(q) || rawName.includes(q) || cat.includes(q);
        });

        if (error || products.length === 0) {
            await ctx.reply(
                `${t(userId, 'search_no_result')}\n\n"${query}" bo'yicha hech narsa topilmadi.`,
                {
                    reply_markup: new InlineKeyboard()
                        .text(t(userId, 'btn_search'), 'menu:search')
                        .text(t(userId, 'btn_categories'), 'show_categories')
                        .row()
                        .text(t(userId, 'btn_home'), 'home'),
                }
            );
            return;
        }

        const lang = getLang(userId);
        // Show results as list
        for (const p of products.slice(0, 5)) {
            const productName = localizeText(p.name, lang).replace(/[*_`\[\]]/g, '');
            const price = Number(p.price).toLocaleString('uz-UZ');
            const minQty = Number(p.itemsPerPackage) > 1 ? Number(p.itemsPerPackage) : 100;
            const packSum = (Number(p.price || 0) * minQty).toLocaleString('uz-UZ');
            const stockText = p.stock && p.stock > 0 ? t(userId, 'product_stock_yes') : t(userId, 'product_stock_no');
            const caption =
                `🏷 *${productName}*\n\n` +
                `${t(userId, 'product_price')} *${String(p.formattedPrice || price + ' UZS').replace(/[*_`\[\]]/g, '')}*\n` +
                `${t(userId, 'product_min_order')} *${minQty} ${t(userId, 'product_pcs')}* (${packSum} UZS)\n` +
                `${t(userId, 'product_status')} ${stockText}`;

            const productUrl = getProductUrl(config.SITE_URL, p, userId);
            const unitLabel = t(userId, 'product_pcs');
            const kb = new InlineKeyboard()
                .webApp(t(userId, 'btn_buy_on_site'), productUrl)
                .row()
                .text(`🛒 +1x (${minQty} ${unitLabel})`, `addcart:${p.id}:1`)
                .text(`📦 +5x (${minQty * 5})`, `addcart:${p.id}:5`)
                .text(`📦 +10x (${minQty * 10})`, `addcart:${p.id}:10`)
                .row()
                .url(t(userId, 'btn_view_site'), productUrl);

            const rawImg = String(p.image || '').trim();
            const photoUrl = rawImg.startsWith('http://') || rawImg.startsWith('https://')
                ? rawImg
                : rawImg
                ? `${(config.SITE_URL || 'https://luxe-core.uz').replace(/\/+$/, '')}${rawImg.startsWith('/') ? rawImg : `/${rawImg}`}`
                : 'https://via.placeholder.com/400';

            try {
                await ctx.replyWithPhoto(photoUrl, {
                    caption,
                    parse_mode: 'Markdown',
                    reply_markup: kb,
                });
            } catch {
                await ctx.reply(caption, { parse_mode: 'Markdown', reply_markup: kb });
            }
        }
    } catch (err) {
        console.error('Search error:', err);
        await ctx.reply(t(userId, 'error'));
    }
}
