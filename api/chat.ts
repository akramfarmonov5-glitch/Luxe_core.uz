import { GoogleGenAI } from '@google/genai';

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

const getEnv = (key: string): string => {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return String(process.env[key]).trim();
    }
    return '';
};

const getGeminiApiKey = (): string => {
    return getEnv('GEMINI_API_KEY') || getEnv('VITE_GEMINI_API_KEY');
};

export default async function handler(req: any, res: any) {
    // GET = Live session (voice chat WebSocket URL)
    if (req.method === 'GET') {
        const apiKey = getGeminiApiKey();
        if (!apiKey) {
            res.status(500).json({ error: 'API key not configured' });
            return;
        }
        const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
        res.status(200).json({ wsUrl, model: LIVE_MODEL });
        return;
    }

    // POST = Chat message
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'GET, POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const apiKey = getGeminiApiKey();
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

    // Try models in order of preference (February 2026 update)
    const models = [
        'gemini-3-flash-preview',
        'gemini-3.1-pro-preview',
        'gemini-2.5-flash',
        'gemini-2.0-flash'
    ];

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
