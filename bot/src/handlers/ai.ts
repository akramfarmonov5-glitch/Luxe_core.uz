import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { config } from '../config';
import { t, getLang } from '../i18n';

const aiState = new Map<number, boolean>();
const aiHistory = new Map<number, { role: string; parts: { text: string }[] }[]>();

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

        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

        const lang = getLang(userId);
        const langName = lang === 'ru' ? 'Русский' : 'O\'zbek';

        const systemInstruction =
            `Sen LUXECORE premium do'konining yordamchisisiga. ` +
            `${langName} tilida javob ber. LUXECORE - O'zbekistondagi premium onlayn do'kon. ` +
            `Soatlar, sumkalar, ko'zoynaklar, parfyumeriya va aksessuarlar sotadi. ` +
            `Qisqa va foydali javoblar ber. Emoji ishlat. Sayt: ${config.SITE_URL}`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
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
