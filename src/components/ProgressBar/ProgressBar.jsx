import React from 'react';

export default function ProgressBar({ progress = 0, color }) {
  let colorClass = 'bg-blue-600';
  if (color) {
    colorClass = color;
  } else {
    if (progress >= 75) {
      colorClass = 'bg-emerald-600';
    } else if (progress >= 35) {
      colorClass = 'bg-amber-500';
    } else {
      colorClass = 'bg-rose-600';
    }
  }

  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div
        className={`${colorClass} h-2.5 rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  );
}
