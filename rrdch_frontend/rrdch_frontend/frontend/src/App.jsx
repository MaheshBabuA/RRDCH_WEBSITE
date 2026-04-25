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
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionDashboard from './pages/ReceptionDashboard';
import Achievements from './pages/Achievements';
import DoctorConsole from './pages/DoctorConsole';
import Research from './pages/Research';

// Academic Pages
import Courses from './pages/Courses';
import Facilities from './pages/Facilities';
import Alumni from './pages/Alumni';
import Academics from './pages/Academics';

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
        <Route path="student-portal" element={<StudentPortal />} />
        <Route path="admissions" element={<Admissions />} />

        {/* Doctor Dashboard Routes */}
        <Route path="research" element={<Research />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="doctor-console" element={<DoctorConsole />} />

        {/* Academic Routes */}
        <Route path="courses" element={<Courses />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="alumni" element={<Alumni />} />
        <Route path="academics" element={<Academics />} />

        <Route
          path="check-status"
          element={<Navigate to="/student-portal" replace />}
        />
        <Route
          path="syllabus"
          element={<Navigate to="/student-portal" replace />}
        />

        {/* Hidden Staff Routes */}
        <Route
          path="staff/doctor-dashboard"
          element={<DoctorDashboard />}
        />
        <Route
          path="staff/reception-dashboard"
          element={<ReceptionDashboard />}
        />

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
  );
}

export default App;