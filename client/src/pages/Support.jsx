import { motion } from 'framer-motion'
import { HeartIcon, AcademicCapIcon, LightBulbIcon } from '@heroicons/react/24/outline'

const Support = () => {
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
              Support The Qualitative Research Series (TQRS)
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Your support helps us make qualitative research accessible, robust, and impactful for researchers worldwide—especially those in the Global South. Every contribution enables us to offer free training, develop innovative research tools, and expand our reach to more communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
                <HeartIcon className="w-5 h-5 mr-2" />
                Contribute to Our Mission
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg font-medium">
                <AcademicCapIcon className="w-5 h-5 mr-2" />
                Empower Researchers
              </span>
            </div>
            <p className="text-gray-600 text-base mb-2">
              <LightBulbIcon className="w-5 h-5 inline mr-1 text-primary-600" />
              <span>
                Your donation supports the development of new qualitative research apps, free webinars, and hands-on workshops for the global research community.
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How You Can Help</h2>
            <ul className="text-lg text-gray-700 text-left list-disc list-inside space-y-2 mb-8">
              <li>Make a donation to support our free training and outreach programs</li>
              <li>Sponsor a webinar, workshop, or app development</li>
              <li>Partner with us to expand access to qualitative research resources</li>
              <li>Share TQRS with your network to help us reach more researchers</li>
            </ul>
            <form className="bg-primary-50 rounded-lg shadow p-6 flex flex-col gap-4 items-center mx-auto max-w-md">
              <input type="text" className="input-field" placeholder="Your Name" required />
              <input type="email" className="input-field" placeholder="Your Email" required />
              <input type="number" className="input-field" placeholder="Amount (USD)" min="1" required />
              <textarea className="input-field" placeholder="Message (optional)" rows={3}></textarea>
              <button type="submit" className="btn-primary w-full">Contribute</button>
            </form>
            <p className="text-xs text-gray-500 mt-2">All contributions go directly to supporting TQRS’s mission and expanding our impact.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-primary-600 text-white">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Thank You for Your Support!</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Together, we are building a stronger, more inclusive future for qualitative research. Your support makes a real difference.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Support 