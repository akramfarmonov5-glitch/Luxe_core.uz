'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CartSidebar from '../../components/CartSidebar';
import MobileNav from '../../components/MobileNav';
import SearchModal from '../../components/SearchModal';
import AuthModal from '../../components/AuthModal';
import AIChatAssistant from '../../components/AIChatAssistant';
import InstallPWA from '../../components/InstallPWA';
import MetaPixel from '../../components/MetaPixel';
import PushNotificationBanner from '../../components/PushNotificationBanner';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useGlobalData } from '../../context/GlobalContext';
import { usePathname, useRouter } from 'next/navigation';
import { productSlug } from '../../lib/slugify';

export default function ClientLayout({ children, lang }: { children: React.ReactNode, lang?: string }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toggleCart } = useCart();
  const { user } = useAuth();
  const { products, categories, navigationSettings } = useGlobalData();
  const pathname = usePathname() || '/';
  const router = useRouter();
  const langPrefix = `/${lang || 'uz'}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Telegram Mini App (WebApp) auto-expand & user prefill
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        tg.expand();
        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser?.first_name) {
          const existing = JSON.parse(localStorage.getItem('luxecore_customer_info') || '{}');
          if (!existing.firstName) {
            localStorage.setItem(
              'luxecore_customer_info',
              JSON.stringify({
                ...existing,
                firstName: tgUser.first_name,
                lastName: tgUser.last_name || existing.lastName || '',
              }),
            );
          }
        }
      } catch {
        // Ignore Telegram WebApp errors
      }
    }

    const hash = window.location.hash;
    if (hash && hash.startsWith('#product/')) {
      const id = hash.replace('#product/', '').trim();
      if (id) {
        router.replace(`${langPrefix}/product/${id}`);
      }
    } else if (hash && hash.startsWith('#category/')) {
      const slug = hash.replace('#category/', '').trim();
      if (slug) {
        router.replace(`${langPrefix}/category/${slug}`);
      }
    } else if (hash && hash.startsWith('#blog/')) {
      const id = hash.replace('#blog/', '').trim();
      if (id) {
        router.replace(`${langPrefix}/blog/${id}`);
      }
    }
  }, [langPrefix, router]);

  const isCheckout = pathname.includes('/checkout');
  const isAdmin = pathname.includes('/admin');
  const isTracking = pathname.includes('/tracking');
  const isBlogPost = pathname.includes('/blog/');
  const isWishlist = pathname.includes('/wishlist');
  const isProfile = pathname.includes('/profile');

  const hideNavAndFooter = isCheckout || isAdmin || isTracking;
  const hideFooter = hideNavAndFooter || isBlogPost || isWishlist;

  const navigateToHome = () => router.push(langPrefix);
  const navigateToProduct = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      router.push(`${langPrefix}/product/${productSlug(product, lang || 'uz')}`);
    }
  };
  const navigateToWishlist = () => router.push(`${langPrefix}/wishlist`);
  const navigateToTracking = () => router.push(`${langPrefix}/tracking`);
  const navigateToAdmin = () => router.push(`${langPrefix}/admin`);

  const handleProfileClick = () => {
    if (user) {
      router.push(`${langPrefix}/profile`);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <MetaPixel />
      
      {!hideNavAndFooter && (
        <Navbar
          onNavigateHome={navigateToHome}
          navigationSettings={navigationSettings}
          onProfileClick={handleProfileClick}
          onSearchClick={() => setIsSearchOpen(true)}
          onWishlistClick={navigateToWishlist}
          onTrackingClick={navigateToTracking}
        />
      )}

      {children}

      {!isAdmin && <CartSidebar onCheckout={() => router.push(`${langPrefix}/checkout`)} />}

      {!hideNavAndFooter && (
        <MobileNav
          onNavigateHome={navigateToHome}
          onCartClick={toggleCart}
          onSearchClick={() => setIsSearchOpen(true)}
          onProfileClick={handleProfileClick}
          onWishlistClick={navigateToWishlist}
        />
      )}

      <AIChatAssistant products={products} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        categories={categories}
        onNavigateToProduct={navigateToProduct}
      />

      {!hideFooter && (
        <Footer onAdminClick={navigateToAdmin} />
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <InstallPWA />
      <PushNotificationBanner />
    </>
  );
}
