# Onboarding

A minimal Next.js app with:

- **`/`** — email + password login page
- **`/users`** — protected page listing every user in the system

Frontend pages call Next.js API routes (`/api/auth/login`, `/api/auth/logout`, `/api/users`), which talk to Supabase. Auth uses Supabase Auth; the user list is fetched server-side with the Supabase Admin API (service-role key), so no extra database table is required.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), sign in, and create a new project.
2. In **Project Settings → API**, copy:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this secret — server-only)
3. Under **Authentication → Providers**, make sure **Email** is enabled. For quick local testing you can also disable "Confirm email" under **Authentication → Sign In / Providers → Email** so seeded/new users can log in immediately.

## 2. Configure environment variables

Copy the example file and fill in the three values from step 1:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`.env.local` is gitignored and must never be committed.

## 3. Install dependencies and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4. Seed sample users

With `.env.local` filled in, create 5 sample accounts (`alice@example.com` … `erin@example.com`, all with password `Password123!`):

```bash
npm run seed
```

The script (`scripts/seed-users.mjs`) uses the Supabase Admin API and is safe to re-run — it skips users that already exist. Log in with any of the seeded emails and that password.

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), import the repo as a new project (framework preset: Next.js).
3. Add the same three environment variables from `.env.local` in **Project Settings → Environment Variables**.
4. Deploy.

You (the account owner) need to do the actual GitHub push and Vercel project creation/login — those steps require your own credentials/accounts.

## Project structure

```
middleware.ts                  Redirects unauthenticated visitors away from /users
src/lib/supabase/client.ts     Browser Supabase client
src/lib/supabase/server.ts     Server Supabase client (Server Components/Route Handlers)
src/lib/supabase/admin.ts      Service-role client (server-only, used to list all users)
src/lib/supabase/middleware.ts Session refresh + route protection logic
src/app/page.tsx               Login page
src/app/api/auth/login         POST — signs in with email/password
src/app/api/auth/logout        POST — signs out
src/app/users/page.tsx         Protected users list page
src/app/api/users              GET — returns all users (requires auth)
scripts/seed-users.mjs         Seeds sample users via the Admin API
```
