import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PageWrapper from './pages/Index';

import Appointments from './pages/Appointments';
import Departments from './pages/Departments';
import DepartmentDetail from './pages/DepartmentDetail';
import Events from './pages/Events';
import HostelComplaints from './pages/HostelComplaints';
import Feedback from './pages/Feedback';
import About from './pages/About';
import Contact from './pages/Contact';
import StudentPortal from './pages/StudentPortal';
import Admissions from './pages/Admissions';
import AISymptomChecker from './pages/AISymptomChecker';
import PatientPortal from './pages/PatientPortal';
import VideoGallery from './pages/VideoGallery';
import ContactUs from './pages/ContactUs';

import ReceptionDashboard from './pages/ReceptionDashboard';
import Achievements from './pages/Achievements';
import DoctorConsole from './pages/DoctorConsole';
import Research from './pages/Research';

// Integrated Pages
import Courses from './pages/Courses';
import Facilities from './pages/Facilities';
import Alumni from './pages/Alumni';
import Academics from './pages/Academics';

function App() {
  const [connectionError, setConnectionError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const checkConnectivity = async () => {
    setIsRetrying(true);
    try {
      const res = await fetch('http://localhost:5000/api/health');
      const data = await res.json();
      if (data.status === 'ok') {
        console.log('✅ Backend Connected Successfully');
        setConnectionError(false);
      } else {
        setConnectionError(true);
      }
    } catch (err) {
      console.error('❌ Backend Connection Failed:', err);
      setConnectionError(true);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    checkConnectivity();
    // Re-check every 30 seconds
    const interval = setInterval(checkConnectivity, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* GLOBAL ERROR BOUNDARY MODAL (Glassmorphism) */}
      {connectionError && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="glass-panel max-w-md w-full p-12 rounded-[56px] text-center space-y-8 border-white/40 shadow-2xl teal-bloom bg-white/70">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
               <span className="text-5xl">📡</span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Connection Lost</h2>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">
                Connecting to Hospital Server... <br/>
                Please ensure the clinical backend is active.
              </p>
            </div>

            <button 
              onClick={checkConnectivity}
              disabled={isRetrying}
              className={`w-full py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${
                isRetrying 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-[#008080] hover:shadow-[#008080]/30'
              }`}
            >
              {isRetrying ? 'Attempting Sync...' : 'Retry Connection'}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></div>
               RRDCH Digital Health Systems
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<PageWrapper />}>
          <Route index element={<Home />} />

          <Route path="video-gallery" element={<VideoGallery />} />
          <Route path="ai-checker" element={<AISymptomChecker />} />
          <Route path="patient-portal" element={<PatientPortal />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="book-appointment" element={<Appointments />} />

          <Route path="departments">
            <Route index element={<Departments />} />
            <Route path=":id" element={<DepartmentDetail />} />
          </Route>

          <Route path="events" element={<Events />} />
          <Route path="hostel-complaints" element={<HostelComplaints />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="about" element={<About />} />
          <Route path="student-portal" element={<StudentPortal />} />
          <Route path="admissions" element={<Admissions />} />
          
          {/* Clinical & Research Routes */}
          <Route path="research" element={<Research />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="doctor-console" element={<DoctorConsole />} />

          {/* Academic Routes */}
          <Route path="courses" element={<Courses />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="alumni" element={<Alumni />} />
          <Route path="academics" element={<Academics />} />

          {/* Status & Redirection */}
          <Route path="check-status" element={<Navigate to="/student-portal" replace />} />
          <Route path="syllabus" element={<Navigate to="/student-portal" replace />} />

          {/* Hidden Staff-Only Routes */}
          <Route path="staff/doctor-dashboard" element={<DoctorConsole />} />
          <Route path="staff/reception-dashboard" element={<ReceptionDashboard />} />

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <div className="p-20 text-center text-xl font-bold text-gray-500">
                🚧 Page Under Construction 🚧
              </div>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
