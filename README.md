# Habit Tracker

A React app built with Vite and Supabase. Supabase provides authentication and persistent storage for user habits.

## Local development

1. Create a Supabase project and run [`supabase/schema.sql`](./supabase/schema.sql) in its SQL Editor.
2. Copy `.env.example` to `.env` and fill in your Supabase project URL and anon/publishable key. Find both in the Supabase project API settings.
3. Install dependencies and start the app:

   ```sh
   npm install
   npm run dev
   ```

## Deploy to Vercel

1. Import this repository into Vercel. Vercel detects Vite; use `npm run build` as the build command and `dist` as the output directory.
2. In the Supabase project used by this deployment, run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL Editor if the habits table and its row-level security policies have not been created yet. The app's habit data is stored in this Supabase project, not in Vercel's filesystem.
3. In **Vercel → Project → Settings → Environment Variables**, add:
   - `VITE_HABIT_TRACKER_SUPABASE_URL`: the Supabase project URL
   - `VITE_HABIT_TRACKER_SUPABASE_ANON_KEY`: the Supabase anon/publishable key

   Set the variables for every environment where the app should work (Production, Preview, and/or Development). These `VITE_` variables are included in the browser build, so only use the public anon/publishable key—not a Supabase `service_role` key.
4. In Supabase **Authentication → URL Configuration**, set the Site URL to the deployed Vercel URL and add that URL (and any preview URLs you use) to the Redirect URLs allowlist.
5. Redeploy the Vercel project after setting or changing environment variables. Vite reads them during the build.

`vercel.json` routes browser-side paths back to the Vite app, so refreshing a route such as `/tracker` works on Vercel.

## Scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and build the production app
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally
