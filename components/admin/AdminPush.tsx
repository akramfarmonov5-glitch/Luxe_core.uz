import React, { useState, useEffect } from 'react';
import { Bell, Send, Image as ImageIcon, Link as LinkIcon, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';

const AdminPush: React.FC = () => {
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    imageUrl: '',
    clickUrl: '',
  });

  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchDeviceCount();
  }, []);

  const fetchDeviceCount = async () => {
    setIsLoadingCount(true);
    try {
      const { count, error } = await supabase
        .from('user_devices')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setDeviceCount(count || 0);
    } catch (err) {
      console.error('Error fetching device count:', err);
      // Fallback
      setDeviceCount(0);
    } finally {
      setIsLoadingCount(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) {
      showToast("Sarlavha va matn majburiy.", 'warning');
      return;
    }

    setIsSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/admin/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          body: formData.body.trim(),
          imageUrl: formData.imageUrl.trim() || undefined,
          clickUrl: formData.clickUrl.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Xabarnoma yuborishda xatolik yuz berdi.");
      }

      showToast(`Push xabarnoma muvaffaqiyatli yuborildi! Yuborilganlar: ${data.sentCount} ta qurilma.`, 'success');
      
      // Clear form
      setFormData({
        title: '',
        body: '',
        imageUrl: '',
        clickUrl: '',
      });
      
      // Refresh count
      fetchDeviceCount();
    } catch (err: any) {
      console.error('Push send error:', err);
      showToast(err.message || 'Xatolik yuz berdi.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Bell className="text-gold-400" size={32} />
            Push Xabarnomalar (Broadcast)
          </h2>
          <p className="text-gray-400">
            Foydalanuvchilar brauzerlariga chegirmalar, yangiliklar va aksiyalar haqida broadcast push-xabarnomalar yuboring.
          </p>
        </div>

        {/* Device Stats Card */}
        <div className="bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center gap-4 min-w-[200px]">
          <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center text-gold-400">
            <Bell size={24} />
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider flex items-center gap-2">
              Faol Qurilmalar
              <button 
                onClick={fetchDeviceCount} 
                className="text-gray-400 hover:text-white transition-colors"
                title="Yangilash"
              >
                <RefreshCw size={12} className={isLoadingCount ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-black text-white">
                {deviceCount === null ? '...' : deviceCount}
              </span>
              {deviceCount !== null && deviceCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <Send size={18} className="text-gold-400" />
            Yangi Xabar Yaratish
          </h3>

          <form onSubmit={handleSend} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 block font-medium">Sarlavha (Title) *</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none transition-colors"
                placeholder="Masalan: Katta Chegirma Boshlandi! 📣"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 block font-medium">Xabar Matni (Body) *</label>
              <textarea
                required
                value={formData.body}
                onChange={e => setFormData({ ...formData, body: e.target.value })}
                className="w-full h-28 bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none resize-none leading-relaxed transition-colors"
                placeholder="Masalan: Premium aksessuarlar va soatlarga 50% gacha chegirmalarni boy berib qo'ymang!"
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
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, clickUrl: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none transition-colors font-mono text-sm"
                  placeholder="/uz/products/premium-watch"
                />
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-gray-400 leading-relaxed">
                <p className="font-bold text-blue-300 mb-0.5">Muhim ogohlantirish</p>
                Ushbu xabar push bildirishnomalarga ruxsat bergan barcha faol qurilmalarga yuboriladi. Iltimos, ma'lumotlar to'g'riligini va havola to'g'ri ishlashini o'ng tomondagi **jonli ko'rinish (Live Preview)** orqali tekshirib oling.
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending || deviceCount === 0}
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
                  <span>Push Xabarni Broadcast Qilish</span>
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
              Jonli Ko'rinish (Live Preview)
            </h3>

            {/* Desktop Notification Mockup */}
            <div className="space-y-6 flex-1">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Tizim (OS/Browser) ko'rinishi</span>
                <div className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-start gap-3">
                    {/* App Icon */}
                    <div className="w-10 h-10 rounded-xl bg-gold-400 flex items-center justify-center text-black font-black text-xs shrink-0 select-none">
                      LC
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white block truncate">
                          {formData.title || 'Chegirmalar va Aksiyalar'}
                        </span>
                        <span className="text-[10px] text-gray-500 shrink-0">Hozir</span>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block leading-normal whitespace-pre-wrap break-words">
                        {formData.body || "Ajoyib takliflar va yangi mahsulotlar haqida birinchilardan bo'lib xabardor bo'ling!"}
                      </span>
                    </div>
                  </div>

                  {/* Banner Image inside Push */}
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

                  {/* Footer/Domain */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-gray-500">
                    <span>luxe-core.uz</span>
                    <span>Xabarnoma</span>
                  </div>
                </div>
              </div>

              {/* Mobile Phone Mockup */}
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Smartfon (Lock Screen) ko'rinishi</span>
                <div className="w-full max-w-[280px] mx-auto bg-black border-4 border-zinc-800 rounded-[36px] aspect-[9/16] p-3 shadow-2xl relative overflow-hidden flex flex-col">
                  {/* Speaker & Camera notch */}
                  <div className="w-24 h-4 bg-zinc-800 rounded-full mx-auto mb-6 shrink-0 relative flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-zinc-950 absolute left-6" />
                  </div>

                  <div className="flex-1 flex flex-col justify-start pt-6 space-y-4">
                    {/* Time */}
                    <div className="text-center select-none">
                      <span className="text-3xl font-light text-white">12:00</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Chorshanba, 20-May</span>
                    </div>

                    {/* Banner Card */}
                    <div className="w-full bg-zinc-900/90 backdrop-blur border border-white/10 rounded-2xl p-3 shadow-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-gold-400 flex items-center justify-center text-[8px] text-black font-bold">LC</div>
                        <span className="text-[10px] font-bold text-white">LUXECORE</span>
                        <span className="text-[8px] text-gray-500 ml-auto">Hozir</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-white block truncate leading-tight">
                          {formData.title || 'Chegirmalar va Aksiyalar'}
                        </span>
                        <span className="text-[10px] text-gray-400 block leading-tight line-clamp-3">
                          {formData.body || "Ajoyib takliflar va yangi mahsulotlar haqida birinchilardan bo'lib xabardor bo'ling!"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="w-20 h-1 bg-zinc-700 rounded-full mx-auto mt-auto mb-1 shrink-0" />
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
