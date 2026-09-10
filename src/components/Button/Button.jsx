import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = 'px-4 py-2.5 rounded-xl font-extrabold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:scale-95 cursor-pointer';
  const variants = {
    primary: 'bg-purple-700 text-white hover:bg-purple-800 shadow-md shadow-purple-900/10',
    secondary: 'bg-purple-100 text-purple-900 hover:bg-purple-200 border border-purple-300',
    outline: 'border-2 border-purple-700 text-purple-900 hover:bg-purple-700 hover:text-white',
  };

  return (
    <button className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
