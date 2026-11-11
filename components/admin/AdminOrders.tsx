import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { Clock, CheckCircle, Truck, Package, Download, Trash2, XCircle, Printer, Eye, X } from 'lucide-react';

import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';
import { getLocalizedText } from '../../lib/i18nUtils';

const AdminOrders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      // Admin panelda barcha buyurtmalarni cheksiz yuklamaymiz —
      // eng so'nggi 300 tasi yetarli (tezlik va xotira uchun).
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);

      if (error) throw error;

      if (data) {
        setOrders(data as Order[]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // `fetchOrders` e'londan keyin chaqiriladi (react-hooks/immutability).
  React.useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Kutilmoqda': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'To\'landi': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Yetkazilmoqda': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Yakunlandi': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Bekor qilindi': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Kutilmoqda': return Clock;
      case 'To\'landi': return CheckCircle;
      case 'Yetkazilmoqda': return Truck;
      case 'Yakunlandi': return Package;
      case 'Bekor qilindi': return XCircle;
      default: return Clock;
    }
  };

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    // Optimistic update
    setOrders(prev => prev.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ orderId: id, status: newStatus }),
      });

      if (!res.ok) {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', id);
        if (error) throw error;
      } else {
        const data = await res.json();
        showToast(
          data.notifiedTelegram
            ? `Holat "${newStatus}" ga o'zgartirildi va mijozga Telegram xabar yuborildi!`
            : `Buyurtma holati "${newStatus}" ga o'zgartirildi`,
          'success'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('Status yangilashda xatolik yuz berdi', 'error');
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error('Error deleting order:', err);
      showToast("Buyurtmani o'chirishda xatolik yuz berdi", 'error');
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';

  const handlePrintInvoice = (order: Order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsTotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    const rowsHtml =
      items.length > 0
        ? items
            .map((item, idx) => {
              const name = getLocalizedText(item.name, 'uz');
              const qty = Number(item.quantity || 0);
              const price = Number(item.price || 0);
              const lineTotal = qty * price;
              return `
                <tr>
                  <td style="text-align:center;">${idx + 1}</td>
                  <td><b>${name}</b></td>
                  <td style="text-align:center;">${qty.toLocaleString('uz-UZ')} dona</td>
                  <td style="text-align:right;">${price.toLocaleString('uz-UZ')} UZS</td>
                  <td style="text-align:right;"><b>${lineTotal.toLocaleString('uz-UZ')} UZS</b></td>
                </tr>
              `;
            })
            .join('')
        : `<tr><td colspan="5" style="text-align:center;color:#666;">Mahsulotlar ro'yxati ko'rsatilmagan</td></tr>`;

    const addressText = (order as any).address || "Toshkent (aniqlashtiriladi)";
    const printWin = window.open('', '_blank', 'width=850,height=900');
    if (!printWin) {
      showToast('Brauzerda pop-up oynaga ruxsat bering', 'error');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8" />
        <title>Yuk xati - ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111; margin: 28px; font-size: 13px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 18px; }
          .brand { font-size: 22px; font-weight: 800; letter-spacing: 1px; }
          .sub { color: #555; font-size: 12px; margin-top: 4px; }
          .doc-title { font-size: 18px; font-weight: 700; text-align: right; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8f8f8; border: 1px solid #ddd; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; }
          .meta-row { margin: 4px 0; }
          .meta-label { color: #666; font-size: 11px; text-transform: uppercase; }
          .meta-val { font-weight: 700; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
          th, td { border: 1px solid #ccc; padding: 8px 10px; }
          th { background: #111; color: #fff; font-size: 12px; text-transform: uppercase; }
          .totals { margin-left: auto; width: 320px; border: 1px solid #111; border-radius: 6px; padding: 10px 14px; margin-bottom: 28px; }
          .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .totals-final { font-size: 16px; font-weight: 800; border-top: 1px solid #ccc; padding-top: 8px; margin-top: 6px; }
          .signs { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 16px; }
          .sign-box { width: 45%; border-top: 1px solid #333; padding-top: 6px; font-size: 12px; color: #444; }
          @media print {
            .no-print { display: none !important; }
            body { margin: 12px; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom:16px;text-align:right;">
          <button onclick="window.print()" style="background:#d4af37;color:#000;border:none;padding:10px 18px;font-weight:bold;border-radius:6px;cursor:pointer;">🖨 Chop etish / PDF saqlash</button>
        </div>
        <div class="header">
          <div>
            <div class="brand">LUXECORE (luxe-core.uz)</div>
            <div class="sub">Ulgurji Sovg'a Qutilari va Qadoqlash Materiallari (O'rikzor ombori)</div>
            <div class="sub">Sayt: https://luxe-core.uz | Telegram: @luxecoreuz</div>
          </div>
          <div>
            <div class="doc-title">YUK XATI (НАКЛАДНАЯ)</div>
            <div class="sub" style="text-align:right;"><b>№ ${order.id}</b></div>
            <div class="sub" style="text-align:right;">Sana: ${order.date || new Date().toLocaleDateString('uz-UZ')}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <div class="meta-row"><span class="meta-label">Mijoz (Oluvchi):</span><div class="meta-val">${order.customerName || '-'}</div></div>
            <div class="meta-row"><span class="meta-label">Telefon raqami:</span><div class="meta-val">${order.phone || '-'}</div></div>
          </div>
          <div>
            <div class="meta-row"><span class="meta-label">Yetkazib berish manzili:</span><div class="meta-val">${addressText}</div></div>
            <div class="meta-row"><span class="meta-label">To'lov turi / Holati:</span><div class="meta-val">${order.paymentMethod || '-'} (${order.status})</div></div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width:40px;">№</th>
              <th>Mahsulot nomi</th>
              <th style="width:110px;">Soni (dona)</th>
              <th style="width:130px;">1 dona narxi</th>
              <th style="width:140px;">Jami summa</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Mahsulotlar summasi:</span>
            <b>${(itemsTotal || Number(order.total || 0)).toLocaleString('uz-UZ')} UZS</b>
          </div>
          <div class="totals-row totals-final">
            <span>JAMI TO'LOVGA:</span>
            <span>${Number(order.total || 0).toLocaleString('uz-UZ')} UZS</span>
          </div>
        </div>

        <div class="signs">
          <div class="sign-box">Topshirdi (Ombor / Kuryer): _______________________</div>
          <div class="sign-box">Qabul qildi (Mijoz): _______________________</div>
        </div>
        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 250); };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Sana', 'Mijoz', 'Telefon', 'To\'lov turi', 'Summa', 'Holat'];
    const rows = orders.map(o => [
        o.id,
        o.date,
        `"${o.customerName || ''}"`,
        `"${o.phone || ''}"`,
        o.paymentMethod,
        o.total,
        o.status
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `buyurtmalar-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Buyurtmalar (CRM)</h2>
          <p className="text-gray-400">Mijozlar buyurtmalarini boshqarish va kuzatish tizimi.</p>
        </div>
        <button 
            onClick={handleExportCSV} 
            disabled={orders.length === 0}
            className="flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-black px-4 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
        >
            <Download size={18} />
            Excel yuklab olish
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-400">ID & Sana</th>
              <th className="p-4 text-sm font-medium text-gray-400">Mijoz</th>
              <th className="p-4 text-sm font-medium text-gray-400">To'lov</th>
              <th className="p-4 text-sm font-medium text-gray-400">Summa</th>
              <th className="p-4 text-sm font-medium text-gray-400">Holat</th>
              <th className="p-4 text-sm font-medium text-gray-400">Boshqaruv</th>
              <th className="p-4 text-sm font-medium text-gray-400 text-center">Yuk xati / Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              const itemsCount = Array.isArray(order.items) ? order.items.length : 0;
              return (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="font-mono text-white text-sm">{order.id}</div>
                    <div className="text-xs text-gray-500">{order.date}</div>
                    {itemsCount > 0 && (
                      <div className="text-[11px] text-gold-400 mt-0.5">{itemsCount} xil mahsulot</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.phone}</div>
                    {(order as any).address && (
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">{(order as any).address}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded border ${order.paymentMethod === 'Paynet' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-green-500/30 text-green-400 bg-green-500/10'}`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-white">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                      <StatusIcon size={12} />
                      <span>{order.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-black border border-white/20 text-white text-xs rounded-lg px-2 py-1.5 focus:border-gold-400 outline-none cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <option className="bg-zinc-900 text-white" value="Kutilmoqda">Kutilmoqda</option>
                      <option className="bg-zinc-900 text-white" value="To'landi">To'landi</option>
                      <option className="bg-zinc-900 text-white" value="Yetkazilmoqda">Yetkazilmoqda</option>
                      <option className="bg-zinc-900 text-white" value="Yakunlandi">Yakunlandi</option>
                      <option className="bg-zinc-900 text-red-400" value="Bekor qilindi">Bekor qilindi</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Buyurtma tarkibini ko'rish"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handlePrintInvoice(order)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gold-400 bg-gold-400/10 border border-gold-400/20 hover:bg-gold-400/20 rounded-lg transition-colors"
                        title="Yuk xati / Chek chiqarish"
                      >
                        <Printer size={14} />
                        <span>Yuk xati</span>
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Buyurtmani o'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Buyurtma #{selectedOrder.id}</h3>
                <p className="text-xs text-gray-400">{selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm bg-black/40 p-3.5 rounded-xl border border-white/5">
              <div>
                <p className="text-xs text-gray-500">Mijoz</p>
                <p className="text-white font-medium">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Telefon</p>
                <p className="text-white font-medium">{selectedOrder.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Manzil</p>
                <p className="text-white font-medium">{(selectedOrder as any).address || 'Kiritilmagan'}</p>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <p className="text-xs font-bold uppercase text-gray-400">Mahsulotlar ro&apos;yxati:</p>
              {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 text-sm">
                    <div className="text-white font-medium">
                      {idx + 1}. {getLocalizedText(item.name, 'uz')}
                      <span className="text-xs text-gold-400 ml-2">({item.quantity} dona)</span>
                    </div>
                    <div className="text-gray-300 font-mono text-xs">
                      {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString('uz-UZ')} UZS
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Mahsulotlar haqida ma&apos;lumot yo&apos;q</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div>
                <p className="text-xs text-gray-400">Jami summa</p>
                <p className="text-xl font-bold text-gold-400">{formatPrice(selectedOrder.total)}</p>
              </div>
              <button
                onClick={() => handlePrintInvoice(selectedOrder)}
                className="flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-black font-bold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Printer size={18} />
                <span>Yuk xatini chop etish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;