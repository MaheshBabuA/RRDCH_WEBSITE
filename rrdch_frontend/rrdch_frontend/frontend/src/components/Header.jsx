import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="w-full flex flex-col shadow-md z-50">
      {/* Layer 1: Top Utility Bar */}
      <div className="bg-secondary-blue text-white py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[11px] sm:text-xs font-semibold tracking-wide">
          {/* Left: Contact Info */}
          <div className="flex items-center space-x-6">
            <a href="tel:+918028437102" className="flex items-center hover:text-primary-blue transition-colors">
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +91 80 2843 7102
            </a>
            <a href="mailto:info@rrdch.edu.in" className="flex items-center hover:text-primary-blue transition-colors">
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@rrdch.edu.in
            </a>
          </div>

          {/* Right: Utility Links */}
          <div className="flex items-center space-x-6 mt-2 md:mt-0 uppercase">
            <a href="#" className="hover:text-primary-blue transition-colors">ERP Login</a>
            <a href="#" className="hover:text-primary-blue transition-colors">ESI Portal</a>
            <Link to="/patient-portal" className="bg-primary-blue/20 text-primary-blue px-3 py-1 rounded-md hover:bg-primary-blue hover:text-white transition-all font-bold">Patient Portal</Link>
            <Link to="/ai-checker" className="text-success-green hover:underline">AI Checker</Link>
          </div>
        </div>
      </div>

      {/* Layer 2: Brand & Search Section */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: RRDCH Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-blue rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-xl">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-secondary-blue leading-none tracking-tight">RRDCH</span>
              <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] mt-1">Dental College & Hospital</span>
            </div>
          </Link>

          {/* Middle: Search Bar */}
          <div className={`relative flex-grow max-w-lg transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
            <input 
              type="text" 
              placeholder="Search departments, courses, services..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Right: Recognition/Accreditation */}
          <div className="hidden lg:flex items-center space-x-4 text-right">
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase">Recognized By</span>
                <span className="text-sm font-extrabold text-secondary-blue">Royal College of Surgeons</span>
             </div>
             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-help" title="RCS England Accredited">
                🎓
             </div>
          </div>
        </div>
      </div>

      {/* Layer 3: Main Navigation Bar (Sticky-ready) */}
      <nav className="bg-[#008080] text-white sticky top-0 shadow-lg px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex space-x-1">
            <NavLink to="/" label="Home" />
            <NavDropdown 
              label="About Us" 
              items={[
                { label: 'Our History', to: '/about' },
                { label: 'Vision & Mission', to: '/about' },
                { label: 'Leadership', to: '/about' },
                { label: 'Video Gallery', to: '/video-gallery', highlight: true },
                { label: 'Quality Policy', to: '/about' }
              ]} 
            />
            <NavDropdown label="Departments" items={['Oral Surgery', 'Orthodontics', 'Periodontics', 'Prosthodontics', 'Conservative Dentistry']} />
            <NavDropdown 
              label="Academics" 
              items={[
                { label: 'BDS Course', to: '/admissions' },
                { label: 'MDS Specializations', to: '/admissions' },
                { label: 'PhD Programs', to: '/admissions' },
                { label: 'Certificate Courses', to: '/admissions' },
                { label: 'Student Portal', to: '/student-portal', highlight: true }
              ]} 
            />
            <NavLink to="/campus-life" label="Campus Life" />
            <NavLink to="/research" label="Research" />
            <NavLink to="/contact" label="Contact" />
          </div>

          {/* Language Toggle & Mobile Menu (Simplified) */}
          <div className="flex items-center space-x-4">
             <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs font-bold transition-all">ಕನ್ನಡ</button>
             <Link to="/book-appointment" className="bg-success-green hover:bg-green-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all">Book Now</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

const NavLink = ({ to, label }) => (
  <Link to={to} className="px-4 py-4 text-sm font-bold hover:bg-white/10 transition-all border-b-2 border-transparent hover:border-white">
    {label}
  </Link>
);

const NavDropdown = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="px-4 py-4 text-sm font-bold flex items-center hover:bg-white/10 transition-all border-b-2 border-transparent group-hover:border-white">
        {label}
        <svg className={`ml-1.5 w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full w-64 bg-white shadow-2xl rounded-b-xl overflow-hidden animate-fade-in border-t-2 border-[#008080] py-2">
          {items.map((item, idx) => {
            const label = typeof item === 'string' ? item : item.label;
            const to = typeof item === 'string' ? '#' : item.to;
            const highlight = item.highlight;

            return (
              <Link 
                key={idx} 
                to={to} 
                className={`block px-6 py-3 text-sm font-semibold transition-all ${highlight ? 'bg-[#008080]/5 text-[#008080] border-l-4 border-[#008080]' : 'text-secondary-blue hover:bg-gray-50 hover:text-[#008080]'}`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Header;
