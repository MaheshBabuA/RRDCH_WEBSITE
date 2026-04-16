import React from 'react';

const FormSelect = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  error, 
  required,
  name,
  placeholder = "Select an option"
}) => {
  return (
    <div className="w-full mb-6">
      {label && (
        <label className="block text-sm font-bold text-secondary-blue mb-2 ml-1" htmlFor={name}>
          {label} {required && <span className="text-primary-blue">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-5 py-3.5 bg-white border-2 rounded-2xl outline-none transition-all duration-300 font-medium appearance-none cursor-pointer
            ${error 
              ? 'border-error-red/50 bg-error-red/[0.02] text-error-red focus:border-error-red focus:ring-4 focus:ring-error-red/10' 
              : 'border-border-soft hover:border-primary-blue/30 focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10'
            }
          `}
        >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.id || option.value || option.name} value={option.id || option.value}>
            {option.name || option.label}
          </option>
        ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-error-red">{error}</p>
      )}
    </div>
  );
};

export default FormSelect;
