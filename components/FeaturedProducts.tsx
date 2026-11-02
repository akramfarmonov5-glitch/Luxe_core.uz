import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product, Category } from '../types';
import { Filter, X, Check, Search, Download, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getWholesaleUnitPrice } from '../context/CartContext';
import { ProductSkeleton } from './Skeleton';
import { getLocalizedText } from '../lib/i18nUtils';
import { getCategoryDisplayName, getCategorySlug, getProductCategoryKey } from '../lib/categoryUtils';
import { productSlug } from '../lib/slugify';

interface FeaturedProductsProps {
    products: Product[];
    categories: Category[];
    onNavigateToProduct: (id: number) => void;
    activeCategory?: string;
    isLoading?: boolean;
}

const PAGE_SIZE = 12;

const LOAD_MORE_LABELS: Record<string, string> = {
    uz: "Ko'proq ko'rish",
    ru: 'Показать ещё',
    en: 'Show more',
};

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, categories, onNavigateToProduct, activeCategory, isLoading }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Sync internal state with prop
    useEffect(() => {
        if (activeCategory) {
            setSelectedCategory(activeCategory);
        }
    }, [activeCategory]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCustomLogoOpen, setIsCustomLogoOpen] = useState(false);
    const [customForm, setCustomForm] = useState({
        name: '',
        phone: '',
        packageType: "Sovg'a qutisi / Yangi yil qutisi",
        quantity: '1 000 dona',
        notes: '',
    });
    const [customSubmitting, setCustomSubmitting] = useState(false);
    const [customSuccess, setCustomSuccess] = useState(false);
    const [customError, setCustomError] = useState('');

    const handleCustomLogoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCustomSubmitting(true);
        setCustomError('');
        try {
            const res = await fetch('/api/custom-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Xatolik');
            setCustomSuccess(true);
            setTimeout(() => {
                setIsCustomLogoOpen(false);
                setCustomSuccess(false);
                setCustomForm({ name: '', phone: '', packageType: "Sovg'a qutisi / Yangi yil qutisi", quantity: '1 000 dona', notes: '' });
            }, 2200);
        } catch (err: any) {
            setCustomError(err?.message || 'Xatolik yuz berdi');
        } finally {
            setCustomSubmitting(false);
        }
    };
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<string>('newest');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const { isDark } = useTheme();
    const { lang, t } = useLanguage();

    // Filtr o'zgarganda sahifalash boshiga qaytadi
    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [selectedCategory, searchQuery, sortOrder, minPrice, maxPrice]);

    // Derive active products based on filter and sorting
    const filteredProducts = products.filter(p => {
        const pCat = getProductCategoryKey(p.category, categories);
        const matchesCategory = selectedCategory === 'All' || pCat === selectedCategory;
        const pName = getLocalizedText(p.name, lang).toLowerCase();
        const pDesc = getLocalizedText(p.shortDescription, lang).toLowerCase();
        const matchesSearch = pName.includes(searchQuery.toLowerCase()) ||
            pDesc.includes(searchQuery.toLowerCase());
        const minP = minPrice ? parseInt(minPrice) : 0;
        const maxP = maxPrice ? parseInt(maxPrice) : Infinity;
        const matchesPrice = p.price >= minP && p.price <= maxP;
        return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
        if (sortOrder === 'price-asc') return a.price - b.price;
        if (sortOrder === 'price-desc') return b.price - a.price;
        return b.id - a.id; // default: newest
    });

    const handleDownloadPriceList = () => {
        if (!products || products.length === 0) return;
        const headers = [
            'ID',
            lang === 'ru' ? 'Наименование товара' : 'Mahsulot nomi',
            lang === 'ru' ? 'Категория' : 'Kategoriya',
            lang === 'ru' ? 'Мин. упаковка (шт)' : 'Min. pachka (dona)',
            lang === 'ru' ? 'Цена 100-499 шт (UZS)' : '100-499 dona narxi (UZS)',
            lang === 'ru' ? 'Цена 500-999 шт -5% (UZS)' : '500-999 dona -5% (UZS)',
            lang === 'ru' ? 'Цена 1000+ шт -10% VIP (UZS)' : '1000+ dona -10% VIP (UZS)',
            lang === 'ru' ? 'Сумма за 1 упаковку (UZS)' : '1 pachka summasi (UZS)',
            'URL',
        ];
        const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const rows = products.map((p) => {
            const name = getLocalizedText(p.name, lang);
            const cat = getCategoryDisplayName(p.category, categories, lang);
            const minPack = p.itemsPerPackage && p.itemsPerPackage > 1 ? p.itemsPerPackage : 100;
            const basePrice = Number(p.price || 0);
            const price500 = getWholesaleUnitPrice(basePrice, 500);
            const price1000 = getWholesaleUnitPrice(basePrice, 1000);
            const packTotal = basePrice * minPack;
            const url = `https://luxe-core.uz/${lang}/product/${productSlug(p, lang)}`;
            return [p.id, name, cat, minPack, basePrice, price500, price1000, packTotal, url].map(esc).join(';');
        });
        const csv = '\uFEFF' + [headers.map(esc).join(';'), ...rows].join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `LUXECORE_Optom_Prays_List_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <section id="featured-products" className={`py-12 md:py-24 scroll-mt-20 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-light-bg'}`}>
            <div className="container mx-auto px-4 md:px-6">

                {/* Header with Search and Filter */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-12 gap-4">
                    <div className="space-y-2 w-full md:w-auto">
                        <h2 className={`text-2xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-light-text'}`}>
                            {t('premium_collection').split(' ')[0]} <span className="text-gold-400">{t('premium_collection').split(' ')[1]}</span>
                        </h2>
                        <p className={`text-sm md:text-base max-w-md ${isDark ? 'text-gray-400' : 'text-light-muted'}`}>
                            {t('collection_desc')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => setIsCustomLogoOpen(true)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs md:text-sm font-bold border transition-all shrink-0 ${
                                isDark
                                    ? 'bg-white/5 border-white/15 text-white hover:border-gold-400 hover:text-gold-400'
                                    : 'bg-white border-light-border text-light-text hover:border-gold-500'
                            }`}
                        >
                            <Sparkles size={15} className="text-gold-400" />
                            <span>{lang === 'ru' ? 'Свой логотип (1000+)' : 'Logotip tushirish (1000+)'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleDownloadPriceList}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs md:text-sm font-bold bg-gold-400/15 border border-gold-400/30 text-gold-400 hover:bg-gold-400 hover:text-black transition-all shrink-0"
                        >
                            <Download size={15} />
                            <span>{lang === 'ru' ? 'Прайс-лист (Excel)' : 'Prays-list (Excel)'}</span>
                        </button>
                        {/* Search Input */}
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder={t('search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full border rounded-full pl-10 pr-4 py-2.5 text-sm focus:border-gold-400 focus:outline-none transition-colors ${isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-white border-light-border text-light-text'}`}
                            />
                        </div>

                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`md:hidden flex items-center gap-2 px-4 py-2.5 border rounded-full text-sm shrink-0 ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-light-border text-light-text hover:bg-light-card'}`}
                        >
                            <Filter size={16} />
                            {t('filter')}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                    {/* Sidebar Filter (Desktop) */}
                    <div className="hidden md:block w-64 shrink-0 sticky top-28 h-fit">
                        <div className="space-y-8">
                            {/* Categories */}
                            <div>
                                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-light-text'}`}>
                                    <Filter size={18} className="text-gold-400" />
                                    {t('footer_categories')}
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedCategory('All')}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center ${selectedCategory === 'All' ? 'bg-gold-400 text-black font-bold' : isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-light-muted hover:bg-light-card hover:text-light-text'}`}
                                    >
                                        <span>{t('all_categories')}</span>
                                        {selectedCategory === 'All' && <Check size={16} />}
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(getCategorySlug(cat))}
                                            className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm border ${selectedCategory === getCategorySlug(cat)
                                                    ? 'border-gold-400 bg-gold-400/10 text-gold-400'
                                                    : isDark
                                                        ? 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                                        : 'border-transparent text-light-muted hover:text-light-text hover:bg-light-card'
                                                }`}
                                        >
                                            {getLocalizedText(cat.name, lang)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-light-text'}`}>
                                    {t('sort_by')}
                                </h3>
                                <select 
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className={`w-full border rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-gold-400 transition-colors cursor-pointer ${isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-white border-light-border text-light-text'}`}
                                >
                                    <option value="newest">{t('sort_newest')}</option>
                                    <option value="price-asc">{t('sort_price_asc')}</option>
                                    <option value="price-desc">{t('sort_price_desc')}</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-light-text'}`}>
                                    {t('price_range')}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        placeholder={t('min_price')}
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className={`w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-gold-400 transition-colors ${isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-white border-light-border text-light-text'}`}
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input 
                                        type="number" 
                                        placeholder={t('max_price')}
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className={`w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-gold-400 transition-colors ${isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-white border-light-border text-light-text'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <>
                                {filteredProducts.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <p className="text-gray-500 text-lg">
                                            {searchQuery ? t('no_products_found') : t('no_products_found')}
                                        </p>
                                        <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-4 text-gold-400 underline">
                                            {t('view_all')}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <motion.div
                                            layout
                                            className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8"
                                        >
                                            <AnimatePresence>
                                                {filteredProducts.slice(0, visibleCount).map((product) => (
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
                                                            categories={categories}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </motion.div>
                                        {filteredProducts.length > visibleCount && (
                                            <div className="mt-8 md:mt-12 text-center">
                                                <button
                                                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                                                    className={`px-8 py-3 rounded-full border font-medium transition-all duration-300 ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-light-border text-light-text hover:bg-light-card'}`}
                                                >
                                                    {LOAD_MORE_LABELS[lang] || LOAD_MORE_LABELS.uz} ({filteredProducts.length - visibleCount})
                                                </button>
                                            </div>
                                        )}
                                    </>
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
                            className={`absolute left-0 top-0 bottom-0 w-[80%] max-w-sm border-r p-6 flex flex-col ${isDark ? 'bg-dark-900 border-white/10' : 'bg-white border-light-border'}`}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-light-text'}`}>{t('filter')}</h3>
                                <button onClick={() => setIsFilterOpen(false)} className={isDark ? 'text-gray-400 hover:text-white' : 'text-light-muted hover:text-light-text'}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-140px)] pr-2 custom-scrollbar">
                                {/* Categories */}
                                <div>
                                    <h4 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('footer_categories')}</h4>
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => { setSelectedCategory('All'); setIsFilterOpen(false); }}
                                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedCategory === 'All' ? 'bg-gold-400 text-black font-bold' : isDark ? 'text-gray-400 hover:bg-white/5' : 'text-light-muted hover:bg-light-card'}`}
                                        >
                                            {t('all_categories')}
                                        </button>
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => { setSelectedCategory(getCategorySlug(cat)); setIsFilterOpen(false); }}
                                                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedCategory === getCategorySlug(cat) ? 'bg-gold-400 text-black font-bold' : isDark ? 'text-gray-400 hover:bg-white/5' : 'text-light-muted hover:bg-light-card'}`}
                                            >
                                                {getCategoryDisplayName(cat.name, categories, lang)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <h4 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('sort_by')}</h4>
                                    <select 
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className={`w-full border rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-gold-400 transition-colors ${isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-white border-light-border text-light-text'}`}
                                    >
                                        <option value="newest">{t('sort_newest')}</option>
                                        <option value="price-asc">{t('sort_price_asc')}</option>
                                        <option value="price-desc">{t('sort_price_desc')}</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h4 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('price_range')}</h4>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            placeholder={t('min_price')}
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className={`w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-gold-400 transition-colors ${isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-white border-light-border text-light-text'}`}
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input 
                                            type="number" 
                                            placeholder={t('max_price')}
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className={`w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-gold-400 transition-colors ${isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-white border-light-border text-light-text'}`}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => setIsFilterOpen(false)}
                                        className="w-full mt-4 bg-gold-400 text-black font-bold py-3 rounded-xl hover:bg-gold-500"
                                    >
                                        {t('apply')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Logo B2B Order Modal */}
            <AnimatePresence>
                {isCustomLogoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCustomLogoOpen(false)}
                        className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
                                isDark ? 'bg-dark-900 border-white/15 text-white' : 'bg-white border-light-border text-light-text'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="text-gold-400" size={20} />
                                    <h3 className="text-lg font-bold">
                                        {lang === 'ru' ? 'Индивидуальный заказ с логотипом' : 'Logotip tushirish (Individual buyurtma)'}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCustomLogoOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {customSuccess ? (
                                <div className="py-8 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                                        <Check size={24} />
                                    </div>
                                    <h4 className="font-bold text-lg">
                                        {lang === 'ru' ? 'Заявка отправлена!' : "So'rovingiz qabul qilindi!"}
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                        {lang === 'ru'
                                            ? 'Наш B2B-менеджер свяжется с вами в течение 15 минут для расчета стоимости печати.'
                                            : "B2B menejerimiz 15 daqiqa ichida siz bilan bog'lanib, logotip bosish narxini hisoblab beradi."}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleCustomLogoSubmit} className="space-y-3.5">
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {lang === 'ru'
                                            ? 'Нанесение вашего логотипа и фирменного стиля на коробки, крафт-пакеты, Zip-Lock и стаканы (от 1000 шт).'
                                            : "Qutilar, kraft va Zip-Lock paketlar hamda kofe stakanlariga kompaniyangiz logotipini tushirib beramiz (minimal tiraj: 1000 dona)."}
                                    </p>

                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">
                                            {lang === 'ru' ? 'Ваше имя или название бренда *' : 'Ismingiz yoki Brend nomi *'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={customForm.name}
                                            onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                                            placeholder={lang === 'ru' ? 'Например: OOO Baraka / Сардор' : 'Masalan: Baraka Market / Sardor'}
                                            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:border-gold-400 focus:outline-none ${
                                                isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">
                                            {lang === 'ru' ? 'Телефон для связи *' : 'Telefon raqamingiz *'}
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={customForm.phone}
                                            onChange={(e) => setCustomForm({ ...customForm, phone: e.target.value })}
                                            placeholder="+998 90 123 45 67"
                                            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:border-gold-400 focus:outline-none ${
                                                isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'
                                            }`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">
                                                {lang === 'ru' ? 'Тип упаковки' : 'Qadoq turi'}
                                            </label>
                                            <select
                                                value={customForm.packageType}
                                                onChange={(e) => setCustomForm({ ...customForm, packageType: e.target.value })}
                                                className={`w-full rounded-xl border px-3 py-2.5 text-xs focus:border-gold-400 focus:outline-none ${
                                                    isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'
                                                }`}
                                            >
                                                <option value="Sovg'a qutisi / Yangi yil qutisi">{lang === 'ru' ? 'Подарочные коробки' : "Sovg'a / Bayram qutisi"}</option>
                                                <option value="Kraft paket (tutqichli)">{lang === 'ru' ? 'Крафт-пакеты' : 'Kraft paket'}</option>
                                                <option value="Zip-Lock / Kuryer paket">{lang === 'ru' ? 'Zip-Lock / Курьерские' : 'Zip-Lock / Kuryer paket'}</option>
                                                <option value="Kofe stakan / HoReCa">{lang === 'ru' ? 'Стаканы / HoReCa' : 'Kofe stakan / Idishlar'}</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">
                                                {lang === 'ru' ? 'Тираж (количество)' : 'Taxminiy soni (tiraj)'}
                                            </label>
                                            <select
                                                value={customForm.quantity}
                                                onChange={(e) => setCustomForm({ ...customForm, quantity: e.target.value })}
                                                className={`w-full rounded-xl border px-3 py-2.5 text-xs focus:border-gold-400 focus:outline-none ${
                                                    isDark ? 'bg-dark-800 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'
                                                }`}
                                            >
                                                <option value="1 000 dona">1 000 {lang === 'ru' ? 'шт' : 'dona'}</option>
                                                <option value="3 000 dona">3 000 {lang === 'ru' ? 'шт' : 'dona'}</option>
                                                <option value="5 000 dona">5 000 {lang === 'ru' ? 'шт' : 'dona'}</option>
                                                <option value="10 000+ dona">10 000+ {lang === 'ru' ? 'шт' : 'dona'}</option>
                                            </select>
                                        </div>
                                    </div>

                                    {customError && (
                                        <p className="text-xs text-red-400">{customError}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={customSubmitting}
                                        className="w-full py-3 rounded-xl bg-gold-400 text-black font-bold text-sm hover:bg-gold-500 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        <Send size={16} />
                                        <span>
                                            {customSubmitting
                                                ? (lang === 'ru' ? 'Отправка...' : 'Yuborilmoqda...')
                                                : (lang === 'ru' ? 'Запросить расчет стоимости' : 'Narx hisoblatish uchun yuborish')}
                                        </span>
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default FeaturedProducts;
