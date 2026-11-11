'use client';
import { useGlobalData } from '../../../../context/GlobalContext';
import FeaturedProducts from '../../../../components/FeaturedProducts';
import { useParams, useRouter } from 'next/navigation';
import { productSlug, slugify } from '../../../../lib/slugify';
import { getLocalizedText } from '../../../../lib/i18nUtils';
import { useTheme } from '../../../../context/ThemeContext';

const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  'toy-va-sarpo': 'toy-qutilari',
  'kraft-va-zip-lock': 'kraft-zip-paketlar',
  'horeca-idishlar': 'horeca-xojalik',
};

export default function CategoryClient() {
  const params = useParams();
  const rawSlug = String(params?.slug || '');
  const slug = CATEGORY_SLUG_ALIASES[rawSlug] || rawSlug;
  const lang = String(params?.lang || 'uz');
  const { products, categories, isLoading } = useGlobalData();
  const { isDark } = useTheme();
  const router = useRouter();

  const currentCategory = categories.find((cat) => {
    const slugUz = getLocalizedText(cat.slug, 'uz') || slugify(getLocalizedText(cat.name, 'uz'));
    const slugLang = getLocalizedText(cat.slug, lang) || slugify(getLocalizedText(cat.name, lang));
    return slugUz === slug || slugLang === slug;
  });

  const categoryTitle = currentCategory
    ? getLocalizedText(currentCategory.name, lang)
    : slug.replace(/-/g, ' ');
  const categoryDesc = currentCategory
    ? getLocalizedText(currentCategory.description, lang)
    : '';

  return (
    <div className={`pt-24 pb-16 min-h-screen ${isDark ? 'bg-black text-white' : 'bg-light-bg text-light-text'}`}>
      <div className="container mx-auto px-4 md:px-6 pt-4 pb-2">
        <h1 className="text-2xl md:text-4xl font-bold capitalize mb-2">
          {categoryTitle}
        </h1>
        {categoryDesc && (
          <p className={`text-sm md:text-base max-w-3xl ${isDark ? 'text-gray-400' : 'text-light-muted'}`}>
            {categoryDesc}
          </p>
        )}
      </div>

      <FeaturedProducts
        products={products}
        categories={categories}
        activeCategory={slug}
        onNavigateToProduct={(id) => {
          const prod = products.find((p) => p.id === id);
          router.push(`/${lang}/product/${prod ? productSlug(prod, lang) : id}`);
        }}
        isLoading={isLoading}
      />

      <section className="container mx-auto px-4 md:px-6 mt-12">
        <div className={`p-6 md:p-8 rounded-2xl border ${isDark ? 'bg-white/[0.02] border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
          <h2 className={`text-lg md:text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {lang === 'ru'
              ? `${categoryTitle} — купить оптом со склада Урикзор в Ташкенте`
              : `${categoryTitle} — Toshkent O'rikzor omboridan ulgurji (optom) narxlarda`}
          </h2>
          <p className="text-xs md:text-sm leading-relaxed">
            {lang === 'ru'
              ? `Интернет-магазин LUXECORE предлагает ${categoryTitle.toLowerCase()} крупным и мелким оптом напрямую со склада на рынке Урикзор (Ташкент). При заказе от 500 штук действует автоматическая скидка -5%, от 1000 штук — VIP-скидка -10%. Быстрая доставка по Ташкенту за 2 часа и отправка во все области Узбекистана (Самарканд, Бухара, Фергана, Андижан, Наманган, Хорезм) за 24 часа.`
              : `LUXECORE ulgurji do'koni ${categoryTitle.toLowerCase()} bo'limidagi barcha mahsulotlarni Toshkentdagi O'rikzor omboridan birinchi qo'l ulgurji narxlarda taklif etadi. 500 donadan boshlab avtomatik -5%, 1000 donadan boshlab esa -10% VIP ulgurji chegirma amal qiladi. Toshkent shahri bo'ylab 2 soatda, O'zbekistonning barcha viloyatlariga 24 soat ichida yetkazib beramiz.`}
          </p>
        </div>
      </section>
    </div>
  );
}
