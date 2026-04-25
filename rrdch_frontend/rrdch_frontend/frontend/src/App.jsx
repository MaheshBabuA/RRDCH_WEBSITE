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



function App() {
  return (
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
        <Route path="contact" element={<Contact />} />
        <Route path="student-portal" element={<StudentPortal />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="research" element={<Research />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="doctor-console" element={<DoctorConsole />} />


        <Route path="check-status" element={<Navigate to="/student-portal" replace />} />
        <Route path="syllabus" element={<Navigate to="/student-portal" replace />} />
        <Route path="academics" element={<Navigate to="/admissions" replace />} />
        
        {/* Hidden Staff-Only Route — not linked in navigation */}
        <Route path="staff/reception-dashboard" element={<ReceptionDashboard />} />


        {/* Fallback route for unimplemented pages */}
        <Route path="*" element={<div className="p-20 text-center scale-150">🚧 Page Under Construction 🚧</div>} />
      </Route>
    </Routes>
  );
}

export default App;
