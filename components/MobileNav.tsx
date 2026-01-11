import React from 'react';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface MobileNavProps {
  onNavigateHome: () => void;
  onSearchClick: () => void;
  onProfileClick: () => void;
  onCartClick: () => void;
  onWishlistClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onNavigateHome, onSearchClick, onProfileClick, onCartClick, onWishlistClick }) => {
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900/95 backdrop-blur-xl border-t border-white/10 px-2 py-3 z-40 flex justify-between items-center safe-pb">
       <button onClick={onNavigateHome} className="flex-1 flex flex-col items-center gap-1 text-gray-400 hover:text-gold-400 transition-colors">
         <Home size={20} strokeWidth={1.5} />
         <span className="text-[10px] font-medium">Asosiy</span>
       </button>
       
       <button onClick={onSearchClick} className="flex-1 flex flex-col items-center gap-1 text-gray-400 hover:text-gold-400 transition-colors">
         <Search size={20} strokeWidth={1.5} />
         <span className="text-[10px] font-medium">Qidiruv</span>
       </button>
       
       <button onClick={onWishlistClick} className="flex-1 relative flex flex-col items-center gap-1 text-gray-400 hover:text-gold-400 transition-colors">
         <div className="relative">
            <Heart size={20} strokeWidth={1.5} />
            {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-3.5 h-3.5 text-[9px] font-bold text-black bg-gold-400 rounded-full">
                {wishlist.length}
                </span>
            )}
         </div>
         <span className="text-[10px] font-medium">Sevimlilar</span>
       </button>

       <button onClick={onCartClick} className="flex-1 relative flex flex-col items-center gap-1 text-gray-400 hover:text-gold-400 transition-colors">
         <div className="relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-3.5 h-3.5 text-[9px] font-bold text-black bg-gold-400 rounded-full animate-bounce">
                {cartCount}
                </span>
            )}
         </div>
         <span className="text-[10px] font-medium">Savatcha</span>
       </button>
       
       <button onClick={onProfileClick} className="flex-1 flex flex-col items-center gap-1 text-gray-400 hover:text-gold-400 transition-colors">
         <User size={20} strokeWidth={1.5} />
         <span className="text-[10px] font-medium">Profil</span>
       </button>
    </div>
  );
};

export default MobileNav;