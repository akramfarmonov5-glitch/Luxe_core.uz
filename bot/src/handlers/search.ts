import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';

// Session storage for search state
const searchState = new Map<number, string>();

export function setSearchMode(userId: number) {
    searchState.set(userId, 'waiting');
}

export function isInSearchMode(userId: number): boolean {
    return searchState.has(userId);
}

export function clearSearchMode(userId: number) {
    searchState.delete(userId);
}

export async function handleSearchPrompt(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    setSearchMode(userId);
    await ctx.reply(
        '🔍 *Qidirish*\n\nMahsulot nomini yozing:',
        { parse_mode: 'Markdown' }
    );
}

export async function handleSearchQuery(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    clearSearchMode(userId);

    const query = ctx.message?.text?.trim();
    if (!query) {
        await ctx.reply('❌ Qidirish uchun matn kiriting.');
        return;
    }

    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${query}%`);

        if (error || !products || products.length === 0) {
            await ctx.reply(
                `🔍 "${query}" bo'yicha mahsulot topilmadi.\n\nBoshqa so'z bilan qidiring yoki kategoriyalarni ko'ring.`,
                {
                    reply_markup: new InlineKeyboard()
                        .text('📂 Kategoriyalar', 'show_categories')
                        .row()
                        .text('🏠 Bosh menyu', 'home'),
                }
            );
            return;
        }

        // Show results
        await ctx.reply(`🔍 "${query}" bo'yicha *${products.length} ta* mahsulot topildi:`, {
            parse_mode: 'Markdown',
        });

        // Show first 5 results as list
        const items = products.slice(0, 5);
        for (const p of items) {
            const price = Number(p.price).toLocaleString('uz-UZ');
            const kb = new InlineKeyboard();
            kb.text('🛒 Savatga', `addcart:${p.id}`);
            kb.url('🌐 Ko\'rish', `https://luxe-core-uz-three.vercel.app/#product/${p.id}`);

            await ctx.replyWithPhoto(p.image || 'https://via.placeholder.com/400', {
                caption: `🏷 *${p.name}*\n💰 ${p.formattedPrice || price + ' UZS'}`,
                parse_mode: 'Markdown',
                reply_markup: kb,
            });
        }

        if (products.length > 5) {
            await ctx.reply(`... va yana ${products.length - 5} ta mahsulot. Saytda to'liq ko'ring.`, {
                reply_markup: new InlineKeyboard()
                    .url('🌐 Barchasini ko\'rish', `https://luxe-core-uz-three.vercel.app/?q=${encodeURIComponent(query)}`),
            });
        }
    } catch (err) {
        console.error('Search error:', err);
        await ctx.reply('❌ Qidirishda xatolik yuz berdi.');
    }
}
