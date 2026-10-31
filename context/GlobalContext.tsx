'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, HeroContent, NavigationSettings, BlogPost } from '../types';
import { DEFAULT_HERO_CONTENT, DEFAULT_NAVIGATION } from '../constants';
import { fetchGlobalData, type GlobalData } from '../lib/globalData';
import { supabase } from '../lib/supabaseClient';

async function triggerServerRevalidate() {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Ignore background revalidation errors
  }
}

interface GlobalContextType {
  products: Product[];
  categories: Category[];
  heroContent: HeroContent;
  navigationSettings: NavigationSettings;
  blogPosts: BlogPost[];
  isLoading: boolean;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setHeroContent: React.Dispatch<React.SetStateAction<HeroContent>>;
  setNavigationSettings: React.Dispatch<React.SetStateAction<NavigationSettings>>;
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const useGlobalData = () => useContext(GlobalContext);

interface GlobalProviderProps {
  children: React.ReactNode;
  initialData?: GlobalData | null;
}

export function GlobalProvider({ children, initialData }: GlobalProviderProps) {
  const [products, setProductsState] = useState<Product[]>(initialData?.products ?? []);
  const [categories, setCategoriesState] = useState<Category[]>(initialData?.categories ?? []);
  const [heroContent, setHeroContentState] = useState<HeroContent>(initialData?.heroContent ?? DEFAULT_HERO_CONTENT);
  const [navigationSettings, setNavigationSettingsState] = useState<NavigationSettings>(initialData?.navigationSettings ?? DEFAULT_NAVIGATION);
  const [blogPosts, setBlogPostsState] = useState<BlogPost[]>(initialData?.blogPosts ?? []);
  const [isLoading, setIsLoading] = useState(!initialData);

  const setProducts = useCallback((val: React.SetStateAction<Product[]>) => {
    setProductsState(val);
    void triggerServerRevalidate();
  }, []);

  const setCategories = useCallback((val: React.SetStateAction<Category[]>) => {
    setCategoriesState(val);
    void triggerServerRevalidate();
  }, []);

  const setHeroContent = useCallback((val: React.SetStateAction<HeroContent>) => {
    setHeroContentState(val);
    void triggerServerRevalidate();
  }, []);

  const setNavigationSettings = useCallback((val: React.SetStateAction<NavigationSettings>) => {
    setNavigationSettingsState(val);
    void triggerServerRevalidate();
  }, []);

  const setBlogPosts = useCallback((val: React.SetStateAction<BlogPost[]>) => {
    setBlogPostsState(val);
    void triggerServerRevalidate();
  }, []);

  useEffect(() => {
    // Server layout initialData bergan bo'lsa, klientda qayta yuklash shart emas
    if (initialData) return;

    const fetchData = async () => {
      try {
        const data = await fetchGlobalData();
        setProductsState(data.products);
        setCategoriesState(data.categories);
        setHeroContentState(data.heroContent);
        setNavigationSettingsState(data.navigationSettings);
        setBlogPostsState(data.blogPosts);
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
