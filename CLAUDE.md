# NODE Collective — Website

## What this app does
Website for NODE, a student/alumni collective at IAAC Barcelona building
autonomous surface vehicles (ASVs). Landing page plus a mission/news section
and a Support NODE page, with a password-gated admin for post content.

## Stack
Express.js + EJS + Neon PostgreSQL, deployed on Render at nodeengineering.club.

## Directory map
- `server.js` — Express entry, mounts all routes, sets `themeCSS` on `res.locals` for every view
- `routes/missions.js` — `GET /missions`, `GET /missions/:slug` (published posts only)
- `routes/admin.js` — `/admin/posts` CRUD, behind `lib/basic-auth.js`
- `lib/db.js` — shared `pg` Pool (null if `DATABASE_URL` unset)
- `lib/posts.js` — slugify/excerpt/date-format helpers
- `lib/landing-context.js` — render context for the landing page
- `views/layout.ejs` — landing page (Nav, Hero, About, Focus Areas, Team, Partners, Contact)
- `views/support.ejs` — Support NODE page
- `views/missions/` — mission list/detail templates
- `views/admin/` — admin post list + edit templates (intentionally utilitarian, doesn't match the marketing site)
- `views/partials/` — shared `nav.ejs`, `footer.ejs`, `logo.ejs`
- `public/css/site.css` — all site CSS (loaded via `themeCSS` in every view's `<head>`)

## Database
- `users` — created by `migrate.js`, currently unused.
- `posts` — `title, slug, body, cover_image_url, category (mission|press|update), published_at, created_at, updated_at`. `published_at IS NULL` = draft. Added 2026-09-12 (`migrations/1789222364304_add_posts_table.js`).

Neon project has two branches: `production` (wired to Render's `DATABASE_URL`)
and `development` (for local work — see README's "Database branches").

## External integrations
- Google Fonts (Space Grotesk)

## Recent changes
- 2026-06-21 — Full NODE landing page built. Swiss International Typographic Style. Nav, Hero (ASV image bg), About (two-column), Focus Areas (3-card grid), Team photo, dark Contact/Footer. All brand assets embedded.
- 2026-09-12 — Repo cleanup: removed leftover Polsia-platform scaffolding (analytics beacon, unused `openai` dep, unused Stripe/subscription columns on `users`, generic package/README naming), added `dotenv` + `.env.example` for local dev, removed stale `TODO.md`.
- 2026-09-12 — Phase 1 (per `WEBSITE-PLAN.md`): provisioned a real Neon database (production + development branches), extracted shared nav/footer partials and `public/css/site.css`, added the `posts` table, `/missions` list/detail, `/support` page (email CTA for now), and a Basic-Auth-gated `/admin/posts` CRUD. No posts seeded yet — pending real NJORD 2026 / Namibia copy.
