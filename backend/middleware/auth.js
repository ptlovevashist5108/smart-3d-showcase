const jwt = require('jsonwebtoken');

function normalizeIp(ip) {
  if (!ip) return '';
  // remove IPv6 prefix if present
  if (ip.startsWith('::ffff:')) return ip.replace('::ffff:', '');
  return ip;
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;

    // Optional IP whitelist: set ADMIN_ALLOWED_IPS as comma-separated list
    const allowed = process.env.ADMIN_ALLOWED_IPS;
    if (allowed) {
      const list = allowed.split(',').map((s) => s.trim()).filter(Boolean);
      const remote = normalizeIp(req.ip || req.connection.remoteAddress);
      if (!list.includes(remote)) {
        return res.status(403).json({ message: 'Access denied from this IP.' });
      }
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = verifyToken;
