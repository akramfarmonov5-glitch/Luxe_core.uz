import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key] as string;
    }
    return '';
};

// Fallback hardcoded codes if Supabase promo_codes table doesn't exist
const FALLBACK_CODES: Record<string, number> = {
    LUXE2026: 10,
    ADMIN: 50,
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    let body: any;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }

    const code = (body?.code || '').trim().toUpperCase();
    const cartTotal = Number(body?.cartTotal || 0);

    if (!code) {
        res.status(400).json({ valid: false, error: 'Promo kod kiritilmagan.' });
        return;
    }

    if (cartTotal <= 0) {
        res.status(400).json({ valid: false, error: 'Savat bo\'sh.' });
        return;
    }

    // Try Supabase first
    const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
    const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

    if (supabaseUrl && supabaseKey) {
        try {
            const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
            const { data: promo } = await supabase
                .from('promo_codes')
                .select('*')
                .eq('code', code)
                .single();

            if (promo) {
                // Check if expired
                if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
                    res.status(200).json({ valid: false, discountAmount: 0, error: 'Promo kod muddati tugagan.' });
                    return;
                }

                // Check usage limit
                if (promo.max_uses && promo.used_count >= promo.max_uses) {
                    res.status(200).json({ valid: false, discountAmount: 0, error: 'Promo kod foydalanish limiti tugagan.' });
                    return;
                }

                const discountAmount = cartTotal * (promo.discount / 100);

                // Increment usage counter
                await supabase
                    .from('promo_codes')
                    .update({ used_count: (promo.used_count || 0) + 1 })
                    .eq('id', promo.id);

                res.status(200).json({
                    valid: true,
                    discountAmount,
                    discountPercent: promo.discount,
                });
                return;
            }
        } catch (err) {
            console.error('Supabase promo check error:', err);
            // Fall through to hardcoded codes
        }
    }

    // Fallback to hardcoded codes
    const discountPercent = FALLBACK_CODES[code];
    if (!discountPercent) {
        res.status(200).json({ valid: false, discountAmount: 0, error: 'Bunday promo kod mavjud emas.' });
        return;
    }

    const discountAmount = cartTotal * (discountPercent / 100);
    res.status(200).json({
        valid: true,
        discountAmount,
        discountPercent,
    });
}
