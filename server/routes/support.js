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

// Submit support contribution (public)
router.post('/contribute', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('contribution_type').isIn(['donation', 'sponsorship', 'partnership']).withMessage('Invalid contribution type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, amount, currency, message, contribution_type } = req.body;

    // Create contribution
    const [result] = await pool.execute(
      'INSERT INTO support_contributions (name, email, amount, currency, message, contribution_type) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, amount || null, currency || 'USD', message || null, contribution_type]
    );

    res.status(201).json({
      message: 'Contribution submitted successfully',
      contributionId: result.insertId
    });
  } catch (error) {
    console.error('Submit contribution error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit contact form (public)
router.post('/contact', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    // Create contact submission
    const [result] = await pool.execute(
      'INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || null, message]
    );

    res.status(201).json({
      message: 'Contact form submitted successfully',
      submissionId: result.insertId
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all contributions (admin/editor only)
router.get('/contributions', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const { page = 1, limit = 20, status, type } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM support_contributions';
    let countQuery = 'SELECT COUNT(*) as total FROM support_contributions';
    let params = [];
    let countParams = [];
    let whereConditions = [];

    if (status) {
      whereConditions.push('status = ?');
      params.push(status);
      countParams.push(status);
    }

    if (type) {
      whereConditions.push('contribution_type = ?');
      params.push(type);
      countParams.push(type);
    }

    if (whereConditions.length > 0) {
      const whereClause = ' WHERE ' + whereConditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [contributions] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      contributions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(countResult[0].total / limit),
        hasNext: offset + contributions.length < countResult[0].total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get contributions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all contact submissions (admin/editor only)
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM contact_submissions';
    let countQuery = 'SELECT COUNT(*) as total FROM contact_submissions';
    let params = [];
    let countParams = [];

    if (status) {
      query += ' WHERE status = ?';
      countQuery += ' WHERE status = ?';
      params.push(status);
      countParams.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [contacts] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      contacts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(countResult[0].total / limit),
        hasNext: offset + contacts.length < countResult[0].total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update contribution status (admin/editor only)
router.put('/contributions/:id', [
  authenticateToken,
  body('status').isIn(['pending', 'completed', 'failed']).withMessage('Invalid status')
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
    const { status } = req.body;

    // Check if contribution exists
    const [existingContributions] = await pool.execute(
      'SELECT id FROM support_contributions WHERE id = ?',
      [id]
    );

    if (existingContributions.length === 0) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    // Update contribution status
    await pool.execute(
      'UPDATE support_contributions SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Contribution status updated successfully' });
  } catch (error) {
    console.error('Update contribution status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update contact submission status (admin/editor only)
router.put('/contacts/:id', [
  authenticateToken,
  body('status').isIn(['new', 'read', 'replied', 'closed']).withMessage('Invalid status')
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
    const { status } = req.body;

    // Check if contact exists
    const [existingContacts] = await pool.execute(
      'SELECT id FROM contact_submissions WHERE id = ?',
      [id]
    );

    if (existingContacts.length === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    // Update contact status
    await pool.execute(
      'UPDATE contact_submissions SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Contact status updated successfully' });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get support statistics (admin only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get contribution statistics
    const [contributionStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_contributions,
        SUM(amount) as total_amount,
        contribution_type,
        status
      FROM support_contributions 
      GROUP BY contribution_type, status
    `);

    // Get contact statistics
    const [contactStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_contacts,
        status
      FROM contact_submissions 
      GROUP BY status
    `);

    // Get recent activity
    const [recentContributions] = await pool.execute(`
      SELECT * FROM support_contributions 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const [recentContacts] = await pool.execute(`
      SELECT * FROM contact_submissions 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      contributionStats,
      contactStats,
      recentContributions,
      recentContacts
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 