import React from 'react';

export default function DoctorScrubsAvatar({ className = "w-12 h-12", size = 48 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Doctor in Medical Scrubs"
    >
      <defs>
        {/* Background circle gradient */}
        <linearGradient id="docBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#ddd6fe" />
        </linearGradient>

        {/* Medical Scrubs Teal Gradient */}
        <linearGradient id="scrubsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>

        {/* Scrub V-Neck Inner Gradient */}
        <linearGradient id="vNeckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#115e59" />
          <stop offset="100%" stopColor="#134e4a" />
        </linearGradient>

        {/* Skin Tone Gradient */}
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Hair Gradient */}
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
      </defs>

      {/* Outer circular background frame */}
      <circle cx="50" cy="50" r="48" fill="url(#docBgGrad)" stroke="#c4b5fd" strokeWidth="2" />

      {/* Hair (Back) */}
      <path
        d="M28 42C28 26 38 18 50 18C62 18 72 26 72 42C72 48 70 54 68 56C64 48 64 34 50 34C36 34 36 48 32 56C30 54 28 48 28 42Z"
        fill="url(#hairGrad)"
      />

      {/* Neck */}
      <rect x="43" y="49" width="14" height="15" rx="3" fill="#fcd34d" />
      {/* Neck shadow under chin */}
      <path d="M43 51C46 54 54 54 57 51V55C54 57 46 57 43 55V51Z" fill="#f59e0b" opacity="0.6" />

      {/* Head / Face */}
      <ellipse cx="50" cy="40" rx="16" ry="18" fill="#fef08a" />
      <path
        d="M34 38C34 49 41 57 50 57C59 57 66 49 66 38C66 27 59 23 50 23C41 23 34 27 34 38Z"
        fill="#fde047"
      />

      {/* Hair Front / Style */}
      <path
        d="M34 32C37 25 44 21 50 21C58 21 65 25 66 33C62 28 56 26 50 26C43 26 38 29 34 32Z"
        fill="url(#hairGrad)"
      />
      <path
        d="M33 34C35 30 38 27 43 25C40 28 37 32 35 37L33 34Z"
        fill="url(#hairGrad)"
      />

      {/* Eyebrows */}
      <path d="M40 33C42 32 45 32 46 33" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M54 33C55 32 58 32 60 33" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" />

      {/* Eyes */}
      <circle cx="43" cy="38" r="2" fill="#1f2937" />
      <circle cx="57" cy="38" r="2" fill="#1f2937" />
      <circle cx="43.7" cy="37.3" r="0.7" fill="#ffffff" />
      <circle cx="57.7" cy="37.3" r="0.7" fill="#ffffff" />

      {/* Friendly Smile */}
      <path
        d="M45 47C47 50 53 50 55 47"
        stroke="#b45309"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Ears */}
      <circle cx="33.5" cy="40" r="3" fill="#fcd34d" />
      <circle cx="66.5" cy="40" r="3" fill="#fcd34d" />

      {/* Medical Scrubs Body / Shoulders (NO STETHOSCOPE) */}
      <path
        d="M20 92C20 74 30 63 40 61L44 65L50 72L56 65L60 61C70 63 80 74 80 92C80 95 78 96 75 96H25C22 96 20 95 20 92Z"
        fill="url(#scrubsGrad)"
      />

      {/* Scrubs Inner Undershirt / V-Neck Cutout */}
      <path
        d="M44 60L50 70L56 60C54 62 46 62 44 60Z"
        fill="url(#vNeckGrad)"
      />

      {/* Scrubs Collar Detail */}
      <path
        d="M39 61.5L48 72.5L50 75L52 72.5L61 61.5"
        stroke="#14b8a6"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Scrubs Left Pocket & Clinical ID Badge (NO STETHOSCOPE) */}
      <rect x="30" y="73" width="12" height="14" rx="2" fill="#0f766e" stroke="#14b8a6" strokeWidth="1" />
      
      {/* Medical ID Card Badge clip */}
      <rect x="33" y="71" width="6" height="5" rx="1" fill="#ffffff" />
      <rect x="34.5" y="72" width="3" height="1" rx="0.5" fill="#0284c7" />
      <line x1="33" y1="74" x2="39" y2="74" stroke="#0d9488" strokeWidth="0.8" />

      {/* Scrub Shoulder Seams */}
      <path d="M28 72L36 67" stroke="#0f766e" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M72 72L64 67" stroke="#0f766e" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
