import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="main-nav" style={{ padding: '1rem', background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="logo">
          <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', textDecoration: 'none', color: '#333' }}>RRDCH</Link>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/appointments">Appointments</Link>
          <Link to="/departments">Departments</Link>
          <Link to="/events">Events</Link>
          <Link to="/student-portal">Student Portal</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
