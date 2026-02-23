import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { BlogPost } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post, onBack }) => {
  const { t } = useLanguage();
  return (
    <div className="pt-24 pb-20 min-h-screen bg-black text-white">
      <Helmet>
        <title>{post.title} | LUXECORE Blog</title>
        <meta name="description" content={post.seo?.description || post.content.substring(0, 160)} />
        <meta property="og:title" content={`${post.title} | LUXECORE`} />
        <meta property="og:description" content={post.seo?.description || post.content.substring(0, 160)} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/#blog/${post.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": [post.image],
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": "LUXECORE"
            },
            "publisher": {
              "@type": "Organization",
              "name": "LUXECORE",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.jpg`
              }
            },
            "description": post.seo?.description || post.content.substring(0, 160)
          })}
        </script>
      </Helmet>
      <article className="container mx-auto px-4 md:px-6 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>{t('common.back')}</span>
        </button>

        <div className="mb-8">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-3 block">{t('nav.blog')}</span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">{post.title}</h1>

          <div className="flex items-center gap-6 text-sm text-gray-400 border-b border-white/10 pb-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{t('blog.author')}</span>
            </div>
          </div>
        </div>

        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-10 bg-zinc-900 border border-white/10">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Share / Footer of post */}
        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
          <p className="text-gray-500 italic">{t('blog.thanks_for_reading')}</p>
          <button className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors">
            <Share2 size={18} />
            <span className="font-medium">{t('blog.share')}</span>
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogPostDetail;