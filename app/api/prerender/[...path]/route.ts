import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '../../../../lib/siteUrl';

const BASE_URL = SITE_URL;
const LANGUAGES = ['uz', 'ru', 'en'] as const;
type Lang = typeof LANGUAGES[number];
const LOCALES: Record<Lang, string> = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' };

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { path } = await params;
  const rawSegments = path || [];
  const lang: Lang = (LANGUAGES as readonly string[]).includes(rawSegments[0]) ? (rawSegments[0] as Lang) : 'uz';
  const segments = (LANGUAGES as readonly string[]).includes(rawSegments[0]) ? rawSegments.slice(1) : rawSegments;
  const pageType = segments[0] || 'home';

  try {
    let products: any[] = [];
    let categories: any[] = [];
    let blogPosts: any[] = [];

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const [prodRes, catRes, blogRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('blog_posts').select('*').order('date', { ascending: false }),
      ]);

      if (prodRes.data) products = prodRes.data;
      if (catRes.data) categories = catRes.data;
      if (blogRes.data) blogPosts = blogRes.data;
    }

    if (products.length === 0) products = getMockProducts();
    if (categories.length === 0) categories = getMockCategories();

    let html = '';
    if (pageType === 'product' && segments[1]) {
      html = renderProductPage(segments[1], products, categories, lang);
    } else if (pageType === 'blog' && segments[1]) {
      html = renderBlogPage(segments[1], blogPosts, lang);
    } else if (pageType === 'category' && segments[1]) {
      html = renderCategoryPage(segments[1], products, categories, lang);
    } else {
      html = renderHomePage(products, categories, blogPosts, lang);
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('Pre-render Error:', err);
    return NextResponse.redirect(`${BASE_URL}${localizedPath('/', 'uz')}`, 302);
  }
}

function renderProductPage(slug: string, products: any[], categories: any[], lang: Lang) {
  const id = parseInt(slug.split('-').pop() || '', 10);
  const product = products.find(p => Number(p.id) === id);
  if (!product) return renderNotFound(lang);

  const category = findCategoryByValue(product.category, categories);
  const categoryName = category ? getLocalizedText(category.name, lang) : getLocalizedText(product.category, lang);
  const categorySlug = category ? getCategorySlug(category, lang) : slugify(getLocalizedText(product.category, lang));
  const categoryKey = category ? getCategorySlug(category, 'uz') : slugify(getLocalizedText(product.category, 'uz'));
  const name = getLocalizedText(product.name, lang);
  const descriptionText = getLocalizedText(product.shortDescription || product.description || product.name, lang);
  const productUrlSlug = getEntitySlug(product, 'product', lang);
  const canonicalUrl = localizedUrl(`/product/${productUrlSlug}`, lang);
  const title = `${name} - ${categoryName} | LUXECORE`;
  const description = `${name} - ${descriptionText}. ${formatPrice(product.price)}. LUXECORE`;

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name,
    image: [product.image, ...(product.images || [])],
    description: descriptionText,
    sku: `PSHOP-${product.id}`,
    brand: { '@type': 'Brand', name: 'LUXECORE' },
    category: categoryName,
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'UZS',
      price: product.price,
      availability: (product.stock === undefined || product.stock > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'LUXECORE' },
    },
  };

  const breadcrumbs = [
    { name: homeLabel(lang), url: localizedUrl('/', lang) },
    { name: categoryName, url: localizedUrl(`/category/${categorySlug}`, lang) },
    { name, url: canonicalUrl },
  ];

  const related = products
    .filter(p => getProductCategoryKey(p.category, categories, 'uz') === categoryKey && Number(p.id) !== Number(product.id))
    .slice(0, 4);

  return renderDocument({
    lang,
    title,
    description,
    canonicalUrl,
    alternatePaths: Object.fromEntries(LANGUAGES.map(altLang => [altLang, `/product/${getEntitySlug(product, 'product', altLang)}`])),
    keywords: [name, categoryName, 'LUXECORE', 'Uzbekistan'],
    ogType: 'product',
    ogImage: product.image,
    schemas: [productSchema, breadcrumbSchema(breadcrumbs)],
    body: `
      ${breadcrumbHtml(breadcrumbs)}
      <article itemscope itemtype="https://schema.org/Product">
        <h1 itemprop="name">${esc(name)}</h1>
        <img itemprop="image" src="${esc(product.image)}" alt="${esc(name)}" width="600" height="750">
        <p itemprop="description">${esc(descriptionText)}</p>
        <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <meta itemprop="priceCurrency" content="UZS">
          <p>${priceLabel(lang)}: <span itemprop="price">${product.price}</span> UZS</p>
        </div>
        ${specTable(product.specs || [], lang)}
      </article>
      ${related.length > 0 ? `<section><h2>${relatedLabel(lang)}</h2><ul>${related.map(p => productListItem(p, lang)).join('')}</ul></section>` : ''}
    `,
  });
}

