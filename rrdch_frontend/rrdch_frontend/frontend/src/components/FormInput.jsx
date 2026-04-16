import React from 'react';

const FormInput = ({ 
  label, 
  placeholder, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required,
  name
}) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-secondary-blue mb-1" htmlFor={name}>
          {label} {required && <span className="text-error-red">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200
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

export default FormInput;
