const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');
const { excerpt, formatDate } = require('../lib/posts');

router.get('/', async (req, res) => {
  // The list page also carries the featured Namibia card, so it renders
  // with no posts if the database is missing or not migrated yet.
  let rows = [];
  if (pool) {
    try {
      ({ rows } = await pool.query(
        `SELECT id, title, slug, body, category, published_at
         FROM posts
         WHERE published_at IS NOT NULL AND published_at <= NOW()
         ORDER BY published_at DESC`
      ));
    } catch (err) {
      console.error('missions list query failed:', err.message);
    }
  }

  const posts = rows.map((post) => ({
    ...post,
    excerpt: excerpt(post.body),
    publishedAtFormatted: formatDate(post.published_at),
  }));

  res.render('missions/index', { posts });
});

// Static mission page; listed before /:slug so the database is not queried.
router.get('/namibia-2026', (req, res) => {
  res.render('missions/namibia');
});

router.get('/njord-2026', (req, res) => {
  res.render('missions/njord');
});

router.get('/:slug', async (req, res) => {
  if (!pool) return res.status(503).send('Database not configured');

  const { rows } = await pool.query(
    `SELECT id, title, slug, body, cover_image_url, category, published_at
     FROM posts
     WHERE slug = $1 AND published_at IS NOT NULL AND published_at <= NOW()`,
    [req.params.slug]
  );

  if (rows.length === 0) {
    return res.status(404).send('Not found');
  }

  const post = {
    ...rows[0],
    excerpt: excerpt(rows[0].body),
    publishedAtFormatted: formatDate(rows[0].published_at),
  };

  res.render('missions/show', { post });
});

module.exports = router;
