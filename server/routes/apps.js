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

// Get all active apps (public)
router.get('/', async (req, res) => {
  try {
    const [apps] = await pool.execute(
      'SELECT * FROM apps WHERE is_active = TRUE ORDER BY created_at DESC'
    );

    res.json({ apps });
  } catch (error) {
    console.error('Get apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single app (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [apps] = await pool.execute(
      'SELECT * FROM apps WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (apps.length === 0) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json({ app: apps[0] });
  } catch (error) {
    console.error('Get app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new app (admin/editor only)
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

    const { name, description, features, status, signup_url, demo_url, target_audience, release_date } = req.body;

    // Create app
    const [result] = await pool.execute(
      'INSERT INTO apps (name, description, features, status, signup_url, demo_url, target_audience, release_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, features ? JSON.stringify(features) : null, status || 'development', signup_url || null, demo_url || null, target_audience || null, release_date || null]
    );

    res.status(201).json({
      message: 'App created successfully',
      appId: result.insertId
    });
  } catch (error) {
    console.error('Create app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update app (admin/editor only)
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
    const { name, description, features, status, signup_url, demo_url, target_audience, release_date } = req.body;

    // Check if app exists
    const [existingApps] = await pool.execute(
      'SELECT id FROM apps WHERE id = ?',
      [id]
    );

    if (existingApps.length === 0) {
      return res.status(404).json({ error: 'App not found' });
    }

    // Update app
    await pool.execute(
      'UPDATE apps SET name = ?, description = ?, features = ?, status = ?, signup_url = ?, demo_url = ?, target_audience = ?, release_date = ? WHERE id = ?',
      [name, description, features ? JSON.stringify(features) : null, status, signup_url || null, demo_url || null, target_audience || null, release_date || null, id]
    );

    res.json({ message: 'App updated successfully' });
  } catch (error) {
    console.error('Update app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete app (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    // Check if app exists
    const [existingApps] = await pool.execute(
      'SELECT id FROM apps WHERE id = ?',
      [id]
    );

    if (existingApps.length === 0) {
      return res.status(404).json({ error: 'App not found' });
    }

    // Delete app
    await pool.execute('DELETE FROM apps WHERE id = ?', [id]);

    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    console.error('Delete app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Early access signup (public)
router.post('/:id/signup', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('name').notEmpty().withMessage('Name is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, company, interests } = req.body;

    // Check if app exists
    const [apps] = await pool.execute(
      'SELECT id FROM apps WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (apps.length === 0) {
      return res.status(404).json({ error: 'App not found' });
    }

    // Check if email already signed up for this app
    const [existingSignups] = await pool.execute(
      'SELECT id FROM early_access_signups WHERE app_id = ? AND email = ?',
      [id, email]
    );

    if (existingSignups.length > 0) {
      return res.status(400).json({ error: 'Email already signed up for this app' });
    }

    // Create signup
    const [result] = await pool.execute(
      'INSERT INTO early_access_signups (app_id, email, name, company, interests) VALUES (?, ?, ?, ?, ?)',
      [id, email, name, company || null, interests ? JSON.stringify(interests) : null]
    );

    res.status(201).json({
      message: 'Early access signup successful',
      signupId: result.insertId
    });
  } catch (error) {
    console.error('Early access signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all apps (admin/editor view)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const [apps] = await pool.execute(
      'SELECT * FROM apps ORDER BY created_at DESC'
    );

    res.json({ apps });
  } catch (error) {
    console.error('Get admin apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get early access signups for an app (admin/editor only)
router.get('/:id/signups', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const { id } = req.params;
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM early_access_signups WHERE app_id = ?';
    let countQuery = 'SELECT COUNT(*) as total FROM early_access_signups WHERE app_id = ?';
    let params = [id];
    let countParams = [id];

    if (status) {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [signups] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      signups,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(countResult[0].total / limit),
        hasNext: offset + signups.length < countResult[0].total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get signups error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update signup status (admin/editor only)
router.put('/signups/:id', [
  authenticateToken,
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
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

    // Check if signup exists
    const [existingSignups] = await pool.execute(
      'SELECT id FROM early_access_signups WHERE id = ?',
      [id]
    );

    if (existingSignups.length === 0) {
      return res.status(404).json({ error: 'Signup not found' });
    }

    // Update signup status
    await pool.execute(
      'UPDATE early_access_signups SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Signup status updated successfully' });
  } catch (error) {
    console.error('Update signup status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Notify all early access users for an app (admin/editor only)
const { sendBulkEmails } = require('../utils/email');

router.post('/:id/notify-early-access', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const { id } = req.params;
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    // Fetch all early access signups for this app
    const [signups] = await pool.execute(
      'SELECT email, name FROM early_access_signups WHERE app_id = ? AND status = "approved"',
      [id]
    );
    if (signups.length === 0) {
      return res.status(404).json({ error: 'No approved early access users found for this app' });
    }

    // Send bulk emails using the email utility
    const results = await sendBulkEmails(signups, subject, message, 'name');

    res.json({ 
      message: `Notification sent to ${results.sent} users, failed for ${results.failed}`,
      details: results
    });
  } catch (error) {
    console.error('Notify early access error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 