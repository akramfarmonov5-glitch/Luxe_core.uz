import React, { useState, useEffect } from 'react';
import { Users, Phone, Calendar, Search, MessageSquare, Trash2, Download, MapPin, Send } from 'lucide-react';
import { ChatLead } from '../../types';
import { hasSupabaseCredentials, supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';

interface BotCustomer {
  telegram_id: number;
  name: string;
  phone: string;
  address?: string;
  lang?: string;
  created_at: string;
}

const AdminLeads: React.FC = () => {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<ChatLead[]>([]);
  const [botCustomers, setBotCustomers] = useState<BotCustomer[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'bot' | 'chat'>('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const fetchAllCustomers = async () => {
    setLoading(true);

    if (!hasSupabaseCredentials) {
      setLeads([]);
      setLoading(false);
      return;
    }

    try {
      const [{ data: leadsData }, { data: sessionData }] = await Promise.all([
        // Eng so'nggi 500 lid — cheksiz yuklash brauzerni sekinlashtiradi.
        supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500),
        supabase.auth.getSession(),
      ]);

      setLeads(leadsData || []);

      const token = sessionData.session?.access_token;
      const res = await fetch('/api/admin/telegram-broadcast', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setBotCustomers(data.botUsers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      setLeads(leads.filter((lead) => lead.id !== id));
      showToast("Mijoz yozuvi o'chirildi", 'success');
    } catch (err) {
      console.error('Error deleting lead:', err);
      showToast("O'chirishda xatolik yuz berdi", 'error');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const combinedList = [
    ...botCustomers.map((b) => ({
      id: `bot_${b.telegram_id}`,
      rawId: String(b.telegram_id),
      source: 'bot' as const,
      name: b.name || `TG #${b.telegram_id}`,
      phone: b.phone || '-',
      address: b.address || '',
      telegramId: b.telegram_id,
      created_at: b.created_at,
    })),
    ...leads.map((l) => ({
      id: `chat_${l.id}`,
      rawId: l.id,
      source: 'chat' as const,
      name: l.name || 'Mijoz',
      phone: l.phone || '-',
      address: '',
      telegramId: undefined,
      created_at: l.created_at,
    })),
  ];

  const filteredList = combinedList.filter((item) => {
    if (activeTab === 'bot' && item.source !== 'bot') return false;
    if (activeTab === 'chat' && item.source !== 'chat') return false;
    const q = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      (item.address && item.address.toLowerCase().includes(q))
    );
  });

  const handleExportCSV = () => {
    const headers = ['Manba,Ism,Telefon,Manzil,Telegram ID,Sana\n'];
    const rows = filteredList.map(
      (c) =>
        `"${c.source === 'bot' ? 'Telegram Bot' : 'Sayt Chat'}","${c.name.replace(/"/g, '""')}","${c.phone}","${(c.address || '').replace(/"/g, '""')}","${c.telegramId || ''}","${c.created_at || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `luxecore_mijozlar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Mijozlar Bazasi (CRM)</h2>
          <p className="text-gray-400">
            Telegram Bot va Sayt AI Chat orqali ro'yxatdan o'tgan barcha mijozlar.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-xl flex flex-col items-center">
            <span className="text-[10px] text-sky-400 uppercase font-bold">Telegram Bot</span>
            <span className="text-xl font-bold text-white">{botCustomers.length}</span>
          </div>
          <div className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-xl flex flex-col items-center">
            <span className="text-[10px] text-gold-400 uppercase font-bold">Sayt Chat</span>
            <span className="text-xl font-bold text-white">{leads.length}</span>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={filteredList.length === 0}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Download size={16} />
            CSV Yuklash
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Barchasi ({combinedList.length})
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bot' ? 'bg-sky-400 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            🤖 Telegram Bot ({botCustomers.length})
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'chat' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            💬 Sayt Chat ({leads.length})
          </button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Ism, telefon yoki manzil orqali qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:border-gold-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="p-4 text-sm font-medium text-gray-400">Mijoz</th>
                <th className="p-4 text-sm font-medium text-gray-400">Manba</th>
                <th className="p-4 text-sm font-medium text-gray-400">Telefon</th>
                <th className="p-4 text-sm font-medium text-gray-400">Manzil</th>
                <th className="p-4 text-sm font-medium text-gray-400">Sana</th>
                <th className="p-4 text-sm font-medium text-gray-400 text-right">Bog'lanish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Mijozlar topilmadi.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const cleanDigits = item.phone.replace(/\D/g, '');
                  const telHref = cleanDigits
                    ? `tel:+${cleanDigits.startsWith('998') ? cleanDigits : `998${cleanDigits}`}`
                    : undefined;
                  const tgHref = cleanDigits
                    ? `https://t.me/+${cleanDigits.startsWith('998') ? cleanDigits : `998${cleanDigits}`}`
                    : undefined;

                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.source === 'bot'
                                ? 'bg-sky-500/10 text-sky-400'
                                : 'bg-gold-400/10 text-gold-400'
                            }`}
                          >
                            <Users size={18} />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{item.name}</span>
                            {item.telegramId && (
                              <span className="text-[11px] text-gray-500 font-mono">
                                ID: {item.telegramId}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            item.source === 'bot'
                              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                              : 'bg-gold-400/15 text-gold-400 border border-gold-400/20'
                          }`}
                        >
                          {item.source === 'bot' ? '🤖 Bot' : '💬 Chat'}
                        </span>
                      </td>
                      <td className="p-4">
                        {telHref ? (
                          <a
                            href={telHref}
                            className="flex items-center gap-2 text-gray-200 hover:text-gold-400 transition-colors font-medium"
                          >
                            <Phone size={14} />
                            <span>{item.phone}</span>
                          </a>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-400 max-w-[200px] truncate">
                        {item.address ? (
                          <span className="flex items-center gap-1.5" title={item.address}>
                            <MapPin size={13} className="text-gray-500 shrink-0" />
                            {item.address}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={14} />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {telHref && (
                            <a
                              href={telHref}
                              className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                              title="Qo'ng'iroq qilish"
                            >
                              <Phone size={16} />
                            </a>
                          )}
                          {tgHref && (
                            <a
                              href={tgHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"
                              title="Telegram orqali yozish"
                            >
                              <Send size={16} />
                            </a>
                          )}
                          {item.source === 'chat' && (
                            <button
                              onClick={() => deleteLead(item.rawId)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="O'chirish"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
