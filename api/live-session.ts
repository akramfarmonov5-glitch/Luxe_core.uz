export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'API key not configured' });
        return;
    }

    // Return the WebSocket URL with the key embedded
    const model = 'gemini-2.5-flash-native-audio-preview-12-2025';
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;

    res.status(200).json({ wsUrl, model });
}
