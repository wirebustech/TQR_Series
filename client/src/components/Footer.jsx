import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState([])
  const [affiliates, setAffiliates] = useState([])

  useEffect(() => {
    // Fetch social media links
    fetch('/api/social-media')
      .then(res => res.json())
      .then(data => setSocialLinks(data.links || []))
      .catch(err => console.error('Error fetching social links:', err))

    // Fetch affiliates
    fetch('/api/affiliates')
      .then(res => res.json())
      .then(data => setAffiliates(data.affiliates || []))
      .catch(err => console.error('Error fetching affiliates:', err))
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TQRS</span>
              </div>
              <span className="text-xl font-bold">TQRS</span>
            </div>
            <p className="text-gray-300 mb-6">
              Empowering research excellence through innovative solutions and collaborative partnerships.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="sr-only">{link.platform}</span>
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200">
                    <span className="text-xs font-bold">{link.platform.charAt(0)}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/webinars" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Webinars
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/apps" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Our Apps
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">info@tqrs.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Research District, Innovation City</span>
              </div>
            </div>
          </div>

          {/* Affiliates */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Partners</h3>
            <div className="space-y-3">
              {affiliates.slice(0, 3).map((affiliate) => (
                <div key={affiliate.id} className="flex items-center space-x-2">
                  {affiliate.logo_url ? (
                    <img 
                      src={affiliate.logo_url} 
                      alt={affiliate.name}
                      className="w-8 h-8 rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs font-bold">{affiliate.name.charAt(0)}</span>
                    </div>
                  )}
                  <span className="text-gray-300 text-sm">{affiliate.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} The Quality Research Series (TQRS). All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/support" className="text-gray-400 hover:text-white transition-colors duration-200">
                Support Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 