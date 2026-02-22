import { Bot } from 'grammy';
import { config } from './config';
import { handleStart, handleHome } from './handlers/start';
import { handleCategories, handleCategorySelect, handleCategoryPage } from './handlers/categories';
import { handleSearchPrompt, handleSearchQuery, isInSearchMode, clearSearchMode } from './handlers/search';
import { handleOrdersPrompt, handleOrderPhone, isInOrderPhoneMode, clearOrderPhoneMode } from './handlers/orders';
import { handleAddToCart, handleShowCart, handleClearCart, handleCheckout, handleCheckoutInput, isInCheckoutMode, clearCheckoutMode, setBotInstance } from './handlers/cart';
import { handleAiPrompt, handleAiMessage, handleExitAi, isInAiMode, clearAiMode } from './handlers/ai';
import { handleContact, handleHelp, handleChannel } from './handlers/info';
import { handleLangPrompt, handleLangSet } from './handlers/lang';
import { handleAdminAccept, handleAdminReject, handleStats } from './handlers/admin';
import { handleAddPromo, handleDelPromo } from './handlers/promo';
import { handleBroadcast, handleBroadcastAll } from './handlers/broadcast';

export function createBot() {
    const bot = new Bot(config.BOT_TOKEN);

    // Set bot instance for admin notifications
    setBotInstance(bot);

    // Error handler
    bot.catch((err) => {
        console.error('Bot error:', err);
    });

    // ========== COMMANDS ==========
    bot.command('start', (ctx) => {
        const userId = ctx.from?.id;
        if (userId) {
            clearSearchMode(userId);
            clearOrderPhoneMode(userId);
            clearCheckoutMode(userId);
            clearAiMode(userId);
        }
        return handleStart(ctx);
    });

    // Admin commands
    bot.command('stats', handleStats);
    bot.command('broadcast', handleBroadcast);
    bot.command('broadcastall', handleBroadcastAll);
    bot.command('addpromo', handleAddPromo);
    bot.command('delpromo', handleDelPromo);

    // ========== INLINE MENU CALLBACKS ==========
    bot.callbackQuery('home', handleHome);
    bot.callbackQuery('noop', (ctx) => ctx.answerCallbackQuery());

    // Main menu
    bot.callbackQuery('menu:search', (ctx) => {
        ctx.answerCallbackQuery();
        return handleSearchPrompt(ctx);
    });
    bot.callbackQuery('menu:categories', (ctx) => {
        ctx.answerCallbackQuery();
        return handleCategories(ctx);
    });
    bot.callbackQuery('menu:orders', (ctx) => {
        ctx.answerCallbackQuery();
        return handleOrdersPrompt(ctx);
    });
    bot.callbackQuery('menu:ai', (ctx) => {
        ctx.answerCallbackQuery();
        return handleAiPrompt(ctx);
    });
    bot.callbackQuery('menu:contact', (ctx) => {
        ctx.answerCallbackQuery();
        return handleContact(ctx);
    });
    bot.callbackQuery('menu:help', (ctx) => {
        ctx.answerCallbackQuery();
        return handleHelp(ctx);
    });
    bot.callbackQuery('menu:lang', handleLangPrompt);

    // Language
    bot.callbackQuery(/^lang:/, handleLangSet);

    // Admin order actions
    bot.callbackQuery(/^admin_accept:/, handleAdminAccept);
    bot.callbackQuery(/^admin_reject:/, handleAdminReject);
    bot.callbackQuery(/^admin_call:/, (ctx) => ctx.answerCallbackQuery('📞 Telefon raqam nusxalandi'));

    // Other callbacks
    bot.callbackQuery('show_categories', (ctx) => {
        ctx.answerCallbackQuery();
        return handleCategories(ctx);
    });
    bot.callbackQuery('show_cart', handleShowCart);
    bot.callbackQuery('clear_cart', handleClearCart);
    bot.callbackQuery('checkout', handleCheckout);
    bot.callbackQuery('exit_ai', handleExitAi);
    bot.callbackQuery('back_to_list', (ctx) => {
        ctx.answerCallbackQuery();
        return handleCategories(ctx);
    });

    // Category/product
    bot.callbackQuery(/^cat:/, handleCategorySelect);
    bot.callbackQuery(/^catpage:/, handleCategoryPage);
    bot.callbackQuery(/^addcart:/, handleAddToCart);

    // ========== TEXT MESSAGES ==========
    bot.on('message:text', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        if (isInCheckoutMode(userId)) return handleCheckoutInput(ctx);
        if (isInOrderPhoneMode(userId)) return handleOrderPhone(ctx);
        if (isInSearchMode(userId)) return handleSearchQuery(ctx);
        if (isInAiMode(userId)) return handleAiMessage(ctx);

        // Default
        return handleSearchQuery(ctx);
    });

    return bot;
}
