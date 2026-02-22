import { Bot } from 'grammy';
import { config } from './config';
import { handleStart, handleHome, handleShop } from './handlers/start';
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
        // Clear all states
        const userId = ctx.from?.id;
        if (userId) {
            clearSearchMode(userId);
            clearOrderPhoneMode(userId);
            clearCheckoutMode(userId);
            clearAiMode(userId);
        }
        return handleStart(ctx);
    });

    // ========== CALLBACK QUERIES ==========
    bot.callbackQuery('home', handleHome);
    bot.callbackQuery('noop', (ctx) => ctx.answerCallbackQuery());
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

    // Search pagination: searchpage:query:page
    bot.callbackQuery(/^searchpage:/, async (ctx) => {
        await ctx.answerCallbackQuery();
    });

    // Add to cart: addcart:id
    bot.callbackQuery(/^addcart:/, handleAddToCart);

    // ========== TEXT MESSAGES (Reply Keyboard) ==========
    bot.hears('🛒 Do\'kon (Sayt)', handleShop);
    bot.hears('🔍 Qidirish', handleSearchPrompt);
    bot.hears('📂 Kategoriyalar', handleCategories);
    bot.hears('📦 Buyurtmalarim', handleOrdersPrompt);
    bot.hears('🤖 AI Yordamchi', handleAiPrompt);
    bot.hears('📞 Aloqa', handleContact);
    bot.hears('ℹ️ Yordam', handleHelp);
    bot.hears('📢 Kanalimiz', handleChannel);

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
