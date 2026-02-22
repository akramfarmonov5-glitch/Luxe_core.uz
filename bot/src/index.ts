import { createBot } from './bot';
import { config } from './config';
import http from 'http';

async function main() {
    if (!config.BOT_TOKEN) {
        console.error('❌ BOT_TOKEN environment variable is required!');
        process.exit(1);
    }

    if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
        console.warn('⚠️ SUPABASE_URL or SUPABASE_KEY not set — database features will not work.');
    }

    const bot = createBot();

    // Simple HTTP server for Render Web Service health checks
    const PORT = parseInt(process.env.PORT || '10000');
    const server = http.createServer((req, res) => {
        if (req.url === '/health' || req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', bot: 'LUXECORE Bot', uptime: process.uptime() }));
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    });

    server.listen(PORT, () => {
        console.log(`🌐 Health server running on port ${PORT}`);
    });

    // Graceful stop
    process.once('SIGINT', () => { bot.stop(); server.close(); });
    process.once('SIGTERM', () => { bot.stop(); server.close(); });

    console.log('🤖 LUXECORE Bot ishga tushdi! (polling mode)');
    await bot.start();
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
