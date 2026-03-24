-- =====================================================
-- LUXECORE Add Username Column
-- Run this in Supabase SQL Editor to add username support
-- =====================================================

alter table public.bot_users add column if not exists username text;
