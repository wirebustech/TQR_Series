import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { 
  UsersIcon, 
  DocumentTextIcon, 
  PlayIcon, 
  DevicePhoneMobileIcon,
  EyeIcon,
  HeartIcon,
  ChartBarIcon,
  TrendingUpIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const Analytics = () => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/analytics?range=${timeRange}`)
      setStats(res.data)
    } catch (err) {
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const metricCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      change: stats.userGrowth || 0,
      icon: UsersIcon,
      color: 'blue'
    },
    {
      title: 'Blog Posts',
      value: stats.totalPosts || 0,
      change: stats.postGrowth || 0,
      icon: DocumentTextIcon,
      color: 'green'
    },
    {
      title: 'Webinars',
      value: stats.totalWebinars || 0,
      change: stats.webinarGrowth || 0,
      icon: PlayIcon,
      color: 'purple'
    },
    {
      title: 'Apps',
      value: stats.totalApps || 0,
      change: stats.appGrowth || 0,
      icon: DevicePhoneMobileIcon,
      color: 'orange'
    },
    {
      title: 'Page Views',
      value: stats.pageViews || 0,
      change: stats.viewGrowth || 0,
      icon: EyeIcon,
      color: 'red'
    },
    {
      title: 'Early Access Signups',
      value: stats.earlyAccessSignups || 0,
      change: stats.signupGrowth || 0,
      icon: HeartIcon,
      color: 'pink'
    }
  ]

  const topContent = [
    { title: 'Most Viewed Posts', data: stats.topPosts || [] },
    { title: 'Popular Webinars', data: stats.topWebinars || [] },
    { title: 'Active Apps', data: stats.topApps || [] }
  ]

  const recentActivity = stats.recentActivity || []

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Monitor your TQRS CMS performance and user engagement</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-auto"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button 
            onClick={fetchAnalytics}
            className="btn-primary"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metricCards.map((metric, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUpIcon className={`w-4 h-4 ${
                    metric.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`text-sm font-medium ml-1 ${
                    metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {topContent.map((section, index) => (
          <div key={index} className="card">
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
            <div className="space-y-3">
              {section.data.slice(0, 5).map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title || item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.views || item.signups || 0} {item.views ? 'views' : 'signups'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {item.percentage || 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 bg-${activity.type === 'user' ? 'blue' : 
                  activity.type === 'post' ? 'green' : 
                  activity.type === 'webinar' ? 'purple' : 'orange'}-100 rounded-full flex items-center justify-center`}>
                  {activity.type === 'user' && <UsersIcon className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'post' && <DocumentTextIcon className="w-4 h-4 text-green-600" />}
                  {activity.type === 'webinar' && <PlayIcon className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'app' && <DevicePhoneMobileIcon className="w-4 h-4 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Geographic Distribution */}
      {stats.geographicData && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.geographicData.map((region, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <GlobeAltIcon className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                <p className="font-medium">{region.country}</p>
                <p className="text-2xl font-bold text-primary-600">{region.users}</p>
                <p className="text-sm text-gray-500">{region.percentage}% of total</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Database Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Email Service</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Storage Usage</span>
              <span className="text-sm font-medium">{stats.storageUsage || '0'}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Uptime</span>
              <span className="text-sm font-medium">{stats.uptime || '99.9'}%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-sm">
              <AcademicCapIcon className="w-4 h-4 mr-2 inline" />
              Generate Report
            </button>
            <button className="w-full btn-outline text-sm">
              <ChartBarIcon className="w-4 h-4 mr-2 inline" />
              Export Data
            </button>
            <button className="w-full btn-secondary text-sm">
              <TrendingUpIcon className="w-4 h-4 mr-2 inline" />
              View Trends
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics 