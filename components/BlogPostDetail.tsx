import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { BlogPost } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedText } from '../lib/i18nUtils';

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
}

function renderInlineContent(text: string) {
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('[') && part.includes('](')) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, label, href] = match;
        const isExternal = href.startsWith('http');
        if (isExternal) {
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 underline font-medium transition-colors"
            >
              {label}
            </a>
          );
        }
        return (
          <Link
            key={i}
            href={href}
            className="text-gold-400 hover:text-gold-300 underline font-medium transition-colors"
          >
            {label}
          </Link>
        );
      }
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderMarkdownBlocks(content: string) {
  const blocks = content.split(/\n\s*\n/);

  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-xl md:text-2xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-gold-400 rounded-full inline-block" />
          <span>{renderInlineContent(trimmed.replace(/^###\s+/, ''))}</span>
        </h3>
      );
    }

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="text-2xl md:text-3xl font-bold text-white mt-10 mb-5 border-b border-white/10 pb-2">
          {renderInlineContent(trimmed.replace(/^##\s+/, ''))}
        </h2>
      );
    }

    const lines = trimmed.split('\n');
    const isList = lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('• '));
    if (isList) {
      return (
        <ul key={idx} className="space-y-2.5 my-4 pl-4 border-l-2 border-gold-400/30">
          {lines.map((line, lIdx) => {
            const itemText = line.replace(/^[-•]\s*/, '').trim();
            return (
              <li key={lIdx} className="text-gray-300 leading-relaxed flex items-start gap-2">
                <span className="text-gold-400 mt-1">•</span>
                <span>{renderInlineContent(itemText)}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <p key={idx} className="text-gray-300 text-base md:text-lg leading-relaxed mb-5">
        {renderInlineContent(trimmed)}
      </p>
    );
  });
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post, onBack }) => {
  const { lang } = useLanguage();
  const rawContent = getLocalizedText(post.content, lang);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: getLocalizedText(post.title, lang),
          url: shareUrl,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert("Maqola havolasi nusxalandi!");
      }
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-black text-white">
      <article className="container mx-auto px-4 md:px-6 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Ortga qaytish</span>
        </button>

        <div className="mb-8">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-3 block">B2B Ulgurji Blog</span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            {getLocalizedText(post.title, lang)}
          </h1>

          <div className="flex items-center gap-6 text-sm text-gray-400 border-b border-white/10 pb-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>LUXECORE.UZ (O'rikzor Ombori)</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-10 bg-zinc-900 border border-white/10">
          <Image
            src={post.image}
            alt={getLocalizedText(post.title, lang)}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          {renderMarkdownBlocks(rawContent)}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
          <p className="text-gray-500 italic">O'qiganingiz uchun rahmat. B2B savdo va ulgurji narxlar uchun LUXECORE ga murojaat qiling.</p>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
          >
            <Share2 size={18} />
            <span className="font-medium">Ulashish</span>
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogPostDetail;
