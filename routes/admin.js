const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');
const { requireAdmin } = require('../lib/basic-auth');
const { slugify, formatDate } = require('../lib/posts');

router.use(requireAdmin);

router.get('/posts', async (req, res) => {
  if (!pool) return res.status(503).send('Database not configured');

  const { rows } = await pool.query(
    `SELECT id, title, slug, category, published_at, updated_at FROM posts ORDER BY updated_at DESC`
  );

  const posts = rows.map((post) => ({ ...post, updatedAtFormatted: formatDate(post.updated_at) }));

  res.render('admin/posts', { posts });
});

router.post('/posts', async (req, res) => {
  if (!pool) return res.status(503).send('Database not configured');

  const { title, category, cover_image_url, body } = req.body;
  const slug = (req.body.slug && req.body.slug.trim()) || slugify(title);
  const published = req.body.published === 'on';

  await pool.query(
    `INSERT INTO posts (title, slug, body, cover_image_url, category, published_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [title, slug, body, cover_image_url || null, category, published ? new Date() : null]
  );

  res.redirect('/admin/posts');
});

router.get('/posts/:id/edit', async (req, res) => {
  if (!pool) return res.status(503).send('Database not configured');

  const { rows } = await pool.query(`SELECT * FROM posts WHERE id = $1`, [req.params.id]);
  if (rows.length === 0) return res.status(404).send('Not found');

  res.render('admin/edit', { post: rows[0] });
});

router.post('/posts/:id', async (req, res) => {
  if (!pool) return res.status(503).send('Database not configured');

  const { title, slug, category, cover_image_url, body } = req.body;
  const published = req.body.published === 'on';

  const { rows } = await pool.query(`SELECT published_at FROM posts WHERE id = $1`, [req.params.id]);
  if (rows.length === 0) return res.status(404).send('Not found');

  let publishedAt = rows[0].published_at;
  if (published && !publishedAt) publishedAt = new Date();
  if (!published) publishedAt = null;

  await pool.query(
    `UPDATE posts
     SET title = $1, slug = $2, body = $3, cover_image_url = $4, category = $5, published_at = $6, updated_at = NOW()
     WHERE id = $7`,
    [title, slug, body, cover_image_url || null, category, publishedAt, req.params.id]
  );

  res.redirect('/admin/posts');
});

router.post('/posts/:id/delete', async (req, res) => {
  if (!pool) return res.status(503).send('Database not configured');

  await pool.query(`DELETE FROM posts WHERE id = $1`, [req.params.id]);
  res.redirect('/admin/posts');
});

module.exports = router;
