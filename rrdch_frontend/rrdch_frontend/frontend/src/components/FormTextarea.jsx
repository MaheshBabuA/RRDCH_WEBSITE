import React from 'react';

const FormTextarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error, 
  required,
  name,
  rows = 4
}) => {
  return (
    <div className="w-full mb-6">
      {label && (
        <label className="block text-sm font-bold text-secondary-blue mb-2 ml-1" htmlFor={name}>
          {label} {required && <span className="text-primary-blue">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`w-full px-5 py-3.5 bg-white border-2 rounded-2xl outline-none transition-all duration-300 font-medium placeholder:text-text-muted/50 resize-none
          ${error 
            ? 'border-error-red/50 bg-error-red/[0.02] text-error-red focus:border-error-red focus:ring-4 focus:ring-error-red/10' 
            : 'border-border-soft hover:border-primary-blue/30 focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10'
          }
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-error-red">{error}</p>
      )}
    </div>
  );
};

export default FormTextarea;
