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

// Get all published blog posts (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, u.username as author_name 
      FROM blog_posts b 
      LEFT JOIN users u ON b.author_id = u.id 
      WHERE b.status = 'published'
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM blog_posts WHERE status = "published"';
    let params = [];
    let countParams = [];

    if (tag) {
      query += ' AND JSON_CONTAINS(b.tags, ?)';
      countQuery += ' AND JSON_CONTAINS(tags, ?)';
      params.push(`"${tag}"`);
      countParams.push(`"${tag}"`);
    }

    query += ' ORDER BY b.published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [posts] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      posts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(countResult[0].total / limit),
        hasNext: offset + posts.length < countResult[0].total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single blog post by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const [posts] = await pool.execute(`
      SELECT b.*, u.username as author_name 
      FROM blog_posts b 
      LEFT JOIN users u ON b.author_id = u.id 
      WHERE b.slug = ? AND b.status = 'published'
    `, [slug]);

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ post: posts[0] });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new blog post (admin/editor only)
router.post('/', [
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('slug').notEmpty().withMessage('Slug is required')
], async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      title, 
      content, 
      slug, 
      excerpt, 
      featured_image, 
      meta_title, 
      meta_description, 
      tags,
      status = 'draft'
    } = req.body;

    // Check if slug already exists
    const [existingPosts] = await pool.execute(
      'SELECT id FROM blog_posts WHERE slug = ?',
      [slug]
    );

    if (existingPosts.length > 0) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    // Create blog post
    const [result] = await pool.execute(`
      INSERT INTO blog_posts (
        title, slug, content, excerpt, featured_image, 
        author_id, status, meta_title, meta_description, tags,
        published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, slug, content, excerpt || null, featured_image || null,
      req.user.id, status, meta_title || null, meta_description || null,
      tags ? JSON.stringify(tags) : null,
      status === 'published' ? new Date() : null
    ]);

    res.status(201).json({
      message: 'Blog post created successfully',
      postId: result.insertId
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update blog post (admin/editor only)
router.put('/:id', [
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
    const { 
      title, 
      content, 
      excerpt, 
      featured_image, 
      meta_title, 
      meta_description, 
      tags,
      status
    } = req.body;

    // Check if post exists
    const [existingPosts] = await pool.execute(
      'SELECT id, status FROM blog_posts WHERE id = ?',
      [id]
    );

    if (existingPosts.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const currentStatus = existingPosts[0].status;
    const publishedAt = status === 'published' && currentStatus !== 'published' 
      ? new Date() 
      : null;

    // Update blog post
    await pool.execute(`
      UPDATE blog_posts SET 
        title = ?, content = ?, excerpt = ?, featured_image = ?,
        meta_title = ?, meta_description = ?, tags = ?, status = ?,
        published_at = COALESCE(?, published_at)
      WHERE id = ?
    `, [
      title, content, excerpt || null, featured_image || null,
      meta_title || null, meta_description || null,
      tags ? JSON.stringify(tags) : null, status, publishedAt, id
    ]);

    res.json({ message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete blog post (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    // Check if post exists
    const [existingPosts] = await pool.execute(
      'SELECT id FROM blog_posts WHERE id = ?',
      [id]
    );

    if (existingPosts.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Delete post
    await pool.execute('DELETE FROM blog_posts WHERE id = ?', [id]);

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all blog posts (admin/editor view)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, u.username as author_name 
      FROM blog_posts b 
      LEFT JOIN users u ON b.author_id = u.id 
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM blog_posts';
    let params = [];
    let countParams = [];

    if (status) {
      query += ' WHERE b.status = ?';
      countQuery += ' WHERE status = ?';
      params.push(status);
      countParams.push(status);
    }

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [posts] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      posts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(countResult[0].total / limit),
        hasNext: offset + posts.length < countResult[0].total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get blog tags (public)
router.get('/tags/all', async (req, res) => {
  try {
    const [posts] = await pool.execute(
      'SELECT tags FROM blog_posts WHERE status = "published" AND tags IS NOT NULL'
    );

    const tags = new Set();
    posts.forEach(post => {
      if (post.tags) {
        const postTags = JSON.parse(post.tags);
        postTags.forEach(tag => tags.add(tag));
      }
    });

    res.json({ tags: Array.from(tags) });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 