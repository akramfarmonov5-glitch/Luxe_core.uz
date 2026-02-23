import { Bot, Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { config } from '../config';
import { CartItem } from '../types';
import { t } from '../i18n';
import { statusEmoji } from '../keyboards';

let botRef: Bot | null = null;
export function setAdminBotRef(bot: Bot) { botRef = bot; }

// ========== ADMIN NOTIFICATION ==========
export async function notifyAdmin(
    bot: Bot,
    orderId: string,
    customerName: string,
    phone: string,
    total: number,
    items: CartItem[],
    userId: number,
    paymentMethod?: string,
    address?: string
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
            `📍 Manzil: ${address || '-'}\n` +
            `💳 To'lov: ${paymentMethod || 'Naqd'}\n` +
            `💰 Jami: *${total.toLocaleString('uz-UZ')} UZS*\n\n` +
            `📦 Mahsulotlar:\n${itemsText}\n` +
            `🕐 Vaqt: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`;

        await bot.api.sendMessage(config.ADMIN_ID, text, {
            parse_mode: 'Markdown',
            reply_markup: new InlineKeyboard()
                .text('✅ Qabul', `admin_accept:${orderId}`)
                .text('❌ Bekor', `admin_reject:${orderId}`)
                .row()
                .text('🚚 Yetkazilmoqda', `admin_ship:${orderId}`)
                .text('✅ Yakunlandi', `admin_done:${orderId}`)
                .row()
                .text(`📞 Qo'ng'iroq`, `admin_call:${phone}`),
        });
    } catch (err) {
        console.error('Admin notify error:', err);
    }
}

// Helper to notify user about status change
async function notifyUserStatusChange(bot: Bot, orderId: string, newStatus: string) {
    try {
        const { data: order } = await supabase
            .from('orders')
            .select('telegram_user_id')
            .eq('id', orderId)
            .single();

        if (order?.telegram_user_id) {
            const emoji = statusEmoji(newStatus);
            const userId = order.telegram_user_id;
            const msg = t(userId, 'order_status_changed')
                .replace('{id}', orderId)
                .replace('{emoji}', emoji)
                .replace('{status}', newStatus);

            await bot.api.sendMessage(userId, msg, { parse_mode: 'Markdown' });
        }
    } catch (err) {
        console.error('User notify error:', err);
    }
}

export async function handleAdminAccept(ctx: Context) {
    try {
        await ctx.answerCallbackQuery('✅ Buyurtma qabul qilindi!');
        const data = ctx.callbackQuery?.data;
        if (!data) return;
        const orderId = data.replace('admin_accept:', '');

        await supabase.from('orders').update({ status: 'To\'landi' }).eq('id', orderId);

        await ctx.editMessageText(
            ctx.callbackQuery?.message?.text + '\n\n✅ *QABUL QILINDI*',
            { parse_mode: 'Markdown' }
        );

        if (botRef) await notifyUserStatusChange(botRef, orderId, 'To\'landi');
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

        await supabase.from('orders').update({ status: 'Bekor qilindi' }).eq('id', orderId);

        await ctx.editMessageText(
            ctx.callbackQuery?.message?.text + '\n\n❌ *BEKOR QILINDI*',
            { parse_mode: 'Markdown' }
        );

        if (botRef) await notifyUserStatusChange(botRef, orderId, 'Bekor qilindi');
    } catch (err) {
        console.error('Admin reject error:', err);
    }
}

export async function handleAdminShip(ctx: Context) {
    try {
        await ctx.answerCallbackQuery('🚚 Yetkazilmoqda!');
        const data = ctx.callbackQuery?.data;
        if (!data) return;
        const orderId = data.replace('admin_ship:', '');

        await supabase.from('orders').update({ status: 'Yetkazilmoqda' }).eq('id', orderId);

        await ctx.editMessageText(
            ctx.callbackQuery?.message?.text + '\n\n🚚 *YETKAZILMOQDA*',
            { parse_mode: 'Markdown' }
        );

        if (botRef) await notifyUserStatusChange(botRef, orderId, 'Yetkazilmoqda');
    } catch (err) {
        console.error('Admin ship error:', err);
    }
}

