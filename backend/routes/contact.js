const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// @route   POST /api/contact
// @desc    Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }

    await db.query(
      'INSERT INTO contacts (name, email, message, phone) VALUES (?, ?, ?, ?)',
      [name, email, message, phone || null]
    );

    res.status(201).json({ message: 'Thanks! Your message has been received.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit message.' });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});

module.exports = router;
