import React from 'react';

export default function Header({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm md:text-base text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
