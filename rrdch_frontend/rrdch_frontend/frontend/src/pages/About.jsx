import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Eye, Users, ChevronRight } from 'lucide-react';
import { siteContent } from '../data/siteContent';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-24 relative overflow-hidden -mt-8 mx-[-1rem] sm:mx-[-1.5rem] lg:mx-[-2rem] w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-6"
          >
            About {siteContent.institution.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            A legacy of excellence since {siteContent.institution.established}.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* History & Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-extrabold text-gray-900">Our Legacy</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
            <p className="text-gray-600 text-lg leading-relaxed">
              {siteContent.aboutUs.history}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl font-black text-blue-600 mb-2">{siteContent.institution.established}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Established</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl font-black text-blue-600 mb-2">{siteContent.institution.dentalUnits}+</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Dental Units</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Campus building" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Accredited</div>
                  <div className="text-sm text-gray-500">NAAC B+ Grade</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                "{siteContent.aboutUs.vision}"
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-cyan-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                "{siteContent.aboutUs.mission}"
              </p>
            </motion.div>
          </div>
        </section>

        {/* Achievements / Core Values */}
        <section className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Why RRDCH?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">We pride ourselves on our comprehensive approach to dental education and patient care.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteContent.aboutUs.achievements.map((achievement, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 text-left"
              >
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-snug">{achievement}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
