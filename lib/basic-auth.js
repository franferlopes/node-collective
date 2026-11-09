const crypto = require('crypto');

function timingSafeEqual(a, b) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  // Compare against a fixed-length buffer first so mismatched lengths don't
  // short-circuit before timingSafeEqual — that would leak length via timing.
  if (aBuf.length !== bBuf.length) {
    crypto.timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function requireAdmin(req, res, next) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return res.status(500).send('ADMIN_PASSWORD not configured');
  }

  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const separatorIndex = decoded.indexOf(':');
    const suppliedPassword = separatorIndex === -1 ? decoded : decoded.slice(separatorIndex + 1);

    if (timingSafeEqual(suppliedPassword, password)) {
      return next();
    }
  }

  res.set('WWW-Authenticate', 'Basic realm="NODE Admin"');
  res.status(401).send('Authentication required');
}

module.exports = { requireAdmin };
