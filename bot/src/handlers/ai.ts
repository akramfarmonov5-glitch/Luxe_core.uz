import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { config } from '../config';

const aiState = new Map<number, boolean>();
const aiHistory = new Map<number, { role: string; parts: { text: string }[] }[]>();

export function setAiMode(userId: number) {
    aiState.set(userId, true);
}

export function isInAiMode(userId: number): boolean {
    return aiState.has(userId);
}

export function clearAiMode(userId: number) {
    aiState.delete(userId);
}

export async function handleAiPrompt(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    setAiMode(userId);
    aiHistory.delete(userId); // fresh conversation
    await ctx.reply(
        '🤖 *AI Yordamchi*\n\n' +
        'Men sizga LUXECORE mahsulotlari haqida maslahat bera olaman.\n' +
        'Savolingizni yozing!\n\n' +
        '_Chiqish uchun /start bosing_',
        { parse_mode: 'Markdown' }
    );
}

export async function handleAiMessage(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const message = ctx.message?.text?.trim();
    if (!message) return;

    if (!config.GEMINI_API_KEY) {
        await ctx.reply('❌ AI tizimi hozirda ishlamayapti.');
        clearAiMode(userId);
        return;
    }

    try {
        await ctx.replyWithChatAction('typing');

        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

        const systemInstruction =
            `Sen LUXECORE premium do'konining yordamchisisiga. ` +
            `O'zbek tilida javob ber. LUXECORE - O'zbekistondagi premium onlayn do'kon. ` +
            `Soatlar, sumkalar, ko'zoynaklar, parfyumeriya va aksessuarlar sotadi. ` +
            `Qisqa va foydali javoblar ber. Emoji ishlat. Sayt: ${config.SITE_URL}`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: systemInstruction,
        });

        // Get existing history
        const history = aiHistory.get(userId) || [];

        const chat = model.startChat({
            history: history.length > 0 ? history : undefined,
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const aiText = response.text() || 'Uzr, tushunmadim. Qayta so\'ray olasizmi?';

        // Save to history (keep last 20 messages = 10 pairs)
        history.push({ role: 'user', parts: [{ text: message }] });
        history.push({ role: 'model', parts: [{ text: aiText }] });
        if (history.length > 20) history.splice(0, history.length - 20);
        aiHistory.set(userId, history);

        await ctx.reply(aiText, {
            reply_markup: new InlineKeyboard()
                .text('🔚 Chiqish', 'exit_ai')
                .text('🏠 Bosh menyu', 'home'),
        });
    } catch (err: any) {
        console.error('AI error:', err?.message || err);
        await ctx.reply(
            '❌ AI xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.\n\n' +
            '_Chiqish uchun /start bosing_',
            {
                parse_mode: 'Markdown',
                reply_markup: new InlineKeyboard()
                    .text('🔄 Qayta urinish', 'menu:ai')
                    .text('🏠 Bosh menyu', 'home'),
            }
        );
    }
}

export async function handleExitAi(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id;
    if (!userId) return;
    clearAiMode(userId);
    aiHistory.delete(userId);
    await ctx.reply('🤖 AI suhbat yakunlandi.');
}
