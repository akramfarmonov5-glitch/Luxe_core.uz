import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X, ChevronRight, Instagram, Send, Facebook, Youtube, Twitter, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { NavigationSettings } from '../types';
import { DEFAULT_NAVIGATION } from '../constants';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onNavigateHome: () => void;
  onCategorySelect: (categoryName: string) => void;
  navigationSettings?: NavigationSettings;
  onProfileClick?: () => void;
  onSearchClick?: () => void;
  onWishlistClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigateHome, onCategorySelect, navigationSettings = DEFAULT_NAVIGATION, onProfileClick, onSearchClick, onWishlistClick }) => {
  const { cartCount, toggleCart } = useCart();
  const { wishlist } = useWishlist();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileLinkClick = (label: string) => {
    onCategorySelect(label);
    setIsMobileMenuOpen(false);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram size={20} />;
      case 'telegram': return <Send size={20} />;
      case 'facebook': return <Facebook size={20} />;
      case 'youtube': return <Youtube size={20} />;
      case 'twitter': return <Twitter size={20} />;
      default: return <Instagram size={20} />;
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 bg-dark-900/80 backdrop-blur-md border-b border-white/10"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-white hover:text-gold-400 transition-colors p-1"
          >
            <Menu size={24} />
          </button>
          <button onClick={onNavigateHome} className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-wider text-white">
            <img src="/logo.jpg" alt="LUXECORE" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" />
            LUXE<span className="text-gold-400">CORE</span>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-gray-300">
          {navigationSettings.menuItems.map((link) => (
            <button key={link.id} onClick={() => onCategorySelect(link.label)} className="hover:text-gold-400 transition-colors">
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Icons (Hidden on Mobile as we have Bottom Nav) */}
        <div className="hidden md:flex items-center gap-6 text-white">
          <button onClick={onSearchClick} className="hover:text-gold-400 transition-colors">
            <Search size={22} strokeWidth={1.5} />
          </button>

          <button onClick={onWishlistClick} className="relative hover:text-gold-400 transition-colors">
            <Heart size={22} strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-black bg-gold-400 rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>

          <button onClick={onProfileClick} className="hover:text-gold-400 transition-colors">
            <User size={22} strokeWidth={1.5} />
          </button>

          <button
            onClick={toggleCart}
            className="relative cursor-pointer group hover:text-gold-400 transition-colors"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-black bg-gold-400 rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            <button
              onClick={() => setLanguage('uz')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'uz' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              UZ
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'ru' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              RU
            </button>
          </div>
        </div >

        {/* Mobile Spacer (for logo centering on mobile if needed) */}
        < div className="md:hidden w-8" ></div >
      </motion.nav >

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {
          isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm md:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-dark-900 border-r border-white/10 z-[70] p-6 flex flex-col md:hidden"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold tracking-wider text-white">
                    LUXE<span className="text-gold-400">CORE</span>
                  </h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {navigationSettings.menuItems.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleMobileLinkClick(link.label)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 text-left text-white transition-colors group"
                    >
                      <span className="font-medium">{link.label}</span>
                      <ChevronRight size={16} className="text-gray-500 group-hover:text-gold-400" />
                    </button>
                  ))}
                </div>

                {/* Social Media & Footer Info */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Til / Язык</p>
                    <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                      <button
                        onClick={() => setLanguage('uz')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'uz' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'}`}
                      >
                        UZ
                      </button>
                      <button
                        onClick={() => setLanguage('ru')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'ru' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'}`}
                      >
                        RU
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mb-4 uppercase tracking-widest font-semibold">{t('footer.follow_us')}</p>
                  <div className="flex gap-4 mb-8">
                    {navigationSettings.socialLinks.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gold-400 hover:text-black transition-all"
                      >
                        {getSocialIcon(social.platform)}
                      </a>
                    ))}
                  </div>

                  <p className="text-gray-600 text-xs text-center">
                    &copy; 2026 LUXECORE. <br /> Premium Shopping Experience.
                  </p>
                </div>
              </motion.div>
            </>
          )
        }
      </AnimatePresence >
    </>
  );
};

export default Navbar;