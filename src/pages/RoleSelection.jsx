import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Users, ChevronRight, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChromaMascot from '../components/ChromaMascot';

// Typewriter greetings list (Tamil & English without brackets)
const GREETINGS = [
  "வணக்கம்",
  "Namasthe",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 flex flex-col font-sans overflow-x-hidden">
      {/* Top Banner / Nav for logged in users */}
      {isAuthenticated && (
        <div className="bg-blue-600/10 border-b border-blue-200/50 px-4 py-2.5 text-center text-xs text-blue-800 flex items-center justify-center gap-2 z-30">
          <span>You are currently signed in as <strong>{user?.fullName || 'Clinician'}</strong>.</span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="font-bold underline hover:text-blue-900 cursor-pointer flex items-center gap-0.5"
          >
            Go to Doctor Dashboard <ChevronRight className="w-3.5 h-3.5 inline" />
          </button>
        </div>
      )}

      {/* Main Split Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 md:py-8 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT SIDE: Big 3D Shruthi Mascot Video */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[420px] md:min-h-[600px] lg:min-h-[680px] w-full">
            <ChromaMascot />
          </div>

          {/* RIGHT SIDE: Typewriter Greetings, Heading & Role Selection */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start space-y-6 px-2 md:px-6">
            
            {/* Healthcare Platform Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/90 text-blue-700 border border-blue-200 text-xs font-semibold shadow-xs">
              <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Healthcare Assessment Platform</span>
            </div>

            {/* Typewriter Greeting Loop (Tamil / English) */}
            <div className="min-h-[60px] md:min-h-[72px] flex items-center">
              <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 tracking-tight leading-tight flex items-center gap-1">
                <span>{displayText}</span>
                <span className="w-1.5 h-10 md:h-12 bg-blue-600 animate-ping inline-block ml-1 rounded-full" />
              </h2>
            </div>

            {/* Heading: Communication Assessment Tool */}
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Communication <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Assessment Tool</span>
              </h1>
              <p className="text-base md:text-lg text-slate-600 mt-2 font-medium">
                AI-powered assessment platform for clinicians and caregivers.
              </p>
            </div>

            {/* Selection Prompt */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Select your portal to continue:</h3>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              
              {/* Doctor / Clinician Card */}
              <div 
                onClick={() => navigate('/doctor-login')}
                className="group relative bg-white/90 backdrop-blur-md rounded-2xl border border-blue-100 p-6 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">👨‍⚕️ Doctor / Clinician</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Manage patients, conduct assessments & view reports.
                  </p>
                </div>
                <button className="w-full bg-blue-600 text-white font-semibold py-2.5 px-3 text-xs rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 group-hover:gap-2 cursor-pointer">
                  <span>Doctor Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Parent / Caregiver Card */}
              <div 
                onClick={() => navigate('/parent-login')}
                className="group relative bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-100 p-6 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">👨‍👩‍👧 Parent / Caregiver</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Track progress, access home activities & resources.
                  </p>
                </div>
                <button className="w-full bg-emerald-600 text-white font-semibold py-2.5 px-3 text-xs rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 group-hover:gap-2 cursor-pointer">
                  <span>Parent Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Communication Assessment Tool. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
