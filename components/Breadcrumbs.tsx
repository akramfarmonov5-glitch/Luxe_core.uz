import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getLocalizedText } from '../lib/i18nUtils';

interface BreadcrumbsProps {
  items: { label: any; href?: string; onClick?: () => void; active?: boolean }[];
  onHomeClick?: () => void;
  homeHref?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onHomeClick, homeHref }) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();
  const resolvedHomeHref = homeHref || `/${lang}`;
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-sm mb-8 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
      <button
        type="button"
        onClick={() => window.history.back()}
        className={`flex items-center gap-1 transition-colors mr-3 px-2 py-1 rounded-md ${isDark ? 'text-gray-400 hover:text-white bg-white/5' : 'text-gray-600 hover:text-black bg-gray-100'}`}
      >
        <ArrowLeft size={14} />
        <span>{t('back_button') || 'Orqaga'}</span>
      </button>

      <Link
        href={resolvedHomeHref}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
          if (onHomeClick) {
            e.preventDefault();
            onHomeClick();
          }
        }}
        className="flex items-center gap-1 hover:text-gold-400 transition-colors"
      >
        <Home size={14} />
        <span>{t('breadcrumb_home')}</span>
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="mx-2 text-gray-700" />
          {item.active ? (
            <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
              {getLocalizedText(item.label, lang)}
            </span>
          ) : item.href ? (
            <Link
              href={item.href}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
              }}
              className="hover:text-gold-400 transition-colors"
            >
              {getLocalizedText(item.label, lang)}
            </Link>
          ) : (
            <button
              type="button"
              onClick={item.onClick}
              className="hover:text-gold-400 transition-colors"
            >
              {getLocalizedText(item.label, lang)}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;