'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Hero from '../../components/Hero';
import TrustBadges from '../../components/TrustBadges';
import CategoryGrid from '../../components/CategoryGrid';
import FeaturedProducts from '../../components/FeaturedProducts';
import ShoppingGuide from '../../components/ShoppingGuide';
import CustomerReviews from '../../components/CustomerReviews';
import BlogGrid from '../../components/BlogGrid';
import { useGlobalData } from '../../context/GlobalContext';
import { useRouter, useParams } from 'next/navigation';
import { getCategorySlug } from '../../lib/categoryUtils';
import { productSlug, blogSlug } from '../../lib/slugify';
import * as fpixel from '../../lib/fpixel';
import { getLocalizedText } from '../../lib/i18nUtils';
import { useTheme } from '../../context/ThemeContext';
import type { Review } from '../../types';

interface HomePageProps {
  featuredReviews?: Review[];
}

export default function HomePage({ featuredReviews = [] }: HomePageProps) {
  const { products, categories, heroContent, blogPosts, isLoading } = useGlobalData();
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || 'uz';

  const seoTags =
    lang === 'ru'
      ? [
          { label: 'Новогодняя упаковка 2027 оптом', href: '/ru/category/yangi-yil-2027' },
          { label: 'Подарки на Новый год 2027', href: '/ru/category/yangi-yil-2027' },
          { label: 'Свадебные коробки и Сарпо оптом', href: '/ru/category/toy-va-sarpo' },
          { label: 'Подарочные коробки оптом', href: '/ru/category/sovga-qutilari' },
          { label: 'Крафт и Zip-Lock пакеты оптом', href: '/ru/category/kraft-va-zip-lock' },
          { label: 'БОПП пакеты и упаковка', href: '/ru/category/bopp-paketlar' },
          { label: 'Одноразовая посуда и HoReCa оптом', href: '/ru/category/horeca-idishlar' },
          { label: 'Упаковочные материалы Урикзор', href: '/ru' },
        ]
      : [
          { label: 'Yangi yil uchun qutilar 2027 optom', href: `/${lang}/category/yangi-yil-2027` },
          { label: '2027 yil sovg\'a qutilari', href: `/${lang}/category/yangi-yil-2027` },
          { label: 'To\'y va Sarpo qutilari optom', href: `/${lang}/category/toy-va-sarpo` },
          { label: 'Sovg\'a qutilari ulgurji', href: `/${lang}/category/sovga-qutilari` },
          { label: 'Paketlar va Qadoqlash (Kraft, Zip-Lock)', href: `/${lang}/category/kraft-va-zip-lock` },
          { label: 'BOPP selofan paketlar optom', href: `/${lang}/category/bopp-paketlar` },
          { label: 'Bir martalik idishlar va HoReCa optom', href: `/${lang}/category/horeca-idishlar` },
          { label: 'O\'rikzor optom qadoqlash bozori', href: `/${lang}` },
        ];

  const handleCategorySelect = (categoryName: string) => {
    setActiveCategory(categoryName);
    const category = categories.find(c => getLocalizedText(c.name, 'uz') === categoryName || c.slug === categoryName);
    if (category) {
      fpixel.trackViewCategory(getLocalizedText(category.name, 'uz'));
    }
    const element = document.getElementById('featured-products');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navigateToProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    const slug = product ? productSlug(product, String(lang)) : String(id);
    router.push(`/${lang}/product/${slug}`);
  };

  const navigateToBlogPost = (id: number) => {
    const post = blogPosts.find((p) => p.id === id);
    const slug = post ? blogSlug(post, String(lang)) : String(id);
    router.push(`/${lang}/blog/${slug}`);
  };

  return (
    <main className="pb-20">
      <Hero content={heroContent} />
      <CategoryGrid
        categories={categories}
        onSelectCategory={handleCategorySelect}
        isLoading={isLoading}
      />
      <FeaturedProducts
        products={products}
        categories={categories}
        activeCategory={activeCategory}
        onNavigateToProduct={navigateToProduct}
        isLoading={isLoading}
      />
      <ShoppingGuide />
      <TrustBadges />
      <CustomerReviews reviews={featuredReviews} products={products} />
      <BlogGrid posts={blogPosts} onPostClick={navigateToBlogPost} isLoading={isLoading} />

      <section className="container mx-auto px-4 md:px-6 mt-12">
        <div className={`p-6 md:p-8 rounded-2xl border ${isDark ? 'bg-white/[0.02] border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
          <h2 className={`text-lg md:text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {lang === 'ru'
              ? 'LUXECORE (luxe-core.uz) — Подарочные коробки, пакеты, упаковка, одноразовая посуда и новогодняя упаковка 2027 оптом в Ташкенте'
              : 'LUXECORE (luxe-core.uz) — Sovg\'a qutilari, paketlar, qadoqlash materiallari, bir martalik idishlar va 2027 yil yangi yil uchun qutilar optom (ulgurji)'}
          </h2>
          <p className="text-xs md:text-sm leading-relaxed mb-4">
            {lang === 'ru'
              ? 'Оптовый интернет-магазин LUXECORE (luxe-core.uz / LuxeCore / ЛюксКор Ташкент, склад Урикзор) поставляет упаковочные материалы крупным и мелким оптом по всему Узбекистану. В нашем каталоге представлены: новогодняя упаковка на 2027 год (детские коробки для конфет и корпоративные наборы), свадебные коробки для сарпо, подарочные коробки на магните, крафт-пакеты с ручками, матовые и прозрачные Zip-Lock пакеты для маркетплейсов Uzum и Wildberries, БОПП пакеты, а также одноразовая посуда, стаканы и ланч-боксы для кафе и доставки.'
              : 'LUXECORE (luxe-core.uz / LuxeCore / Luxe Core Toshkent, O\'rikzor ombori) ulgurji do\'koni O\'zbekiston bo\'ylab tadbirkorlar, do\'konlar, marketpleys sotuvchilari va restoranlar uchun barcha turdagi qadoqlash mahsulotlarini birinchi qo\'l optom narxlarda yetkazib beradi. Katalogimizda: 2027 yil yangi yil uchun bolalar shirinlik qutilari va korporativ qadoqlar, to\'y va kelin-kuyov sarpo qutilari, magnitli premium sovg\'a qutilari, burama tutqichli kraft paketlar, Uzum va Wildberries uchun Zip-Lock paketlar, yopishqoq BOPP paketlar hamda kafe-restoranlar uchun bir martalik idishlar (odnorazoviy idishlar, stakanlar, konteynerlar) mavjud.'}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {seoTags.map((tag, idx) => (
              <Link
                key={idx}
                href={tag.href}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-gray-300 hover:border-gold-400 hover:text-gold-400'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gold-500 hover:text-amber-700'
                }`}
              >
                #{tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
