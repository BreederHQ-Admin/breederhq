
import * as React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      style={{
        padding: '0.5rem 0.75rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(0,0,0,0.1)',
        background: 'white',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
};
