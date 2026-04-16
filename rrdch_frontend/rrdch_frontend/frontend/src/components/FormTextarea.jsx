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
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-secondary-blue mb-1" htmlFor={name}>
          {label} {required && <span className="text-error-red">*</span>}
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
        className={`form-input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 resize-y
          ${error 
            ? 'border-error-red focus:border-error-red focus:ring-error-red/20' 
            : 'border-border-light focus:border-primary-blue focus:ring-primary-blue/20'
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
