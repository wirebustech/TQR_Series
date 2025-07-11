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

// Get all active social media links (public)
router.get('/', async (req, res) => {
  try {
    const [links] = await pool.execute(
      'SELECT * FROM social_media_links WHERE is_active = TRUE ORDER BY sort_order ASC'
    );

    res.json({ links });
  } catch (error) {
    console.error('Get social media links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new social media link (admin/editor only)
router.post('/', [
  authenticateToken,
  body('platform').notEmpty().withMessage('Platform is required'),
  body('url').isURL().withMessage('Valid URL is required')
], async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { platform, url, icon, sort_order } = req.body;

    // Create social media link
    const [result] = await pool.execute(
      'INSERT INTO social_media_links (platform, url, icon, sort_order) VALUES (?, ?, ?, ?)',
      [platform, url, icon || null, sort_order || 0]
    );

    res.status(201).json({
      message: 'Social media link created successfully',
      linkId: result.insertId
    });
  } catch (error) {
    console.error('Create social media link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update social media link (admin/editor only)
router.put('/:id', [
  authenticateToken,
  body('platform').notEmpty().withMessage('Platform is required'),
  body('url').isURL().withMessage('Valid URL is required')
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
    const { platform, url, icon, sort_order, is_active } = req.body;

    // Check if link exists
    const [existingLinks] = await pool.execute(
      'SELECT id FROM social_media_links WHERE id = ?',
      [id]
    );

    if (existingLinks.length === 0) {
      return res.status(404).json({ error: 'Social media link not found' });
    }

    // Update link
    await pool.execute(
      'UPDATE social_media_links SET platform = ?, url = ?, icon = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [platform, url, icon || null, sort_order || 0, is_active !== undefined ? is_active : true, id]
    );

    res.json({ message: 'Social media link updated successfully' });
  } catch (error) {
    console.error('Update social media link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete social media link (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    // Check if link exists
    const [existingLinks] = await pool.execute(
      'SELECT id FROM social_media_links WHERE id = ?',
      [id]
    );

    if (existingLinks.length === 0) {
      return res.status(404).json({ error: 'Social media link not found' });
    }

    // Delete link
    await pool.execute('DELETE FROM social_media_links WHERE id = ?', [id]);

    res.json({ message: 'Social media link deleted successfully' });
  } catch (error) {
    console.error('Delete social media link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reorder social media links (admin/editor only)
router.post('/reorder', [
  authenticateToken,
  body('links').isArray().withMessage('Links array is required')
], async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { links } = req.body;

    // Update sort order for each link
    for (const link of links) {
      await pool.execute(
        'UPDATE social_media_links SET sort_order = ? WHERE id = ?',
        [link.sort_order, link.id]
      );
    }

    res.json({ message: 'Social media links reordered successfully' });
  } catch (error) {
    console.error('Reorder social media links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all social media links (admin/editor view)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const [links] = await pool.execute(
      'SELECT * FROM social_media_links ORDER BY sort_order ASC, created_at DESC'
    );

    res.json({ links });
  } catch (error) {
    console.error('Get admin social media links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 