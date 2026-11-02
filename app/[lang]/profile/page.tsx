'use client';
import UserProfile from '../../../components/UserProfile';
import { useParams, useRouter } from 'next/navigation';
import { useGlobalData } from '../../../context/GlobalContext';
import { productSlug } from '../../../lib/slugify';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const lang = String(params?.lang || 'uz');
  const { products } = useGlobalData();

  return (
    <UserProfile
      onBack={() => router.push(`/${lang}`)}
      onNavigateToProduct={(id) => {
        const prod = products.find((p) => p.id === id);
        router.push(`/${lang}/product/${prod ? productSlug(prod, lang) : id}`);
      }}
    />
  );
}
