
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function auth(required = true) {
  return async (req, res, next) => {
    try {
      const header = req.headers['authorization'] || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) {
        if (required) return res.status(401).json({ message: 'Unauthorized' });
        req.user = null; return next();
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).lean();
      if (!user) return res.status(401).json({ message: 'Invalid token' });
      if (user.isBlocked) return res.status(403).json({ message: 'Account is blocked' });
      req.user = user;
      next();
    } catch (e) {
      console.error(e);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { auth, requireRole };
