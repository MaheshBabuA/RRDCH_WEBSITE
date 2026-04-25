import React, { useEffect } from 'react';

const SuccessModal = ({ isOpen, onClose, title, subtitle, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto">
      {/* Ultra Glassmorphic Background */}
      <div 
        className="fixed inset-0 bg-secondary-blue/40 backdrop-blur-[24px] transition-all duration-700"
        onClick={onClose}
      >
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-blue/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-success-green/20 rounded-full blur-[130px] animate-pulse [animation-delay:1.5s]"></div>
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl my-auto flex flex-col bg-white/60 backdrop-blur-3xl border border-white/60 rounded-[60px] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.4)] overflow-hidden animate-scale-up">
        
        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-primary-blue via-success-green to-primary-blue shadow-lg shadow-primary-blue/20"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-white/40 hover:bg-white/80 backdrop-blur-md rounded-2xl text-secondary-blue transition-all duration-300 z-50 group border border-white/50 shadow-sm"
        >
          <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-grow p-8 md:p-14 text-center relative z-10">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-success-green/5 group-hover:bg-success-green/10 transition-colors"></div>
            <svg className="w-12 h-12 text-success-green drop-shadow-sm relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-secondary-blue mb-4 tracking-tighter leading-tight drop-shadow-md">
            {title}
          </h2>
          <p className="text-xl text-secondary-blue/70 font-bold mb-12 max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>

          <div className="relative">
            {children}
          </div>
        </div>

        {/* Subtle Bottom Accent */}
        <div className="absolute -bottom-16 inset-x-0 h-32 bg-gradient-to-t from-primary-blue/10 to-transparent blur-3xl -z-10"></div>
      </div>
    </div>
  );
};

export default SuccessModal;
