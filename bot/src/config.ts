export const config = {
    BOT_TOKEN: process.env.BOT_TOKEN || '',
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_KEY: process.env.SUPABASE_KEY || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    SITE_URL: process.env.SITE_URL || 'https://luxe-core-uz-three.vercel.app',
    CHANNEL_URL: process.env.CHANNEL_URL || 'https://t.me/luxe_core_uz',
    CHANNEL_ID: process.env.CHANNEL_ID || '-1003605314914',
    CONTACT_PHONE: process.env.CONTACT_PHONE || '+998996448444',
    CONTACT_USERNAME: process.env.CONTACT_USERNAME || '@Akramjon1984',
    ADMIN_ID: parseInt(process.env.ADMIN_ID || '819931801'),
};
