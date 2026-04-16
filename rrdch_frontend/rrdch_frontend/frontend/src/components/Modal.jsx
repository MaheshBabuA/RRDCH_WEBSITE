import React, { useEffect } from 'react';

const Modal = ({ isOpen, title, children, onClose }) => {
  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 bg-secondary-blue/40 backdrop-blur-md transition-all duration-500 ease-in-out" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Panel */}
      <div 
        className="relative bg-white rounded-[40px] shadow-premium-hover transform transition-all w-full max-w-lg mx-auto flex flex-col max-h-[90vh] overflow-hidden border border-white/20 animate-fade-in"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-border-soft flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <h3 className="text-2xl font-black text-secondary-blue tracking-tight m-0" id="modal-title">
            {title}
          </h3>
          <button
            type="button"
            className="text-text-muted hover:text-primary-blue hover:bg-primary-blue/5 rounded-2xl p-2.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-blue/10 ml-auto inline-flex items-center"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
