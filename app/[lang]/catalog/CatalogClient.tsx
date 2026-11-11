'use client';

import { useRouter, useParams } from 'next/navigation';
import { useGlobalData } from '../../../context/GlobalContext';
import { useTheme } from '../../../context/ThemeContext';
import FeaturedProducts from '../../../components/FeaturedProducts';
import CategoryGrid from '../../../components/CategoryGrid';
import { productSlug } from '../../../lib/slugify';
import { getCategorySlug } from '../../../lib/categoryUtils';

export default function CatalogClient() {
  const params = useParams();
  const lang = String(params?.lang || 'uz');
  const router = useRouter();
  const { products, categories, isLoading } = useGlobalData();
  const { isDark } = useTheme();

  return (
    <div className={`pt-24 pb-16 min-h-screen ${isDark ? 'bg-black text-white' : 'bg-light-bg text-light-text'}`}>
      <div className="container mx-auto px-4 md:px-6 pt-4 pb-2">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          {lang === 'ru'
            ? 'Оптовый каталог LUXECORE (Урикзор)'
            : lang === 'en'
            ? 'LUXECORE Wholesale Catalog'
            : "LUXECORE B2B Ulgurji Katalog (O'rikzor)"}
        </h1>
        <p className={`text-sm md:text-base max-w-3xl ${isDark ? 'text-gray-400' : 'text-light-muted'}`}>
          {lang === 'ru'
            ? 'Все товары в наличии на складе Урикзор: новогодняя упаковка 2027, свадебные коробки сарпо, крафт и Zip-Lock пакеты, одноразовая посуда HoReCa. Скидки 500+ (-5%) и 1000+ (-10% VIP).'
            : lang === 'en'
            ? 'All wholesale items in stock at Tashkent Urikzor warehouse: New Year 2027 boxes, wedding packaging, Kraft and Zip-Lock bags, HoReCa supplies. Automatic -5% (500+) and -10% VIP (1000+) discounts.'
            : "O'rikzor omboridagi barcha ulgurji tovarlar: Yangi yil 2027 sovg'a qutilari, to'y va sarpo qutilari, kraft va Zip-Lock paketlar, HoReCa idishlar. 500+ (-5%), 1000+ (-10% VIP) avtomatik chegirmalar."}
        </p>
      </div>

      <CategoryGrid
        categories={categories}
        onSelectCategory={(catSlug) => {
          const matched = categories.find((c) => getCategorySlug(c) === catSlug);
          router.push(`/${lang}/category/${matched ? getCategorySlug(matched, lang) : catSlug}`);
        }}
        isLoading={isLoading}
      />

      <FeaturedProducts
        products={products}
        categories={categories}
        onNavigateToProduct={(id) => {
          const prod = products.find((p) => p.id === id);
          router.push(`/${lang}/product/${prod ? productSlug(prod, lang) : id}`);
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
