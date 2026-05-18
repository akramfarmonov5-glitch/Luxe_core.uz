# LUXECORE

Next.js 16 (App Router) + React 18 + Supabase asosidagi premium e-commerce loyiha.

## Stack

- **Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS, Framer Motion
- **State**: React Context (Auth, Cart, Wishlist, Global, Language, Theme, Toast)
- **DB / Auth**: Supabase (Postgres + Auth + RLS)
- **AI**: Google Gemini (`@google/genai`) — chat + opt-in TTS
- **Telegram**: alohida `bot/` paketi (Grammy.js, Render Web Service)
- **Deploy**: Vercel (frontend), Render (bot)

## Lokal ishga tushirish

1. `npm install`
2. `.env.local` faylini `.env.example` dan nusxalab to'ldiring
3. `npm run dev` — http://localhost:3000

## Environment variables

`.env.example` ga qarang. Asosiy o'zgaruvchilar:

### Public (client + server)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` — sayt URL (default: production Vercel domeni)

### Server-only
- `SUPABASE_SERVICE_ROLE_KEY` — server-side order creation + order tracking uchun
- `GEMINI_API_KEY` — AI chat uchun
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — buyurtma bildirishnoma uchun
- `TELEGRAM_INTERNAL_SECRET` — `/api/telegram` relay endpointidan ichki foydalanish kerak bo‘lsa
- `BOT_INTERNAL_SECRET` — Telegram botdan server-side checkout API’ga ishonchli ichki so‘rovlar uchun

### Optional (server alternatives)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` — `NEXT_PUBLIC_*` o'rniga server-side uchun

## NPM scripts

```bash
npm run dev        # Dev server
npm run build      # Production build
npm run start      # Production server (build dan keyin)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run audit:prod # Production dependencies audit
```

## Supabase

- Yangi baza uchun: `supabase_schema.sql`
- Mavjud bazani yangilash uchun: `supabase_fix_tables.sql`
- Review jadvali uchun: `supabase_reviews.sql`

### Admin foydalanuvchi yaratish

1. Supabase Auth orqali admin user yarating
2. SQL Editor da:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID');
```

Endi shu user `/admin` orqali email/parol bilan kirishi mumkin.

## Loyiha tuzilmasi

```
app/[lang]/            i18n routing (uz/ru/en) + sahifalar
app/api/*/             App Router API routes
app/sitemap.xml/       Dinamik sitemap
app/catalog.xml/       Google Merchant feed
components/            UI komponentlar + admin/ paneli
context/               React Context providerlar
lib/                   Helper modullar (Supabase, i18n, slug, SEO)
bot/                   Alohida Telegram bot loyihasi
```

## Deploy

- **Vercel** — frontend (avtomatik git push'da)
- **Render** — `bot/` (alohida Web Service)
