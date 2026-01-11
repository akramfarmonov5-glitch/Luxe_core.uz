import { createClient } from '@supabase/supabase-js';

// Universal Environment Variable o'quvchi (Vite + Node.js)
const getEnv = (key: string) => {
  // 1. Vite (Frontend) tekshiruvi
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  // 2. Node.js (Vercel Serverless Function) tekshiruvi
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return ''; // Agar topilmasa bo'sh qaytaradi
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_KEY');

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);