function renderBlogPage(slug: string, blogPosts: any[], lang: Lang) {
  const id = slug.split('-').pop();
  const post = blogPosts.find(p => String(p.id) === String(id));
  if (!post) return renderNotFound(lang);

  const titleText = getLocalizedText(post.seo?.title || post.title, lang);
  const postTitle = getLocalizedText(post.title, lang);
  const content = getLocalizedText(post.content, lang);
  const description = getLocalizedText(post.seo?.description, lang) || content.substring(0, 160);
  const postUrlSlug = getEntitySlug(post, 'blog', lang);
  const canonicalUrl = localizedUrl(`/blog/${postUrlSlug}`, lang);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postTitle,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'LUXECORE' },
    publisher: {
      '@type': 'Organization',
      name: 'LUXECORE',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.jpg` },
    },
    description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  const breadcrumbs = [
    { name: homeLabel(lang), url: localizedUrl('/', lang) },
    { name: 'Blog', url: localizedUrl('/', lang) },
    { name: postTitle, url: canonicalUrl },
  ];

  return renderDocument({
    lang,
    title: `${titleText} | LUXECORE Blog`,
    description,
    canonicalUrl,
    alternatePaths: Object.fromEntries(LANGUAGES.map(altLang => [altLang, `/blog/${getEntitySlug(post, 'blog', altLang)}`])),
    keywords: getLocalizedText(post.seo?.keywords, lang) || postTitle,
    ogType: 'article',
    ogImage: post.image,
    schemas: [schema, breadcrumbSchema(breadcrumbs)],
    body: `
      ${breadcrumbHtml(breadcrumbs)}
      <article itemscope itemtype="https://schema.org/BlogPosting">
        <h1 itemprop="headline">${esc(postTitle)}</h1>
        <time itemprop="datePublished" datetime="${esc(post.date || '')}">${esc(post.date || '')}</time>
        <img itemprop="image" src="${esc(post.image)}" alt="${esc(postTitle)}" width="1200" height="675">
        <div itemprop="articleBody">${content.split('\n').map(p => `<p>${esc(p)}</p>`).join('')}</div>
      </article>
    `,
  });
}

function renderCategoryPage(catSlug: string, products: any[], categories: any[], lang: Lang) {
  const category = categories.find(c => getCategorySlugs(c).includes(catSlug) || slugify(getLocalizedText(c.name, 'uz')) === catSlug);
  const categoryName = category ? getLocalizedText(category.name, lang) : catSlug;
  const description = category ? getLocalizedText(category.description, lang) : `${categoryName} - LUXECORE`;
  const categorySlug = category ? getCategorySlug(category, lang) : catSlug;
  const categoryKey = category ? getCategorySlug(category, 'uz') : catSlug;
  const canonicalUrl = localizedUrl(`/category/${categorySlug}`, lang);
  const catProducts = products.filter(p => getProductCategoryKey(p.category, categories, 'uz') === categoryKey);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryName,
    description,
    url: canonicalUrl,
    numberOfItems: catProducts.length,
    itemListElement: catProducts.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: localizedUrl(`/product/${getEntitySlug(p, 'product', lang)}`, lang),
      name: getLocalizedText(p.name, lang),
    })),
  };

  const breadcrumbs = [
    { name: homeLabel(lang), url: localizedUrl('/', lang) },
    { name: categoryName, url: canonicalUrl },
  ];

  return renderDocument({
    lang,
    title: `${categoryName} | LUXECORE`,
    description,
    canonicalUrl,
    alternatePaths: category ? Object.fromEntries(LANGUAGES.map(altLang => [altLang, `/category/${getCategorySlug(category, altLang)}`])) : null,
    keywords: [categoryName, 'LUXECORE', 'Uzbekistan'],
    ogType: 'website',
    ogImage: category?.image || `${BASE_URL}/logo.jpg`,
    schemas: [schema, breadcrumbSchema(breadcrumbs)],
    body: `
      ${breadcrumbHtml(breadcrumbs)}
      <h1>${esc(categoryName)}</h1>
      <p>${esc(description)}</p>
      <section>
        <h2>${productsCountLabel(lang, catProducts.length)}</h2>
        <ul>${catProducts.map(p => productListItem(p, lang)).join('')}</ul>
      </section>
    `,
  });
}

function renderHomePage(products: any[], categories: any[], blogPosts: any[], lang: Lang) {
  const title = homeTitle(lang);
  const description = homeDescription(lang);
  const canonicalUrl = localizedUrl('/', lang);
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'LUXECORE',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.jpg`,
      description,
      sameAs: ['https://instagram.com/luxecore.uz', 'https://t.me/luxecore_uz'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'LUXECORE',
      url: BASE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/${lang}?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];

  return renderDocument({
    lang,
    title,
    description,
    canonicalUrl,
    keywords: ['LUXECORE', 'premium store', 'luxury', 'Uzbekistan'],
    ogType: 'website',
    ogImage: `${BASE_URL}/logo.jpg`,
    schemas,
    body: `
      <h1>${esc(title)}</h1>
      <p>${esc(description)}</p>
      <section>
        <h2>${categoriesLabel(lang)}</h2>
        <ul>${categories.map(c => `<li><a href="${localizedUrl(`/category/${getCategorySlug(c, lang)}`, lang)}">${esc(getLocalizedText(c.name, lang))}</a></li>`).join('')}</ul>
      </section>
      <section>
        <h2>${productsLabel(lang)}</h2>
        <ul>${products.slice(0, 12).map(p => productListItem(p, lang)).join('')}</ul>
      </section>
      ${blogPosts.length > 0 ? `<section><h2>Blog</h2><ul>${blogPosts.map(p => `<li><a href="${localizedUrl(`/blog/${slugify(getLocalizedText(p.title, 'uz'))}-${p.id}`, lang)}">${esc(getLocalizedText(p.title, lang))}</a></li>`).join('')}</ul></section>` : ''}
    `,
  });
}

