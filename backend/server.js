const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const contactRoutes = require('./routes/contact');
const uploadRoutes = require('./routes/upload');
const { db, ensureSchema } = require('./config/db');

const app = express();

// Basic security hardening — configure resource policy to allow cross-origin static assets
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
// Trust first proxy when deployed behind one (for rate-limit, secure cookies)
app.set('trust proxy', 1);

// Middleware
const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:5173').trim().replace(/\/+$/, '');
// Accept requests from the configured client URL plus common local dev hosts and Vercel deployments.
const allowedOrigins = new Set([
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.1.127:5173',
]);
app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser requests (curl, Postman) with no origin
    if (!origin) return cb(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.has(normalizedOrigin)) return cb(null, true);

    try {
      const hostname = new URL(origin).hostname;
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.endsWith('.vercel.app') ||
        hostname.endsWith('.netlify.app') ||
        /^192\.168\./.test(hostname)
      ) {
        return cb(null, true);
      }
    } catch {
      // ignore invalid origin strings and reject below
    }

    return cb(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

// Serve uploaded service photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Smart 3D Showcase API is running.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const PORT = Number(process.env.PORT || 5000);

(async () => {
  try {
    await db.getConnection();
    await ensureSchema();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Cannot start server: database connection failed.');
    console.error('Reason:', err.message);
    console.error('Check Render env vars: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME');
    process.exit(1);
  }
})();
