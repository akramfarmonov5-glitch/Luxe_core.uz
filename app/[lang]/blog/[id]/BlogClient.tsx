'use client';

import { useEffect } from 'react';
import { useGlobalData } from '../../../../context/GlobalContext';
import BlogPostDetail from '../../../../components/BlogPostDetail';
import { useRouter, useParams } from 'next/navigation';
import { blogSlug } from '../../../../lib/slugify';
import { getLocalizedText } from '../../../../lib/i18nUtils';

export default function BlogClient({ id }: { id: string }) {
  const { blogPosts, isLoading } = useGlobalData();
  const router = useRouter();
  const params = useParams();
  const lang = String(params?.lang || 'uz');

  let blogId = id;
  if (isNaN(Number(id)) && id.includes('-')) {
    const parts = id.split('-');
    const maybeId = Number(parts[parts.length - 1]);
    if (!isNaN(maybeId)) blogId = String(maybeId);
  }

  const post = blogPosts.find((p) => {
    if (!isNaN(Number(blogId)) && p.id === Number(blogId)) return true;
    const slugUz = getLocalizedText(p.slug, 'uz');
    const slugRu = getLocalizedText(p.slug, 'ru');
    const slugEn = getLocalizedText(p.slug, 'en');
    return slugUz === id || slugRu === id || slugEn === id || (typeof p.slug === 'string' && p.slug === id);
  });

  useEffect(() => {
    if (!post || typeof window === 'undefined') return;
    const seoSlug = blogSlug(post, lang);
    const targetPath = `/${lang}/blog/${seoSlug}`;
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, '', targetPath + window.location.search);
    }
  }, [post, lang]);

  if (isLoading) return <div className="min-h-screen pt-24 text-center">Yuklanmoqda...</div>;

  if (!post) return <div className="min-h-screen pt-24 text-center">Maqola topilmadi</div>;
  return <BlogPostDetail post={post} onBack={() => router.push(`/${lang}`)} />;
}
