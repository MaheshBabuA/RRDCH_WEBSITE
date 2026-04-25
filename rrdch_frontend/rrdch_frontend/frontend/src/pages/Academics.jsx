import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, FileText, Download, ChevronRight } from 'lucide-react';
import { siteContent } from '../data/siteContent';

const Academics = () => {
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
            Academics & Research
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Fostering an environment of rigorous learning, clinical excellence, and groundbreaking research.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
        
        {/* Research Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Research Focus Areas</h2>
            <div className="w-16 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteContent.research.activeAreas.map((area, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{area}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Publications & Collaborations</h3>
              <p className="text-blue-800/80">
                {siteContent.research.publications} | {siteContent.research.collaborations}
              </p>
            </div>
            <button className="shrink-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              View Research Journal
            </button>
          </div>
        </section>

        {/* E-Content & Results */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-7 h-7 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">E-Content Portal</h2>
            <p className="text-gray-600 mb-6">
              Access digital study materials, recorded lectures, and extensive library databases from anywhere.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800">
              Access E-Content <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6">
              <Download className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Examination Results</h2>
            <p className="text-gray-600 mb-6">
              Check latest university results, download marksheets, and view examination schedules.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-800">
              View Results <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Academics;
