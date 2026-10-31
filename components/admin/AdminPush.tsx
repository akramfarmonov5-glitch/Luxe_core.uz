import React, { useState, useEffect } from 'react';
import { Bell, Send, Image as ImageIcon, Link as LinkIcon, RefreshCw, AlertCircle, Tag, Plus, Trash2, Users } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';

interface PromoItem {
  code: string;
  discount_percent: number;
  is_active: boolean;
}

const AdminPush: React.FC = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    imageUrl: '',
    clickUrl: '',
    sendToChannel: true,
    sendToBotUsers: true,
    sendToWebPush: false,
  });

  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  const [botUsersCount, setBotUsersCount] = useState<number | null>(null);
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoPercentInput, setPromoPercentInput] = useState(10);
  const [isSavingPromo, setIsSavingPromo] = useState(false);

  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchStatsAndPromos();
  }, []);

  const fetchStatsAndPromos = async () => {
    setIsLoadingCount(true);
    try {
      const [{ count: webCount }, { data: sessionData }] = await Promise.all([
        supabase.from('user_devices').select('*', { count: 'exact', head: true }),
        supabase.auth.getSession(),
      ]);
      setDeviceCount(webCount || 0);

      const token = sessionData.session?.access_token;
      const res = await fetch('/api/admin/telegram-broadcast', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setBotUsersCount(data.botUsersCount ?? 0);
        setPromos(data.promos ?? []);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setDeviceCount(0);
    } finally {
      setIsLoadingCount(false);
    }
  };

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      showToast('Promo-kod nomini kiriting (masalan: LUXE10)', 'warning');
      return;
    }

    setIsSavingPromo(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/telegram-broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          mode: 'add_promo',
          code,
          discountPercent: Number(promoPercentInput),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Promo-kod saqlashda xatolik');

      showToast(`🎁 "${code}" (${promoPercentInput}%) promo-kodi faollashtirildi!`, 'success');
      setPromoCodeInput('');
      fetchStatsAndPromos();
    } catch (err: any) {
      showToast(err.message || 'Xatolik yuz berdi', 'error');
    } finally {
      setIsSavingPromo(false);
    }
  };

  const handleDeletePromo = async (code: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/telegram-broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ mode: 'delete_promo', code }),
      });
      if (!res.ok) throw new Error('Promo-kodni o\'chirishda xatolik');
      setPromos((prev) => prev.filter((p) => p.code !== code));
      showToast(`"${code}" o'chirildi`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Xatolik', 'error');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) {
      showToast('Sarlavha va matn majburiy.', 'warning');
      return;
    }

    if (!formData.sendToChannel && !formData.sendToBotUsers && !formData.sendToWebPush) {
      showToast('Kamida bitta yuborish manzilini tanlang.', 'warning');
      return;
    }

    setIsSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};

      const results: string[] = [];

      // 1. Send to Telegram Channel & Bot Subscribers
      if (formData.sendToChannel || formData.sendToBotUsers) {
        const tgRes = await fetch('/api/admin/telegram-broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify({
            mode: 'custom_message',
            title: formData.title.trim(),
            body: formData.body.trim(),
            imageUrl: formData.imageUrl.trim() || undefined,
            clickUrl: formData.clickUrl.trim() || undefined,
            sendToChannel: formData.sendToChannel,
            sendToBotUsers: formData.sendToBotUsers,
          }),
        });
        const tgData = await tgRes.json();
        if (!tgRes.ok) {
          throw new Error(tgData.error || 'Telegram yuborishda xatolik');
        }
        if (tgData.channelSent) results.push('📢 Kanalga joylandi');
        if (formData.sendToBotUsers) results.push(`🤖 Botda ${tgData.botSentCount} obunachiga yuborildi`);
      }

      // 2. Send to Web Push if selected
      if (formData.sendToWebPush) {
        const pushRes = await fetch('/api/admin/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify({
            title: formData.title.trim(),
            body: formData.body.trim(),
            imageUrl: formData.imageUrl.trim() || undefined,
            clickUrl: formData.clickUrl.trim() || undefined,
          }),
        });
        const pushData = await pushRes.json();
        if (pushRes.ok) {
          results.push(`🌐 Web Push: ${pushData.sentCount || 0} qurilma`);
        }
      }

      showToast(results.join(' | ') || 'Xabarnoma muvaffaqiyatli yuborildi!', 'success');

      setFormData((prev) => ({
        ...prev,
        title: '',
        body: '',
        imageUrl: '',
        clickUrl: '',
      }));

      fetchStatsAndPromos();
    } catch (err: any) {
      console.error('Broadcast send error:', err);
      showToast(err.message || 'Xatolik yuz berdi.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Bell className="text-gold-400" size={32} />
            Marketing: Push, Telegram & Promo-kodlar
          </h2>
          <p className="text-gray-400">
            Bir vaqtning o'zida Telegram kanal (@luxecoreuz), Bot obunachilari hamda Sayt foydalanuvchilariga aksiya va chegirmalar yuboring.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-zinc-900 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Users size={20} />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase font-bold">Bot Mijozlari</div>
              <div className="text-xl font-black text-white">{botUsersCount === null ? '...' : botUsersCount}</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center text-gold-400">
              <Bell size={20} />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase font-bold flex items-center gap-1.5">
                Web Qurilmalar
                <button onClick={fetchStatsAndPromos} className="text-gray-400 hover:text-white" title="Yangilash">
                  <RefreshCw size={11} className={isLoadingCount ? 'animate-spin' : ''} />
                </button>
              </div>
              <div className="text-xl font-black text-white">{deviceCount === null ? '...' : deviceCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Codes Section */}
      <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Tag size={18} className="text-gold-400" />
            Promo-kodlar Boshqaruvi (Sayt va Bot uchun)
          </h3>
          <span className="text-xs text-gray-400">Yaratilgan promo-kod ham saytda, ham Telegram botda darhol ishlaydi</span>
        </div>

        <form onSubmit={handleAddPromo} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
            placeholder="KOD NOMI (masalan: LUXE10)"
            className="bg-black border border-white/20 rounded-xl px-4 py-3 text-white font-mono uppercase focus:border-gold-400 outline-none"
          />
          <div className="flex items-center bg-black border border-white/20 rounded-xl px-4 py-3">
            <span className="text-gray-400 text-sm mr-2">Chegirma:</span>
            <input
              type="number"
              min={1}
              max={90}
              value={promoPercentInput}
              onChange={(e) => setPromoPercentInput(Number(e.target.value))}
              className="w-full bg-transparent text-white font-bold outline-none"
            />
            <span className="text-gold-400 font-bold">%</span>
          </div>
          <button
            type="submit"
            disabled={isSavingPromo}
            className="bg-gold-400 hover:bg-gold-500 text-black font-bold rounded-xl px-6 py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
            {isSavingPromo ? 'Saqlanmoqda...' : 'Promo-kod Qo\'shish'}
          </button>
        </form>

        {promos.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {promos.map((p) => (
              <div
                key={p.code}
                className="flex items-center gap-3 bg-black/60 border border-gold-500/30 rounded-xl px-4 py-2"
              >
                <span className="font-mono font-bold text-gold-400">{p.code}</span>
                <span className="text-xs bg-gold-400/15 text-gold-300 px-2 py-0.5 rounded-full font-semibold">
                  -{p.discount_percent}%
                </span>
                <button
                  type="button"
                  onClick={() => handleDeletePromo(p.code)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                  title="O'chirish"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <Send size={18} className="text-gold-400" />
            Yangi Xabar / Aksiya Yuborish
          </h3>

          <form onSubmit={handleSend} className="space-y-5">
            {/* Target Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-sky-500/30 bg-sky-500/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendToChannel}
                  onChange={(e) => setFormData({ ...formData, sendToChannel: e.target.checked })}
                  className="h-4 w-4 accent-sky-400"
                />
                <div className="text-xs">
                  <p className="font-bold text-white">📢 @luxecoreuz</p>
                  <p className="text-sky-300/80">Telegram kanalga</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendToBotUsers}
                  onChange={(e) => setFormData({ ...formData, sendToBotUsers: e.target.checked })}
                  className="h-4 w-4 accent-emerald-400"
                />
                <div className="text-xs">
                  <p className="font-bold text-white">🤖 Bot Obunachilar</p>
                  <p className="text-emerald-300/80">{botUsersCount ?? 0} ta mijozga</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-white/15 bg-black/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendToWebPush}
                  onChange={(e) => setFormData({ ...formData, sendToWebPush: e.target.checked })}
                  className="h-4 w-4 accent-amber-400"
                />
                <div className="text-xs">
                  <p className="font-bold text-white">🌐 Web Push</p>
                  <p className="text-gray-400">{deviceCount ?? 0} ta qurilmaga</p>
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 block font-medium">Sarlavha (Title) *</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none transition-colors"
                placeholder="Masalan: 🔥 Yangi kolleksiya keldi! LUXE10 kodi bilan 10% chegirma!"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 block font-medium">Xabar Matni (Body) *</label>
              <textarea
                required
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="w-full h-28 bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none resize-none leading-relaxed transition-colors"
                placeholder="Masalan: Premium soatlar va aksessuarlar to'plamiga 10% chegirma! Hoziroq saytga kiring va LUXE10 promo-kodini kiriting."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2 font-medium">
                  <ImageIcon size={16} /> Rasm URL (Ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none transition-colors"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2 font-medium">
                  <LinkIcon size={16} /> O'tish Manzili (Click URL)
                </label>
                <input
                  type="text"
                  value={formData.clickUrl}
                  onChange={(e) => setFormData({ ...formData, clickUrl: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none transition-colors font-mono text-sm"
                  placeholder="/uz"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-4 bg-gold-400 hover:bg-gold-500 text-black font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg shadow-gold-500/5"
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Xabarlar Yuborilmoqda...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Tanlangan Kanallarga Yuborish</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col h-full">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
              <AlertCircle size={18} className="text-gold-400" />
              Jonli Ko'rinish (Preview)
            </h3>

            <div className="space-y-6 flex-1">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">
                  Telegram & Push ko'rinishi
                </span>
                <div className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3 relative overflow-hidden">
                  {formData.imageUrl && formData.imageUrl.trim() !== '' && (
                    <div className="w-full aspect-[2/1] rounded-lg overflow-hidden border border-white/5 relative bg-zinc-900">
                      <img
                        src={formData.imageUrl}
                        alt="Push Banner"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-400 flex items-center justify-center text-black font-black text-xs shrink-0 select-none">
                      LC
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white block truncate">
                          {formData.title || 'Chegirmalar va Aksiyalar'}
                        </span>
                        <span className="text-[10px] text-gray-500 shrink-0">Hozir</span>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block leading-normal whitespace-pre-wrap break-words">
                        {formData.body ||
                          "Ajoyib takliflar va yangi mahsulotlar haqida birinchilardan bo'lib xabardor bo'ling!"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-gray-500">
                    <span>luxe-core.uz</span>
                    <span>@luxecoreuz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPush;
