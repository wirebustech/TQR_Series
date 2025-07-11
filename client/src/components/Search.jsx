import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  DocumentTextIcon,
  PlayIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Search = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    blogs: true,
    webinars: true,
    apps: true
  })
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)

  // Popular search terms
  const popularSearches = [
    'qualitative research',
    'data analysis',
    'interview techniques',
    'focus groups',
    'coding data',
    'research methodology',
    'thematic analysis',
    'grounded theory'
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (query.length > 2) {
      performSearch()
      generateSuggestions()
    } else {
      setResults([])
      setSuggestions([])
    }
  }, [query, filters])

  const performSearch = async () => {
    setLoading(true)
    try {
      const searchParams = new URLSearchParams({
        q: query,
        ...filters
      })
      
      const res = await fetch(`/api/search?${searchParams}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSuggestions = () => {
    const filtered = popularSearches.filter(term => 
      term.toLowerCase().includes(query.toLowerCase())
    )
    setSuggestions(filtered.slice(0, 5))
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    setShowSuggestions(false)
  }

  const getResultIcon = (type) => {
    switch (type) {
      case 'blog':
        return <DocumentTextIcon className="w-5 h-5 text-green-600" />
      case 'webinar':
        return <PlayIcon className="w-5 h-5 text-purple-600" />
      case 'app':
        return <DevicePhoneMobileIcon className="w-5 h-5 text-orange-600" />
      default:
        return <DocumentTextIcon className="w-5 h-5 text-gray-600" />
    }
  }

  const getResultUrl = (result) => {
    switch (result.type) {
      case 'blog':
        return `/blog/${result.slug}`
      case 'webinar':
        return `/webinars#${result.id}`
      case 'app':
        return `/apps#${result.id}`
      default:
        return '#'
    }
  }

  const getResultBadge = (result) => {
    if (result.type === 'app' && result.status) {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          result.status === 'released' ? 'bg-green-100 text-green-800' :
          result.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {result.status}
        </span>
      )
    }
    return null
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
      >
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
        >
          {/* Search Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search blogs, webinars, apps..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4 mt-4">
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400" />
              <div className="flex space-x-4">
                {Object.entries(filters).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Searching...</p>
              </div>
            ) : query.length > 2 ? (
              results.length > 0 ? (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      {results.length} result{results.length !== 1 ? 's' : ''} found
                    </p>
                    <SparklesIcon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <motion.div
                        key={`${result.type}-${result.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={getResultUrl(result)}
                          onClick={onClose}
                          className="block p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getResultIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                  {result.title || result.name}
                                </h3>
                                {getResultBadge(result)}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {result.excerpt || result.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="capitalize">{result.type}</span>
                                {result.date && (
                                  <span>{new Date(result.date).toLocaleDateString()}</span>
                                )}
                                {result.views && (
                                  <span>{result.views} views</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">No results found for "{query}"</p>
                  <p className="text-sm text-gray-400">Try different keywords or check your filters</p>
                </div>
              )
            ) : (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(term)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Access</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Link
                        to="/blog"
                        onClick={onClose}
                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <DocumentTextIcon className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">Blog Posts</span>
                      </Link>
                      <Link
                        to="/webinars"
                        onClick={onClose}
                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <PlayIcon className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium">Webinars</span>
                      </Link>
                      <Link
                        to="/apps"
                        onClick={onClose}
                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <DevicePhoneMobileIcon className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium">Apps</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Suggestions */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border-t border-gray-200 p-4"
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Suggestions</h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left p-2 rounded hover:bg-gray-50 text-sm text-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Search 