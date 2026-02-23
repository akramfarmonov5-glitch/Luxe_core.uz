-- Product Reviews table for LuxeCore website
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    product_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (
        rating >= 1
        AND rating <= 5
    ),
    comment TEXT NOT NULL,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews
CREATE POLICY "Anyone can read reviews" ON public.product_reviews FOR
SELECT USING (true);

-- Allow anyone to insert reviews (public reviews)
CREATE POLICY "Anyone can insert reviews" ON public.product_reviews FOR
INSERT
WITH
    CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews (product_id);

CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON public.product_reviews (created_at DESC);

-- Promo codes table (if not exists)
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount INTEGER NOT NULL CHECK (
        discount >= 1
        AND discount <= 100
    ),
    expires_at TIMESTAMP
    WITH
        TIME ZONE,
        max_uses INTEGER,
        used_count INTEGER DEFAULT 0,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read promo codes" ON public.promo_codes FOR
SELECT USING (true);

CREATE POLICY "Service role can manage promo codes" ON public.promo_codes FOR ALL USING (true);