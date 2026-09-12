import React from 'react';
import logoNiepmd from '../../assets/logo_niepmd.jpg';
import logoCat from '../../assets/cat_logo.jpeg';

export default function HomeNavbar() {
  return (
    <header className="bg-[#ffffcc] border-b-2 border-purple-200/80 sticky top-0 z-40 px-4 md:px-8 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Side: NIEPMD Logo & Full Name */}
        <div className="flex items-center gap-3">
          <img
            src={logoNiepmd}
            alt="NIEPMD Logo"
            className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-xl bg-white p-1 border-2 border-purple-200 shadow-xs flex-shrink-0"
          />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-black text-purple-950 text-base md:text-lg tracking-wide">
                NIEPMD
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-700 text-white shadow-xs hidden sm:inline-block">
                Govt of India
              </span>
            </div>
            <p className="text-xs text-purple-900 font-bold leading-tight max-w-md hidden sm:block">
              National Institute for Empowerment of Persons with Multiple Disabilities
            </p>
          </div>
        </div>

        {/* Right Side: CAT Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <h1 className="text-sm md:text-base font-black text-purple-950 tracking-tight leading-none uppercase">
              COMMUNICATION ASSESSMENT TOOL
            </h1>
            <p className="text-[10px] text-purple-800 font-extrabold tracking-wider mt-0.5">
              (CAT)
            </p>
          </div>
          <img
            src={logoCat}
            alt="CAT Logo"
            className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full border-2 border-purple-300 shadow-md flex-shrink-0 bg-white"
          />
        </div>

      </div>
    </header>
  );
}
