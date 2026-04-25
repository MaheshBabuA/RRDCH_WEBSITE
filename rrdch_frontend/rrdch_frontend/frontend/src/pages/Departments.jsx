import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteContent } from '../data/siteContent';

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = siteContent.departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-24 relative overflow-hidden -mt-8 mx-[-1rem] sm:mx-[-1.5rem] lg:mx-[-2rem] w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left flex-1">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-800 text-blue-200 font-semibold text-sm mb-6 border border-blue-700">
              Clinical Specializations
            </span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold mb-6"
            >
              Our Departments
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-blue-100 max-w-xl mx-auto md:mx-0"
            >
              Explore our state-of-the-art clinical and academic departments dedicated to excellence in dental healthcare.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-96 relative"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-6 h-6" />
            </div>
            <input 
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl outline-none transition-all duration-300 font-medium placeholder:text-blue-200 text-white focus:ring-4 focus:ring-blue-500/30 shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {filteredDepartments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl text-gray-900 font-bold">No departments found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredDepartments.map((dept, idx) => (
              <motion.div 
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors text-3xl">
                  {dept.icon || <Stethoscope className="w-8 h-8" />}
                </div>
                
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {dept.name}
                </h2>
                
                <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">
                  Head: {dept.headName}
                </div>
                
                <p className="text-gray-600 mb-6 flex-grow">
                  {dept.shortDesc}
                </p>

                <div className="space-y-2 mb-8">
                  <div className="text-sm font-semibold text-gray-900">Key Facilities:</div>
                  <div className="flex flex-wrap gap-2">
                    {dept.facilities.slice(0, 3).map((fac, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                        {fac}
                      </span>
                    ))}
                    {dept.facilities.length > 3 && <span className="text-xs text-gray-400">+{dept.facilities.length - 3} more</span>}
                  </div>
                </div>

                <Link to={`/departments/${dept.id}`} className="mt-auto pt-4 border-t border-gray-100">
                  <button className="w-full py-3 rounded-xl text-blue-600 font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                    View Details <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;
