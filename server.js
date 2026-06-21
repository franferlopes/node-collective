const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const { buildLandingContext } = require('./lib/landing-context');

const app = express();
const port = process.env.PORT || 3000;

// DATABASE_URL is optional — the landing page is static and doesn't query the DB.
if (process.env.DATABASE_URL) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  // Neon closes idle connections (auto-suspend). Without this listener the pooled
  // client emits an unhandled 'error' event, which Node throws on and crashes the
  // whole process. Log it and keep serving; the pool reconnects on the next query.
  pool.on('error', (err) => {
    console.error('[pg pool] idle client error (non-fatal):', err && err.message);
  });
} else {
  console.log('DATABASE_URL not set — skipping database connection');
}

app.use(express.json());

// EJS view engine. Templates live in ./views/ (entry point: layout.ejs).
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Health check endpoint (required for Render)
// Note: Does NOT query database to allow Neon auto-suspend
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Serve static files from public folder.
// `index: false` disables auto-serving public/index.html as the directory
// index — `/` always hits the EJS render route below, which is the only
// thing that should ever serve the landing page on this template.
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Landing page
app.get('/', (_req, res) => {
  res.render('layout', buildLandingContext());
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
