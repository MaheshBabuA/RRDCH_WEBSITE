import React from 'react';

const Card = ({ title, children, footer, className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-premium border border-border-soft p-6 transition-all duration-300 hover:shadow-premium-hover hover:border-primary-blue/30 overflow-hidden ${className}`}>
      {title && (
        <div className="mb-4 pb-4 border-b border-border-soft">
          <h3 className="text-xl font-bold text-secondary-blue m-0">{title}</h3>
        </div>
      )}
      
      <div className="text-text-muted">
        {children}
      </div>

      {footer && (
        <div className="mt-6 pt-4 border-t border-border-soft flex justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
