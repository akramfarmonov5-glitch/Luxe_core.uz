<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/17_gOT7TjykOgLd5zG0BV24FdRoERr0ML

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set env values in `.env.local`:
   - `VITE_GEMINI_API_KEY=...`
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_KEY=...`
   - `VITE_ADMIN_EMAILS=admin@example.com` (comma-separated if multiple)
3. Run the app:
   `npm run dev`

## Security Setup (Supabase)

1. Run `supabase_schema.sql` (base tables).
2. Run `supabase_fix_tables.sql` (hero/navigation fixes).
3. Run `supabase_security_patch.sql` (hardened RLS policies).
4. Ensure admin users have `app_metadata.role = "admin"` or email is in `VITE_ADMIN_EMAILS` / `ADMIN_EMAILS`.

## Server API Env (Vercel / Backend)

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY` (optional fallback)
- `ADMIN_EMAILS` (recommended)
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (optional order notifications)
