import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product, Category } from '../types';
import { Filter, X, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedProductsProps {
  products: Product[];
  categories: Category[];
  onNavigateToProduct: (id: number) => void;
  isLoading?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, categories, onNavigateToProduct, isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Derive active products based on filter
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="featured-products" className="py-12 md:py-24 bg-black scroll-mt-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header with Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-12 gap-4">
          <div className="space-y-2 w-full md:w-auto">
            <h2 className="text-2xl md:text-4xl font-bold">
              Premium <span className="text-gold-400">To'plam</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-md">
              Eksklyuziv dizayn va yuqori sifat uyg'unligi.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             {/* Search Input */}
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                    type="text"
                    placeholder="Qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-dark-800 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:border-gold-400 focus:outline-none transition-colors"
                />
             </div>

             <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-white/20 rounded-full text-white hover:bg-white/10 text-sm shrink-0"
             >
                <Filter size={16} />
                Filtr
             </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar Filter (Desktop) */}
          <div className="hidden md:block w-64 shrink-0 space-y-8 sticky top-28 h-fit">
             <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Filter size={18} className="text-gold-400"/>
                    Kategoriyalar
                </h3>
                <div className="space-y-2">
                    <button
                         onClick={() => setSelectedCategory('All')}
                         className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center ${selectedCategory === 'All' ? 'bg-gold-400 text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <span>Barchasi</span>
                        {selectedCategory === 'All' && <Check size={16} />}
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center ${selectedCategory === cat.name ? 'bg-gold-400 text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span>{cat.name}</span>
                            {selectedCategory === cat.name && <Check size={16} />}
                        </button>
                    ))}
                </div>
             </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-dark-800 rounded-xl h-[250px] md:h-[400px] animate-pulse border border-white/5"></div>
                    ))}
                </div>
            ) : (
                <>
                    {filteredProducts.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 text-lg">
                                {searchQuery ? "So'rovingiz bo'yicha mahsulotlar topilmadi." : "Ushbu kategoriyada mahsulotlar topilmadi."}
                            </p>
                            <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-4 text-gold-400 underline">
                                Barchasini ko'rish
                            </button>
                        </div>
                    ) : (
                        <motion.div 
                            layout
                            className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8"
                        >
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProductCard 
                                            product={product} 
                                            onNavigate={() => onNavigateToProduct(product.id)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] md:hidden bg-black/80 backdrop-blur-sm"
                onClick={() => setIsFilterOpen(false)}
            >
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-dark-900 border-r border-white/10 p-6"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white">Filtr</h3>
                        <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <button
                                onClick={() => { setSelectedCategory('All'); setIsFilterOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedCategory === 'All' ? 'bg-gold-400 text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                        >
                            Barchasi
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => { setSelectedCategory(cat.name); setIsFilterOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedCategory === cat.name ? 'bg-gold-400 text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedProducts;