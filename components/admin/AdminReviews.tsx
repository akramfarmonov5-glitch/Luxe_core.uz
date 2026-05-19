import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, EyeOff, MessageCircle, Search, Star, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';
import { getLocalizedText } from '../../lib/i18nUtils';
import type { Product, Review } from '../../types';

interface AdminReviewsProps {
  products: Product[];
}

type ReviewFilter = 'all' | 'pending' | 'approved';

const AdminReviews: React.FC<AdminReviewsProps> = ({ products }) => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<ReviewFilter>('all');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading reviews:', error);
        showToast("Sharhlarni yuklashda xatolik yuz berdi.", 'error');
      } else {
        setReviews((data || []) as Review[]);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [showToast]);

  const productNames = useMemo(
    () => new Map(products.map((product) => [product.id, getLocalizedText(product.name, 'uz')])),
    [products],
  );

  const filteredReviews = reviews.filter((review) => {
    const isApproved = Boolean(review.is_approved);
    const matchesFilter = filter === 'all'
      || (filter === 'approved' && isApproved)
      || (filter === 'pending' && !isApproved);
    const haystack = [
      review.user_name || '',
      review.comment || '',
      productNames.get(review.product_id) || '',
    ].join(' ').toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const approvedCount = reviews.filter((review) => review.is_approved).length;
  const pendingCount = reviews.length - approvedCount;

  const setApproval = async (reviewId: Review['id'], nextApproved: boolean) => {
    const { data, error } = await supabase
      .from('product_reviews')
      .update({ is_approved: nextApproved })
      .eq('id', reviewId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating review approval:', error);
      showToast("Sharh holatini yangilab bo'lmadi. Moderation migration ishlatilganini tekshiring.", 'error');
      return;
    }

    if (data) {
      setReviews((prev) => prev.map((review) => (
        review.id === reviewId ? ({ ...review, ...data } as Review) : review
      )));
      showToast(nextApproved ? 'Sharh tasdiqlandi.' : 'Sharh yashirildi.', 'success');
    }
  };

  const deleteReview = async (reviewId: Review['id']) => {
    if (!confirm("Haqiqatan ham bu sharhni o'chirmoqchimisiz?")) {
      return;
    }

    const { error } = await supabase
      .from('product_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      showToast("Sharhni o'chirib bo'lmadi.", 'error');
      return;
    }

    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    showToast("Sharh o'chirildi.", 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Sharhlar moderatsiyasi</h2>
          <p className="text-gray-400">Yangi sharhlarni tekshiring, tasdiqlang yoki yashiring.</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3">
            <p className="text-xs text-gray-500">Kutilmoqda</p>
            <p className="text-xl font-bold text-amber-400">{pendingCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3">
            <p className="text-xs text-gray-500">Tasdiqlangan</p>
            <p className="text-xl font-bold text-emerald-400">{approvedCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Sharh, mijoz yoki mahsulot bo'yicha qidirish..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-12 pr-4 text-white outline-none focus:border-gold-400"
          />
        </div>

        <div className="flex rounded-xl border border-white/10 bg-zinc-900 p-1">
          {([
            ['all', 'Barchasi'],
            ['pending', 'Kutilmoqda'],
            ['approved', 'Tasdiqlangan'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === value ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Sharhlar yuklanmoqda...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <MessageCircle className="mx-auto mb-3 text-gray-600" size={32} />
            Mos sharh topilmadi.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredReviews.map((review) => (
              <article key={review.id} className="p-4 md:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-white">{review.user_name || 'Mijoz'}</p>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                        review.is_approved
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                      }`}>
                        {review.is_approved ? 'Tasdiqlangan' : 'Kutilmoqda'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                      <span>{productNames.get(review.product_id) || `Mahsulot #${review.product_id}`}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-gold-400">
                        <Star size={14} className="fill-gold-400" />
                        {review.rating}
                      </span>
                    </div>

                    <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                      {review.comment || 'Izoh matni yo‘q.'}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setApproval(review.id, !review.is_approved)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                        review.is_approved
                          ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {review.is_approved ? <EyeOff size={16} /> : <CheckCircle2 size={16} />}
                      {review.is_approved ? 'Yashirish' : 'Tasdiqlash'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReview(review.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                    >
                      <Trash2 size={16} />
                      O'chirish
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