interface RenderDocumentParams {
  lang: Lang;
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string[] | string;
  ogType: string;
  ogImage: string;
  schemas: any[];
  body: string;
  alternatePaths?: Record<string, string> | null;
}

function renderDocument({ lang, title, description, canonicalUrl, keywords, ogType, ogImage, schemas, body, alternatePaths = null }: RenderDocumentParams) {
  const basePath = stripLanguagePrefix(new URL(canonicalUrl).pathname);
  const alternates = LANGUAGES.map(altLang =>
    `<link rel="alternate" hreflang="${altLang}" href="${localizedUrl(alternatePaths?.[altLang] || basePath, altLang)}">`
  ).join('\n  ');
  const xDefaultPath = alternatePaths?.uz || basePath;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="keywords" content="${esc(Array.isArray(keywords) ? keywords.join(', ') : keywords)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${canonicalUrl}">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${localizedUrl(xDefaultPath, 'uz')}">
  <meta property="og:type" content="${esc(ogType)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:site_name" content="LUXECORE">
  <meta property="og:locale" content="${LOCALES[lang]}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(ogImage)}">
  ${schemas.map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join('\n  ')}
  <link rel="icon" type="image/png" href="/logo.jpg">
</head>
<body>
  <header><nav><a href="${localizedUrl('/', lang)}">LUXECORE</a></nav></header>
  <main>${body}</main>
  <footer><p>&copy; ${new Date().getFullYear()} LUXECORE</p></footer>
  <script>
    if (!navigator.userAgent.match(/bot|crawl|spider|slurp|googlebot|bingbot|yandex|baidu|duckduck|facebot|ia_archiver/i)) {
      window.location.replace('${canonicalUrl}');
    }
  </script>
</body>
</html>`;
}

function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function breadcrumbHtml(items: { name: string; url: string }[]) {
  return `<nav aria-label="breadcrumb"><ol>${items.map((item, index) =>
    index === items.length - 1
      ? `<li>${esc(item.name)}</li>`
      : `<li><a href="${item.url}">${esc(item.name)}</a></li>`
  ).join('')}</ol></nav>`;
}

function specTable(specs: any[], lang: Lang) {
  if (!specs.length) return '';
  return `<table>${specs.map(spec => `<tr><th>${esc(getLocalizedText(spec.label, lang))}</th><td>${esc(getLocalizedText(spec.value, lang))}</td></tr>`).join('')}</table>`;
}

function productListItem(product: any, lang: Lang) {
  const name = getLocalizedText(product.name, lang);
  const description = getLocalizedText(product.shortDescription || product.description || '', lang);
  return `<li>
    <a href="${localizedUrl(`/product/${getEntitySlug(product, 'product', lang)}`, lang)}">
      <img src="${esc(product.image)}" alt="${esc(name)}" width="300" height="375" loading="lazy">
      <h3>${esc(name)}</h3>
      <p>${esc(description)}</p>
      <p>${priceLabel(lang)}: ${formatPrice(product.price)}</p>
    </a>
  </li>`;
}

function findCategoryByValue(value: any, categories: any[]) {
  const rawValue = getLocalizedText(value, 'uz');
  return categories.find(category => {
    const names = LANGUAGES.map(lang => getLocalizedText(category.name, lang));
    return getCategorySlugs(category).includes(rawValue) || names.includes(rawValue);
  });
}

function getProductCategoryKey(value: any, categories: any[], lang: Lang = 'uz') {
  const category = findCategoryByValue(value, categories);
  return category ? getCategorySlug(category, lang) : getLocalizedText(value, lang);
}

function getCategorySlug(category: any, lang: Lang = 'uz') {
  return getLocalizedText(category.slug, lang) || slugify(getLocalizedText(category.name, lang));
}

function getCategorySlugs(category: any) {
  return LANGUAGES
    .map(lang => getCategorySlug(category, lang))
    .filter((slug, index, slugs) => slug && slugs.indexOf(slug) === index);
}

function getEntitySlug(entity: any, entityType: string, lang: Lang) {
  const source = entityType === 'blog' ? entity.title : entity.name;
  return `${getLocalizedText(entity.slug, lang) || slugify(getLocalizedText(source, lang))}-${entity.id}`;
}

function localizedUrl(path: string, lang: Lang) {
  return `${BASE_URL}${localizedPath(path, lang)}`;
}

function localizedPath(path: string, lang: Lang) {
  const cleanPath = stripLanguagePrefix(path);
  return cleanPath === '/' ? `/${lang}` : `/${lang}${cleanPath}`;
}

function stripLanguagePrefix(path: string) {
  const segments = path.split('/').filter(Boolean);
  if ((LANGUAGES as readonly string[]).includes(segments[0])) {
    const rest = segments.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
}

function getLocalizedText(text: any, lang: Lang): string {
  if (!text) return '';
  if (typeof text === 'string') {
    try {
      const parsed = JSON.parse(text);
      if (parsed && (parsed.uz !== undefined || parsed.ru !== undefined || parsed.en !== undefined)) {
        return parsed[lang] || parsed.uz || '';
      }
    } catch {
      return text;
    }
  }
  if (typeof text === 'object') return text[lang] || text.uz || '';
  return String(text);
}

function slugify(text: string) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/['`']/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function esc(str: string) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatPrice(price: number) {
  if (!price) return '0 UZS';
  return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
}

