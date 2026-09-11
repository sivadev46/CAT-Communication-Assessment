import React from 'react';

export default function ParentAvatar({ className = "w-12 h-12", size = 48 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Parent and Child"
    >
      <defs>
        <linearGradient id="parentBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fce7f3" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </linearGradient>

        <linearGradient id="parentShirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#9d174d" />
        </linearGradient>

        <linearGradient id="childShirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>

        <linearGradient id="parentHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4b5563" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
      </defs>

      {/* Outer circular background */}
      <circle cx="50" cy="50" r="48" fill="url(#parentBgGrad)" stroke="#f472b6" strokeWidth="2" />

      {/* Parent Figure (Left/Center) */}
      {/* Hair Back */}
      <circle cx="40" cy="36" r="14" fill="url(#parentHairGrad)" />
      
      {/* Neck */}
      <rect x="36" y="44" width="8" height="12" rx="2" fill="#fcd34d" />
      
      {/* Face */}
      <circle cx="40" cy="38" r="11" fill="#fde047" />
      
      {/* Hair Front */}
      <path d="M29 34C31 27 38 25 45 27C49 29 51 33 50 37C46 32 40 31 32 35Z" fill="url(#parentHairGrad)" />
      
      {/* Parent Eye & Smile */}
      <circle cx="37" cy="37" r="1.5" fill="#1f2937" />
      <circle cx="44" cy="37" r="1.5" fill="#1f2937" />
      <path d="M38 43C40 45 43 45 45 43" stroke="#b45309" strokeWidth="1.4" strokeLinecap="round" />

      {/* Parent Body */}
      <path d="M18 92C18 70 28 56 46 56C54 56 60 62 62 70L54 92H18Z" fill="url(#parentShirtGrad)" />

      {/* Child Figure (Right/Front) */}
      {/* Child Hair */}
      <circle cx="66" cy="52" r="10" fill="url(#parentHairGrad)" />
      
      {/* Child Neck */}
      <rect x="63" y="58" width="6" height="8" rx="1.5" fill="#fcd34d" />
      
      {/* Child Face */}
      <circle cx="66" cy="53" r="8" fill="#fde047" />
      <path d="M58 50C60 44 67 43 72 46C70 48 64 47 60 52Z" fill="url(#parentHairGrad)" />
      
      {/* Child Eye & Smile */}
      <circle cx="63.5" cy="53" r="1.2" fill="#1f2937" />
      <circle cx="68.5" cy="53" r="1.2" fill="#1f2937" />
      <path d="M64 57C65.5 58.5 67.5 58.5 69 57" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />

      {/* Child Body */}
      <path d="M48 92C48 76 56 66 70 66C78 66 84 72 86 92H48Z" fill="url(#childShirtGrad)" />

      {/* Small Floating Heart Icon */}
      <path
        d="M74 26C74 22.5 70.5 20 67.5 22C64.5 20 61 22.5 61 26C61 31 67.5 35 67.5 35C67.5 35 74 31 74 26Z"
        fill="#ec4899"
      />
    </svg>
  );
}
