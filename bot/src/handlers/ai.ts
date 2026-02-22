import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { config } from '../config';

const aiState = new Map<number, boolean>();
const aiHistory = new Map<number, { role: string; text: string }[]>();

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
    await ctx.reply(
        '🤖 *AI Yordamchi*\n\n' +
        'Men sizga LUXECORE mahsulotlari haqida maslahat bera olaman\\.\n' +
        'Savolingizni yozing\\!\n\n' +
        '_Chiqish uchun /start bosing_',
        { parse_mode: 'MarkdownV2' }
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

        // Get history
        const history = aiHistory.get(userId) || [];

        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const systemInstruction = `Sen LUXECORE premium do'konining yordamchisisiga. 
O'zbek tilida javob ber. LUXECORE - O'zbekistondagi premium onlayn do'kon. 
Soatlar, sumkalar, ko'zoynaklar, parfyumeriya va aksessuarlar sotadi.
Qisqa va foydali javoblar ber. Emoji ishlat.
Sayt: ${config.SITE_URL}`;

        const chatHistory = history.map((msg: any) => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }],
        }));

        // Add system instruction as first user message if no history
        if (chatHistory.length === 0) {
            chatHistory.push({
                role: 'user',
                parts: [{ text: systemInstruction + '\n\nFoydalanuvchi: ' + message }],
            });
        }

        const chat = model.startChat({
            history: chatHistory.length > 0 ? chatHistory : undefined,
        });

        const result = await chat.sendMessage(message);
        const aiText = result.response.text() || 'Uzr, tushunmadim. Qayta so\'ray olasizmi?';

        // Save history (keep last 10)
        history.push({ role: 'user', text: message });
        history.push({ role: 'model', text: aiText });
        if (history.length > 20) history.splice(0, history.length - 20);

        aiHistory.set(userId, history);

        await ctx.reply(aiText, {
            reply_markup: new InlineKeyboard()
                .text('🔚 Chiqish', 'exit_ai')
                .text('🏠 Bosh menyu', 'home'),
        });
    } catch (err: any) {
        console.error('AI error:', err?.message || err);
        await ctx.reply('❌ AI xatolik. Qaytadan urinib ko\'ring.');
    }
}

export async function handleExitAi(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id;
    if (!userId) return;
    clearAiMode(userId);
    aiHistory.delete(userId);
    await ctx.reply('🤖 AI suhbat yakunlandi. Bosh menyuga qaytdingiz.');
}
