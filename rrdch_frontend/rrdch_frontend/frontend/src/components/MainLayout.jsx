import React from 'react';
import Footer from './Footer';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-soft-bg relative overflow-x-hidden flex flex-col font-sans text-text-main">
      {/* Decorative background blobs for glassmorphism effect */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-success-green/20 rounded-full blur-3xl pointer-events-none" />

      {/* Multi-layered Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 flex flex-col">
        <div className="flex-grow bg-white/70 backdrop-blur-[12px] border border-[rgba(0,121,191,0.3)] rounded-[40px] shadow-2xl p-8 sm:p-10">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
