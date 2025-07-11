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

// Get all content sections (public)
router.get('/sections', async (req, res) => {
  try {
    const [sections] = await pool.execute(
      'SELECT * FROM content_sections WHERE is_active = TRUE ORDER BY sort_order ASC'
    );

    res.json({ sections });
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific content section (public)
router.get('/sections/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const [sections] = await pool.execute(
      'SELECT * FROM content_sections WHERE section_key = ? AND is_active = TRUE',
      [key]
    );

    if (sections.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json({ section: sections[0] });
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new content section (admin/editor only)
router.post('/sections', [
  authenticateToken,
  body('section_key').notEmpty().withMessage('Section key is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { section_key, title, content, meta_description, sort_order } = req.body;

    // Check if section key already exists
    const [existingSections] = await pool.execute(
      'SELECT id FROM content_sections WHERE section_key = ?',
      [section_key]
    );

    if (existingSections.length > 0) {
      return res.status(400).json({ error: 'Section key already exists' });
    }

    // Create section
    const [result] = await pool.execute(
      'INSERT INTO content_sections (section_key, title, content, meta_description, sort_order) VALUES (?, ?, ?, ?, ?)',
      [section_key, title, content, meta_description || null, sort_order || 0]
    );

    res.status(201).json({
      message: 'Content section created successfully',
      sectionId: result.insertId
    });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update content section (admin/editor only)
router.put('/sections/:id', [
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
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
    const { title, content, meta_description, sort_order, is_active } = req.body;

    // Check if section exists
    const [existingSections] = await pool.execute(
      'SELECT id FROM content_sections WHERE id = ?',
      [id]
    );

    if (existingSections.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Update section
    await pool.execute(
      'UPDATE content_sections SET title = ?, content = ?, meta_description = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [title, content, meta_description || null, sort_order || 0, is_active !== undefined ? is_active : true, id]
    );

    res.json({ message: 'Content section updated successfully' });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete content section (admin only)
router.delete('/sections/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    // Check if section exists
    const [existingSections] = await pool.execute(
      'SELECT id FROM content_sections WHERE id = ?',
      [id]
    );

    if (existingSections.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Delete section
    await pool.execute('DELETE FROM content_sections WHERE id = ?', [id]);

    res.json({ message: 'Content section deleted successfully' });
  } catch (error) {
    console.error('Delete section error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all content sections (admin/editor view)
router.get('/admin/sections', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const [sections] = await pool.execute(
      'SELECT * FROM content_sections ORDER BY sort_order ASC, created_at DESC'
    );

    res.json({ sections });
  } catch (error) {
    console.error('Get admin sections error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reorder content sections (admin/editor only)
router.post('/sections/reorder', [
  authenticateToken,
  body('sections').isArray().withMessage('Sections array is required')
], async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sections } = req.body;

    // Update sort order for each section
    for (const section of sections) {
      await pool.execute(
        'UPDATE content_sections SET sort_order = ? WHERE id = ?',
        [section.sort_order, section.id]
      );
    }

    res.json({ message: 'Sections reordered successfully' });
  } catch (error) {
    console.error('Reorder sections error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 