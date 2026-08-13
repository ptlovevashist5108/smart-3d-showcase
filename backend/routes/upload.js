const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const verifyToken = require('../middleware/auth');
const db = require('../config/db');

// Store uploaded photos in /uploads with a unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
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

// @route   POST /api/upload
// @desc    Upload a service photo (admin only) — resize and return the URL
router.post('/', verifyToken, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const filePath = req.file.path;
  const ext = path.extname(req.file.filename).toLowerCase();
  const resizedPath = `${filePath}.tmp`;

  try {
    // Resize to max width 1200 and overwrite
    await sharp(filePath)
      .resize({ width: 1200, withoutEnlargement: true })
      .toFile(resizedPath);

    // Replace original file with resized
    fs.unlinkSync(filePath);
    fs.renameSync(resizedPath, filePath);

    const fileUrl = `/uploads/${req.file.filename}`;

    // Log audit
    try {
      await db.query('INSERT INTO admin_audit (admin_id, action, details) VALUES (?, ?, ?)', [req.admin?.id || null, 'upload_photo', fileUrl]);
    } catch (e) {
      console.error('Audit log failed:', e.message);
    }

    res.status(201).json({ message: 'Photo uploaded.', url: fileUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Image processing failed.' });
  }
});

module.exports = router;
