import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import { Product, Category } from '../types';
import * as fpixel from '../lib/fpixel';
import { useLanguage } from '../context/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onNavigateToProduct: (id: number) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, products, categories, onNavigateToProduct }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const filteredProducts = query.trim()
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  const filteredCategories = query.trim()
    ? categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Track search event (debounced)
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      fpixel.trackSearch(query.trim(), filteredProducts.length);
    }, 800);
    return () => clearTimeout(timer);
  }, [query, filteredProducts.length]);

  // Popular searches suggestions
  const suggestions = [t('search.suggest_1', 'Soatlar'), t('search.suggest_2', 'Sumkalar'), t('search.suggest_3', 'Titan'), t('search.suggest_4', 'Sovg\'a')];

  const handleProductClick = (id: number) => {
    onNavigateToProduct(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 md:pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-dark-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header / Input */}
            <div className="flex items-center gap-4 p-6 border-b border-white/10">
              <Search className="text-gold-400" size={24} />
              <input
                ref={inputRef}
                type="text"
                placeholder={t('common.search')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-xl text-white placeholder:text-gray-600 focus:outline-none"
              />
              <button
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {!query.trim() && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp size={14} /> {t('search.popular')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(item)}
                        className="px-4 py-2 bg-white/5 hover:bg-gold-400/10 hover:text-gold-400 border border-white/5 rounded-full text-sm text-gray-300 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && (
                <div className="space-y-8">
                  {filteredProducts.length === 0 && filteredCategories.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      {t('search.no_results')}
                    </div>
                  )}

                  {/* Categories */}
                  {filteredCategories.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('footer.categories')}</h3>
                      <div className="space-y-2">
                        {filteredCategories.map(cat => (
                          <div key={cat.id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer group">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800">
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-white font-medium group-hover:text-gold-400 transition-colors">{cat.name}</span>
                            <ArrowRight size={16} className="ml-auto text-gray-600 group-hover:text-gold-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {filteredProducts.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('featured.title')}</h3>
                      <div className="space-y-2">
                        {filteredProducts.map(product => (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors"
                          >
                            <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-800 border border-white/5">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium group-hover:text-gold-400 transition-colors">{product.name}</h4>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-gold-400">{product.formattedPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 text-center text-xs text-gray-500">
              <span className="hidden md:inline">{t('search.shortcuts')}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;