import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

/**
 * Layout component that wraps main page content.
 * Provides the sticky Navigation at the top and Footer at the bottom.
 * Applies the base medical theme background.
 */
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-light-bg font-sans text-neutral-gray transition-colors duration-300">
      <Navigation />
      
      {/* Main content area expands to push footer to bottom */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
