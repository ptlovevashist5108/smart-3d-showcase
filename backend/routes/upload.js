const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const sharp = require('sharp');
const verifyToken = require('../middleware/auth');
const db = require('../config/db');

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage — uploads directly to cloud
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smart-3d-showcase', // organize uploads in this folder
    resource_type: 'auto',
    format: async (req, file) => {
      // Keep original format (jpg, png, webp)
      const mime = file.mimetype.split('/')[1];
      return ['jpeg', 'png', 'webp'].includes(mime) ? mime : 'jpg';
    },
    public_id: (req, file) => {
      // unique name based on timestamp
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

// @route   POST /api/upload
// @desc    Upload a service photo (admin only) to Cloudinary — return the secure URL
router.post('/', verifyToken, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // req.file.path contains the Cloudinary secure_url
    const fileUrl = req.file.path; // Cloudinary's secure_url

    // Log audit
    try {
      await db.query('INSERT INTO admin_audit (admin_id, action, details) VALUES (?, ?, ?)', [req.admin?.id || null, 'upload_photo', fileUrl]);
    } catch (e) {
      console.error('Audit log failed:', e.message);
    }

    res.status(201).json({ message: 'Photo uploaded to Cloudinary.', url: fileUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Image upload to Cloudinary failed.' });
  }
});

module.exports = router;
