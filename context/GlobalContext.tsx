'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, HeroContent, NavigationSettings, BlogPost } from '../types';
import { DEFAULT_HERO_CONTENT, DEFAULT_NAVIGATION } from '../constants';
import { fetchGlobalData, type GlobalData } from '../lib/globalData';

interface GlobalContextType {
  products: Product[];
  categories: Category[];
  heroContent: HeroContent;
  navigationSettings: NavigationSettings;
  blogPosts: BlogPost[];
  isLoading: boolean;
  setProducts: (p: Product[]) => void;
  setCategories: (c: Category[]) => void;
  setHeroContent: (h: HeroContent) => void;
  setNavigationSettings: (n: NavigationSettings) => void;
  setBlogPosts: (b: BlogPost[]) => void;
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const useGlobalData = () => useContext(GlobalContext);

interface GlobalProviderProps {
  children: React.ReactNode;
  initialData?: GlobalData | null;
}

export function GlobalProvider({ children, initialData }: GlobalProviderProps) {
  const [products, setProducts] = useState<Product[]>(initialData?.products ?? []);
  const [categories, setCategories] = useState<Category[]>(initialData?.categories ?? []);
  const [heroContent, setHeroContent] = useState<HeroContent>(initialData?.heroContent ?? DEFAULT_HERO_CONTENT);
  const [navigationSettings, setNavigationSettings] = useState<NavigationSettings>(initialData?.navigationSettings ?? DEFAULT_NAVIGATION);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialData?.blogPosts ?? []);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    // Server layout initialData bergan bo'lsa, klientda qayta yuklash shart emas
    if (initialData) return;

    const fetchData = async () => {
      try {
        const data = await fetchGlobalData();
        setProducts(data.products);
        setCategories(data.categories);
        setHeroContent(data.heroContent);
        setNavigationSettings(data.navigationSettings);
        setBlogPosts(data.blogPosts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GlobalContext.Provider value={{
      products, categories, heroContent, navigationSettings, blogPosts, isLoading,
      setProducts, setCategories, setHeroContent, setNavigationSettings, setBlogPosts
    }}>
      {children}
    </GlobalContext.Provider>
  );
}
