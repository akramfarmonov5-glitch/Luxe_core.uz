import { Bot, Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { config } from '../config';
import { CartItem } from '../types';
import { t } from '../i18n';

// ========== ADMIN NOTIFICATION ==========
export async function notifyAdmin(
    bot: Bot,
    orderId: string,
    customerName: string,
    phone: string,
    total: number,
    items: CartItem[],
    userId: number
) {
    try {
        let itemsText = '';
        items.forEach((i) => {
            itemsText += `  • ${i.name} x${i.quantity} = ${(i.price * i.quantity).toLocaleString('uz-UZ')} UZS\n`;
        });

        const text =
            `🆕 *YANGI BUYURTMA!*\n\n` +
            `📋 ID: *#${orderId}*\n` +
            `👤 Ism: ${customerName}\n` +
            `📱 Tel: ${phone}\n` +
            `💰 Jami: *${total.toLocaleString('uz-UZ')} UZS*\n\n` +
            `📦 Mahsulotlar:\n${itemsText}\n` +
            `🕐 Vaqt: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`;

        await bot.api.sendMessage(config.ADMIN_ID, text, {
            parse_mode: 'Markdown',
            reply_markup: new InlineKeyboard()
                .text('✅ Qabul qilish', `admin_accept:${orderId}`)
                .text('❌ Bekor qilish', `admin_reject:${orderId}`)
                .row()
                .text(`📞 Qo'ng'iroq`, `admin_call:${phone}`),
        });
    } catch (err) {
        console.error('Admin notify error:', err);
    }
}

export async function handleAdminAccept(ctx: Context) {
    try {
        await ctx.answerCallbackQuery('✅ Buyurtma qabul qilindi!');
        const data = ctx.callbackQuery?.data;
        if (!data) return;
        const orderId = data.replace('admin_accept:', '');

        await supabase
            .from('orders')
            .update({ status: 'To\'landi' })
            .eq('id', orderId);

        await ctx.editMessageText(
            ctx.callbackQuery?.message?.text + '\n\n✅ *QABUL QILINDI*',
            { parse_mode: 'Markdown' }
        );
    } catch (err) {
        console.error('Admin accept error:', err);
    }
}

export async function handleAdminReject(ctx: Context) {
    try {
        await ctx.answerCallbackQuery('❌ Buyurtma bekor qilindi!');
        const data = ctx.callbackQuery?.data;
        if (!data) return;
        const orderId = data.replace('admin_reject:', '');

        await supabase
            .from('orders')
            .update({ status: 'Bekor qilindi' })
            .eq('id', orderId);

        await ctx.editMessageText(
            ctx.callbackQuery?.message?.text + '\n\n❌ *BEKOR QILINDI*',
            { parse_mode: 'Markdown' }
        );
    } catch (err) {
        console.error('Admin reject error:', err);
    }
}

// ========== ADMIN STATS ==========
export async function handleStats(ctx: Context) {
    const userId = ctx.from?.id;
    if (userId !== config.ADMIN_ID) {
        await ctx.reply('⛔ Bu komanda faqat admin uchun.');
        return;
    }

    try {
        // Total orders
        const { count: totalOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true });

        // Today's orders
        const today = new Date().toISOString().split('T')[0];
        const { count: todayOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('date', today);

        // Total revenue
        const { data: orders } = await supabase
            .from('orders')
            .select('total');
        const totalRevenue = orders?.reduce((s: number, o: any) => s + Number(o.total), 0) || 0;

        // Today's revenue
        const { data: todayOrdersData } = await supabase
            .from('orders')
            .select('total')
            .eq('date', today);
        const todayRevenue = todayOrdersData?.reduce((s: number, o: any) => s + Number(o.total), 0) || 0;

        // Products count
        const { count: totalProducts } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        // Pending orders
        const { count: pendingOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Kutilmoqda');

        // Status breakdown
        const { data: statusData } = await supabase
            .from('orders')
            .select('status');
        const statusMap: Record<string, number> = {};
        statusData?.forEach((o: any) => {
            statusMap[o.status] = (statusMap[o.status] || 0) + 1;
        });

        let statusText = '';
        Object.entries(statusMap).forEach(([status, count]) => {
            const emoji = status === 'Kutilmoqda' ? '🟡' : status === 'To\'landi' ? '🟢' : status === 'Yakunlandi' ? '✅' : '📊';
            statusText += `${emoji} ${status}: ${count}\n`;
        });

        const text =
            `📊 *LUXECORE Admin Statistika*\n\n` +
            `📅 Bugun: *${today}*\n\n` +
            `━━━━━━━━━━━━━━━\n` +
            `📦 Jami buyurtmalar: *${totalOrders || 0}*\n` +
            `📦 Bugungi buyurtmalar: *${todayOrders || 0}*\n` +
            `⏳ Kutilayotgan: *${pendingOrders || 0}*\n` +
            `━━━━━━━━━━━━━━━\n` +
            `💰 Jami tushum: *${totalRevenue.toLocaleString('uz-UZ')} UZS*\n` +
            `💰 Bugungi tushum: *${todayRevenue.toLocaleString('uz-UZ')} UZS*\n` +
            `━━━━━━━━━━━━━━━\n` +
            `🏷 Mahsulotlar soni: *${totalProducts || 0}*\n\n` +
            `📈 *Buyurtma holatlari:*\n${statusText || 'Ma\'lumot yo\'q'}`;

        await ctx.reply(text, { parse_mode: 'Markdown' });
    } catch (err) {
        console.error('Stats error:', err);
        await ctx.reply('❌ Statistikani yuklashda xatolik.');
    }
}
