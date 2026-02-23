import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onNavigate: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const isLiked = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    if (!isLiked) {
      showToast(`${product.name} ${t('product.wishlist_added')}`, 'success');
    } else {
      showToast(`${product.name} ${t('product.wishlist_removed')}`, 'info');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    showToast(`${product.name} ${t('product.cart_added')}`, 'success');
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-dark-800 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 shadow-lg flex flex-col"
    >
      {/* Image Container */}
      <div
        onClick={onNavigate}
        className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Product Badges */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5 z-10">
          {product.stock !== undefined && product.stock > 15 && (
            <span className="bg-emerald-500 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-lg">
              🆕 {t('product.new')}
            </span>
          )}
          {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
            <span className="bg-orange-500 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-lg animate-pulse">
              🔥 {t('product.bestseller')}
            </span>
          )}
        </div>

        {/* Overlay Buttons - Mobile: Always visible (translate-x-0), Desktop: Visible on hover */}
        <div className="absolute top-2 right-2 md:top-3 md:right-3 flex flex-col gap-2 translate-x-0 md:translate-x-12 md:group-hover:translate-x-0 transition-transform duration-300 z-10">
          <button
            onClick={handleWishlistClick}
            className={`p-2 md:p-3 backdrop-blur-md rounded-full transition-all shadow-lg ${isLiked
              ? 'bg-gold-400 text-black scale-110'
              : 'bg-black/40 text-white hover:bg-gold-400 hover:text-black border border-white/10'
              }`}
          >
            <Heart size={16} className={`md:w-[18px] md:h-[18px] ${isLiked ? 'fill-black' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-6 flex flex-col flex-grow">
        <div className="flex-grow cursor-pointer" onClick={onNavigate}>
          <span className="text-[9px] md:text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
          <h3 className="text-sm md:text-lg font-medium text-white mt-0.5 md:mt-1 group-hover:text-gold-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-2 md:mt-4">
          <span className="text-gold-400 font-semibold text-xs md:text-lg">
            {product.formattedPrice}
          </span>

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-7 h-7 md:w-auto md:h-auto md:px-4 md:py-2 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-full text-sm font-medium transition-all duration-300"
            aria-label="Add to cart"
          >
            <Plus size={14} className="md:w-[16px] md:h-[16px]" />
            <span className="hidden md:inline">{t('product.add_to_cart')}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;