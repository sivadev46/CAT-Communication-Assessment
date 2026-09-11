import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Activity } from 'lucide-react';
import ChromaMascot from '../components/ChromaMascot';
import PreloaderChromaVideo from '../components/PreloaderChromaVideo';
import DoctorScrubsAvatar from '../components/Common/DoctorScrubsAvatar';
import ParentAvatar from '../components/Common/ParentAvatar';
import LearnerAvatar from '../components/Common/LearnerAvatar';
import logoNiepmd from '../assets/logo_niepmd.jpg';

// In-memory session tracker for client-side SPA navigation
// Resets to false on full page reload / refresh (F5, Ctrl+R, initial load)
// Stays true during in-app client-side navigation (e.g. Back to Role Selection)
let hasIntroPlayedInSession = false;

// Typewriter greetings list (Tamil, Hindi, English)
const GREETINGS = [
  "வணக்கம்",
  "नमस्ते",
  "Welcome to CAT"
];

export default function RoleSelection() {
  const navigate = useNavigate();

  // State to determine if intro loader should display
  // Initializes to true on fresh page load / browser refresh; false on client-side SPA navigation
  const [showSplash, setShowSplash] = useState(() => !hasIntroPlayedInSession);
  const hasCompletedRef = useRef(false);

  // Typewriter effect state
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-transition when preloader finishes
  const handleIntroComplete = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    hasIntroPlayedInSession = true;
    setShowSplash(false);
  };

  // Preloader transition timer
  useEffect(() => {
    if (showSplash) {
      hasCompletedRef.current = false;
      const timer = setTimeout(() => {
        handleIntroComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Typewriter animation loop (active once on Assessment Portal)
  useEffect(() => {
    if (showSplash) return;

    const currentFullText = GREETINGS[greetingIndex];
    let typingSpeed = isDeleting ? 40 : 90;

    if (!isDeleting && displayText === currentFullText) {
      const timeout = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentFullText.substring(0, prev.length - 1)
          : currentFullText.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, greetingIndex, showSplash]);

  // =========================================================================
  // 1. INTRO SPLASH / PRELOADER SCREEN (On Page Load / Browser Refresh)
  // =========================================================================
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-[#ffffb3] flex flex-col justify-between overflow-hidden select-none font-sans text-slate-900">
        
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

          {/* Outer Circular Container — Chroma-Keyed CAT LOGO Video on White */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 my-2 flex items-center justify-center">
            {/*
              bg-white: white fills the circle behind the canvas.
              Wherever the chroma key removes green pixels (alpha → 0),
              the white background shows through — no yellow, no patch.
              overflow-hidden + rounded-full provide the circular clip mask.
            */}
            <div
              className="w-full h-full rounded-full border-4 border-purple-400/50 shadow-2xl overflow-hidden flex items-center justify-center bg-white"
            >
              <PreloaderChromaVideo />
            </div>
          </div>

          {/* Automatic Navigation Indicator (No Manual Click Required) */}
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

  // =========================================================================
  // 2. ASSESSMENT PORTAL / ROLE SELECTION VIEW (After Intro or via SPA Nav)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#ffffb3] text-slate-900 flex flex-col justify-between font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white relative">
      
      {/* ========================================================================= */}
      {/* TOP NAVIGATION — ONLY LEFT SIDE CONTENT (RIGHT SIDE COMPLETELY CLEAN)     */}
      {/* ========================================================================= */}
      <header className="bg-[#ffffb3] border-b-2 border-purple-200/80 sticky top-0 z-40 px-4 md:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left Side: NIEPMD Logo & Text (Kept intact on the left) */}
          <div className="flex items-center gap-3">
            <img
              src={logoNiepmd}
              alt="NIEPMD Logo"
              className="w-11 h-11 md:w-14 md:h-14 object-contain rounded-xl bg-white p-1 border-2 border-purple-200 shadow-xs"
            />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-purple-950 text-base md:text-lg tracking-wide">
                  NIEPMD
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-700 text-white shadow-xs">
                  Govt of India
                </span>
              </div>
              <p className="text-xs text-purple-900 font-bold leading-tight hidden sm:block">
                National Institute for Empowerment of Persons with Multiple Disabilities
              </p>
            </div>
          </div>

          {/* Right Side: Completely Clean / Empty (Removed all buttons, links, and text) */}
          <div className="hidden sm:block" aria-hidden="true" />

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT SECTION                                                      */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col justify-center">
        
        {/* Top Hero Row: Shruthi Mascot Showcase & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* LEFT SIDE: Shruthi Mascot Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[360px] w-full">
            <div className="w-full relative">
              <ChromaMascot />
            </div>
          </div>

          {/* RIGHT SIDE: Typewriter Greetings, Clean Title (NO underline) & Description */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start space-y-4 px-2 md:px-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-700 text-white text-xs font-black tracking-wide shadow-md">
              <Activity className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>COMMUNICATION ASSESSMENT TOOL (CAT)</span>
            </div>

            {/* Typewriter Greeting Loop */}
            <div className="min-h-[44px] md:min-h-[56px] flex items-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-purple-950 tracking-tight leading-tight flex items-center gap-2">
                <span>{displayText}</span>
                <span className="w-1.5 h-8 md:h-10 bg-purple-700 animate-ping inline-block rounded-full" />
              </h2>
            </div>

            {/* Clean Title without underline */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-purple-950 tracking-tight leading-snug">
                Clinical Speech & Language <span className="text-purple-700">Assessment Portal</span>
              </h1>
              <p className="text-sm md:text-base text-purple-900 mt-2 font-semibold leading-relaxed max-w-2xl">
                Empowering therapists and caregivers with dynamic 4-scale evaluation, parent video review, and Gemini AI report generation.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* THREE PORTAL LOGIN OPTIONS — IN ONE HORIZONTAL ROW ON DESKTOP           */}
        {/* ======================================================================= */}
        <div className="mt-8 w-full">
          <div className="mb-4">
            <h3 className="text-xs font-black text-purple-800 tracking-wider uppercase">
              Select your portal to continue:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full items-stretch">
            
            {/* 1. THERAPIST PORTAL CARD (Doctor in scrubs avatar, NO stethoscope, NO doctor emoji) */}
            <div 
              onClick={() => navigate('/doctor-login')}
              className="group relative bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg shadow-purple-900/5 hover:border-purple-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden h-full"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-700" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs overflow-hidden">
                  <DoctorScrubsAvatar className="w-12 h-12" />
                </div>
                <h4 className="text-lg font-extrabold text-purple-950 mb-1">
                  Therapist Portal
                </h4>
                <p className="text-xs text-purple-900 leading-relaxed mb-4 font-medium">
                  Manage patients, conduct 4-scale assessments, review parent videos & generate reports.
                </p>
              </div>
              <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                <span>Therapist Login</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 2. PARENT PORTAL CARD (Matching ParentAvatar, consistent size and styling) */}
            <div 
              onClick={() => navigate('/parent-login')}
              className="group relative bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg shadow-purple-900/5 hover:border-purple-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden h-full"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-800" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs overflow-hidden">
                  <ParentAvatar className="w-12 h-12" />
                </div>
                <h4 className="text-lg font-extrabold text-purple-950 mb-1">
                  Parent Portal
                </h4>
                <p className="text-xs text-purple-900 leading-relaxed mb-4 font-medium">
                  Register with Patient ID, assess ward, record video sessions & track child reports.
                </p>
              </div>
              <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                <span>Parent Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3. LEARNER PORTAL CARD (Matching LearnerAvatar, consistent size and styling) */}
            <div 
              onClick={() => navigate('/learner-login')}
              className="group relative bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg shadow-purple-900/5 hover:border-purple-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden h-full"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-700" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs overflow-hidden">
                  <LearnerAvatar className="w-12 h-12" />
                </div>
                <h4 className="text-lg font-extrabold text-purple-950 mb-1">
                  Learner Portal
                </h4>
                <p className="text-xs text-purple-900 leading-relaxed mb-4 font-medium">
                  Practice, learn, and track your communication progress.
                </p>
              </div>
              <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                <span>Learner Login</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* FOOTER — CLEAN, NO LIGHT PURPLE SHADE/OVERLAY, CENTRED COPYRIGHT          */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#ffffb3] py-5 px-4 border-t border-purple-200/80">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
          <p className="text-xs font-semibold text-purple-950">
            © {new Date().getFullYear()} CAT Communication Assessment Tool. All Rights Reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
