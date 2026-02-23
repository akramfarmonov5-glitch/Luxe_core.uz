import React, { useState } from 'react';
import { Search, Package, Clock, Truck, CheckCircle, ArrowLeft, CreditCard, Banknote, Wallet, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OrderTrackerProps {
  onBack: () => void;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'phone' | 'orderId'>('phone');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    setLoading(true);
    setSearched(true);

    try {
      const body: any = {};
      if (searchType === 'phone') {
        body.phone = searchQuery;
      } else {
        body.orderId = searchQuery;
      }

      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Tracking request failed');
      }

      const json = await response.json();
      setOrders(json.data || []);
    } catch (error) {
      console.error("Search error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Kutilmoqda': return <Clock size={20} className="text-yellow-400" />;
      case 'To\'landi': return <CheckCircle size={20} className="text-green-400" />;
      case 'Yetkazilmoqda': return <Truck size={20} className="text-blue-400" />;
      case 'Yakunlandi': return <CheckCircle size={20} className="text-green-400" />;
      case 'Bekor qilindi': return <XCircle size={20} className="text-red-400" />;
      default: return <Package size={20} className="text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Kutilmoqda': return t('tracking.status.pending');
      case 'To\'landi': return t('tracking.status.paid');
      case 'Yetkazilmoqda': return t('tracking.status.shipping');
      case 'Yakunlandi': return t('tracking.status.completed');
      case 'Bekor qilindi': return t('tracking.status.cancelled');
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Kutilmoqda': return 'text-yellow-400 bg-yellow-400/10';
      case 'To\'landi': return 'text-green-400 bg-green-400/10';
      case 'Yetkazilmoqda': return 'text-blue-400 bg-blue-400/10';
      case 'Yakunlandi': return 'text-green-400 bg-green-400/10';
      case 'Bekor qilindi': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPaymentIcon = (method: string) => {
    if (method?.includes('Paynet')) return <Wallet size={16} className="text-blue-400" />;
    if (method?.includes('Karta')) return <CreditCard size={16} className="text-gold-400" />;
    return <Banknote size={16} className="text-green-400" />;
  };

  const formatDate = (dateString: string) => {
    const locale = language === 'uz' ? 'uz-UZ' : 'ru-RU';
    return new Date(dateString).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black text-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>{t('checkout.back_home')}</span>
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('tracking.title')}</h1>
          <p className="text-gray-400">
            {t('tracking.subtitle')}
          </p>
        </div>

        <div className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl mb-10">
          {/* Search type toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => { setSearchType('phone'); setSearchQuery(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${searchType === 'phone' ? 'bg-gold-400 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              {t('tracking.phone')}
            </button>
            <button
              type="button"
              onClick={() => { setSearchType('orderId'); setSearchQuery(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${searchType === 'orderId' ? 'bg-gold-400 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              {t('tracking.order_id')}
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              {searchType === 'phone' && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-lg">+998</span>
              )}
              <input
                type={searchType === 'phone' ? 'tel' : 'text'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === 'phone' ? '90 123 45 67' : 'ORD-1234567890'}
                className={`w-full bg-black border border-white/20 rounded-xl ${searchType === 'phone' ? 'pl-16' : 'pl-4'} pr-4 py-4 text-lg text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all`}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gold-400 text-black font-bold py-4 px-8 rounded-xl hover:bg-gold-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
              ) : (
                <>
                  <Search size={20} /> {t('tracking.track_btn')}
                </>
              )}
            </button>
          </form>
        </div>

        {searched && !loading && (
          <div className="space-y-6">
            {orders && orders.length > 0 ? (
              <>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="text-gold-400" />
                  {t('tracking.found_orders')} ({orders.length})
                </h2>
                {orders.map((order) => (
                  <div key={order.id} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-gold-400/30 transition-all">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-white/5 pb-4">
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">{t('tracking.order_id')}</span>
                        <span className="font-mono text-white font-medium">{order.id}</span>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${getStatusColor(order.status || 'Kutilmoqda')}`}>
                        {getStatusIcon(order.status || 'Kutilmoqda')}
                        <span className="text-sm font-medium">{getStatusLabel(order.status || 'Kutilmoqda')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block mb-1">{t('tracking.date')}</span>
                        <span className="text-sm text-white">{formatDate(order.created_at)}</span>
                      </div>
                    </div>

                    {/* Payment method */}
                    {order.paymentMethod && (
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                        {getPaymentIcon(order.paymentMethod)}
                        <span>{t('checkout.payment_method')}: {order.paymentMethod}</span>
                      </div>
                    )}

                    {/* Order items */}
                    {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                      <div className="mb-4 bg-black/30 rounded-xl p-4 space-y-2">
                        <span className="text-xs text-gray-500 block mb-2">{t('tracking.items')}:</span>
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-300">{item.name} x{item.quantity}</span>
                            <span className="text-gray-400">{new Intl.NumberFormat('uz-UZ').format((item.price || 0) * (item.quantity || 1))} UZS</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                        <span className="text-gray-400">{t('cart.total')}:</span>
                        <span className="text-lg font-bold text-gold-400">
                          {new Intl.NumberFormat(language === 'uz' ? 'uz-UZ' : 'ru-RU').format(order.total || 0)} UZS
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12 bg-zinc-900/50 rounded-3xl border border-white/5 border-dashed">
                <Package size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">{t('tracking.no_orders')}</h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  {searchType === 'phone'
                    ? t('tracking.no_orders_phone')
                    : t('tracking.no_orders_id')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracker;
