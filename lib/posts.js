function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function excerpt(body, length = 160) {
  const clean = body.replace(/\s+/g, ' ').trim();
  if (clean.length <= length) return clean;
  return clean.slice(0, length).replace(/\s+\S*$/, '') + '…';
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

module.exports = { slugify, excerpt, formatDate };
