import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <main className="main-content" style={{ flex: '1', maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem 1rem' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
