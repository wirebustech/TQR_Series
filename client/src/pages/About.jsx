import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AcademicCapIcon,
  UsersIcon,
  GlobeAltIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

const About = () => {
  const [contentSections, setContentSections] = useState({})
  const [affiliates, setAffiliates] = useState([])
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

        // Fetch affiliates
        const affiliatesRes = await fetch('/api/affiliates')
        const affiliatesData = await affiliatesRes.json()
        setAffiliates(affiliatesData.affiliates || [])
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

  const stats = [
    { icon: AcademicCapIcon, number: '500+', label: 'Research Papers' },
    { icon: UsersIcon, number: '10K+', label: 'Researchers' },
    { icon: GlobeAltIcon, number: '50+', label: 'Countries' },
    { icon: TrophyIcon, number: '25+', label: 'Awards' }
  ]

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
              {contentSections.about?.title || 'About TQRS'}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {contentSections.about?.content || 'The Quality Research Series (TQRS) is dedicated to advancing research methodologies and fostering collaboration across academic and industry sectors.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To empower researchers worldwide with cutting-edge tools, methodologies, and collaborative opportunities that drive innovation and advance human knowledge.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that quality research is the foundation of progress, and we're committed to providing the resources and support needed to make meaningful discoveries.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary-600">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be the leading platform that connects researchers, facilitates collaboration, and accelerates the pace of discovery across all fields of study.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Numbers that reflect our commitment to advancing research excellence worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Excellence',
                description: 'We strive for the highest standards in everything we do, from research methodologies to user experience.'
              },
              {
                title: 'Innovation',
                description: 'We embrace new ideas and technologies to push the boundaries of what's possible in research.'
              },
              {
                title: 'Collaboration',
                description: 'We believe that the best research happens when people work together across disciplines and borders.'
              },
              {
                title: 'Integrity',
                description: 'We maintain the highest ethical standards and transparency in all our research and operations.'
              },
              {
                title: 'Accessibility',
                description: 'We make quality research tools and resources available to researchers at all levels and institutions.'
              },
              {
                title: 'Impact',
                description: 'We focus on research that makes a real difference in the world and advances human knowledge.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold mb-3 text-primary-600">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      {affiliates.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Partners</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We collaborate with leading institutions and organizations worldwide to advance research excellence.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {affiliates.map((affiliate, index) => (
                <motion.div
                  key={affiliate.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4">
                    {affiliate.logo_url ? (
                      <img 
                        src={affiliate.logo_url} 
                        alt={affiliate.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{affiliate.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{affiliate.name}</h3>
                      <p className="text-gray-600 text-sm">{affiliate.description}</p>
                    </div>
                  </div>
                  {affiliate.website_url && (
                    <a
                      href={affiliate.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Visit Website →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Be part of a global network of researchers dedicated to advancing knowledge and making a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Get in Touch
              </a>
              <a href="/support" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Support Our Mission
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About 