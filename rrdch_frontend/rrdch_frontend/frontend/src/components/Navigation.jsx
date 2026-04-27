import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import logo from '../assets/logo.jpg';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => {
    setIsOpen(false);
    setPatientDropdownOpen(false);
  };

  const navLinkClasses = (path) => `
    block px-3 py-2 rounded-xl text-base font-semibold transition-all duration-300
    ${isActive(path) 
      ? 'text-primary-blue bg-primary-blue/10 shadow-sm' 
      : 'text-text-muted hover:text-primary-blue hover:bg-primary-blue/5'}
  `;

  return (
    <>
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-soft shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3" onClick={closeMenu}>
               <img src={logo} alt="RRDCH Logo" className="h-12 w-12 object-contain rounded-full" />
               <div className="hidden sm:block mt-0.5">
                 <span className="font-bold text-xl text-secondary-blue block leading-tight tracking-tight">RRDCH</span>
                 <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold leading-tight">Centre of Excellence</span>
               </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            <Link to="/" className={navLinkClasses('/')}>
              {t('navbar.home')}
            </Link>
            
            {/* About Us Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className={`flex items-center px-3 py-2 rounded-xl text-base font-semibold transition-all duration-300 text-text-muted group-hover:text-primary-blue group-hover:bg-primary-blue/5`}>
                About Us
                <svg className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 top-[100%] w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transition-all duration-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0">
                <div className="py-2 px-1">
                  <Link to="/about" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>{t('navbar.about')}</Link>
                  <Link to="/facilities" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>Facilities</Link>
                  <Link to="/alumni" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>Alumni</Link>
                  <Link to="/events" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>Events</Link>
                </div>
              </div>
            </div>

            {/* Academic Services Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className={`flex items-center px-3 py-2 rounded-xl text-base font-semibold transition-all duration-300 text-text-muted group-hover:text-primary-blue group-hover:bg-primary-blue/5`}>
                {t('navbar.academicServices')}
                <svg className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 top-[100%] w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transition-all duration-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0">
                <div className="py-2 px-1">
                  <Link to="/courses" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>Courses</Link>
                  <Link to="/academics" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>{t('navbar.academics')}</Link>
                  <Link to="/departments" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>{t('navbar.departments')}</Link>
                  <Link to="/admissions" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>{t('navbar.admissions')}</Link>
                  <Link to="/student-portal" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>{t('navbar.studentPortal')}</Link>
                </div>
              </div>
            </div>

            {/* Patient Services Dropdown */}
            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setPatientDropdownOpen(true)}
              onMouseLeave={() => setPatientDropdownOpen(false)}
            >
              <button className={`flex items-center block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-neutral-gray group-hover:text-primary-blue group-hover:bg-gray-50`}>
                {t('navbar.patientServices')}
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {patientDropdownOpen && (
                <div className="absolute left-0 top-full mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link to="/book-appointment" className="block px-4 py-2 text-sm text-neutral-gray hover:bg-gray-50 hover:text-primary-blue transition-colors" onClick={closeMenu}>{t('navbar.bookAppointment')}</Link>
                    <Link to="/check-status" className="block px-4 py-2 text-sm text-neutral-gray hover:bg-gray-50 hover:text-primary-blue transition-colors" onClick={closeMenu}>{t('navbar.checkStatus')}</Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/contact" className={navLinkClasses('/contact')}>
              {t('navbar.contact')}
            </Link>
          </div>

          {/* Right Section (Lang Toggle + Desktop CTA) */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-light hover:border-primary-blue hover:text-primary-blue focus:ring-2 focus:ring-primary-blue/30 transition-all text-sm font-medium text-neutral-gray"
              title={`Switch to ${language === 'en' ? 'Kannada' : 'English'}`}
            >
              <GlobeIcon className="w-4 h-4" />
              <span>{language === 'en' ? 'KN' : 'EN'}</span>
            </button>
            <Link to="/book-appointment" className="btn-primary text-sm px-5 py-2">
              {t('navbar.bookAppointment')}
            </Link>
          </div>
          
          {/* Mobile Right Section (Just Lang Toggle for now, Menu is at bottom) */}
          <div className="md:hidden flex items-center gap-2">
             <button 
               onClick={toggleLanguage}
               className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border-light hover:border-primary-blue hover:text-primary-blue transition-all text-[10px] font-black uppercase text-neutral-gray"
             >
               <GlobeIcon className="w-3 h-3" />
               {language === 'en' ? 'KN' : 'EN'}
             </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Bottom Navigation Bar */}
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-[100] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
       <div className="flex items-center justify-around h-16 px-2">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-primary-blue' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/') ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
          </Link>
          
          <Link to="/book-appointment" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/book-appointment') ? 'text-primary-blue' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/book-appointment') ? 2.5 : 2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Book</span>
          </Link>

          <Link to="/check-status" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/check-status') ? 'text-primary-blue' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/check-status') ? 2.5 : 2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Portal</span>
          </Link>
          
          <button onClick={() => setIsOpen(!isOpen)} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isOpen ? 'text-primary-blue' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isOpen ? 2.5 : 2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Menu</span>
          </button>
       </div>
    </div>

    {/* Mobile Slide-Up Menu Overlay */}
    {isOpen && (
      <div className="md:hidden fixed inset-0 z-[90] bg-white pt-24 pb-20 overflow-y-auto px-6 animate-fade-in">
         <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-6 uppercase">Menu</h2>
         
         <div className="space-y-6">
            <div>
              <div className="text-[10px] font-black text-primary-blue uppercase tracking-widest mb-3">About Us</div>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/about" className="p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-700" onClick={closeMenu}>{t('navbar.about')}</Link>
                <Link to="/facilities" className="p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-700" onClick={closeMenu}>Facilities</Link>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black text-primary-blue uppercase tracking-widest mb-3">{t('navbar.academicServices')}</div>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/courses" className="p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-700" onClick={closeMenu}>Courses</Link>
                <Link to="/academics" className="p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-700" onClick={closeMenu}>{t('navbar.academics')}</Link>
                <Link to="/departments" className="p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-700" onClick={closeMenu}>{t('navbar.departments')}</Link>
                <Link to="/student-portal" className="p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-700" onClick={closeMenu}>{t('navbar.studentPortal')}</Link>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black text-primary-blue uppercase tracking-widest mb-3">Support</div>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/contact" className="p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-700" onClick={closeMenu}>{t('navbar.contact')}</Link>
              </div>
            </div>
         </div>
      </div>
    )}
    </>
  );
};

const GlobeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

export default Navigation;
