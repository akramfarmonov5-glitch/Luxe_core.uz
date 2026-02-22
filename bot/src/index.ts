import { createBot } from './bot';
import { config } from './config';

async function main() {
    if (!config.BOT_TOKEN) {
        console.error('❌ BOT_TOKEN environment variable is required!');
        process.exit(1);
    }

    if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
        console.warn('⚠️ SUPABASE_URL or SUPABASE_KEY not set — database features will not work.');
    }

    const bot = createBot();

    // Graceful stop
    process.once('SIGINT', () => bot.stop());
    process.once('SIGTERM', () => bot.stop());

    console.log('🤖 LUXECORE Bot ishga tushdi! (polling mode)');
    await bot.start();
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
