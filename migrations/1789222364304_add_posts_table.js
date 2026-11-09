module.exports = {
  name: 'add_posts_table',
  up: async (client) => {
    await client.query(`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        cover_image_url TEXT,
        category VARCHAR(20) NOT NULL CHECK (category IN ('mission', 'press', 'update')),
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE UNIQUE INDEX posts_slug_unique_idx ON posts (slug)
    `);

    await client.query(`
      CREATE INDEX posts_published_at_idx ON posts (published_at DESC)
    `);
  },
};
