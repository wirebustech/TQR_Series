const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();

// Get analytics dashboard data
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const { range = '30d' } = req.query;
    const days = range === '7d' ? 7 : range === '90d' ? 90 : range === '1y' ? 365 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get basic counts
    const [
      usersResult,
      postsResult,
      webinarsResult,
      appsResult,
      signupsResult,
      contactsResult
    ] = await Promise.all([
      pool.execute('SELECT COUNT(*) as count FROM users WHERE created_at >= ?', [startDate]),
      pool.execute('SELECT COUNT(*) as count FROM blog_posts WHERE created_at >= ?', [startDate]),
      pool.execute('SELECT COUNT(*) as count FROM webinars WHERE created_at >= ?', [startDate]),
      pool.execute('SELECT COUNT(*) as count FROM apps WHERE created_at >= ?', [startDate]),
      pool.execute('SELECT COUNT(*) as count FROM early_access_signups WHERE created_at >= ?', [startDate]),
      pool.execute('SELECT COUNT(*) as count FROM contact_submissions WHERE created_at >= ?', [startDate])
    ]);

    // Get growth percentages (compare with previous period)
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);

    const [
      prevUsersResult,
      prevPostsResult,
      prevWebinarsResult,
      prevAppsResult,
      prevSignupsResult
    ] = await Promise.all([
      pool.execute('SELECT COUNT(*) as count FROM users WHERE created_at >= ? AND created_at < ?', [prevStartDate, startDate]),
      pool.execute('SELECT COUNT(*) as count FROM blog_posts WHERE created_at >= ? AND created_at < ?', [prevStartDate, startDate]),
      pool.execute('SELECT COUNT(*) as count FROM webinars WHERE created_at >= ? AND created_at < ?', [prevStartDate, startDate]),
      pool.execute('SELECT COUNT(*) as count FROM apps WHERE created_at >= ? AND created_at < ?', [prevStartDate, startDate]),
      pool.execute('SELECT COUNT(*) as count FROM early_access_signups WHERE created_at >= ? AND created_at < ?', [prevStartDate, startDate])
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Get top content
    const [
      topPostsResult,
      topWebinarsResult,
      topAppsResult
    ] = await Promise.all([
      pool.execute(`
        SELECT id, title, status, created_at, 
               (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') as total_posts
        FROM blog_posts 
        WHERE status = 'published' 
        ORDER BY created_at DESC 
        LIMIT 5
      `),
      pool.execute(`
        SELECT id, title, is_active, created_at,
               (SELECT COUNT(*) FROM webinars WHERE is_active = TRUE) as total_webinars
        FROM webinars 
        WHERE is_active = TRUE 
        ORDER BY created_at DESC 
        LIMIT 5
      `),
      pool.execute(`
        SELECT id, name, status, created_at,
               (SELECT COUNT(*) FROM apps WHERE is_active = TRUE) as total_apps
        FROM apps 
        WHERE is_active = TRUE 
        ORDER BY created_at DESC 
        LIMIT 5
      `)
    ]);

    // Get recent activity
    const [recentActivityResult] = await pool.execute(`
      (SELECT 'user' as type, username as description, created_at as time
       FROM users 
       WHERE created_at >= ?
       ORDER BY created_at DESC
       LIMIT 3)
      UNION ALL
      (SELECT 'post' as type, title as description, created_at as time
       FROM blog_posts 
       WHERE created_at >= ?
       ORDER BY created_at DESC
       LIMIT 3)
      UNION ALL
      (SELECT 'webinar' as type, title as description, created_at as time
       FROM webinars 
       WHERE created_at >= ?
       ORDER BY created_at DESC
       LIMIT 3)
      UNION ALL
      (SELECT 'app' as type, name as description, created_at as time
       FROM apps 
       WHERE created_at >= ?
       ORDER BY created_at DESC
       LIMIT 3)
      ORDER BY time DESC
      LIMIT 10
    `, [startDate, startDate, startDate, startDate]);

    // Get geographic distribution (mock data for now)
    const geographicData = [
      { country: 'United States', users: 45, percentage: 30 },
      { country: 'United Kingdom', users: 32, percentage: 21 },
      { country: 'Canada', users: 28, percentage: 19 },
      { country: 'Australia', users: 25, percentage: 17 },
      { country: 'Germany', users: 18, percentage: 12 }
    ];

    // Calculate percentages for top content
    const processTopContent = (items, total) => {
      return items.map(item => ({
        ...item,
        percentage: total > 0 ? Math.round((1 / total) * 100) : 0
      }));
    };

    const analytics = {
      // Basic metrics
      totalUsers: usersResult[0][0].count,
      totalPosts: postsResult[0][0].count,
      totalWebinars: webinarsResult[0][0].count,
      totalApps: appsResult[0][0].count,
      earlyAccessSignups: signupsResult[0][0].count,
      pageViews: Math.floor(Math.random() * 10000) + 5000, // Mock data
      contacts: contactsResult[0][0].count,

      // Growth metrics
      userGrowth: calculateGrowth(usersResult[0][0].count, prevUsersResult[0][0].count),
      postGrowth: calculateGrowth(postsResult[0][0].count, prevPostsResult[0][0].count),
      webinarGrowth: calculateGrowth(webinarsResult[0][0].count, prevWebinarsResult[0][0].count),
      appGrowth: calculateGrowth(appsResult[0][0].count, prevAppsResult[0][0].count),
      signupGrowth: calculateGrowth(signupsResult[0][0].count, prevSignupsResult[0][0].count),
      viewGrowth: Math.floor(Math.random() * 20) - 5, // Mock data

      // Top content
      topPosts: processTopContent(topPostsResult[0], topPostsResult[0].length),
      topWebinars: processTopContent(topWebinarsResult[0], topWebinarsResult[0].length),
      topApps: processTopContent(topAppsResult[0], topAppsResult[0].length),

      // Recent activity
      recentActivity: recentActivityResult.map(activity => ({
        type: activity.type,
        description: activity.description,
        time: new Date(activity.time).toLocaleDateString()
      })),

      // Geographic data
      geographicData,

      // System health (mock data)
      storageUsage: Math.floor(Math.random() * 30) + 10,
      uptime: 99.9,

      // Time range info
      timeRange: range,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString()
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get detailed analytics for specific content type
router.get('/:type', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const { type } = req.params;
    const { range = '30d' } = req.query;
    const days = range === '7d' ? 7 : range === '90d' ? 90 : range === '1y' ? 365 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let analytics = {};

    switch (type) {
      case 'users':
        const [userStats] = await pool.execute(`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as count
          FROM users 
          WHERE created_at >= ?
          GROUP BY DATE(created_at)
          ORDER BY date
        `, [startDate]);
        analytics = { userStats };
        break;

      case 'content':
        const [contentStats] = await pool.execute(`
          SELECT 
            'blog' as type,
            COUNT(*) as count
          FROM blog_posts 
          WHERE created_at >= ?
          UNION ALL
          SELECT 
            'webinar' as type,
            COUNT(*) as count
          FROM webinars 
          WHERE created_at >= ?
          UNION ALL
          SELECT 
            'app' as type,
            COUNT(*) as count
          FROM apps 
          WHERE created_at >= ?
        `, [startDate, startDate, startDate]);
        analytics = { contentStats };
        break;

      case 'engagement':
        // Mock engagement data
        analytics = {
          pageViews: Array.from({ length: days }, (_, i) => ({
            date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            views: Math.floor(Math.random() * 500) + 100
          })),
          topPages: [
            { page: '/', views: 1500 },
            { page: '/about', views: 800 },
            { page: '/webinars', views: 650 },
            { page: '/apps', views: 450 },
            { page: '/blog', views: 350 }
          ]
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid analytics type' });
    }

    res.json(analytics);
  } catch (error) {
    console.error('Detailed analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export analytics data
router.post('/export', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Editor access required' });
    }

    const { type, format = 'json', dateRange } = req.body;

    // Generate export data based on type
    let exportData = {};

    switch (type) {
      case 'users':
        const [users] = await pool.execute(`
          SELECT id, username, email, role, created_at, is_active
          FROM users
          ORDER BY created_at DESC
        `);
        exportData = { users };
        break;

      case 'content':
        const [posts] = await pool.execute(`
          SELECT id, title, status, created_at, published_at
          FROM blog_posts
          ORDER BY created_at DESC
        `);
        const [webinars] = await pool.execute(`
          SELECT id, title, is_active, created_at, date_time
          FROM webinars
          ORDER BY created_at DESC
        `);
        const [apps] = await pool.execute(`
          SELECT id, name, status, created_at, release_date
          FROM apps
          ORDER BY created_at DESC
        `);
        exportData = { posts, webinars, apps };
        break;

      case 'signups':
        const [signups] = await pool.execute(`
          SELECT eas.*, a.name as app_name
          FROM early_access_signups eas
          JOIN apps a ON eas.app_id = a.id
          ORDER BY eas.created_at DESC
        `);
        exportData = { signups };
        break;

      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(exportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}_export_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvData);
    } else {
      res.json({
        success: true,
        data: exportData,
        exportedAt: new Date().toISOString(),
        type,
        format
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], pre + key));
      } else {
        acc[pre + key] = obj[key];
      }
      return acc;
    }, {});
  };

  const items = Object.values(data)[0]; // Get the first array
  if (!items || !items.length) return '';

  const headers = Object.keys(flattenObject(items[0]));
  const csvContent = [
    headers.join(','),
    ...items.map(item => {
      const flat = flattenObject(item);
      return headers.map(header => {
        const value = flat[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',');
    })
  ].join('\n');

  return csvContent;
};

module.exports = router; 