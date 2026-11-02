'use client';

import { useEffect } from 'react';
import { useGlobalData } from '../../../../context/GlobalContext';
import ProductDetail from '../../../../components/ProductDetail';
import { useRouter, useParams } from 'next/navigation';
import { ProductDetailSkeleton } from '../../../../components/Skeleton';
import { productSlug } from '../../../../lib/slugify';

export default function ProductClient({ id }: { id: string }) {
  const { products, categories, isLoading } = useGlobalData();
  const router = useRouter();
  const params = useParams();
  const lang = String(params?.lang || 'uz');

  let productId = id;
  if (isNaN(Number(id)) && id.includes('-')) {
    const parts = id.split('-');
    productId = parts[parts.length - 1];
  }

  const product = products.find((p) => p.id === Number(productId));

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
