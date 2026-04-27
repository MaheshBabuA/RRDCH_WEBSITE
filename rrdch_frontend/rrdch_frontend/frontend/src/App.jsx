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
      {/* NON-BLOCKING connection warning toast (bottom-right) */}
      {connectionError && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-amber-500 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold animate-fade-in">
          <span className="text-lg">📡</span>
          <span>Backend offline — some features may be limited.</span>
          <button
            onClick={checkConnectivity}
            disabled={isRetrying}
            className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-50 transition-all"
          >
            {isRetrying ? '...' : 'Retry'}
          </button>
          <button onClick={() => setConnectionError(false)} className="text-white/70 hover:text-white ml-1">✕</button>
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

export default App;
