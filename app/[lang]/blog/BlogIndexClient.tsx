'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useGlobalData } from '../../../context/GlobalContext';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getLocalizedText } from '../../../lib/i18nUtils';
import { blogSlug } from '../../../lib/slugify';

export default function BlogIndexClient({ lang }: { lang: string }) {
  const { blogPosts, isLoading } = useGlobalData();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`pt-24 pb-20 min-h-screen transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-light-bg text-light-text'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
            <Sparkles size={14} /> {t('blog_news')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            {lang === 'ru'
              ? 'B2B Блог и полезные руководства по оптовой упаковке'
              : lang === 'en'
              ? 'LUXECORE Wholesale Packaging Blog & Guides'
              : "B2B Ulgurji Savdo Blogi va Qo'llanmalar"}
          </h1>
          <p className={`text-sm md:text-base max-w-2xl ${isDark ? 'text-gray-400' : 'text-light-muted'}`}>
            {lang === 'ru'
              ? 'Практические советы для кондитеров, магазинов, продавцов маркетплейсов Uzum/Wildberries и ресторанного бизнеса.'
              : lang === 'en'
              ? 'Practical wholesale packaging guides for confectioners, boutiques, marketplace sellers and HoReCa businesses.'
              : "Qandolatchilar, sovg'a do'konlari, Uzum/Wildberries sotuvchilari va kafe-restoranlar uchun ulgurji qadoqlash bo'yicha qo'llanmalar."}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-80 rounded-2xl animate-pulse ${isDark ? 'bg-white/5' : 'bg-gray-200'}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const slug = blogSlug(post, lang);
              const title = getLocalizedText(post.title, lang);
              const excerpt = getLocalizedText(post.content, lang).replace(/[#*\[\]()]/g, '');

              return (
                <article key={post.id} className="group flex flex-col h-full">
                  <Link href={`/${lang}/blog/${slug}`} className="flex flex-col h-full">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-5 border border-white/10">
                      <Image
                        src={post.image || '/logo.jpg'}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white flex items-center gap-1.5 border border-white/10">
                        <Calendar size={12} className="text-gold-400" />
                        {post.date}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h2 className={`text-xl font-bold mb-3 group-hover:text-gold-400 transition-colors line-clamp-2 ${isDark ? 'text-white' : 'text-light-text'}`}>
                        {title}
                      </h2>
                      <p className={`text-sm line-clamp-3 mb-4 flex-1 ${isDark ? 'text-gray-400' : 'text-light-muted'}`}>
                        {excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-gold-400 group-hover:gap-3 transition-all">
                        {t('read_more') || "O'qish"} <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
