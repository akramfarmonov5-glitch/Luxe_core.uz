import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (categoryName: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory }) => {
  const { t } = useLanguage();
  const toCategorySlug = (value: string) => encodeURIComponent(
    value.trim().toLowerCase().replace(/\s+/g, '-')
  );

  return (
    <section className="py-12 md:py-20 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            {t('categories.title')}
          </h2>
          <p className="hidden md:block text-gray-400 text-sm max-w-xs text-right">
            {t('categories.subtitle')}
          </p>
        </div>

        {/* Mobile: grid-cols-3 (3 ustun), Tablet/Desktop: grid-cols-3/4 */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 auto-rows-[160px] md:auto-rows-[300px]">
          {/* Slice ko'paytirildi: 6 tagacha kategoriya sig'adi (1 ta katta + 5 ta kichik) */}
          {categories.slice(0, 6).map((category, index) => (
            <motion.a
              key={category.id}
              href={`/shop?category=${toCategorySlug(category.name)}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(category.name);
              }}
              className={`group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer border border-white/5 ${
                // 1-element (index 0) 2x2 joy egallaydi. 3 ustunli gridda bu 2/3 qismni oladi.
                index === 0 ? 'col-span-2 row-span-2' : 'col-span-1'
                }`}
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-3 md:p-8 flex flex-col justify-end items-start">
                <div className="transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-gold-400 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2 block">
                    {t('common.collection')}
                  </span>
                  {/* Matn o'lchamlari mobil uchun moslashtirildi */}
                  <h3 className={`font-bold text-white mb-1 md:mb-2 leading-tight ${index === 0 ? 'text-xl md:text-4xl' : 'text-xs md:text-2xl'}`}>
                    {category.name}
                  </h3>
                  <p className={`text-gray-300 text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 ${index === 0 ? 'max-w-md' : ''} ${index !== 0 && 'hidden md:block'}`}>
                    {category.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-white text-[10px] md:text-sm font-medium group-hover:text-gold-400 transition-colors">
                    <span className="hidden md:inline">{t('common.view')}</span>
                    <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-gold-400 group-hover:text-black transition-all">
                      <ArrowRight size={10} className="md:w-[14px] md:h-[14px]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
