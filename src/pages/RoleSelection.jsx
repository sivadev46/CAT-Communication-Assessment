import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, ChevronRight, Activity, Play, Sparkles, Volume2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChromaMascot from '../components/ChromaMascot';
import logoNiepmd from '../assets/logo_niepmd.jpg';
import logoRec from '../assets/logo_rec.png';
import catLogoVideo from '../assets/cat_logo.mp4';

// Typewriter greetings list (Tamil, Hindi, English)
const GREETINGS = [
  "வணக்கம்",
  "नमस्ते",
  "Welcome to CAT"
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Splash Loader State
  const [showSplash, setShowSplash] = useState(true);

  // Typewriter effect state
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-dismiss splash loader after 4.5 seconds if user doesn't click
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        // Auto transition after preview
        // setShowSplash(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

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

  return (
    <div className="min-h-screen bg-[#ffffb3] text-slate-900 flex flex-col font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white relative">
      
      {/* ========================================================================= */}
      {/* 1. INTRO SPLASH / LOADER SCREEN (Matches User Reference Image Layout)       */}
      {/* ========================================================================= */}
      {showSplash ? (
        <div className="fixed inset-0 z-50 bg-[#ffffb3] flex flex-col justify-between overflow-hidden animate-fadeIn">
          {/* Header Bar with Logos */}
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

            {/* REC Logo (Top Right) */}
            <div className="flex items-center gap-3 text-right">
              <div className="hidden sm:block text-right">
                <h2 className="font-black text-purple-950 text-base md:text-xl tracking-tight leading-none">
                  RAJALAKSHMI
                </h2>
                <p className="text-[11px] md:text-xs text-purple-900 font-bold leading-tight mt-0.5">
                  ENGINEERING COLLEGE
                </p>
                <p className="text-[10px] text-purple-700 font-medium">
                  An AUTONOMOUS Institution Affiliated to ANNA UNIVERSITY
                </p>
              </div>
              <img
                src={logoRec}
                alt="REC Logo"
                className="w-14 h-14 md:w-20 md:h-20 object-contain rounded-xl bg-white p-1 shadow-md border border-purple-200"
              />
            </div>
          </div>

          {/* Center Content: Welcome Header & Animated Cat Logo Video */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 text-center max-w-4xl mx-auto w-full my-auto">
            {/* Cursive Welcome & Title */}
            <div className="mb-2 md:mb-4">
              <div className="inline-flex items-center justify-center gap-2 mb-1">
                <span className="text-purple-600 text-lg md:text-2xl">✨</span>
                <span className="font-serif italic text-2xl md:text-4xl text-purple-900 font-semibold tracking-wide">
                  Welcome to
                </span>
                <span className="text-purple-600 text-lg md:text-2xl">✨</span>
              </div>

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase font-sans mt-1">
                <span className="text-purple-950">COMMUNICATION </span>
                <span className="text-purple-700">ASSESSMENT </span>
                <span className="text-amber-600">TOOL</span>
              </h1>
            </div>

            {/* Circular Cat Logo Video Container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 my-2 flex items-center justify-center">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full border-4 border-purple-400/40 shadow-2xl bg-white/60 backdrop-blur-xs flex items-center justify-center overflow-hidden">
                {/* Cat Logo MP4 video showing blinking eyes and moving tail */}
                <video
                  src={catLogoVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain transform scale-105"
                />
              </div>
            </div>

            {/* Enter Portal Button */}
            <div className="mt-4 md:mt-6 z-20">
              <button
                onClick={() => setShowSplash(false)}
                className="group relative inline-flex items-center gap-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-base md:text-lg px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-purple-600/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Enter Portal</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-xs text-purple-800 font-medium mt-2 animate-pulse">
                Click to explore the CAT Portal
              </p>
            </div>
          </div>

          {/* Bottom Wave Decorative Footer */}
          <div className="w-full relative bottom-0 left-0 right-0 pointer-events-none">
            <svg
              viewBox="0 0 1440 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-h-32 md:max-h-44 object-cover"
            >
              <path
                d="M0 128L60 117.3C120 107 240 85 360 96C480 107 600 149 720 154.7C840 160 960 128 1080 112C1200 96 1320 96 1380 96L1440 96V220H1380C1320 220 1200 220 1080 220C960 220 840 220 720 220C600 220 480 220 360 220C240 220 120 220 60 220H0V128Z"
                fill="#7e22ce"
                fillOpacity="0.85"
              />
              <path
                d="M0 160L80 149.3C160 139 320 117 480 128C640 139 800 181 960 181.3C1120 181 1280 139 1360 117.3L1440 96V220H1360C1280 220 1120 220 960 220C800 220 640 220 480 220C320 220 160 220 80 220H0V160Z"
                fill="#581c87"
              />
            </svg>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. MAIN HOME PAGE VIEW (Background: #ffffb3, Purple Buttons, Clear Logos)   */
        /* ========================================================================= */
        <div className="min-h-screen flex flex-col justify-between">
          
          {/* TOP NAVIGATION — NIEPMD & REC BRANDING */}
          <header className="bg-[#ffffb3] border-b-2 border-purple-200/80 sticky top-0 z-40 px-4 md:px-8 py-3.5 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              
              {/* Left Side: NIEPMD Logo & Text */}
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

              {/* Right Side: Replay Loader & User Status / REC Logo */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSplash(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-900 font-bold text-xs transition-all cursor-pointer shadow-xs"
                  title="View Cat Intro Loader"
                >
                  <Play className="w-3.5 h-3.5 text-purple-700 fill-purple-700" />
                  <span className="hidden md:inline">Watch Cat Video</span>
                </button>

                {isAuthenticated && (
                  <div className="flex items-center gap-2.5 bg-white border-2 border-purple-200 px-3 py-1.5 rounded-xl text-xs shadow-xs">
                    <span className="text-purple-900 font-medium hidden sm:inline">Signed in as <strong className="text-purple-950 font-bold">{user?.fullName || 'User'}</strong></span>
                    <button
                      onClick={() => navigate(user?.role === 'parent' ? '/parent-dashboard' : '/dashboard')}
                      className="font-extrabold text-white bg-purple-700 hover:bg-purple-800 px-3 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      Portal
                    </button>
                  </div>
                )}

                <img
                  src={logoRec}
                  alt="REC Logo"
                  className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-xl bg-white p-1 border-2 border-purple-200 shadow-xs"
                />
              </div>

            </div>
          </header>

          {/* MAIN CONTENT SECTION */}
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-10 flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* LEFT SIDE: Vani Mascot Video Showcase */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[380px] md:min-h-[480px] w-full">
                <div className="w-full relative">
                  <ChromaMascot />
                </div>
              </div>

              {/* RIGHT SIDE: Typewriter Greetings, Heading & Role Selection */}
              <div className="lg:col-span-6 flex flex-col justify-center items-start space-y-6 px-2 md:px-6">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-700 text-white text-xs font-black tracking-wide shadow-md">
                  <Activity className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>COMMUNICATION ASSESSMENT TOOL (CAT)</span>
                </div>

                {/* Typewriter Greeting Loop */}
                <div className="min-h-[50px] md:min-h-[64px] flex items-center">
                  <h2 className="text-4xl md:text-5xl font-black text-purple-950 tracking-tight leading-tight flex items-center gap-2">
                    <span>{displayText}</span>
                    <span className="w-1.5 h-10 bg-purple-700 animate-ping inline-block rounded-full" />
                  </h2>
                </div>

                {/* Heading & Subtitle */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-purple-950 tracking-tight leading-snug">
                    Clinical Speech & Language <span className="text-purple-700 underline decoration-purple-400 decoration-wavy">Assessment Portal</span>
                  </h1>
                  <p className="text-sm md:text-base text-purple-900 mt-3 font-semibold leading-relaxed">
                    Empowering therapists and caregivers with dynamic 4-scale evaluation, parent video review, and Gemini AI report generation.
                  </p>
                </div>

                {/* Selection Prompt */}
                <div className="pt-2">
                  <h3 className="text-xs font-black text-purple-800 tracking-wider uppercase">
                    Select your portal to continue:
                  </h3>
                </div>

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  
                  {/* Doctor / Clinician Card */}
                  <div 
                    onClick={() => navigate('/doctor-login')}
                    className="group relative bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg shadow-purple-900/5 hover:border-purple-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-700" />
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 border border-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-extrabold text-purple-950 mb-1">👨‍⚕️ Therapist Portal</h4>
                      <p className="text-xs text-purple-900 leading-relaxed mb-4 font-medium">
                        Manage patients, conduct 4-scale assessments, review parent videos & generate reports.
                      </p>
                    </div>
                    <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                      <span>Therapist Login</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Parent / Caregiver Card */}
                  <div 
                    onClick={() => navigate('/parent-login')}
                    className="group relative bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg shadow-purple-900/5 hover:border-purple-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-800" />
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 border border-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                        <Heart className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-extrabold text-purple-950 mb-1">👨‍👩‍👧 Parent Portal</h4>
                      <p className="text-xs text-purple-900 leading-relaxed mb-4 font-medium">
                        Register with Patient ID, assess ward, record video sessions & track child reports.
                      </p>
                    </div>
                    <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                      <span>Parent Portal</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* FOOTER — CLEANED & WITHOUT 'DEVELOPED BY REC' AS REQUESTED */}
          <footer className="bg-[#ffffb3] border-t-2 border-purple-200/80 py-5 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <img
                  src={logoNiepmd}
                  alt="NIEPMD"
                  className="w-8 h-8 object-contain rounded bg-white p-0.5 border border-purple-200"
                />
                <div>
                  <p className="text-xs font-bold text-purple-950">
                    Communication Assessment Tool (CAT)
                  </p>
                  <p className="text-[11px] text-purple-800 font-medium">
                    National Institute for Empowerment of Persons with Multiple Disabilities (Divyangjan)
                  </p>
                </div>
              </div>

              <p className="text-xs font-semibold text-purple-900">
                © {new Date().getFullYear()} Communication Assessment Tool. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      )}

    </div>
  );
}