function homeLabel(lang: Lang) {
  return ({ uz: 'Bosh sahifa', ru: 'Главная', en: 'Home' })[lang];
}

function homeTitle(lang: Lang) {
  return ({
    uz: "LUXECORE | O'zbekistondagi premium onlayn do'kon",
    ru: 'LUXECORE | Премиум онлайн-магазин в Узбекистане',
    en: 'LUXECORE | Premium online store in Uzbekistan',
  })[lang];
}

function homeDescription(lang: Lang) {
  return ({
    uz: "LUXECORE - O'zbekistondagi premium onlayn do'kon. Eksklyuziv soatlar, sumkalar, parfyumeriya va aksessuarlarni buyurtma qiling.",
    ru: 'LUXECORE - премиум онлайн-магазин в Узбекистане. Эксклюзивные часы, сумки, парфюмерия и аксессуары.',
    en: 'LUXECORE is a premium online store in Uzbekistan. Exclusive watches, bags, perfume and accessories.',
  })[lang];
}

function categoriesLabel(lang: Lang) {
  return ({ uz: 'Kategoriyalar', ru: 'Категории', en: 'Categories' })[lang];
}

function productsLabel(lang: Lang) {
  return ({ uz: 'Mahsulotlar', ru: 'Товары', en: 'Products' })[lang];
}

