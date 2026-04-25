import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, Shield, GraduationCap, ChevronRight } from 'lucide-react';
import { siteContent } from '../data/siteContent';

const Courses = () => {
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
            <BookOpen className="w-10 h-10 text-blue-300" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-6"
          >
            Academic Programs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Comprehensive dental education designed to forge the next generation of healthcare leaders.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {siteContent.courses.map((course, idx) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className={`p-8 ${idx === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-700' : idx === 1 ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' : 'bg-gradient-to-br from-cyan-500 to-cyan-700'} text-white`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold tracking-wider">
                    {course.code}
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold mb-2 leading-tight">{course.name}</h2>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-gray-600 mb-8 flex-1">{course.description}</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Duration</div>
                      <div className="font-bold">{course.duration}</div>
                    </div>
                  </div>
                  {course.intake && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Annual Intake</div>
                        <div className="font-bold">{course.intake} Students</div>
                      </div>
                    </div>
                  )}
                  {course.regulatory && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Accreditation</div>
                        <div className="font-bold">{course.regulatory}</div>
                      </div>
                    </div>
                  )}
                  {course.current && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Current Offering</div>
                        <div className="font-bold">{course.current}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <a href="/admissions" className="block w-full py-4 text-center rounded-xl bg-gray-50 text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                  View Admissions <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
