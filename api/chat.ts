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
    const prompt = (body?.prompt || '').trim();
    const systemInstruction = (body?.systemInstruction || '').trim();
    const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];
    const responseMimeType = body?.responseMimeType;

    if (!message && !prompt) {
        res.status(400).json({ error: 'Message or Prompt is required' });
        return;
    }

    // Try models in order of preference
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];

    for (const modelName of models) {
        try {
            const client = new GoogleGenAI({ apiKey });

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
                return;
            } else {
                // Interactive Chat - use generateContent with full context
                const contents: any[] = [];

                // Build conversation from history
                for (const msg of history) {
                    contents.push({
                        role: msg.role === 'model' ? 'model' : 'user',
                        parts: [{ text: msg.text }],
                    });
                }

                // Add the current user message
                contents.push({
                    role: 'user',
                    parts: [{ text: message }],
                });

                const response = await client.models.generateContent({
                    model: modelName,
                    contents: contents,
                    config: {
                        systemInstruction: systemInstruction || undefined,
                    },
                });

                const text = response.text || "Uzr, tushunmadim. Qayta so'ray olasizmi?";
                res.status(200).json({ text });
                return;
            }
        } catch (error: any) {
            console.error(`Gemini API error with ${modelName}:`, error?.message || error);
            // If this isn't the last model, try the next one
            if (modelName === models[models.length - 1]) {
                res.status(500).json({
                    error: "AI tizimida xatolik yuz berdi. Keyinroq urinib ko'ring.",
                    detail: error?.message || 'Unknown error'
                });
                return;
            }
            // Otherwise continue to next model
            console.log(`Falling back from ${modelName} to next model...`);
        }
    }
}
