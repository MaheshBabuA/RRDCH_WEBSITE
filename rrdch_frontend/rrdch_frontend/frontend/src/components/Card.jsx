import React from 'react';

const Card = ({ title, children, footer, className = '' }) => {
  return (
    <div className={`card overflow-hidden ${className}`}>
      {title && (
        <div className="mb-4 pb-4 border-b border-border-light">
          <h3 className="text-xl font-bold text-secondary-blue m-0">{title}</h3>
        </div>
      )}
      
      <div className="text-neutral-gray">
        {children}
      </div>

      {footer && (
        <div className="mt-6 pt-4 border-t border-border-light flex justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
