import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Truck, Send, Wallet, Banknote, X, Smartphone, ExternalLink, Ticket, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import * as fpixel from '../lib/fpixel';
import { useToast } from '../context/ToastContext';

interface CheckoutProps {
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [successNote, setSuccessNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paynet' | 'cash' | 'card'>('paynet');
  const [showPaynetModal, setShowPaynetModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: 'Toshkent',
  });

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const PAYNET_URL = "https://app.paynet.uz/?m=49156&i=4805742d-d76c-4b39-8c02-8ddf1c450f33&branchId=&actTypeId=144";
  const PAYNET_QR_IMAGE = "/images/paynet-qr.jpg";
  const QR_FALLBACK = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(PAYNET_URL)}&color=000000&bgcolor=ffffff`;
  const CARD_NUMBER = '5614 6822 1912 1078';
  const CARD_HOLDER = 'AKRAMJON F.';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsCheckingPromo(true);

    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode.trim(),
          cartTotal,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setDiscountAmount(data.discountAmount);
        setAppliedPromo(promoCode.trim().toUpperCase());
        showToast("Promo kod muvaffaqiyatli qo'llanildi!", "success");
      } else {
        showToast(data.error || "Bunday promo kod mavjud emas.", "error");
        setDiscountAmount(0);
        setAppliedPromo('');
      }
    } catch {
      showToast("Server bilan bog'lanishda xatolik.", "error");
      setDiscountAmount(0);
      setAppliedPromo('');
    }

    setIsCheckingPromo(false);
  };

  const handleRemovePromo = () => {
    setDiscountAmount(0);
    setAppliedPromo('');
    setPromoCode('');
  };

  const createOrder = async (orderId: string) => {
    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        paymentMethod,
        total: finalTotal,
        cart,
        promoCode: appliedPromo,
        discountAmount,
      }),
    });

    if (!response.ok) {
      let message = 'Buyurtma yuborilmadi.';
      try {
        const json = await response.json();
        if (json?.error) message = json.error;
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }
  };

  const completeOrder = async (orderId: string, trackPurchase: boolean, note: string) => {
    if (trackPurchase) {
      fpixel.trackPurchase(orderId, finalTotal, 'UZS');
    }
    setShowPaynetModal(false);
    setIsLoading(false);
    setPendingOrderId(null);
    setSuccessNote(note);
    setIsSuccess(true);
    clearCart();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const orderId = `ORD-${Date.now()}`;
    setPendingOrderId(orderId);

    try {
      await createOrder(orderId);
    } catch (error: any) {
      showToast(error?.message || 'Buyurtma yuborilmadi.', 'error');
      setIsLoading(false);
      setPendingOrderId(null);
      return;
    }

    if (paymentMethod === 'paynet') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
      if (isMobile) {
        window.open(PAYNET_URL, '_blank');
        setTimeout(
          () => completeOrder(orderId, false, "To'lov tekshiruvga yuborildi. Menejer to'lovni tasdiqlagach buyurtma holati yangilanadi."),
          2000
        );
      } else {
        setShowPaynetModal(true);
        setIsLoading(false);
        return;
      }
    } else if (paymentMethod === 'card') {
      setShowCardModal(true);
      setIsLoading(false);
      return;
    } else {
      setTimeout(
        () => completeOrder(orderId, true, "Buyurtmangiz qabul qilindi. Menejerlarimiz tez orada siz bilan bog'lanishadi."),
        1500
      );
    }
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-black flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-bold text-white mb-4">Savatchangiz bo'sh</h2>
        <p className="text-gray-400 mb-8">Buyurtma berish uchun avval mahsulot tanlang.</p>
        <button onClick={onBack} className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
          Do'konga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black text-white relative">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} />
          <span>Do'konga qaytish</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold mb-8">Buyurtmani rasmiylashtirish</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Ismingiz</label>
                  <input required name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all" placeholder="Aziz" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Familiyangiz</label>
                  <input required name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all" placeholder="Rahimov" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Telefon raqam</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+998</span>
                  <input required name="phone" type="tel" value={formData.phone} onChange={handleInputChange} pattern="[0-9]{9,12}" title="Telefon raqamni to'g'ri kiriting (masalan: 901234567)" className="w-full bg-dark-800 border border-white/10 rounded-lg pl-16 pr-4 py-3 text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all" placeholder="90 123 45 67" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Shahar</label>
                <select name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all appearance-none">
                  <option className="bg-zinc-900 text-white" value="Toshkent">Toshkent</option>
                  <option className="bg-zinc-900 text-white" value="Samarqand">Samarqand</option>
                  <option className="bg-zinc-900 text-white" value="Buxoro">Buxoro</option>
                  <option className="bg-zinc-900 text-white" value="Andijon">Andijon</option>
                  <option className="bg-zinc-900 text-white" value="Farg'ona">Farg'ona</option>
                  <option className="bg-zinc-900 text-white" value="Namangan">Namangan</option>
                  <option className="bg-zinc-900 text-white" value="Xorazm">Xorazm</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Manzil</label>
                <input required name="address" type="text" value={formData.address} onChange={handleInputChange} className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all" placeholder="Amir Temur ko'chasi, 15-uy" />
              </div>

              <div className="pt-2">
                <label className="text-sm text-gray-400 mb-2 block">Promo kod (Agar bo'lsa)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      value={promoCode}
                      disabled={!!appliedPromo}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Kodini kiriting"
                      className="w-full bg-dark-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gold-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  {!appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={!promoCode || isCheckingPromo}
                      className="bg-white/10 hover:bg-gold-400 hover:text-black text-white px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isCheckingPromo ? <Loader2 className="animate-spin" size={20} /> : "Qo'llash"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 rounded-lg font-medium transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                {appliedPromo && (
                  <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Kod qo'llanildi! Siz {formatPrice(discountAmount)} tejadingiz.
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-sm text-gray-400">To'lov usuli</label>
                <div className="grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => setPaymentMethod('paynet')} className={`relative p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${paymentMethod === 'paynet' ? 'bg-gold-500/10 border-gold-400 text-gold-400 ring-1 ring-gold-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'}`}>
                    <Wallet size={22} />
                    <span className="font-medium text-xs">Paynet</span>
                    {paymentMethod === 'paynet' && <motion.div layoutId="check" className="absolute top-2 right-2 w-2 h-2 bg-gold-400 rounded-full" />}
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`relative p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${paymentMethod === 'card' ? 'bg-gold-500/10 border-gold-400 text-gold-400 ring-1 ring-gold-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'}`}>
                    <CreditCard size={22} />
                    <span className="font-medium text-xs">Karta</span>
                    {paymentMethod === 'card' && <motion.div layoutId="check" className="absolute top-2 right-2 w-2 h-2 bg-gold-400 rounded-full" />}
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('cash')} className={`relative p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${paymentMethod === 'cash' ? 'bg-gold-500/10 border-gold-400 text-gold-400 ring-1 ring-gold-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'}`}>
                    <Banknote size={22} />
                    <span className="font-medium text-xs">Naqd</span>
                    {paymentMethod === 'cash' && <motion.div layoutId="check" className="absolute top-2 right-2 w-2 h-2 bg-gold-400 rounded-full" />}
                  </button>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={isLoading} className="w-full bg-gold-400 text-black font-bold text-lg py-4 rounded-xl hover:bg-gold-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Jarayonda...</span>
                    </div>
                  ) : (
                    <>
                      <span>{paymentMethod === 'paynet' ? "To'lash" : "Buyurtma berish"}</span>
                      <span className="text-sm font-normal">({formatPrice(finalTotal)})</span>
                      <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
                  <ShieldCheck size={16} /> Xavfsiz to'lov va ma'lumotlar himoyasi
                </p>
              </div>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-dark-900 border border-white/10 rounded-2xl p-8 h-fit sticky top-28">
            <h3 className="text-xl font-bold mb-6">Buyurtma tarkibi</h3>
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{item.name}</h4>
                    <p className="text-xs text-gray-400">{item.category}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">x{item.quantity}</span>
                      <span className="text-sm font-medium text-gold-400">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex justify-between text-gray-400">
                <span>Mahsulotlar</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Chegirma</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Yetkazib berish</span>
                <span className="text-green-400">Bepul</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/5">
                <span>Jami to'lov</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5">
                <Truck className="text-gold-400 mb-2" size={24} />
                <span className="text-xs text-center text-gray-300">Tezkor yetkazish</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5">
                <CreditCard className="text-gold-400 mb-2" size={24} />
                <span className="text-xs text-center text-gray-300">Qulay to'lov</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showPaynetModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaynetModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-dark-900 border border-gold-400/30 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(251,191,36,0.1)] flex flex-col items-center">
              <button onClick={() => setShowPaynetModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-gold-400/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-gold-400/30">
                <Smartphone size={32} className="text-gold-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Paynet orqali to'lash</h2>
              <p className="text-gray-400 text-sm mb-6">To'lovni amalga oshirish uchun QR kodni skanerlang.</p>
              <div className="p-4 bg-white rounded-2xl mb-6 shadow-xl">
                <img src={PAYNET_QR_IMAGE} alt="Paynet QR Code" className="w-48 h-48 object-contain" onError={(e) => { e.currentTarget.src = QR_FALLBACK; }} />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => pendingOrderId && completeOrder(pendingOrderId, false, "To'lov tekshiruvga yuborildi. Menejer siz bilan bog'lanadi.")}
                  className="w-full bg-gold-400 text-black font-bold py-3.5 rounded-xl hover:bg-gold-500 transition-colors"
                >
                  To'lov qildim
                </button>
                <a href={PAYNET_URL} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm"><ExternalLink size={16} /> Havolani ochish</a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card-to-Card Payment Modal */}
      <AnimatePresence>
        {showCardModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCardModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-dark-900 border border-gold-400/30 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(251,191,36,0.1)] flex flex-col items-center">
              <button onClick={() => setShowCardModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-gold-400/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-gold-400/30">
                <CreditCard size={32} className="text-gold-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Kartadan kartaga</h2>
              <p className="text-gray-400 text-sm mb-6">Quyidagi karta raqamiga to'lov qiling va "To'lov qildim" tugmasini bosing.</p>
              <div className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 mb-4">
                <p className="text-gray-400 text-xs mb-2">Karta raqam</p>
                <p className="text-2xl font-mono font-bold text-white tracking-wider mb-4">{CARD_NUMBER}</p>
                <p className="text-gray-400 text-xs mb-1">Karta egasi</p>
                <p className="text-lg font-medium text-gold-400">{CARD_HOLDER}</p>
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText(CARD_NUMBER.replace(/\s/g, '')); showToast('Karta raqam nusxalandi!', 'success'); }}
                className="w-full mb-3 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm"
              >
                📋 Raqamni nusxalash
              </button>
              <button
                onClick={() => pendingOrderId && completeOrder(pendingOrderId, false, "To'lov tekshiruvga yuborildi. Menejer to'lovni tasdiqlagach buyurtma holati yangilanadi.")}
                className="w-full bg-gold-400 text-black font-bold py-3.5 rounded-xl hover:bg-gold-500 transition-colors"
              >
                ✅ To'lov qildim
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-dark-900 border border-white/10 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} className="text-green-500" /></div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Buyurtmangiz qabul qilindi!</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">Rahmat, {formData.firstName}! {successNote || <>Menejerlarimiz tez orada <b>{formData.phone}</b> raqami orqali siz bilan bog'lanishadi.</>}</p>
              <button onClick={onBack} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors">Bosh sahifaga qaytish</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
