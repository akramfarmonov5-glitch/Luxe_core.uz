import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedText } from '../lib/i18nUtils';
import { productSlug } from '../lib/slugify';
import type { Product, Review } from '../types';

interface CustomerReviewsProps {
  reviews: Review[];
  products: Product[];
}

const localeByLang = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US',
} as const;

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews, products }) => {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();

  if (reviews.length === 0) {
    return null;
  }

  const productById = new Map(products.map((product) => [product.id, product]));

  const formatDate = (date: string) => new Date(date).toLocaleDateString(localeByLang[lang], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <section className={`py-12 md:py-20 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-light-bg'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 max-w-2xl md:mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-400 md:text-xs">
            <MessageCircle size={14} />
            {t('home_reviews_label')}
          </span>
          <h2 className={`mt-4 text-2xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-light-text'}`}>
            {t('home_reviews_title')}
          </h2>
          <p className={`mt-3 text-sm leading-relaxed md:text-base ${isDark ? 'text-gray-400' : 'text-light-muted'}`}>
            {t('home_reviews_desc')}
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {reviews.filter((review) => review.comment?.trim()).map((review, index) => {
            const product = productById.get(review.product_id);
            const productName = product ? getLocalizedText(product.name, lang) : null;
            const href = product ? `/${lang}/product/${productSlug(product, lang)}` : null;

            return (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`rounded-2xl border p-5 md:p-6 ${
                  isDark
                    ? 'border-white/10 bg-dark-800'
                    : 'border-light-border bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={15}
                        className={starIndex < review.rating ? 'text-gold-400 fill-gold-400' : 'text-gray-400/30'}
                      />
                    ))}
                  </div>
                  <span className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-light-muted'}`}>
                    {formatDate(review.created_at)}
                  </span>
                </div>

                <p className={`mt-4 line-clamp-5 text-sm leading-relaxed md:text-base ${isDark ? 'text-gray-300' : 'text-light-text'}`}>
                  “{review.comment}”
                </p>

                <div className="mt-5 border-t border-dashed border-current/10 pt-4">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-light-text'}`}>
                    {review.user_name || t('review_customer')}
                  </p>
                  {href && productName && (
                    <Link
                      href={href}
                      className="mt-1 inline-flex text-sm font-medium text-gold-400 transition hover:text-gold-300"
                    >
                      {productName}
                    </Link>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
