const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
// audit logging will insert into admin_audit


// @route   GET /api/products
// @desc    Get all products (public)
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product (public)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
});

// @route   POST /api/products
// @desc    Create a product (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, price, color, shape, image_url, featured } = req.body;
    if (!name) return res.status(400).json({ message: 'Product name is required.' });

    const [result] = await db.query(
      `INSERT INTO products (name, description, price, color, shape, image_url, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description || '', price || 0, color || '#6366f1', shape || 'box', image_url || null, featured ? 1 : 0]
    );

    res.status(201).json({ message: 'Product created.', id: result.insertId });
    try {
      await db.query('INSERT INTO admin_audit (admin_id, action, details) VALUES (?, ?, ?)', [req.admin?.id || null, 'create_product', JSON.stringify({ id: result.insertId, name })]);
    } catch (e) { console.error('Audit log failed:', e.message); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create product.' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, price, color, shape, image_url, featured } = req.body;
    await db.query(
      `UPDATE products SET name=?, description=?, price=?, color=?, shape=?, image_url=?, featured=?
       WHERE id=?`,
      [name, description, price, color, shape, image_url, featured ? 1 : 0, req.params.id]
    );
    res.json({ message: 'Product updated.' });
    try {
      await db.query('INSERT INTO admin_audit (admin_id, action, details) VALUES (?, ?, ?)', [req.admin?.id || null, 'update_product', JSON.stringify({ id: req.params.id, name })]);
    } catch (e) { console.error('Audit log failed:', e.message); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product.' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted.' });
    try {
      await db.query('INSERT INTO admin_audit (admin_id, action, details) VALUES (?, ?, ?)', [req.admin?.id || null, 'delete_product', JSON.stringify({ id: req.params.id })]);
    } catch (e) { console.error('Audit log failed:', e.message); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

module.exports = router;
