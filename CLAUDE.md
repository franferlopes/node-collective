# NODE Collective — Landing Page

## What this app does
Landing page for NODE, a student/alumni collective at IAAC Barcelona building autonomous surface vehicles (ASVs). Informational site with brand presentation, team, and contact info.

## Stack
Express.js + EJS + Neon PostgreSQL (static site, no DB queries needed).

## Directory map
- `server.js` — Express entry, mounts landing route, static assets, analytics
- `lib/landing-context.js` — render context for layout.ejs (CSS assets, analytics snippet)
- `views/layout.ejs` — full NODE landing page (Nav, Hero, About, Focus Areas, Team, Contact)
- `public/` — static assets (CSS lives here via landing-context)

## Database
No tables. Landing page is static. Neon DB provisioned for future use.

## External integrations
- Google Fonts (Space Grotesk)
- Polsia Analytics (beacon pixel injected via `buildAnalyticsSnippet`)

## Recent changes
- 2026-06-21 — Full NODE landing page built. Swiss International Typographic Style. Nav, Hero (ASV image bg), About (two-column), Focus Areas (3-card grid), Team photo, dark Contact/Footer. All brand assets embedded.