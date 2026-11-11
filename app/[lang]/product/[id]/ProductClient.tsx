'use client';

import { useEffect } from 'react';
import { useGlobalData } from '../../../../context/GlobalContext';
import ProductDetail from '../../../../components/ProductDetail';
import { useRouter, useParams } from 'next/navigation';
import { ProductDetailSkeleton } from '../../../../components/Skeleton';
import { productSlug } from '../../../../lib/slugify';
import { getLocalizedText } from '../../../../lib/i18nUtils';

export default function ProductClient({ id }: { id: string }) {
  const { products, categories, isLoading } = useGlobalData();
  const router = useRouter();
  const params = useParams();
  const lang = String(params?.lang || 'uz');

  const numericMatch = /^\d+$/.test(id) ? Number(id) : id.match(/-(\d+)$/)?.[1] ? Number(id.match(/-(\d+)$/)![1]) : null;

  const product = products.find((p) => {
    if (numericMatch !== null && p.id === numericMatch) return true;
    const slugUz = getLocalizedText(p.slug, 'uz');
    const slugRu = getLocalizedText(p.slug, 'ru');
    const slugEn = getLocalizedText(p.slug, 'en');
    return slugUz === id || slugRu === id || slugEn === id || productSlug(p, lang) === id;
  });

  useEffect(() => {
    if (!product || typeof window === 'undefined') return;
    const seoSlug = productSlug(product, lang);
    const targetPath = `/${lang}/product/${seoSlug}`;
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, '', targetPath + window.location.search);
    }
  }, [product, lang]);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center">
        Mahsulot topilmadi
      </div>
    );
  }

  return (
    <ProductDetail
      product={product}
      allProducts={products}
      categories={categories}
      onProductSelect={(pid) => {
        const nextProd = products.find((p) => p.id === pid);
        router.push(`/${lang}/product/${nextProd ? productSlug(nextProd, lang) : pid}`);
      }}
      onBack={() => router.push(`/${lang}`)}
      onCheckout={() => router.push(`/${lang}/checkout`)}
    />
  );
}
