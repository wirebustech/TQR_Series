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

// Get all active webinars (public)
router.get('/', async (req, res) => {
  try {
    const [webinars] = await pool.execute(
      'SELECT * FROM webinars WHERE is_active = TRUE ORDER BY date_time DESC'
    );

    res.json({ webinars });
  } catch (error) {
    console.error('Get webinars error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single webinar (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [webinars] = await pool.execute(
      'SELECT * FROM webinars WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (webinars.length === 0) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    res.json({ webinar: webinars[0] });
  } catch (error) {
    console.error('Get webinar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new webinar (admin/editor only)
router.post('/', [
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
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

    const { title, description, date_time, duration, video_url, registration_url } = req.body;

    // Create webinar
    const [result] = await pool.execute(
      'INSERT INTO webinars (title, description, date_time, duration, video_url, registration_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, date_time || null, duration || null, video_url || null, registration_url || null]
    );

    res.status(201).json({
      message: 'Webinar created successfully',
      webinarId: result.insertId
    });
  } catch (error) {
    console.error('Create webinar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update webinar (admin/editor only)
router.put('/:id', [
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
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
    const { title, description, date_time, duration, video_url, registration_url, is_active } = req.body;

    // Check if webinar exists
    const [existingWebinars] = await pool.execute(
      'SELECT id FROM webinars WHERE id = ?',
      [id]
    );

    if (existingWebinars.length === 0) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    // Update webinar
    await pool.execute(
      'UPDATE webinars SET title = ?, description = ?, date_time = ?, duration = ?, video_url = ?, registration_url = ?, is_active = ? WHERE id = ?',
      [title, description, date_time || null, duration || null, video_url || null, registration_url || null, is_active !== undefined ? is_active : true, id]
    );

    res.json({ message: 'Webinar updated successfully' });
  } catch (error) {
    console.error('Update webinar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete webinar (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    // Check if webinar exists
    const [existingWebinars] = await pool.execute(
      'SELECT id FROM webinars WHERE id = ?',
      [id]
    );

    if (existingWebinars.length === 0) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    // Delete webinar
    await pool.execute('DELETE FROM webinars WHERE id = ?', [id]);

    res.json({ message: 'Webinar deleted successfully' });
  } catch (error) {
    console.error('Delete webinar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all webinars (admin/editor view)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const [webinars] = await pool.execute(
      'SELECT * FROM webinars ORDER BY created_at DESC'
    );

    res.json({ webinars });
  } catch (error) {
    console.error('Get admin webinars error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 