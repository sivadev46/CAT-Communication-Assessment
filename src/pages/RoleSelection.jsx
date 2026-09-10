import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, ChevronRight, Activity, ShieldCheck, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChromaMascot from '../components/ChromaMascot';
import logoNiepmd from '../assets/logo_niepmd.jpg';
import logoRec from '../assets/logo_rec.png';

// Typewriter greetings list (Tamil, Hindi, English)
const GREETINGS = [
  "வணக்கம்",
  "नमस्ते",
  "Welcome"
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Typewriter effect state
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
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
  }, [displayText, isDeleting, greetingIndex]);

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#FFE600] selection:text-black">
      {/* TOP NAVIGATION — NIEPMD BRANDING */}
      <header className="bg-[#121218] border-b border-[#27273A] sticky top-0 z-40 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* NIEPMD Logo & Trilingual Titles */}
          <div className="flex items-center gap-3">
            <img
              src={logoNiepmd}
              alt="NIEPMD Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-lg border border-[#27273A] bg-white p-0.5"
            />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#FFE600] text-base md:text-lg tracking-wide">
                  NIEPMD
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/30">
                  Government of India
                </span>
              </div>
              <p className="text-xs text-gray-200 font-semibold leading-tight">
                National Institute for Empowerment of Persons with Multiple Disabilities (Divyangjan)
              </p>
              <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-gray-400 mt-0.5">
                <span>தேசிய மாற்றுத்திறனாளிகள் அதிகாரமளித்தல் நிறுவனம்</span>
                <span>•</span>
                <span>राष्ट्रीय दिव्यांगजन सशक्तिकरण संस्थान</span>
              </div>
            </div>
          </div>

          {/* User Sign in status banner */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 bg-[#1A1A24] border border-[#27273A] px-3.5 py-1.5 rounded-xl text-xs">
              <span className="text-gray-300">Signed in as <strong className="text-[#FFE600]">{user?.fullName || 'User'}</strong></span>
              <button
                onClick={() => navigate(user?.role === 'parent' ? '/parent-dashboard' : '/dashboard')}
                className="font-extrabold text-black bg-[#FFE600] hover:bg-[#FACC15] px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Go to Portal
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT SECTION */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT SIDE: Shruthi Mascot Video / Interactive Showcase */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[380px] md:min-h-[500px] w-full">
            <ChromaMascot />
          </div>

          {/* RIGHT SIDE: Typewriter Greetings, Heading & Role Selection */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start space-y-6 px-2 md:px-6">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/30 text-[#FFE600] text-xs font-bold shadow-xs">
              <Activity className="w-4 h-4 animate-pulse text-[#FFE600]" />
              <span>COMMUNICATION ASSESSMENT TOOL (CAT)</span>
            </div>

            {/* Typewriter Greeting Loop */}
            <div className="min-h-[50px] md:min-h-[64px] flex items-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#FFE600] tracking-tight leading-tight flex items-center gap-2">
                <span>{displayText}</span>
                <span className="w-1.5 h-10 bg-[#FFE600] animate-ping inline-block rounded-full" />
              </h2>
            </div>

            {/* Heading & Subtitle */}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Clinical Speech & Language <span className="text-[#FFE600]">Assessment Portal</span>
              </h1>
              <p className="text-sm md:text-base text-gray-300 mt-2 font-medium leading-relaxed">
                Empowering therapists and caregivers with dynamic 4-scale evaluation, parent video review, and Gemini AI report generation.
              </p>
            </div>

            {/* Selection Prompt */}
            <div className="pt-2">
              <h3 className="text-xs font-extrabold text-gray-400 tracking-wider uppercase">
                Select your portal to continue:
              </h3>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              
              {/* Doctor / Clinician Card */}
              <div 
                onClick={() => navigate('/doctor-login')}
                className="group relative bg-[#121218] rounded-2xl border-2 border-[#27273A] p-6 shadow-xl hover:border-[#FFE600] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FFE600]" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-extrabold text-white mb-1">👨‍⚕️ Therapist Portal</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4 font-medium">
                    Manage patients, conduct 4-scale assessments, review parent videos & generate reports.
                  </p>
                </div>
                <button className="w-full bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold py-2.5 px-3 text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>Therapist Login</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Parent / Caregiver Card */}
              <div 
                onClick={() => navigate('/parent-login')}
                className="group relative bg-[#121218] rounded-2xl border-2 border-[#27273A] p-6 shadow-xl hover:border-[#FFE600] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-extrabold text-white mb-1">👨‍👩‍👧 Parent Portal</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4 font-medium">
                    Register with Patient ID, assess ward, record video sessions & track child reports.
                  </p>
                </div>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-2.5 px-3 text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>Parent Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* FOOTER — RAJALAKSHMI ENGINEERING COLLEGE BRANDING */}
      <footer className="bg-[#121218] border-t border-[#27273A] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img
              src={logoRec}
              alt="REC Logo"
              className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-[#27273A]"
            />
            <div>
              <p className="text-xs font-bold text-gray-300">
                Developed by <span className="text-[#FFE600]">Rajalakshmi Engineering College</span>
              </p>
              <p className="text-[11px] text-gray-400">
                Communication Assessment Tool (CAT) • Official Clinical System
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Communication Assessment Tool. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
