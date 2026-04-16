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

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageWrapper />}>
        <Route index element={<Home />} />
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
        <Route path="check-status" element={<Navigate to="/student-portal" replace />} />
        <Route path="syllabus" element={<Navigate to="/student-portal" replace />} />
        <Route path="academics" element={<Navigate to="/admissions" replace />} />
        
        {/* Fallback route for unimplemented pages */}
        <Route path="*" element={<div className="p-20 text-center scale-150">🚧 Page Under Construction 🚧</div>} />
      </Route>
    </Routes>
  );
}

export default App;
