import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon,
  PlayIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UsersIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

const Home = () => {
  const [contentSections, setContentSections] = useState({})
  const [apps, setApps] = useState([])
  const [webinars, setWebinars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch content sections
        const sectionsRes = await fetch('/api/content/sections')
        const sectionsData = await sectionsRes.json()
        const sectionsMap = {}
        sectionsData.sections.forEach(section => {
          sectionsMap[section.section_key] = section
        })
        setContentSections(sectionsMap)

        // Fetch apps
        const appsRes = await fetch('/api/apps')
        const appsData = await appsRes.json()
        setApps(appsData.apps || [])

        // Fetch webinars
        const webinarsRes = await fetch('/api/webinars')
        const webinarsData = await webinarsRes.json()
        setWebinars(webinarsData.webinars || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
      {/* Hero Section */}
      <section className="gradient-bg section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Qualitative Research Series (TQRS)
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              TQRS is a high-level qualitative research training and consultation organization. We bridge gaps in learning and understanding, simplify the use of qualitative data, methodologies, and analysis, and empower researchers worldwide—especially in the Global South. Our mission is to make qualitative research accessible, robust, and impactful for all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about" className="btn-primary text-lg px-8 py-3">
                Learn More
                <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link to="/apps" className="btn-outline text-lg px-8 py-3">
                Explore Our Apps
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About TQRS Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About TQRS</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Founded by Rising Scholars and experts from diverse backgrounds, TQRS provides foundational learning spaces, free online sessions, and hands-on workshops. We support students and early- to mid-career researchers, focusing on those in the Global South who face unique research challenges. Our expert-led sessions cover designing and conducting qualitative research, managing robust data, applying methodologies, analyzing and synthesizing data, and reporting findings.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: AcademicCapIcon,
                title: 'Expert-Led Training',
                description: 'Access foundational and advanced qualitative research training from global experts.'
              },
              {
                icon: ChartBarIcon,
                title: 'Consultation & Support',
                description: 'Get personalized consultation and support for your qualitative research projects.'
              },
              {
                icon: UsersIcon,
                title: 'Global Community',
                description: 'Join a diverse network of researchers, with a special focus on the Global South.'
              },
              {
                icon: LightBulbIcon,
                title: 'Innovative Tools',
                description: 'Benefit from cutting-edge qualitative research apps and digital resources.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apps Section */}
      {apps.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Qualitative Research Apps by TQRS</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The TQRS team is building innovative qualitative research applications to help you collect, analyze, and report qualitative data with ease. Sign up for early access and be the first to experience our new tools!
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {apps.slice(0, 2).map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{app.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{app.name}</h3>
                      <p className="text-gray-600 mb-4">{app.description}</p>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.status === 'released' ? 'bg-green-100 text-green-800' :
                          app.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <Link to={`/apps#${app.id}`} className="btn-primary text-sm">
                        Learn More
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/apps" className="btn-outline text-lg px-8 py-3">
                View All Applications
                <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Latest Webinars */}
      {webinars.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Webinars</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay updated with our latest educational content and research insights. Join our free online sessions, including lectures, Q&A, and interactive workshops on qualitative research topics.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {webinars.slice(0, 3).map((webinar, index) => (
                <motion.div
                  key={webinar.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    {webinar.video_url ? (
                      <a
                        href={webinar.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors duration-200"
                      >
                        <PlayIcon className="w-8 h-8 text-white" />
                      </a>
                    ) : (
                      <div className="text-gray-500">No video available</div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{webinar.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{webinar.description}</p>
                  {webinar.date_time && (
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(webinar.date_time).toLocaleDateString()}
                    </p>
                  )}
                  {webinar.registration_url && (
                    <a
                      href={webinar.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm w-full"
                    >
                      Register Now
                    </a>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/webinars" className="btn-outline text-lg px-8 py-3">
                View All Webinars
                <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Join thousands of researchers who are already using TQRS to advance their work and make meaningful discoveries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Contact Us
              </Link>
              <Link to="/support" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Support Our Mission
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 