import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800/80 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}
