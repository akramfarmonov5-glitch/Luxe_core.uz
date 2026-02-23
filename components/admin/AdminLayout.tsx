import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, FileText, LogOut, Layers, Image as ImageIcon, Menu, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminOrders from './AdminOrders';
import AdminBlog from './AdminBlog';
import AdminHero from './AdminHero';
import AdminNavigation from './AdminNavigation';
import AdminLeads from './AdminLeads'; // New component
import { Product, Category, HeroContent, NavigationSettings, BlogPost } from '../../types';

interface AdminLayoutProps {
  onLogout: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  heroContent: HeroContent;
  setHeroContent: React.Dispatch<React.SetStateAction<HeroContent>>;
  navigationSettings?: NavigationSettings;
  setNavigationSettings?: React.Dispatch<React.SetStateAction<NavigationSettings>>;
  blogPosts?: BlogPost[];
  setBlogPosts?: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  onLogout,
  products,
  setProducts,
  categories,
  setCategories,
  heroContent,
  setHeroContent,
  navigationSettings,
  setNavigationSettings,
  blogPosts,
  setBlogPosts
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'leads' | 'blog' | 'hero' | 'navigation'>('dashboard');

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: t('admin.stats'), icon: LayoutDashboard },
    { id: 'orders', label: t('admin.orders'), icon: ShoppingCart },
    { id: 'leads', label: t('admin.leads'), icon: Users }, // New Tab
    { id: 'products', label: t('admin.products'), icon: Package },
    { id: 'categories', label: t('admin.categories'), icon: Layers },
    { id: 'blog', label: t('admin.blog_ai'), icon: FileText },
    { id: 'hero', label: t('admin.hero_banner'), icon: ImageIcon },
    { id: 'navigation', label: t('admin.navigation'), icon: Menu },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard products={products} />;
      case 'hero':
        return <AdminHero heroContent={heroContent} setHeroContent={setHeroContent} />;
      case 'navigation':
        if (navigationSettings && setNavigationSettings) {
          return (
            <AdminNavigation
              navigationSettings={navigationSettings}
              setNavigationSettings={setNavigationSettings}
              categories={categories}
            />
          );
        }
        return <div>Loading...</div>;
      case 'categories':
        return <AdminCategories categories={categories} setCategories={setCategories} />;
      case 'products':
        return <AdminProducts products={products} setProducts={setProducts} categories={categories} />;
      case 'orders':
        return <AdminOrders />;
      case 'leads': // New Case
        return <AdminLeads />;
      case 'blog':
        if (blogPosts && setBlogPosts) {
          return <AdminBlog posts={blogPosts} setPosts={setBlogPosts} />;
        }
        return <div>Blog posts loading...</div>;
      default:
        return <AdminDashboard products={products} />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-white/10 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-wider text-white">
            LUXE<span className="text-gold-400">ADMIN</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">{t('admin.console')}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span>{t('admin.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;