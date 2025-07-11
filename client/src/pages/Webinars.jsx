import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlayIcon, AcademicCapIcon, UsersIcon, LightBulbIcon } from '@heroicons/react/24/outline'

const topics = [
  'Designing and conducting qualitative research',
  'Managing robust data',
  'Applying different methodologies',
  'Analyzing your data',
  'Synthesising and triangulating results',
  'Interpreting and reporting findings',
]

const Webinars = () => {
  const [webinars, setWebinars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const res = await fetch('/api/webinars')
        const data = await res.json()
        setWebinars(data.webinars || [])
      } catch (error) {
        console.error('Error fetching webinars:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWebinars()
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
              TQRS Webinars & Learning Space
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Welcome to this foundational learning space! TQRS offers free online sessions, including webinars (lectures plus Q&A), hands-on training, and interactive workshops. Our goal is to bridge gaps in learning and understanding, especially for students and early- to mid-career researchers in the Global South.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
                <AcademicCapIcon className="w-5 h-5 mr-2" />
                Free & Open to All
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg font-medium">
                <UsersIcon className="w-5 h-5 mr-2" />
                Global Community
              </span>
            </div>
            <p className="text-gray-600 text-base mb-2">
              <LightBulbIcon className="w-5 h-5 inline mr-1 text-primary-600" />
              <span>
                Topics may not be exhaustive. We are always expanding our offerings based on community needs.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Topics Include</h2>
            <ul className="text-lg text-gray-700 max-w-2xl mx-auto text-left list-disc list-inside space-y-2">
              {topics.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 mt-4">Kindly note that topics may not be exhaustive.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webinars.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                No webinars available yet. Stay tuned for upcoming sessions!
              </div>
            )}
            {webinars.map((webinar, index) => (
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
        </div>
      </section>
    </div>
  )
}

export default Webinars 