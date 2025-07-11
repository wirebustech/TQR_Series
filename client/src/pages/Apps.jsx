import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, LightBulbIcon, UserPlusIcon } from '@heroicons/react/24/outline'

const Apps = () => {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch('/api/apps')
        const data = await res.json()
        setApps(data.apps || [])
      } catch (error) {
        console.error('Error fetching apps:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchApps()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="pt-16 lg:pt-20">
      <section className="gradient-bg section-padding">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Qualitative Research Apps by TQRS
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              The TQRS team is building innovative qualitative research applications to help you collect, analyze, and report qualitative data with ease. Our apps are designed to empower researchers at all levels, making high-quality research tools accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="#early-access" className="btn-primary text-lg px-8 py-3">
                Request Early Access
                <UserPlusIcon className="w-5 h-5 ml-2 inline" />
              </a>
            </div>
            <p className="text-gray-600 text-base mb-2">
              <LightBulbIcon className="w-5 h-5 inline mr-1 text-primary-600" />
              <span>
                The admin portal enables the TQRS team to add new apps, update app information, and manage early access signups. When an app is released, its details and download/access links can be updated instantly for all users.
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Applications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our suite of qualitative research tools. Sign up for early access to be among the first to try new releases!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {apps.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                No apps available yet. Stay tuned for updates!
              </div>
            )}
            {apps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-xl transition-shadow duration-300"
                id={app.id}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{app.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{app.name}</h3>
                    <p className="text-gray-600 mb-4">{app.description}</p>
                    {app.features && (
                      <ul className="text-gray-500 text-sm mb-2 list-disc list-inside">
                        {Array.isArray(app.features)
                          ? app.features.map((f, i) => <li key={i}>{f}</li>)
                          : null}
                      </ul>
                    )}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'released' ? 'bg-green-100 text-green-800' :
                        app.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    {app.signup_url && (
                      <a href={app.signup_url} className="btn-primary text-sm mr-2" target="_blank" rel="noopener noreferrer">
                        Early Access Signup
                      </a>
                    )}
                    {app.demo_url && (
                      <a href={app.demo_url} className="btn-outline text-sm" target="_blank" rel="noopener noreferrer">
                        Try Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access Signup Section */}
      <section id="early-access" className="section-padding bg-primary-50">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Request Early Access</h2>
            <p className="text-lg text-gray-700 mb-6">
              Want to be among the first to try our qualitative research apps? Sign up below and we’ll notify you as soon as they’re available!
            </p>
            {/* Early access signup form placeholder */}
            <form className="bg-white rounded-lg shadow p-6 flex flex-col gap-4 items-center mx-auto max-w-md">
              <input type="text" className="input-field" placeholder="Your Name" required />
              <input type="email" className="input-field" placeholder="Your Email" required />
              <input type="text" className="input-field" placeholder="Organization (optional)" />
              <button type="submit" className="btn-primary w-full">Sign Up for Early Access</button>
            </form>
            <p className="text-xs text-gray-500 mt-2">We respect your privacy. You’ll only receive updates about TQRS apps.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Apps 