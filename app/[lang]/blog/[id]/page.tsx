import { supabase } from '../../../../lib/supabaseClient';
import BlogClient from './BlogClient';
import { getLocalizedText } from '../../../../lib/i18nUtils';
import { SITE_URL } from '../../../../lib/siteUrl';
import { blogSlug } from '../../../../lib/slugify';
import { SEO_LANGUAGES } from '../../../../lib/seoLanguage';

function resolveBlogId(raw: string): string {
  if (!isNaN(Number(raw))) return raw;
  if (raw.includes('-')) {
    const parts = raw.split('-');
    return parts[parts.length - 1];
  }
  return raw;
}

async function loadPost(rawId: string) {
  const blogId = resolveBlogId(rawId);
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', blogId)
    .single();
  return post;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string, lang: string }> }) {
  try {
    const { id, lang: paramsLang } = await params;
    const post = await loadPost(id);
    if (!post) return { title: 'Maqola topilmadi | LUXECORE' };

    const lang = paramsLang || 'uz';
    const seoTitle = getLocalizedText(post.seo?.title, lang) || getLocalizedText(post.title, lang);
    const seoDesc = (
      getLocalizedText(post.seo?.description, lang)
      || getLocalizedText(post.content, lang)
    ).substring(0, 160);
    const keywordsRaw = getLocalizedText(post.seo?.keywords, lang);
    const keywords = typeof keywordsRaw === 'string'
      ? keywordsRaw.split(',').map((k) => k.trim()).filter(Boolean)
      : Array.isArray(keywordsRaw) ? keywordsRaw : [];

    const canonicalPath = `/${lang}/blog/${blogSlug(post as any, lang)}`;
    const languages: Record<string, string> = {};
    for (const altLang of SEO_LANGUAGES) {
      languages[altLang] = `/${altLang}/blog/${blogSlug(post as any, altLang)}`;
    }
    languages['x-default'] = languages.uz;

    return {
      title: `${seoTitle} | LUXECORE Blog`,
      description: seoDesc,
      keywords,
      alternates: {
        canonical: canonicalPath,
        languages,
      },
      openGraph: {
        title: seoTitle,
        description: seoDesc,
        url: `${SITE_URL}${canonicalPath}`,
        type: 'article',
        siteName: 'LUXECORE',
        images: post.image ? [{ url: post.image, alt: seoTitle }] : [],
        publishedTime: post.date,
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDesc,
        images: post.image ? [post.image] : [],
      },
    };
  } catch (error) {
    return { title: 'Blog | LUXECORE' };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string, lang: string }> }) {
  const { id, lang } = await params;
  const activeLang = lang || 'uz';
  const post = await loadPost(id);

  const jsonLd = post ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: getLocalizedText(post.title, activeLang),
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'LUXECORE' },
    publisher: {
      '@type': 'Organization',
      name: 'LUXECORE',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.jpg` },
    },
    description: (
      getLocalizedText(post.seo?.description, activeLang)
      || getLocalizedText(post.content, activeLang)
    ).substring(0, 160),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${activeLang}/blog/${blogSlug(post as any, activeLang)}`,
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogClient id={id} />
    </>
  );
}