function priceLabel(lang: Lang) {
  return ({ uz: 'Narxi', ru: 'Цена', en: 'Price' })[lang];
}

function relatedLabel(lang: Lang) {
  return ({ uz: "O'xshash mahsulotlar", ru: 'Похожие товары', en: 'Related products' })[lang];
}

function productsCountLabel(lang: Lang, count: number) {
  return ({ uz: `${count} ta mahsulot`, ru: `${count} товаров`, en: `${count} products` })[lang];
}

function renderNotFound(lang: Lang) {
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"><title>404 | LUXECORE</title><meta name="robots" content="noindex"></head><body><h1>404</h1><p><a href="${localizedUrl('/', lang)}">LUXECORE</a></p></body></html>`;
}

function getMockProducts() {
  return [
    {
      id: 1,
      name: { uz: 'Midnight Chronograph', ru: 'Midnight Chronograph', en: 'Midnight Chronograph' },
      price: 12500000,
      category: 'soatlar',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop',
      shortDescription: {
        uz: 'Tungi osmon ilhomi bilan yaratilgan, olmos qoplamali eksklyuziv soat.',
        ru: 'Эксклюзивные часы с алмазным покрытием.',
        en: 'Exclusive diamond-coated chronograph watch.',
      },
      specs: [],
    },
  ];
}

function getMockCategories() {
  return [
    { slug: 'soatlar', name: { uz: 'Soatlar', ru: 'Часы', en: 'Watches' }, description: { uz: 'Premium soatlar', ru: 'Премиум часы', en: 'Premium watches' } },
    { slug: 'sumkalar', name: { uz: 'Sumkalar', ru: 'Сумки', en: 'Bags' }, description: { uz: 'Italiya charmidan sumkalar', ru: 'Сумки из итальянской кожи', en: 'Italian leather bags' } },
    { slug: 'parfyumeriya', name: { uz: 'Parfyumeriya', ru: 'Парфюмерия', en: 'Perfume' }, description: { uz: 'Premium parfyumeriya', ru: 'Премиум парфюмерия', en: 'Premium perfume' } },
    { slug: 'aksessuarlar', name: { uz: 'Aksessuarlar', ru: 'Аксессуары', en: 'Accessories' }, description: { uz: 'Premium aksessuarlar', ru: 'Премиум аксессуары', en: 'Premium accessories' } },
  ];
}
