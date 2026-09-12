import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PreloaderChromaVideo from '../components/PreloaderChromaVideo';
import logoNiepmd from '../assets/logo_niepmd.jpg';

export default function Preloader() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isForce = searchParams.get('force') === 'true';
  const hasNavigatedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    sessionStorage.setItem('cat_intro_seen', 'true');
    navigate('/role-selection', { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!isForce && sessionStorage.getItem('cat_intro_seen') === 'true') {
      hasNavigatedRef.current = true;
      navigate('/role-selection', { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      handleComplete();
    }, 6000);

    return () => clearTimeout(timer);
  }, [isForce, navigate, handleComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#ffffcc] flex flex-col justify-between overflow-hidden select-none font-sans text-slate-900">
      
      {/* Top Header Bar with NIEPMD Logo */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 pt-4 md:pt-6 flex items-center justify-between">
        {/* NIEPMD Logo (Top Left) */}
        <div className="flex items-center gap-3">
          <img
            src={logoNiepmd}
            alt="NIEPMD Logo"
            className="w-14 h-14 md:w-20 md:h-20 object-contain rounded-xl bg-white p-1 shadow-md border border-purple-200"
          />
          <div className="text-left hidden sm:block">
            <h2 className="font-black text-purple-950 text-base md:text-xl tracking-tight leading-none">
              NIEPMD
            </h2>
            <p className="text-[11px] md:text-xs text-purple-900 font-bold max-w-xs leading-tight mt-0.5">
              National Institute for Empowerment of Persons with Multiple Disabilities (Divyangjan)
            </p>
            <p className="text-[10px] text-purple-700 font-medium">
              Dept. of Empowerment of Persons with Disabilities, MSJE, Govt. of India
            </p>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 border border-purple-300 text-purple-950 text-xs font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-purple-700 animate-ping" />
          <span>Loading Assessment Portal...</span>
        </div>
      </div>

      {/* Center Content: Welcome & Outer Circular Frame */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 text-center max-w-4xl mx-auto w-full my-auto">
        
        {/* Welcome & Title Hierarchy */}
        <div className="mb-2 md:mb-4 space-y-1">
          <div className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-purple-900 font-semibold tracking-wide">
            Welcome to
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase font-sans mt-1">
            <span className="text-purple-950">COMMUNICATION </span>
            <span className="text-purple-700">ASSESSMENT </span>
            <span className="text-amber-600">TOOL</span>
          </h1>

          <p className="text-xs md:text-sm lg:text-base font-bold text-purple-800 tracking-wider uppercase max-w-2xl mx-auto mt-2 leading-relaxed">
            FOR PERSONS WITH AND WITHOUT MULTIPLE DISABILITY
          </p>
        </div>

        {/* Centered Chroma-Keyed CAT Intro Video */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] my-2 flex items-center justify-center">
          <PreloaderChromaVideo onEnded={handleComplete} />
        </div>

        {/* Automatic Navigation Indicator */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-purple-800">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
          <span>Redirecting to portal automatically...</span>
        </div>
      </div>

      {/* Bottom Wave Decorative Footer */}
      <div className="w-full relative bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16 md:h-24 lg:h-28 object-cover"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60C240 110 480 10 720 60C960 110 1200 20 1440 60V140H0V60Z"
            fill="#7e22ce"
            fillOpacity="0.9"
          />
          <path
            d="M0 85C280 125 560 45 840 90C1120 135 1320 70 1440 85V140H0V85Z"
            fill="#581c87"
          />
        </svg>
      </div>

    </div>
  );
}