export async function handleAdminDone(ctx: Context) {
    try {
        await ctx.answerCallbackQuery('✅ Yakunlandi!');
        const data = ctx.callbackQuery?.data;
        if (!data) return;
        const orderId = data.replace('admin_done:', '');

        await supabase.from('orders').update({ status: 'Yakunlandi' }).eq('id', orderId);

        await ctx.editMessageText(
            ctx.callbackQuery?.message?.text + '\n\n✅ *YAKUNLANDI*',
            { parse_mode: 'Markdown' }
        );

        if (botRef) await notifyUserStatusChange(botRef, orderId, 'Yakunlandi');
    } catch (err) {
        console.error('Admin done error:', err);
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
        const { count: totalOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true });

        const today = new Date().toISOString().split('T')[0];
        const { count: todayOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('date', today);

        const { data: orders } = await supabase.from('orders').select('total');
        const totalRevenue = orders?.reduce((s: number, o: any) => s + Number(o.total), 0) || 0;

        const { data: todayOrdersData } = await supabase
            .from('orders')
            .select('total')
            .eq('date', today);
        const todayRevenue = todayOrdersData?.reduce((s: number, o: any) => s + Number(o.total), 0) || 0;

        const { count: totalProducts } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        const { count: pendingOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Kutilmoqda');

        const { count: totalUsers } = await supabase
            .from('bot_users')
            .select('*', { count: 'exact', head: true });

        const { data: statusData } = await supabase.from('orders').select('status');
        const statusMap: Record<string, number> = {};
        statusData?.forEach((o: any) => {
            statusMap[o.status] = (statusMap[o.status] || 0) + 1;
        });

        let statusText = '';
        Object.entries(statusMap).forEach(([status, count]) => {
            const emoji = statusEmoji(status);
            statusText += `${emoji} ${status}: ${count}\n`;
        });

        const text =
            `📊 *LUXECORE Admin Statistika*\n\n` +
            `📅 Bugun: *${today}*\n\n` +
            `━━━━━━━━━━━━━━━\n` +
            `👥 Foydalanuvchilar: *${totalUsers || 0}*\n` +
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

// ========== /users ==========
export async function handleUsers(ctx: Context) {
    if (ctx.from?.id !== config.ADMIN_ID) {
        await ctx.reply('⛔ Bu komanda faqat admin uchun.');
        return;
    }

    try {
        const { data: users, count } = await supabase
            .from('bot_users')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .limit(20);

        if (!users || users.length === 0) {
            await ctx.reply('👥 Foydalanuvchilar topilmadi.');
            return;
        }

        let text = `👥 *Foydalanuvchilar (${count || users.length}):*\n\n`;
        users.forEach((u: any, i: number) => {
            text += `${i + 1}. *${u.name || 'Nomsiz'}*\n`;
            text += `   📱 ${u.phone || '-'} | 🌐 ${u.lang}\n`;
            text += `   🆔 \`${u.telegram_id}\`\n\n`;
        });

        await ctx.reply(text, { parse_mode: 'Markdown' });
    } catch (err) {
        console.error('Users error:', err);
        await ctx.reply('❌ Xatolik.');
    }
}

// ========== /orders (admin) ==========
export async function handleAdminOrders(ctx: Context) {
    if (ctx.from?.id !== config.ADMIN_ID) {
        await ctx.reply('⛔ Bu komanda faqat admin uchun.');
        return;
    }

    try {
        const { data: orders } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (!orders || orders.length === 0) {
            await ctx.reply('📦 Buyurtmalar topilmadi.');
            return;
        }

        let text = `📦 *Oxirgi buyurtmalar:*\n\n`;
        orders.forEach((o: any, i: number) => {
            const emoji = statusEmoji(o.status);
            text += `${i + 1}. *#${o.id}* ${emoji}\n`;
            text += `   👤 ${o.customerName} | 📱 ${o.phone}\n`;
            text += `   💰 ${Number(o.total).toLocaleString('uz-UZ')} UZS | 💳 ${o.paymentMethod || '-'}\n`;
            text += `   📅 ${o.date}\n\n`;
        });

        await ctx.reply(text, { parse_mode: 'Markdown' });
    } catch (err) {
        console.error('Admin orders error:', err);
        await ctx.reply('❌ Xatolik.');
    }
}

// ========== /setprice ID PRICE ==========
export async function handleSetPrice(ctx: Context) {
    if (ctx.from?.id !== config.ADMIN_ID) {
        await ctx.reply('⛔ Bu komanda faqat admin uchun.');
        return;
    }

    const args = ctx.message?.text?.split(' ').slice(1) || [];
    if (args.length < 2) {
        await ctx.reply('❌ Format: `/setprice ID NARX`\nMasalan: `/setprice 5 150000`', { parse_mode: 'Markdown' });
        return;
    }

    const id = parseInt(args[0]);
    const price = parseInt(args[1]);

    try {
        const { error } = await supabase.from('products').update({ price }).eq('id', id);
        if (error) throw error;
        await ctx.reply(`✅ Mahsulot #${id} narxi *${price.toLocaleString('uz-UZ')} UZS* ga o'zgartirildi.`, { parse_mode: 'Markdown' });
    } catch (err) {
        console.error('Set price error:', err);
        await ctx.reply('❌ Xatolik.');
    }
}

// ========== /setstock ID STOCK ==========
export async function handleSetStock(ctx: Context) {
    if (ctx.from?.id !== config.ADMIN_ID) {
        await ctx.reply('⛔ Bu komanda faqat admin uchun.');
        return;
    }

    const args = ctx.message?.text?.split(' ').slice(1) || [];
    if (args.length < 2) {
        await ctx.reply('❌ Format: `/setstock ID SONI`\nMasalan: `/setstock 5 25`', { parse_mode: 'Markdown' });
        return;
    }

    const id = parseInt(args[0]);
    const stock = parseInt(args[1]);

    try {
        const { error } = await supabase.from('products').update({ stock }).eq('id', id);
        if (error) throw error;
        await ctx.reply(`✅ Mahsulot #${id} stok: *${stock}* dona.`, { parse_mode: 'Markdown' });
    } catch (err) {
        console.error('Set stock error:', err);
        await ctx.reply('❌ Xatolik.');
    }
}
