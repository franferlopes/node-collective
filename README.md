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
   Postgres instance — see "Database branches" below) and a value for
   `ADMIN_PASSWORD`.
3. `npm run migrate` to create/update tables.
4. `npm run dev`
5. Visit `http://localhost:3000`

### Database branches

The Neon project has two branches: `production` (wired to Render) and
`development`. Point your local `.env` at the `development` branch's
connection string so local testing never touches live site data.

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (required)
- `PORT` — Server port (default: 3000)
- `ADMIN_PASSWORD` — password for `/admin/posts` (HTTP Basic Auth, any
  username works, only the password is checked)

## Endpoints

- `GET /` — Landing page (renders `views/layout.ejs`)
- `GET /support` — Support NODE page
- `GET /missions` — Mission/news list (published posts only)
- `GET /missions/:slug` — Mission/news detail
- `GET /admin/posts` — Admin post list + create form (Basic Auth)
- `POST /admin/posts` — Create a post
- `GET /admin/posts/:id/edit` — Edit form (Basic Auth)
- `POST /admin/posts/:id` — Update a post
- `POST /admin/posts/:id/delete` — Delete a post
- `GET /health` — Health check (used by Render)

## Layout

```
views/
  layout.ejs           landing page (entry point)
  support.ejs           Support NODE page
  missions/            mission list + detail templates
  admin/               admin post list/edit templates (utilitarian, unstyled)
  partials/            shared nav.ejs, footer.ejs, logo.ejs
public/
  css/                 stylesheets, served at /css/<file>
  images/              served images (partner logos, etc.)
lib/
  landing-context.js   builds the landing page's render context
  db.js                shared pg Pool
  posts.js             slug/excerpt/date helpers for posts
  basic-auth.js         /admin Basic Auth middleware
routes/
  missions.js          GET /missions, /missions/:slug
  admin.js             /admin/posts CRUD
images/, logos/         source assets (not served directly — copied into public/ as needed)
server.js              Express app
migrate.js             migration runner (run via `npm run migrate`)
migrations/            timestamped migration files
```

## Deployment

Configured for Render via `render.yaml`. `npm run build` runs migrations on
deploy. Custom domain (nodeengineering.club) is proxied through Cloudflare.

See `WEBSITE-PLAN.md` for the feature roadmap and build plan.
