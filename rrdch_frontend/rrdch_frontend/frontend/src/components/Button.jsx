import React from 'react';

const Button = ({ 
  type = 'primary', // 'primary' | 'secondary' | 'danger'
  text, 
  onClick, 
  loading = false, 
  disabled = false,
  className = '',
  buttonType = 'button' // 'button' | 'submit' | 'reset'
}) => {
  
  const baseClasses = "relative inline-flex items-center justify-center px-6 py-2.5 font-bold rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden select-none";
  
  const typeClasses = {
    primary: "bg-primary-blue text-white shadow-premium hover:shadow-premium-hover hover:bg-secondary-blue focus:ring-primary-blue border border-transparent",
    secondary: "bg-white text-secondary-blue border-2 border-border-soft hover:border-primary-blue hover:text-primary-blue shadow-sm hover:shadow-md focus:ring-primary-blue",
    danger: "bg-error-red text-white shadow-premium hover:shadow-premium-hover hover:bg-red-700 focus:ring-error-red border border-transparent",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed grayscale shadow-none";
  const activeClasses = "hover:-translate-y-1 active:scale-95";

  const currentTypeClass = typeClasses[type] || typeClasses.primary;
  const stateClasses = disabled || loading ? disabledClasses : activeClasses;

  return (
    <button
      type={buttonType}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${currentTypeClass} ${stateClasses} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span>{loading ? 'Processing...' : text}</span>
    </button>
  );
};

export default Button;
