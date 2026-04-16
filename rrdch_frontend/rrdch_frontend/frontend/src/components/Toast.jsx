import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss logic
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        // Allow exit animation to play before triggering onClose
        setTimeout(onClose, 300);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible && !onClose) return null; // If onClose is not provided, self-unmount conceptually if not using a context manager. Usually handled by parent.

  const typeStyles = {
    success: 'bg-success-green',
    error: 'bg-error-red',
    info: 'bg-primary-blue'
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div className={`fixed top-4 right-4 z-[9999] transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${typeStyles[type] || typeStyles.info}`}>
        {icons[type]}
        <p className="text-sm font-medium pr-2">{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            if (onClose) setTimeout(onClose, 300);
          }}
          className="ml-auto opacity-80 hover:opacity-100 focus:outline-none transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
