import React from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin } from 'lucide-react';
import { siteContent } from '../data/siteContent';

const Facilities = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-24 relative overflow-hidden -mt-8 mx-[-1rem] sm:mx-[-1.5rem] lg:mx-[-2rem] w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-700"
          >
            <Building className="w-10 h-10 text-blue-300" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-6"
          >
            Campus Facilities
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            World-class infrastructure designed to provide a conducive environment for learning, healing, and holistic growth.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteContent.facilities.map((facility, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 3) * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                {/* Fallback pattern since we don't have images for each */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-900 z-20 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Campus
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{facility.name}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {facility.description}
                </p>
                
                <div className="pt-4 border-t border-gray-100">
                  {facility.capacity && (
                    <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">
                      Capacity: {facility.capacity}
                    </div>
                  )}
                  {facility.hours && (
                    <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg inline-block">
                      {facility.hours}
                    </div>
                  )}
                  {facility.amenities && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {facility.amenities.map((item, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Facilities;
