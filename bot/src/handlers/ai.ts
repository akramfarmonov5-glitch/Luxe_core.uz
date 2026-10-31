import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { supabase } from '../supabase';
import { t, getLang, localizeText, getProductUrl } from '../i18n';
import { Lang } from '../types';

const aiState = new Map<number, boolean>();
const aiHistory = new Map<number, { role: string; parts: { text: string }[] }[]>();

let cachedCatalogContext: { uz: string; ru: string; expiresAt: number } | null = null;

async function getCatalogSummary(lang: Lang): Promise<string> {
    const now = Date.now();
    if (cachedCatalogContext && cachedCatalogContext.expiresAt > now) {
        return cachedCatalogContext[lang];
    }

    try {
        const { data: products } = await supabase
            .from('products')
            .select('id, name, price, category, stock, shortDescription')
            .order('created_at', { ascending: false })
            .limit(40);

        if (!products || products.length === 0) {
            return '';
        }

        const buildForLang = (l: Lang) =>
            products
                .map((p: any) => {
                    const name = localizeText(p.name, l);
                    const cat = localizeText(p.category, l);
                    const price = Number(p.price).toLocaleString('uz-UZ') + ' UZS';
                    const inStock = p.stock === undefined || p.stock === null || p.stock > 0
                        ? (l === 'ru' ? 'В наличии' : 'Mavjud')
                        : (l === 'ru' ? 'Нет в наличии' : 'Tugagan');
                    const url = getProductUrl(config.SITE_URL, p.id);
                    return `- [ID:${p.id}] ${name} (${cat}) — ${price} [${inStock}] | Link: ${url}`;
                })
                .join('\n');

        cachedCatalogContext = {
            uz: buildForLang('uz'),
            ru: buildForLang('ru'),
            expiresAt: now + 2 * 60 * 1000,
        };

        return cachedCatalogContext[lang];
    } catch {
        return '';
    }
}

export function setAiMode(userId: number) { aiState.set(userId, true); }
export function isInAiMode(userId: number): boolean { return aiState.has(userId); }
export function clearAiMode(userId: number) { aiState.delete(userId); }

export async function handleAiPrompt(ctx: Context) {
    const userId = ctx.from?.id || 0;
    setAiMode(userId);
    aiHistory.delete(userId);
    await ctx.reply(
        t(userId, 'ai_prompt'),
        { parse_mode: 'Markdown' }
    );
}

export async function handleAiMessage(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const message = ctx.message?.text?.trim();
    if (!message) return;

    if (!config.GEMINI_API_KEY) {
        await ctx.reply(t(userId, 'ai_error'));
        clearAiMode(userId);
        return;
    }

    try {
        await ctx.replyWithChatAction('typing');

        const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

        const lang = getLang(userId);
        const langName = lang === 'ru' ? 'Русский' : 'O\'zbek';
        const catalogSummary = await getCatalogSummary(lang);

        const systemInstruction =
            `Sen LUXECORE premium do'konining rasmiy AI sotuvchi-konsultantisan. ` +
            `${langName} tilida xushmuomala, qisqa va aniq javob ber. Emoji ishlat.\n` +
            `Do'kon ma'lumotlari:\n` +
            `- Minimal buyurtma summasi: 500,000 UZS\n` +
            `- Yetkazib berish: O'zbekiston bo'ylab 40,000 UZS (2,000,000 UZS dan oshsa BEPUL)\n` +
            `- Aloqa: ${config.CONTACT_PHONE} (${config.CONTACT_USERNAME})\n` +
            `- Sayt: ${config.SITE_URL}\n` +
            (catalogSummary
                ? `\nDo'kondagi mavjud mahsulotlar katalogi:\n${catalogSummary}\nFaqat shu katalogdagi haqiqiy mahsulot va narxlarni tavsiya qil.`
                : '');

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction,
        });

        const history = aiHistory.get(userId) || [];
        const chat = model.startChat({
            history: history.length > 0 ? history : undefined,
        });

        const result = await chat.sendMessage(message);
        const aiText = result.response.text() || (lang === 'ru' ? 'Извините, не понял.' : 'Uzr, tushunmadim.');

        history.push({ role: 'user', parts: [{ text: message }] });
        history.push({ role: 'model', parts: [{ text: aiText }] });
        if (history.length > 20) history.splice(0, history.length - 20);
        aiHistory.set(userId, history);

        await ctx.reply(aiText, {
            reply_markup: new InlineKeyboard()
                .text('🔚 Chiqish', 'exit_ai')
                .text(t(userId, 'btn_home'), 'home'),
        });
    } catch (err: any) {
        console.error('AI error:', err?.message || err);
        const lang = getLang(userId);
        let errorMsg = t(userId, 'ai_error');

        if (err?.message?.includes('429') || err?.message?.includes('quota')) {
            errorMsg = lang === 'ru'
                ? '😔 К сожалению, лимит запросов к ИИ на сегодня исчерпан. Пожалуйста, попробуйте завтра.'
                : '😔 Afsuski, bugun uchun AI so\'rovlar limiti tugadi. Iltimos, ertaga qayta urinib ko\'ring.';
        }

        await ctx.reply(
            errorMsg,
            {
                reply_markup: new InlineKeyboard()
                    .text('🔄 Qayta urinish', 'menu:ai')
                    .text(t(userId, 'btn_home'), 'home'),
            }
        );
    }
}

export async function handleExitAi(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;
    clearAiMode(userId);
    aiHistory.delete(userId);
    await ctx.reply(t(userId, 'ai_exit'));
}
