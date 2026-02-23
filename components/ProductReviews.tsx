import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, User, Send, ThumbsUp } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ProductReviewsProps {
    productId: number;
    productName: string;
}

interface Review {
    id: string;
    product_id: number;
    author: string;
    rating: number;
    comment: string;
    created_at: string;
    helpful_count: number;
}

const StarRating: React.FC<{ rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void }> = ({
    rating, size = 16, interactive = false, onChange
}) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <button
                key={i}
                type="button"
                onClick={() => interactive && onChange?.(i)}
                className={interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'}
                disabled={!interactive}
            >
                <Star
                    size={size}
                    className={`transition-colors ${i <= rating ? 'text-gold-400 fill-gold-400' : 'text-gray-600'}`}
                />
            </button>
        ))}
    </div>
);

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [author, setAuthor] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('product_reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false })
                .limit(10);
            setReviews(data || []);
        } catch {
            setReviews([]);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!author.trim() || !comment.trim()) return;
        setSubmitting(true);

        try {
            await supabase.from('product_reviews').insert({
                product_id: productId,
                author: author.trim(),
                rating,
                comment: comment.trim(),
                helpful_count: 0,
            });
            setAuthor('');
            setComment('');
            setRating(5);
            setShowForm(false);
            loadReviews();
        } catch (err) {
            console.error('Review submit error:', err);
        }
        setSubmitting(false);
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0';

    const formatDate = (d: string) => new Date(d).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="mt-12 pt-8 border-t border-white/10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Star className="text-gold-400" size={22} /> Izohlar
                        {reviews.length > 0 && <span className="text-sm font-normal text-gray-400">({reviews.length})</span>}
                    </h3>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={Math.round(Number(avgRating))} size={14} />
                            <span className="text-gold-400 font-semibold">{avgRating}</span>
                            <span className="text-gray-500 text-sm">/ 5</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gold-400 hover:bg-gold-500 text-black font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors"
                >
                    <Send size={16} /> Izoh qoldirish
                </button>
            </div>

            {/* Review Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-8 space-y-4 overflow-hidden"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">Baho:</span>
                            <StarRating rating={rating} size={24} interactive onChange={setRating} />
                        </div>
                        <input
                            required
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            placeholder="Ismingiz"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                        />
                        <textarea
                            required
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder={`${productName} haqida fikringiz...`}
                            rows={3}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-400 focus:outline-none resize-none"
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-gold-400 hover:bg-gold-500 text-black font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Yuborilmoqda...' : 'Yuborish'}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Reviews List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-zinc-900/50 rounded-2xl p-6 animate-pulse h-28 border border-white/5" />
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
                    <Star size={40} className="text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">Hali izoh yo'q. Birinchi bo'lib izoh qoldiring!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 hover:border-gold-400/20 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-gold-400/10 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-gold-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm">{review.author}</h4>
                                        <span className="text-gray-500 text-xs">{formatDate(review.created_at)}</span>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} size={14} />
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;
