const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Search across all content types
router.get('/', async (req, res) => {
  try {
    const { q: query, blogs, webinars, apps, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ results: [] });
    }

    const results = [];
    const searchTerm = `%${query}%`;

    // Search blogs if enabled
    if (blogs !== 'false') {
      const [blogResults] = await pool.execute(`
        SELECT 
          id,
          title,
          excerpt,
          slug,
          'blog' as type,
          created_at as date,
          status
        FROM blog_posts 
        WHERE status = 'published' 
          AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
        ORDER BY created_at DESC 
        LIMIT ?
      `, [searchTerm, searchTerm, searchTerm, parseInt(limit)]);
      
      results.push(...blogResults);
    }

    // Search webinars if enabled
    if (webinars !== 'false') {
      const [webinarResults] = await pool.execute(`
        SELECT 
          id,
          title,
          description as excerpt,
          'webinar' as type,
          created_at as date,
          is_active as status
        FROM webinars 
        WHERE is_active = TRUE 
          AND (title LIKE ? OR description LIKE ?)
        ORDER BY created_at DESC 
        LIMIT ?
      `, [searchTerm, searchTerm, parseInt(limit)]);
      
      results.push(...webinarResults);
    }

    // Search apps if enabled
    if (apps !== 'false') {
      const [appResults] = await pool.execute(`
        SELECT 
          id,
          name as title,
          description as excerpt,
          'app' as type,
          created_at as date,
          status,
          target_audience,
          release_date
        FROM apps 
        WHERE is_active = TRUE 
          AND (name LIKE ? OR description LIKE ? OR target_audience LIKE ?)
        ORDER BY created_at DESC 
        LIMIT ?
      `, [searchTerm, searchTerm, searchTerm, parseInt(limit)]);
      
      results.push(...appResults);
    }

    // Sort results by relevance and date
    const sortedResults = results
      .map(result => ({
        ...result,
        relevance: calculateRelevance(result, query)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, parseInt(limit));

    res.json({ 
      results: sortedResults,
      total: sortedResults.length,
      query,
      filters: { blogs, webinars, apps }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Calculate relevance score for search results
const calculateRelevance = (result, query) => {
  const queryLower = query.toLowerCase();
  const title = (result.title || '').toLowerCase();
  const excerpt = (result.excerpt || '').toLowerCase();
  
  let score = 0;
  
  // Title matches get highest score
  if (title.includes(queryLower)) {
    score += 10;
    // Exact title match gets bonus
    if (title === queryLower) score += 5;
  }
  
  // Excerpt matches get medium score
  if (excerpt.includes(queryLower)) {
    score += 5;
  }
  
  // Recency bonus (newer content gets slight boost)
  const daysSinceCreation = (Date.now() - new Date(result.date).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation < 30) score += 1;
  if (daysSinceCreation < 7) score += 1;
  
  // Type-specific bonuses
  switch (result.type) {
    case 'blog':
      if (result.status === 'published') score += 2;
      break;
    case 'webinar':
      if (result.status === true) score += 2;
      break;
    case 'app':
      if (result.status === 'released') score += 3;
      if (result.status === 'beta') score += 2;
      break;
  }
  
  return score;
};

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchTerm = `%${query}%`;
    const suggestions = [];

    // Get blog titles
    const [blogTitles] = await pool.execute(`
      SELECT title 
      FROM blog_posts 
      WHERE status = 'published' AND title LIKE ?
      LIMIT 3
    `, [searchTerm]);
    
    suggestions.push(...blogTitles.map(b => b.title));

    // Get webinar titles
    const [webinarTitles] = await pool.execute(`
      SELECT title 
      FROM webinars 
      WHERE is_active = TRUE AND title LIKE ?
      LIMIT 3
    `, [searchTerm]);
    
    suggestions.push(...webinarTitles.map(w => w.title));

    // Get app names
    const [appNames] = await pool.execute(`
      SELECT name 
      FROM apps 
      WHERE is_active = TRUE AND name LIKE ?
      LIMIT 3
    `, [searchTerm]);
    
    suggestions.push(...appNames.map(a => a.name));

    // Remove duplicates and limit
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 5);

    res.json({ suggestions: uniqueSuggestions });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get search statistics
router.get('/stats', async (req, res) => {
  try {
    const [blogCount] = await pool.execute('SELECT COUNT(*) as count FROM blog_posts WHERE status = "published"');
    const [webinarCount] = await pool.execute('SELECT COUNT(*) as count FROM webinars WHERE is_active = TRUE');
    const [appCount] = await pool.execute('SELECT COUNT(*) as count FROM apps WHERE is_active = TRUE');

    res.json({
      totalBlogs: blogCount[0].count,
      totalWebinars: webinarCount[0].count,
      totalApps: appCount[0].count,
      totalContent: blogCount[0].count + webinarCount[0].count + appCount[0].count
    });
  } catch (error) {
    console.error('Search stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 