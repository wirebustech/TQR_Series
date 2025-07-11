const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all active affiliates (public)
router.get('/', async (req, res) => {
  try {
    const [affiliates] = await pool.execute(
      'SELECT * FROM affiliates WHERE is_active = TRUE ORDER BY sort_order ASC'
    );

    res.json({ affiliates });
  } catch (error) {
    console.error('Get affiliates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new affiliate (admin/editor only)
router.post('/', [
  authenticateToken,
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, logo_url, website_url, sort_order } = req.body;

    // Create affiliate
    const [result] = await pool.execute(
      'INSERT INTO affiliates (name, description, logo_url, website_url, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, description, logo_url || null, website_url || null, sort_order || 0]
    );

    res.status(201).json({
      message: 'Affiliate created successfully',
      affiliateId: result.insertId
    });
  } catch (error) {
    console.error('Create affiliate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update affiliate (admin/editor only)
router.put('/:id', [
  authenticateToken,
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, logo_url, website_url, sort_order, is_active } = req.body;

    // Check if affiliate exists
    const [existingAffiliates] = await pool.execute(
      'SELECT id FROM affiliates WHERE id = ?',
      [id]
    );

    if (existingAffiliates.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    // Update affiliate
    await pool.execute(
      'UPDATE affiliates SET name = ?, description = ?, logo_url = ?, website_url = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [name, description, logo_url || null, website_url || null, sort_order || 0, is_active !== undefined ? is_active : true, id]
    );

    res.json({ message: 'Affiliate updated successfully' });
  } catch (error) {
    console.error('Update affiliate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete affiliate (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    // Check if affiliate exists
    const [existingAffiliates] = await pool.execute(
      'SELECT id FROM affiliates WHERE id = ?',
      [id]
    );

    if (existingAffiliates.length === 0) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    // Delete affiliate
    await pool.execute('DELETE FROM affiliates WHERE id = ?', [id]);

    res.json({ message: 'Affiliate deleted successfully' });
  } catch (error) {
    console.error('Delete affiliate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all affiliates (admin/editor view)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const [affiliates] = await pool.execute(
      'SELECT * FROM affiliates ORDER BY sort_order ASC, created_at DESC'
    );

    res.json({ affiliates });
  } catch (error) {
    console.error('Get admin affiliates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 