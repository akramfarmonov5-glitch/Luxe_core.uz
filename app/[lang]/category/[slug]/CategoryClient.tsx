'use client';
import { useGlobalData } from '../../../../context/GlobalContext';
import FeaturedProducts from '../../../../components/FeaturedProducts';
import { useParams, useRouter } from 'next/navigation';
import { productSlug } from '../../../../lib/slugify';

export default function CategoryClient() {
  const params = useParams();
  const slug = params?.slug;
  const lang = String(params?.lang || 'uz');
  const { products, categories, isLoading } = useGlobalData();
  const router = useRouter();

  return (
    <div className="pt-24 pb-12">
      <FeaturedProducts
        products={products}
        categories={categories}
        activeCategory={String(slug)}
        onNavigateToProduct={(id) => {
          const prod = products.find((p) => p.id === id);
          router.push(`/${lang}/product/${prod ? productSlug(prod, lang) : id}`);
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
