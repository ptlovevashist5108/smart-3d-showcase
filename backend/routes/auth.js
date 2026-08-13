const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Limit login attempts to mitigate brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' }
});

// @route   POST /api/auth/register
// @desc    Register a new admin (protected by ADMIN_REG_SECRET env var)
router.post('/register', async (req, res) => {
  try {
    const regSecret = process.env.ADMIN_REG_SECRET;
    if (!regSecret) {
      return res.status(403).json({ message: 'Registration is disabled.' });
    }

    const { name, email, password, secret } = req.body;
    if (!name || !email || !password || !secret) {
      return res.status(400).json({ message: 'All fields and registration secret are required.' });
    }

    if (secret !== regSecret) {
      return res.status(403).json({ message: 'Invalid registration secret.' });
    }

    const [existing] = await db.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// @route   POST /api/auth/login
// @desc    Login and receive a JWT token
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // audit login
    try {
      await db.query('INSERT INTO admin_audit (admin_id, action, details) VALUES (?, ?, ?)', [admin.id, 'login', JSON.stringify({ ip: req.ip })]);
    } catch (e) { console.error('Audit log failed:', e.message); }

    res.json({
      message: 'Login successful.',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, boss_photo: admin.boss_photo }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// @route   GET /api/auth/me
// @desc    Return current admin profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, boss_photo FROM admins WHERE id = ?', [req.admin.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    res.json({ admin: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
});

// @route   GET /api/public/profile
// @desc    Public boss profile (boss photo + name)
router.get('/public/profile', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, boss_photo FROM admins ORDER BY id LIMIT 1');
    if (rows.length === 0) {
      return res.json({ admin: { name: null, boss_photo: null } });
    }
    res.json({ admin: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching public profile.' });
  }
});

// @route   PUT /api/auth/boss-photo
// @desc    Update current admin boss photo URL
router.put('/boss-photo', verifyToken, async (req, res) => {
  try {
    const { boss_photo } = req.body;
    if (!boss_photo) {
      return res.status(400).json({ message: 'boss_photo is required.' });
    }
    await db.query('UPDATE admins SET boss_photo = ? WHERE id = ?', [boss_photo, req.admin.id]);
    res.json({ message: 'Boss photo updated.', boss_photo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating boss photo.' });
  }
});

// @route   PUT /api/auth/boss-name
// @desc    Update current admin boss name
router.put('/boss-name', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'name is required.' });
    }
    await db.query('UPDATE admins SET name = ? WHERE id = ?', [name, req.admin.id]);
    res.json({ message: 'Boss name updated.', name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating boss name.' });
  }
});

module.exports = router;
