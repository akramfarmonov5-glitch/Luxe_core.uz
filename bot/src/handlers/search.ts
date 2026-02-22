import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { t } from '../i18n';
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
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${query}%`)
            .limit(10);

        if (error || !products || products.length === 0) {
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

        // Show results as list
        for (const p of products.slice(0, 5)) {
            const price = Number(p.price).toLocaleString('uz-UZ');
            const stockText = p.stock && p.stock > 0 ? t(userId, 'product_stock_yes') : t(userId, 'product_stock_no');
            const caption =
                `🏷 *${p.name}*\n\n` +
                `${t(userId, 'product_price')} *${p.formattedPrice || price + ' UZS'}*\n` +
                `${t(userId, 'product_status')} ${stockText}`;

            const kb = new InlineKeyboard()
                .text(t(userId, 'btn_add_cart'), `addcart:${p.id}`)
                .url(t(userId, 'btn_view_site'), `${config.SITE_URL}/#product/${p.id}`);

            try {
                await ctx.replyWithPhoto(p.image || 'https://via.placeholder.com/400', {
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
