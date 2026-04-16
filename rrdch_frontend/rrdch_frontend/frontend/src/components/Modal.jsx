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
        className="fixed inset-0 bg-secondary-blue/70 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Panel */}
      <div 
        className="relative bg-white rounded-2xl shadow-xl transform transition-all w-full max-w-lg mx-auto flex flex-col max-h-[90vh]"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-light flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
          <h3 className="text-xl font-bold text-secondary-blue m-0" id="modal-title">
            {title}
          </h3>
          <button
            type="button"
            className="text-neutral-gray hover:text-error-red bg-transparent hover:bg-gray-100 rounded-lg p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-error-red/20 ml-auto inline-flex items-center"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
