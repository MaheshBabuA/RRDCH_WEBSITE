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
import DoctorDashboard from './pages/DoctorDashboard';
import Research from './pages/Research';

// Integrated Pages
import Courses from './pages/Courses';
import Facilities from './pages/Facilities';
import Alumni from './pages/Alumni';
import Academics from './pages/Academics';
import Login from './pages/Login';
import StaffManagement from './pages/StaffManagement';

function App() {
  const [connectionError, setConnectionError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const checkConnectivity = async () => {
    setIsRetrying(true);
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      if (data.status === 'ok') {
        setConnectionError(false);
      } else {
        setConnectionError(true);
      }
    } catch (err) {
      console.warn('Backend not reachable:', err.message);
      setConnectionError(true);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    checkConnectivity();
    const interval = setInterval(checkConnectivity, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* PREMIUM GLASSMORPHIC CONNECTION TOAST */}
      {connectionError && (
        <div className="fixed bottom-10 right-10 z-[9999] animate-bounce-slow">
          <div className="glass-panel p-6 rounded-[32px] border border-white/40 shadow-2xl backdrop-blur-2xl flex items-center gap-6 bg-white/20">
            <div className="relative">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl animate-pulse">
                📡
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white animate-ping"></div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">
                System Alert
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Server Connecting...</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Re-establishing clinical handshake
              </p>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={checkConnectivity}
                disabled={isRetrying}
                className="px-6 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all disabled:opacity-50"
              >
                {isRetrying ? 'Syncing...' : 'Retry'}
              </button>
              <button 
                onClick={() => setConnectionError(false)} 
                className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 text-center"
              >
                Dismiss
              </button>
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
          <Route path="login" element={<Login />} />
          <Route path="staff/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="staff/reception-dashboard" element={<ReceptionDashboard />} />
          <Route path="staff/management" element={<StaffManagement />} />

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

const styles = `
  @keyframes bounceSlow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-bounce-slow {
    animation: bounceSlow 3s ease-in-out infinite;
  }
  .glass-panel {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default App;
