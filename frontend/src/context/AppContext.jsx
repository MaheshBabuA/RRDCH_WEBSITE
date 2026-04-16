import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('app_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('app_is_logged_in') === 'true';
  });

  // Sync with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('app_user', JSON.stringify(user));
      localStorage.setItem('app_is_logged_in', 'true');
    } else {
      localStorage.removeItem('app_user');
      localStorage.setItem('app_is_logged_in', 'false');
    }
  }, [user]);

  const login = useCallback((userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(() => ({
    user,
    isLoggedIn,
    login,
    logout
  }), [user, isLoggedIn, login, logout]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
