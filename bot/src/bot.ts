import { Bot } from 'grammy';
import { config } from './config';
import { handleStart, handleHome } from './handlers/start';
import { handleCategories, handleCategorySelect, handleCategoryPage } from './handlers/categories';
import { handleSearchPrompt, handleSearchQuery, isInSearchMode, clearSearchMode } from './handlers/search';
import { handleOrdersPrompt, handleOrderPhone, isInOrderPhoneMode, clearOrderPhoneMode } from './handlers/orders';
import { handleAddToCart, handleShowCart, handleClearCart, handleCheckout, handleCheckoutInput, isInCheckoutMode, clearCheckoutMode } from './handlers/cart';
import { handleAiPrompt, handleAiMessage, handleExitAi, isInAiMode, clearAiMode } from './handlers/ai';
import { handleContact, handleHelp, handleChannel } from './handlers/info';

export function createBot() {
    const bot = new Bot(config.BOT_TOKEN);

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

    // ========== INLINE MENU CALLBACKS ==========
    bot.callbackQuery('home', handleHome);
    bot.callbackQuery('noop', (ctx) => ctx.answerCallbackQuery());

    // Main menu buttons (inline)
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

    // ========== OTHER CALLBACKS ==========
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

    // Category selection: cat:slug
    bot.callbackQuery(/^cat:/, handleCategorySelect);

    // Category pagination: catpage:slug:page
    bot.callbackQuery(/^catpage:/, handleCategoryPage);

    // Add to cart: addcart:id
    bot.callbackQuery(/^addcart:/, handleAddToCart);

    // ========== FREE TEXT (state-based routing) ==========
    bot.on('message:text', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        // Check states in priority order
        if (isInCheckoutMode(userId)) {
            return handleCheckoutInput(ctx);
        }
        if (isInOrderPhoneMode(userId)) {
            return handleOrderPhone(ctx);
        }
        if (isInSearchMode(userId)) {
            return handleSearchQuery(ctx);
        }
        if (isInAiMode(userId)) {
            return handleAiMessage(ctx);
        }

        // Default: treat as search
        return handleSearchQuery(ctx);
    });

    return bot;
}
