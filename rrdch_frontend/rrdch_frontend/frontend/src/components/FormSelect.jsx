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
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-secondary-blue mb-1" htmlFor={name}>
          {label} {required && <span className="text-error-red">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-select w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 appearance-none bg-white
          ${error 
            ? 'border-error-red focus:border-error-red focus:ring-error-red/20' 
            : 'border-border-light focus:border-primary-blue focus:ring-primary-blue/20'
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
      {error && (
        <p className="mt-1 text-sm text-error-red">{error}</p>
      )}
    </div>
  );
};

export default FormSelect;
