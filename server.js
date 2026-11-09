require('dotenv').config();

const express = require('express');
const path = require('path');
require('./lib/db'); // initializes the shared pg Pool as a side effect
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
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Landing page
app.get('/', (_req, res) => {
  res.render('layout', buildLandingContext());
});

app.get('/support', (_req, res) => {
  res.render('support');
});

app.use('/missions', missionsRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
