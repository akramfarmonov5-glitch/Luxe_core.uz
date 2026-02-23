import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import CategoryGrid from './components/CategoryGrid';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import AIChatAssistant from './components/AIChatAssistant';
import MobileNav from './components/MobileNav';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import OrderTracker from './components/OrderTracker';
import BlogGrid from './components/BlogGrid';
import BlogPostDetail from './components/BlogPostDetail';
import Wishlist from './components/Wishlist';
import MetaPixel from './components/MetaPixel';
import SearchModal from './components/SearchModal';
import TelegramPopup from './components/TelegramPopup';
import SaleBanner from './components/SaleBanner';
import InstagramFeed from './components/InstagramFeed';
import PushNotificationManager from './components/PushNotificationManager';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, DEFAULT_HERO_CONTENT, DEFAULT_NAVIGATION } from './constants';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { supabase } from './lib/supabaseClient';
import { BlogPost, Category, HeroContent, NavigationSettings, Product } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

type Route =
  | { name: 'HOME' }
  | { name: 'PRODUCT', productId: number }
  | { name: 'CHECKOUT' }
  | { name: 'ADMIN' }
  | { name: 'TRACKING' }
  | { name: 'WISHLIST' }
  | { name: 'BLOG_POST', postId: string };

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [currentRoute, setCurrentRoute] = useState<Route>({ name: 'HOME' });
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO_CONTENT);
  const [navigationSettings, setNavigationSettings] = useState<NavigationSettings>(DEFAULT_NAVIGATION);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: '2026-yilgi Premium Soatlar Trendi',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop',
      content: 'Bu yil minimalizm va retro uslubining qaytishi kuzatilmoqda. Hashamatli brendlar yupqa korpuslar va klassik dizaynlarga urg\'u bermoqda. Ranglar palitrasi ko\'proq to\'q ko\'k, yashil va metall tuslarda namoyon bo\'lmoqda.\n\nShuningdek, mexanik soatlar yana urfga kirmoqda. Raqamli texnologiyalar davrida klassik mexanika o\'zining qadrini yo\'qotgani yo\'q, aksincha, haqiqiy san\'at asari sifatida qadrlanmoqda.',
      seo: { title: 'Premium Soatlar 2026', description: 'Eng so\'nggi soat modasi haqida bilib oling.', keywords: ['soat', 'moda', '2026'] },
      date: '2025-05-10'
    },
    {
      id: '2',
      title: 'Charm Sumkalar: Sifat va Uslub',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
      content: 'Haqiqiy charm sumka nafaqat aksessuar, balki investitsiyadir. Italiya charm maktabining an\'analari zamonaviy texnologiyalar bilan uyg\'unlashib, uzoq yillar xizmat qiladigan san\'at asarlarini yaratmoqda.\n\nSifatli charm vaqt o\'tishi bilan yanada chiroyli tusga kiradi. Bu mavsumda katta o\'lchamli va funksional sumkalar trendda.',
      seo: { title: 'Charm Sumkalar 2026', description: 'Sifatli sumka tanlash sirlari.', keywords: ['sumka', 'charm', 'italiya'] },
      date: '2025-05-12'
    }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminAuthLoading, setIsAdminAuthLoading] = useState(true);
  const { toggleCart } = useCart();

  const isAllowedAdmin = (user: any) => {
    if (!user) return false;
    const email = user.email as string | undefined;
    const isRoleAdmin = user.app_metadata?.role === 'admin';
    const env = import.meta.env || {};
    const raw = env.VITE_ADMIN_EMAILS || '';
    const allowedEmails = raw
      .split(',')
      .map((item: string) => item.trim().toLowerCase())
      .filter(Boolean);

    if (allowedEmails.length === 0) {
      return isRoleAdmin;
    }

    return isRoleAdmin || (email ? allowedEmails.includes(email.toLowerCase()) : false);
  };

  useEffect(() => {
    const initAdminSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Admin session read error:', error);
          setIsAdminAuthenticated(false);
          return;
        }

        const user = data.session?.user;
        setIsAdminAuthenticated(Boolean(user && isAllowedAdmin(user)));
      } catch (error) {
        console.error('Admin auth init error:', error);
        setIsAdminAuthenticated(false);
      } finally {
        setIsAdminAuthLoading(false);
      }
    };

    initAdminSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setIsAdminAuthenticated(Boolean(user && isAllowedAdmin(user)));
      setIsAdminAuthLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Sync state to URL Hash
  useEffect(() => {
    let hash = '';
    switch (currentRoute.name) {
      case 'HOME': hash = ''; break;
      case 'PRODUCT': hash = `#product/${currentRoute.productId}`; break;
      case 'BLOG_POST': hash = `#blog/${currentRoute.postId}`; break;
      case 'CHECKOUT': hash = '#checkout'; break;
      case 'ADMIN': hash = '#admin'; break;
      case 'TRACKING': hash = '#tracking'; break;
      case 'WISHLIST': hash = '#wishlist'; break;
    }

    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash || '/');
    }
  }, [currentRoute]);

  // Handle Home Section Hashes
  useEffect(() => {
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash === '#shop') {
        setTimeout(() => {
          document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      } else if (hash === '#blog-section') {
        setTimeout(() => {
          document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    };
    handleInitialHash();
  }, []);

  // Sync URL Hash to state (Initial load & Back button)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#') {
        setCurrentRoute({ name: 'HOME' });
      } else if (hash.startsWith('#product/')) {
        const id = Number(hash.replace('#product/', ''));
        if (!isNaN(id)) setCurrentRoute({ name: 'PRODUCT', productId: id });
      } else if (hash.startsWith('#blog/')) {
        const id = hash.replace('#blog/', '');
        setCurrentRoute({ name: 'BLOG_POST', postId: id });
      } else if (hash === '#checkout') {
        setCurrentRoute({ name: 'CHECKOUT' });
      } else if (hash === '#admin') {
        setCurrentRoute({ name: 'ADMIN' });
      } else if (hash === '#tracking') {
        setCurrentRoute({ name: 'TRACKING' });
      } else if (hash === '#wishlist') {
        setCurrentRoute({ name: 'WISHLIST' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const env = import.meta.env || {};
        if (!env.VITE_SUPABASE_URL) {
          console.warn("Supabase credentials missing, using mock data.");
          setProducts(MOCK_PRODUCTS);
          setCategories(MOCK_CATEGORIES);
          setIsLoading(false);
          return;
        }

        // Fetch products
        try {
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('*');

          if (!productError && productData && productData.length > 0) {
            const normalizedProducts = productData
              .map((item: any) => ({
                ...item,
                id: Number(item.id),
              }))
              .filter((item: any) => Number.isFinite(item.id));
            setProducts(normalizedProducts as Product[]);
          } else {
            if (productError) console.warn('Products fetch error:', productError.message);
            setProducts(MOCK_PRODUCTS);
          }
        } catch (e) {
          console.warn('Products fetch failed:', e);
          setProducts(MOCK_PRODUCTS);
        }

        // Fetch categories
        try {
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('*');

          if (!categoryError && categoryData && categoryData.length > 0) {
            setCategories(categoryData as Category[]);
          } else {
            if (categoryError) console.warn('Categories fetch error:', categoryError.message);
            setCategories(MOCK_CATEGORIES);
          }
        } catch (e) {
          console.warn('Categories fetch failed:', e);
          setCategories(MOCK_CATEGORIES);
        }

        // Fetch hero content
        try {
          const { data: heroData } = await supabase
            .from('hero_content')
            .select('*')
            .single();

          if (heroData) {
            setHeroContent(heroData as HeroContent);
          }
        } catch (e) {
          console.warn('Hero content fetch failed:', e);
        }

        // Fetch blog posts
        try {
          const { data: blogData } = await supabase
            .from('blog_posts')
            .select('*')
            .order('date', { ascending: false });

          if (blogData && blogData.length > 0) {
            setBlogPosts(blogData as BlogPost[]);
          }
        } catch (e) {
          console.warn('Blog posts fetch failed:', e);
        }

        // Fetch navigation settings
        try {
          const { data: navData } = await supabase
            .from('navigation_settings')
            .select('*')
            .single();

          if (navData) {
            setNavigationSettings(navData as NavigationSettings);
          }
        } catch (e) {
          console.warn('Navigation settings fetch failed:', e);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts(MOCK_PRODUCTS);
        setCategories(MOCK_CATEGORIES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateToHome = () => {
    setCurrentRoute({ name: 'HOME' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (id: number) => {
    setCurrentRoute({ name: 'PRODUCT', productId: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCheckout = () => {
    setCurrentRoute({ name: 'CHECKOUT' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setCurrentRoute({ name: 'ADMIN' });
  };

  const navigateToTracking = () => {
    setCurrentRoute({ name: 'TRACKING' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToWishlist = () => {
    setCurrentRoute({ name: 'WISHLIST' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBlogPost = (id: string) => {
    setCurrentRoute({ name: 'BLOG_POST', postId: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const element = document.getElementById('featured-products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#shop');
    }
  };

  const handleAdminLogin = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return error.message || t('admin.login_error');
    }

    const { data } = await supabase.auth.getSession();
    const authUser = data.session?.user;
    if (!isAllowedAdmin(authUser)) {
      await supabase.auth.signOut();
      return t('admin.no_access');
    }

    return null;
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminAuthenticated(false);
    navigateToHome();
  };

  const renderContent = () => {
    if (currentRoute.name === 'ADMIN') {
      if (isAdminAuthLoading) {
        return (
          <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
            {t('common.checking')}
          </div>
        );
      }

      if (!isAdminAuthenticated) {
        return (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={navigateToHome}
          />
        );
      }

      return (
        <AdminLayout
          onLogout={handleAdminLogout}
          products={products}
          setProducts={setProducts}
          categories={categories}
          setCategories={setCategories}
          heroContent={heroContent}
          setHeroContent={setHeroContent}
          navigationSettings={navigationSettings}
          setNavigationSettings={setNavigationSettings}
          blogPosts={blogPosts}
          setBlogPosts={setBlogPosts}
        />
      );
    }

    if (currentRoute.name === 'CHECKOUT') {
      return <Checkout onBack={navigateToHome} />;
    }

    if (currentRoute.name === 'TRACKING') {
      return <OrderTracker onBack={navigateToHome} />;
    }

    if (currentRoute.name === 'WISHLIST') {
      return <Wishlist onBack={navigateToHome} onNavigateToProduct={navigateToProduct} />;
    }

    if (currentRoute.name === 'PRODUCT') {
      const product = products.find(p => p.id === currentRoute.productId);
      if (product) {
        return (
          <ProductDetail
            product={product}
            allProducts={products}
            onProductSelect={navigateToProduct}
            onBack={navigateToHome}
            onCheckout={navigateToCheckout}
          />
        );
      }
      return (
        <div className="min-h-screen pt-24 pb-12 bg-black flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">{t('product.out_of_stock')}</h2>
          <p className="text-gray-400 mb-8">{t('featured.no_products')}</p>
          <button onClick={navigateToHome} className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
            {t('checkout.back_home')}
          </button>
        </div>
      );
    }

    if (currentRoute.name === 'BLOG_POST') {
      const post = blogPosts.find(p => p.id === currentRoute.postId);
      if (post) {
        return <BlogPostDetail post={post} onBack={navigateToHome} />;
      }
    }

    return (
      <main className="pb-20">
        <Hero
          content={heroContent}
          onShopClick={() => handleCategorySelect('All')}
          onMoreClick={() => {
            const blogSection = document.getElementById('blog-section');
            if (blogSection) {
              blogSection.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', '#blog-section');
            }
          }}
        />
        <CategoryGrid
          categories={categories}
          onSelectCategory={handleCategorySelect}
        />
        <InstagramFeed />
        <PushNotificationManager />
        <SaleBanner onShopNow={() => handleCategorySelect('All')} />
        <FeaturedProducts
          products={products}
          categories={categories}
          onNavigateToProduct={navigateToProduct}
          isLoading={isLoading}
          initialCategory={selectedCategory}
        />
        <BlogGrid posts={blogPosts} onPostClick={navigateToBlogPost} />
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-400 selection:text-black">
      <Helmet>
        <title>LUXECORE | Premium Store</title>
        <meta name="description" content={t('footer.about')} />
      </Helmet>
      <MetaPixel />
      {currentRoute.name !== 'CHECKOUT' && currentRoute.name !== 'ADMIN' && currentRoute.name !== 'TRACKING' && (
        <Navbar
          onNavigateHome={navigateToHome}
          onCategorySelect={handleCategorySelect}
          navigationSettings={navigationSettings}
          onProfileClick={navigateToTracking}
          onSearchClick={() => setIsSearchOpen(true)}
          onWishlistClick={navigateToWishlist}
        />
      )}

      {renderContent()}

      {currentRoute.name !== 'ADMIN' && <CartSidebar onCheckout={navigateToCheckout} />}

      {currentRoute.name !== 'CHECKOUT' && currentRoute.name !== 'ADMIN' && currentRoute.name !== 'TRACKING' && (
        <MobileNav
          onNavigateHome={navigateToHome}
          onCartClick={toggleCart}
          onSearchClick={() => setIsSearchOpen(true)}
          onProfileClick={navigateToTracking}
          onWishlistClick={navigateToWishlist}
        />
      )}

      <AIChatAssistant products={products} />

      <TelegramPopup />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        categories={categories}
        onNavigateToProduct={navigateToProduct}
      />

      {currentRoute.name !== 'CHECKOUT' && currentRoute.name !== 'ADMIN' && currentRoute.name !== 'TRACKING' && currentRoute.name !== 'BLOG_POST' && currentRoute.name !== 'WISHLIST' && (
        <Footer
          onAdminClick={navigateToAdmin}
          onCategorySelect={handleCategorySelect}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <LanguageProvider>
              <AppContent />
            </LanguageProvider>
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </HelmetProvider>
  );
};

export default App;
