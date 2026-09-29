# C and B Potted Plants

Next.js + Supabase site for the shop. Public pages are pre-rendered static HTML with their own URL, metadata and structured data; products, reviews, photos and Google sign-in live in Supabase.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase URL and publishable key
npm run dev                  # http://localhost:3000
```

## Common tasks

| Task | How |
|---|---|
| Add / edit products | Sign in with Google → avatar menu → **Seller dashboard** (`/seller`) |
| Add team members | Admins: `/seller/team` → add their Google email as Seller or Admin |
| Change phone, email, socials | `src/lib/site.ts` |
| Shrink photos bundled with the site | Put originals in the project root, run `npm run images` |
| Production build | `npm run build && npm start` |

**Roles:** customers can review; sellers add products and edit their own; admins edit everything and manage the team. These rules are enforced by the database (Row Level Security in `supabase/migrations/0001_init.sql`), not just the UI.

`test 7.html` is the old single-page version, kept for reference only.

## Database setup (once per Supabase project)

In Supabase → SQL Editor, run `supabase/migrations/0001_init.sql`, then `0002_seed.sql`.

## Deploy (Vercel)

1. Push this folder to a GitHub repository.
2. Import it at vercel.com → New Project.
3. Add environment variables: `NEXT_PUBLIC_SITE_URL` (live domain), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Add the domain under Project → Domains. In Supabase → Authentication → URL Configuration, set Site URL to the domain and add `https://<domain>/**` to Redirect URLs.
5. In Google Search Console, verify the domain (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) and submit `https://<domain>/sitemap.xml`.
