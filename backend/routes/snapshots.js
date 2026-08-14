const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require('multer-storage-cloudinary');
const verifyToken = require('../middleware/auth');
const db = require('../config/db');

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for snapshots
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smart-3d-showcase/snapshots',
    resource_type: 'auto',
    format: async (req, file) => {
      const mime = file.mimetype.split('/')[1];
      return ['jpeg', 'png', 'webp'].includes(mime) ? mime : 'jpg';
    },
    public_id: (req, file) => {
      return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG or WEBP images are allowed.'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

// @route   GET /api/snapshots
// @desc    Get all progress snapshots (public)
router.get('/', async (req, res) => {
  try {
    const [snapshots] = await db.query('SELECT * FROM snapshots ORDER BY created_at DESC');
    res.json(snapshots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch snapshots.' });
  }
});

// @route   POST /api/snapshots
// @desc    Create a new progress snapshot (admin only)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded.' });
  }

  try {
    const imageUrl = req.file.path; // Cloudinary secure_url
    const caption = req.body.caption || '';

    const [result] = await db.query(
      'INSERT INTO snapshots (image_url, caption) VALUES (?, ?)',
      [imageUrl, caption]
    );

    try {
      await db.query('INSERT INTO admin_audit (admin_id, action, details) VALUES (?, ?, ?)', 
        [req.admin?.id || null, 'create_snapshot', JSON.stringify({ id: result.insertId, caption })]);
    } catch (e) {
      console.error('Audit log failed:', e.message);
    }

    res.status(201).json({ message: 'Snapshot created.', id: result.insertId, image_url: imageUrl, caption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create snapshot.' });
  }
});

// @route   DELETE /api/snapshots/:id
// @desc    Delete a progress snapshot (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM snapshots WHERE id = ?', [req.params.id]);
    res.json({ message: 'Snapshot deleted.' });

    try {
      await db.query('INSERT INTO admin_audit (admin_id, action, details) VALUES (?, ?, ?)', 
        [req.admin?.id || null, 'delete_snapshot', JSON.stringify({ id: req.params.id })]);
    } catch (e) {
      console.error('Audit log failed:', e.message);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete snapshot.' });
  }
});

module.exports = router;
