import React from 'react';

export default function LearnerAvatar({ className = "w-12 h-12", size = 48 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Student / Learner"
    >
      <defs>
        <linearGradient id="learnerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>

        <linearGradient id="capGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>

        <linearGradient id="learnerShirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>

        <linearGradient id="learnerHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>

      {/* Outer circular background */}
      <circle cx="50" cy="50" r="48" fill="url(#learnerBgGrad)" stroke="#f59e0b" strokeWidth="2" />

      {/* Hair Back */}
      <circle cx="50" cy="46" r="17" fill="url(#learnerHairGrad)" />

      {/* Neck */}
      <rect x="44" y="55" width="12" height="12" rx="2" fill="#fcd34d" />

      {/* Face */}
      <ellipse cx="50" cy="48" rx="14" ry="15" fill="#fde047" />

      {/* Hair Front */}
      <path d="M36 42C39 36 46 33 50 33C57 33 62 36 64 42C60 38 54 37 50 37C45 37 40 39 36 42Z" fill="url(#learnerHairGrad)" />

      {/* Eyes */}
      <circle cx="44" cy="47" r="1.8" fill="#1f2937" />
      <circle cx="56" cy="47" r="1.8" fill="#1f2937" />
      <circle cx="44.6" cy="46.4" r="0.6" fill="#ffffff" />
      <circle cx="56.6" cy="46.4" r="0.6" fill="#ffffff" />

      {/* Smile */}
      <path d="M45 54C47 57 53 57 55 54" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" />

      {/* Graduation Cap */}
      <polygon points="50,15 78,26 50,37 22,26" fill="url(#capGrad)" stroke="#a855f7" strokeWidth="1" />
      <path d="M35 31V41C35 41 42 45 50 45C58 45 65 41 65 41V31" fill="#6b21a8" />
      
      {/* Cap Tassel */}
      <circle cx="50" cy="26" r="2" fill="#f59e0b" />
      <path d="M50 26L32 35V42" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="30.5" y="42" width="3" height="4" rx="1" fill="#d97706" />

      {/* Learner Shirt / Body */}
      <path d="M22 92C22 74 32 64 42 63L50 71L58 63C68 64 78 74 78 92H22Z" fill="url(#learnerShirtGrad)" />
      
      {/* Shirt Collar */}
      <polygon points="50,71 45,63 55,63" fill="#ffffff" />
    </svg>
  );
}
