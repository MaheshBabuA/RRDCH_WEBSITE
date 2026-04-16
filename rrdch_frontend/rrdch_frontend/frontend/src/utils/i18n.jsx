import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations.json';

const LanguageContext = createContext();

/**
 * LanguageProvider manages the application's language state and persistence.
 * It provides the current language, a toggle function, and a translation utility.
 */
export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem('rrdch_pref_lang');
      return savedLanguage === 'kn' ? 'kn' : 'en';
    } catch (e) {
      return 'en';
    }
  });

  // Persist language choice and update HTML lang attribute
  useEffect(() => {
    try {
      localStorage.setItem('rrdch_pref_lang', language);
      document.documentElement.lang = language;
    } catch (e) {
      console.error('Failed to persist language preference:', e);
    }
  }, [language]);

  /**
   * Switches the language between English ('en') and Kannada ('kn').
   */
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'kn' : 'en'));
  };

  /**
   * Translates a given key based on the current language.
   * Supports nested keys using dot notation (e.g., 'navbar.home').
   * 
   * @param {string} key - The translation key path.
   * @returns {string} - The translated string or the key itself if not found.
   */
  const t = (key) => {
    const keys = key.split('.');
    let translation = translations[language];

    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Fallback to key if translation is missing
        return key;
      }
    }

    return typeof translation === 'string' ? translation : key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Custom hook to access language state and translation utility.
 * must be used within a LanguageProvider.
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
