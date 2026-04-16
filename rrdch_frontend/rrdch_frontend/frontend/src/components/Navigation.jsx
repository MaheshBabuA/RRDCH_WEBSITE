import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import logo from '../assets/logo.jpg';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
  const [academicDropdownOpen, setAcademicDropdownOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => {
    setIsOpen(false);
    setPatientDropdownOpen(false);
    setAcademicDropdownOpen(false);
  };

  const navLinkClasses = (path) => `
    block px-3 py-2 rounded-xl text-base font-semibold transition-all duration-300
    ${isActive(path) 
      ? 'text-primary-blue bg-primary-blue/10 shadow-sm' 
      : 'text-text-muted hover:text-primary-blue hover:bg-primary-blue/5'}
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-soft shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Link to="/about" className={navLinkClasses('/about')}>
              {t('navbar.about')}
            </Link>

            {/* Academic Services Dropdown (Hover on Desktop) */}
            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setAcademicDropdownOpen(true)}
              onMouseLeave={() => setAcademicDropdownOpen(false)}
            >
              <button className={`flex items-center px-3 py-2 rounded-xl text-base font-semibold transition-all duration-300 text-text-muted group-hover:text-primary-blue group-hover:bg-primary-blue/5`}>
                {t('navbar.academicServices')}
                <svg className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {academicDropdownOpen && (
                <div className="absolute left-0 top-full mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transition-all duration-200 z-50">
                  <div className="py-2 px-1">
                    <Link to="/academics" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>{t('navbar.academics')}</Link>
                    <Link to="/departments" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>{t('navbar.departments')}</Link>
                    <Link to="/admissions" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>{t('navbar.admissions')}</Link>
                    <Link to="/student-portal" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>{t('navbar.studentPortal')}</Link>
                    <Link to="/syllabus" className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-blue/5 hover:text-primary-blue rounded-lg transition-colors" onClick={closeMenu}>{t('navbar.syllabus')}</Link>
                  </div>
                </div>
              )}
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

          {/* Right Section (Lang Toggle + Mobile Menu Button) */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-light hover:border-primary-blue hover:text-primary-blue focus:ring-2 focus:ring-primary-blue/30 transition-all text-sm font-medium text-neutral-gray"
              title={`Switch to ${language === 'en' ? 'Kannada' : 'English'}`}
            >
              <GlobeIcon className="w-4 h-4" />
              <span>{language === 'en' ? 'KN' : 'EN'}</span>
            </button>

            {/* Desktop CTA Button */}
            <div className="hidden lg:block">
               <Link to="/book-appointment" className="btn-primary text-sm px-5 py-2">
                 {t('navbar.bookAppointment')}
               </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-gray hover:text-primary-blue hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-blue transition-colors"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border-light bg-white shadow-lg absolute w-full" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[80vh] overflow-y-auto">
            <Link to="/" className={navLinkClasses('/')} onClick={closeMenu}>{t('navbar.home')}</Link>
            <Link to="/about" className={navLinkClasses('/about')} onClick={closeMenu}>{t('navbar.about')}</Link>
            
            <div className="pt-2 pb-1 mt-1 border-t border-gray-100">
              <span className="block px-3 py-1 text-xs font-semibold text-primary-blue uppercase tracking-wider">{t('navbar.academicServices')}</span>
              <div className="mt-1 space-y-1 pl-3 border-l-2 border-gray-100 ml-3">
                <Link to="/academics" className={navLinkClasses('/academics')} onClick={closeMenu}>{t('navbar.academics')}</Link>
                <Link to="/departments" className={navLinkClasses('/departments')} onClick={closeMenu}>{t('navbar.departments')}</Link>
                <Link to="/admissions" className={navLinkClasses('/admissions')} onClick={closeMenu}>{t('navbar.admissions')}</Link>
                <Link to="/student-portal" className={navLinkClasses('/student-portal')} onClick={closeMenu}>{t('navbar.studentPortal')}</Link>
                <Link to="/syllabus" className={navLinkClasses('/syllabus')} onClick={closeMenu}>{t('navbar.syllabus')}</Link>
              </div>
            </div>

            <div className="pt-2 pb-1 mt-1 border-t border-gray-100">
              <span className="block px-3 py-1 text-xs font-semibold text-primary-blue uppercase tracking-wider">{t('navbar.patientServices')}</span>
              <div className="mt-1 space-y-1 pl-3 border-l-2 border-gray-100 ml-3">
                <Link to="/book-appointment" className={navLinkClasses('/book-appointment')} onClick={closeMenu}>{t('navbar.bookAppointment')}</Link>
                <Link to="/check-status" className={navLinkClasses('/check-status')} onClick={closeMenu}>{t('navbar.checkStatus')}</Link>
              </div>
            </div>

            <div className="pt-2 mt-1 border-t border-gray-100">
              <Link to="/contact" className={navLinkClasses('/contact')} onClick={closeMenu}>{t('navbar.contact')}</Link>
            </div>
          </div>
          <div className="px-4 pb-4 pt-2 border-t border-gray-100">
            <Link to="/book-appointment" className="btn-primary w-full block text-center" onClick={closeMenu}>
              {t('navbar.bookAppointment')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

// Simple Globe Icon SVG component
const GlobeIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

export default Navigation;
