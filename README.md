# NODE Collective — Website

Website for NODE, a student/alumni collective at IAAC Barcelona building
autonomous surface vehicles (ASVs). Express server, EJS templates, Neon
Postgres, deployed on Render at nodeengineering.club.

## Stack

- Node.js 20+, Express, EJS
- PostgreSQL (Neon), via `pg`
- Deployed on Render (`render.yaml`)

## Local Development

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (get it from the
   Render dashboard's env vars for this service, or point at a local/dev
   Postgres instance).
3. `npm run dev`
4. Visit `http://localhost:3000`

`npm run migrate` applies database migrations (creates the `users` table and
anything under `migrations/`). Not required for the current site — nothing
queries the DB yet.

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (required to boot the DB
  pool; the landing page itself doesn't query it yet)
- `PORT` — Server port (default: 3000)

## Endpoints

- `GET /` — Landing page (renders `views/layout.ejs`)
- `GET /health` — Health check (used by Render)

## Layout

```
views/
  layout.ejs           full landing page (entry point)
  partials/            reserved for shared nav/footer once more pages exist
public/
  css/                 stylesheets, served at /css/<file>
  images/              served images (partner logos, etc.)
lib/
  landing-context.js   builds the render context (theme CSS links)
images/, logos/         source assets (not served directly — copied into public/ as needed)
server.js              Express app
migrate.js             migration runner (run via `npm run migrate`)
migrations/            timestamped migration files (created as needed)
```

## Deployment

Configured for Render via `render.yaml`. `npm run build` runs migrations on
deploy. Custom domain (nodeengineering.club) is proxied through Cloudflare.

See `WEBSITE-PLAN.md` for the feature roadmap and build plan.
