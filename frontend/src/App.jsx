import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Providers
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider } from './context/AppContext';

// Layout & Common
import Layout from '../components/layout/Layout';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Pages
import Home from '../pages/Home';
import Appointments from '../pages/Appointments';
import AppointmentDetail from '../pages/AppointmentDetail';
import HostelComplaints from '../pages/HostelComplaints';
import Departments from '../pages/Departments';
import DepartmentDetail from '../pages/DepartmentDetail';
import Events from '../pages/Events';
import About from '../pages/About';
import Contact from '../pages/Contact';
import StudentPortal from '../pages/StudentPortal';
import Feedback from '../pages/Feedback';
import NotFound from '../pages/NotFound';

function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Layout>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/appointments/:id" element={<AppointmentDetail />} />
                <Route path="/complaints" element={<HostelComplaints />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/departments/:id" element={<DepartmentDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/student-portal" element={<StudentPortal />} />
                <Route path="/feedback" element={<Feedback />} />

                {/* 404 Routes */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ErrorBoundary>
        </BrowserRouter>
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
