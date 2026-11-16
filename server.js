require('dotenv').config();

const express = require('express');
const path = require('path');
const { pool } = require('./lib/db');
const { buildLandingContext, buildThemeCSS } = require('./lib/landing-context');
const missionsRouter = require('./routes/missions');
const adminRouter = require('./routes/admin');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// EJS view engine. Templates live in ./views/ (entry point: layout.ejs).
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Every view needs the site stylesheet link — set it once here instead of
// passing it explicitly from every route.
app.use((req, res, next) => {
  res.locals.themeCSS = buildThemeCSS();
  next();
});

// Health check endpoint (required for Render)
// Note: Does NOT query database to allow Neon auto-suspend
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Serve static files from public folder.
// `index: false` disables auto-serving public/index.html as the directory
// index — `/` always hits the EJS render route below, which is the only
// thing that should ever serve the landing page on this template.
// Images can be cached for a week (by browsers and Cloudflare); CSS and JS for
// an hour so design changes still show up quickly after a deploy.
app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  setHeaders: (res, filePath) => {
    if (/\.(jpe?g|png|webp|svg|gif)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    } else if (/\.(css|js)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  },
}));

// Landing page
app.get('/', (_req, res) => {
  res.render('layout', buildLandingContext());
});

app.get('/support', (_req, res) => {
  res.render('support');
});

// Crawl files for search engines and AI search. Mission posts from the
// database are added to the sitemap when the database is available.
const SITE_URL = 'https://www.nodeengineering.club';
const STATIC_PAGES = ['/', '/missions', '/missions/namibia-2026', '/missions/njord-2026', '/missions/njord-2025', '/support'];

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
});

app.get('/sitemap.xml', async (_req, res) => {
  let slugs = [];
  if (pool) {
    try {
      const { rows } = await pool.query(
        `SELECT slug FROM posts WHERE published_at IS NOT NULL AND published_at <= NOW()`
      );
      slugs = rows.map((r) => `/missions/${r.slug}`);
    } catch (err) {
      console.error('sitemap query failed:', err.message);
    }
  }
  const urls = [...STATIC_PAGES, ...slugs]
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join('\n');
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
});

app.use('/missions', missionsRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
