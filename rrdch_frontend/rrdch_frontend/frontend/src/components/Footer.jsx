import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary-blue text-white pt-12 pb-6 border-t-[6px] border-primary-blue mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          
          {/* College Info Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-white text-secondary-blue rounded-full flex items-center justify-center font-bold text-lg">
                 +
               </div>
              <span className="leading-tight">{t('footer.collegeName')}</span>
            </h4>
            <div className="flex items-start gap-3 text-sm text-blue-100">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{t('footer.address')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-100">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{t('footer.phone')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-100">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${t('footer.email')}`} className="hover:text-white transition-colors">{t('footer.email')}</a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-bold mb-5 border-b border-blue-800 pb-2 inline-block">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/departments" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-primary-blue text-xs">▶</span> {t('navbar.departments')}
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-primary-blue text-xs">▶</span> {t('navbar.admissions')}
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-primary-blue text-xs">▶</span> {t('footer.events')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-primary-blue text-xs">▶</span> {t('navbar.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links Section */}
          <div>
            <h4 className="text-lg font-bold mb-5 border-b border-blue-800 pb-2 inline-block">
              {t('footer.socialLinks')}
            </h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center hover:bg-primary-blue transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center hover:bg-[#1DA1F2] transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center hover:bg-[#0077b5] transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
            
            <Link to="/book-appointment" className="inline-block px-6 py-2.5 bg-white text-secondary-blue font-semibold rounded-lg hover:bg-light-bg transition-colors shadow-sm">
              {t('navbar.bookAppointment')}
            </Link>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-blue-800/80 mt-12 pt-6 text-center text-sm text-blue-200">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
