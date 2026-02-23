import { GoogleGenAI } from '@google/genai';

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'AI tizimi sozlanmagan (API key topilmadi).' });
        return;
    }

    let body: any;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }

    const message = (body?.message || '').trim();
    const prompt = (body?.prompt || '').trim(); // Static prompt for generation
    const systemInstruction = (body?.systemInstruction || '').trim();
    const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];
    const responseMimeType = body?.responseMimeType; // Optional JSON mode

    if (!message && !prompt) {
        res.status(400).json({ error: 'Message or Prompt is required' });
        return;
    }

    try {
        const client = new GoogleGenAI({ apiKey });
        const modelName = 'gemini-2.5-flash'; // Text chat model

        if (prompt) {
            // Static content generation (Product Detail, Admin, Blog)
            const response = await client.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction || undefined,
                    responseMimeType: responseMimeType === 'application/json' ? 'application/json' : undefined,
                },
            });

            const text = response.text || "";
            res.status(200).json({ text });
        } else {
            // Interactive Chat (AIChatAssistant)
            const chat = client.chats.create({
                model: modelName,
                config: {
                    systemInstruction: systemInstruction || undefined,
                },
                history: history.map((msg: ChatMessage) => ({
                    role: msg.role === 'model' ? 'model' : 'user',
                    parts: [{ text: msg.text }],
                })),
            });

            const response = await chat.sendMessage(message);
            const text = response.text || "Uzr, tushunmadim. Qayta so'ray olasizmi?";
            res.status(200).json({ text });
        }
    } catch (error: any) {
        console.error('Gemini API error:', error?.message || error);
        res.status(500).json({ error: "AI tizimida xatolik yuz berdi. Keyinroq urinib ko'ring." });
    }
}
