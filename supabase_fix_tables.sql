-- FIX: Update hero_content ID type from bigint to text
-- Run this in Supabase SQL Editor

-- 1. Drop existing hero_content table if exists and recreate with text ID
DROP TABLE IF EXISTS public.hero_content CASCADE;

CREATE TABLE public.hero_content (
  id text NOT NULL PRIMARY KEY DEFAULT 'main',
  badge text,
  title text,
  description text,
  "buttonText" text,
  images text[],
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON public.hero_content FOR ALL USING (true);

-- 2. Create navigation_settings table (WAS MISSING!)
CREATE TABLE IF NOT EXISTS public.navigation_settings (
  id text NOT NULL PRIMARY KEY DEFAULT 'main',
  "menuItems" jsonb DEFAULT '[]'::jsonb,
  "socialLinks" jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.navigation_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON public.navigation_settings FOR ALL USING (true);

-- 3. Fix products table ID if needed (change from bigint to text)
-- First check if this needs to be done based on your current data
-- ALTER TABLE public.products ALTER COLUMN id TYPE text;
