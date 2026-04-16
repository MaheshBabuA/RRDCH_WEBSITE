import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const LanguageContext = createContext();

// Simple translation dictionary
const translations = {
  en: {
    'nav.home': 'Home',
    'nav.appointments': 'Appointments',
    'nav.departments': 'Departments',
    'nav.doctors': 'Doctors',
    'nav.events': 'Events',
    'nav.feedback': 'Feedback',
    'btn.login': 'Login',
    'btn.logout': 'Logout',
    'btn.toggle_lang': 'ಕನ್ನಡ',
    'welcome': 'Welcome to RRDCH',
    'error.fallback': 'Something went wrong. Please try again later.'
  },
  kn: {
    'nav.home': 'ಮುಖಪುಟ',
    'nav.appointments': 'ನೇಮಕಾತಿಗಳ',
    'nav.departments': 'ವಿಭಾಗಗಳು',
    'nav.doctors': 'ವೈದ್ಯರು',
    'nav.events': 'ಕಾರ್ಯಕ್ರಮಗಳು',
    'nav.feedback': 'ಅಭಿಪ್ರಾಯ',
    'btn.login': 'ಲಾಗಿನ್',
    'btn.logout': 'ಲಾಗ್‌ಔಟ್',
    'btn.toggle_lang': 'English',
    'welcome': 'RRDCH ಗೆ ಸುಸ್ವಾಗತ',
    'error.fallback': 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.'
  }
};

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('app_lang');
    return saved || 'en';
  });

  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'kn' : 'en'));
  }, []);

  // Translation function
  const t = useCallback((key) => {
    return translations[language][key] || key;
  }, [language]);

  const value = {
    language,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
