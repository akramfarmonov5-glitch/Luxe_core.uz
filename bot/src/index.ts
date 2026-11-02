import { createBot } from './bot';
import { config } from './config';
import http from 'http';

async function startBot(retries = 5): Promise<void> {
    const bot = createBot();

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`🤖 Bot ishga tushirilmoqda... (urinish ${attempt}/${retries})`);

            // Graceful stop
            process.once('SIGINT', () => bot.stop());
            process.once('SIGTERM', () => bot.stop());

            await bot.start({
                drop_pending_updates: true,
                onStart: async () => {
                    console.log('🤖 LUXECORE Bot ishga tushdi! (polling mode)');
                    try {
                        const webAppUrl = `${config.SITE_URL.replace(/\/$/, '')}/uz`;
                        await bot.api.setChatMenuButton({
                            menu_button: {
                                type: 'web_app',
                                text: '🛍 Do\'kon',
                                web_app: { url: webAppUrl },
                            },
                        });
                        await bot.api.setMyCommands([
                            { command: 'start', description: '🏠 Bosh menyu / Главное меню' },
                            { command: 'categories', description: '📂 Kategoriyalar / Категории' },
                            { command: 'cart', description: '🛒 Savatcha / Корзина' },
                            { command: 'myorders', description: '📦 Buyurtmalarim / Мои заказы' },
                            { command: 'ai', description: '🤖 AI Maslahatchi / AI Помощник' },
                            { command: 'help', description: 'ℹ️ Yordam / Помощь' },
                        ]);
                    } catch (menuErr) {
                        console.warn('Menu button setup warning:', menuErr);
                    }
                },
            });
            return; // success
        } catch (err: any) {
            if (err?.error_code === 409 && attempt < retries) {
                console.log(`⚠️ Boshqa instance ishlayapti, ${5 * attempt}s kutilmoqda...`);
                await new Promise(r => setTimeout(r, 5000 * attempt));
            } else {
                throw err;
            }
        }
    }
}

async function main() {
    if (!config.BOT_TOKEN) {
        console.error('❌ BOT_TOKEN environment variable is required!');
        process.exit(1);
    }

    if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
        console.warn('⚠️ SUPABASE_URL or SUPABASE_KEY not set.');
    }

    // HTTP server for Render Web Service health checks
    const startedAt = new Date().toISOString();
    const PORT = parseInt(process.env.PORT || '10000');
    const server = http.createServer((req, res) => {
        if (req.url === '/health' || req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', bot: 'LUXECORE Bot', version: '2.3.0', startedAt, uptime: process.uptime() }));
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    });

    server.listen(PORT, () => {
        console.log(`🌐 Health server running on port ${PORT}`);
    });

    await startBot();
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
