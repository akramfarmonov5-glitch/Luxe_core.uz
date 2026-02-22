interface PromoRule {
    discountPercent: number;
}

const PROMO_CODES: Record<string, PromoRule> = {
    LUXE2026: { discountPercent: 10 },
    ADMIN: { discountPercent: 50 },
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

    const rule = PROMO_CODES[code];
    if (!rule) {
        res.status(200).json({ valid: false, discountAmount: 0, error: 'Bunday promo kod mavjud emas.' });
        return;
    }

    const discountAmount = cartTotal * (rule.discountPercent / 100);

    res.status(200).json({
        valid: true,
        discountAmount,
        discountPercent: rule.discountPercent,
    });
}
