import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, Activity, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteContent } from '../data/siteContent';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for smooth animations
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 md:gap-24 -mt-8 bg-gray-50 min-h-screen pb-16">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Subtle overlay patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 pt-20 pb-16">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left text-white"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-700/50 text-blue-100 font-semibold text-sm mb-6 border border-blue-600/50 backdrop-blur-sm">
              Est. {siteContent.institution.established} • {siteContent.institution.recognitions[0]}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
              Excellence in <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300">
                Dental Care & Education
              </span>
            </h1>
            <p className="text-xl text-blue-100/90 mb-10 max-w-xl font-light leading-relaxed">
              {siteContent.aboutUs.vision}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book-appointment">
                <button className="w-full sm:w-auto bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-900/20 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group">
                  Book Appointment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/admissions">
                <button className="w-full sm:w-auto bg-transparent border-2 border-blue-400/30 hover:border-blue-300 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                  Admissions {siteContent.courses.find(c => c.code === 'CERT')?.current.split(' ')[1]}
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Stats Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-[450px] shrink-0"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <Activity className="text-cyan-400" /> Daily Campus Activity
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-blue-100">Outpatient Flow</span>
                  <span className="text-white font-bold text-2xl">{siteContent.institution.dailyPatients}+</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-blue-100">Dental Units</span>
                  <span className="text-white font-bold text-2xl">{siteContent.institution.dentalUnits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Departments</span>
                  <span className="text-white font-bold text-2xl">{siteContent.departments.length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Recognitions Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-wrap justify-center gap-8 md:gap-16 items-center">
          {siteContent.institution.recognitions.map((rec, idx) => (
            <div key={idx} className="flex items-center gap-3 text-gray-700 font-semibold">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span>{rec.split('(')[0].trim()}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Departments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Specialized Care</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Our Departments</h2>
          </div>
          <Link to="/departments" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 mt-4 md:mt-0">
            View all departments <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteContent.departments.slice(0, 8).map((dept, i) => (
            <motion.div 
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <span className="text-2xl font-bold text-blue-600 group-hover:text-white">
                  {dept.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{dept.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{dept.description}</p>
              <Link to={`/departments/${dept.id}`} className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                Learn more <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Upcoming Events */}
      <section className="bg-gray-900 py-20 w-full mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-cyan-400 font-bold tracking-wider uppercase text-sm">Campus Life</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">News & Events</h2>
            </div>
            <Link to="/events" className="text-cyan-400 font-semibold hover:text-cyan-300 flex items-center gap-1 mt-4 md:mt-0">
              View all events <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteContent.events.slice(0, 3).map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-4">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" /> {event.category}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-blue-900/20">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to start your journey?</h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join the legacy of excellence. Apply now for the upcoming academic session or book a consultation with our experts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/admissions">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors w-full sm:w-auto">
                Apply for Admissions
              </button>
            </Link>
            <Link to="/book-appointment">
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors w-full sm:w-auto">
                Book Consultation
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
