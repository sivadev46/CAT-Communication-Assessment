import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Users, ChevronRight, Activity, Heart, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 flex flex-col font-sans">
      {/* Top Banner / Nav for logged in users */}
      {isAuthenticated && (
        <div className="bg-blue-600/10 border-b border-blue-200/50 px-4 py-2.5 text-center text-xs text-blue-800 flex items-center justify-center gap-2">
          <span>You are currently signed in as <strong>{user?.fullName || 'Clinician'}</strong>.</span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="font-bold underline hover:text-blue-900 cursor-pointer flex items-center gap-0.5"
          >
            Go to Doctor Dashboard <ChevronRight className="w-3.5 h-3.5 inline" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-16 flex flex-col justify-center items-center">
        
        {/* Hero Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          {/* Decorative Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 border border-blue-200 text-xs font-semibold mb-4 animate-fade-in">
            <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Healthcare Assessment Platform</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Communication <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Assessment Tool</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 mt-3 font-medium">
            AI-powered Communication Assessment Platform
          </p>
        </div>

        {/* Hero Healthcare Illustration Section */}
        <div className="w-full max-w-lg mb-12 md:mb-16 px-4">
          <svg className="w-full h-auto drop-shadow-lg" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background elements */}
            <circle cx="250" cy="100" r="80" fill="url(#bg-gradient)" fillOpacity="0.1" />
            <circle cx="120" cy="140" r="30" fill="url(#blue-gradient)" fillOpacity="0.08" />
            <circle cx="380" cy="60" r="40" fill="url(#green-gradient)" fillOpacity="0.08" />
            
            {/* Abstract connected wave/data path */}
            <path d="M 50,130 C 150,130 100,70 200,70 C 300,70 250,130 350,130 C 450,130 400,70 450,70" stroke="url(#blue-gradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" opacity="0.4" />
            <path d="M 50,130 C 150,130 100,70 200,70 C 300,70 250,130 350,130 C 450,130 400,70 450,70" stroke="url(#blue-gradient)" strokeWidth="3" strokeLinecap="round" opacity="0.1" />

            {/* Glowing nodes */}
            <circle cx="200" cy="70" r="5" fill="#3b82f6" />
            <circle cx="350" cy="130" r="5" fill="#10b981" />
            
            {/* Medical Shield Center Icon */}
            <g transform="translate(225, 75)">
              <rect width="50" height="50" rx="12" fill="white" className="shadow-sm" filter="url(#drop-shadow)" />
              <Shield className="w-6 h-6 text-blue-600 absolute" style={{ transform: 'translate(13px, 13px)' }} />
            </g>

            {/* Side Floating Icons */}
            <g transform="translate(140, 115)" className="animate-bounce" style={{ animationDuration: '3s' }}>
              <circle cx="15" cy="15" r="15" fill="white" filter="url(#drop-shadow)" />
              <Activity className="w-4 h-4 text-indigo-500" style={{ transform: 'translate(7px, 7px)' }} />
            </g>
            <g transform="translate(325, 45)" className="animate-bounce" style={{ animationDuration: '4s' }}>
              <circle cx="15" cy="15" r="15" fill="white" filter="url(#drop-shadow)" />
              <Heart className="w-4 h-4 text-emerald-500" style={{ transform: 'translate(7px, 7px)' }} />
            </g>

            {/* Definitions */}
            <defs>
              <linearGradient id="bg-gradient" x1="170" y1="20" x2="330" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="blue-gradient" x1="50" y1="130" x2="450" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="green-gradient" x1="50" y1="130" x2="450" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
              <filter id="drop-shadow" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Selection Prompt */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 tracking-wide uppercase">Who are you?</h2>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          
          {/* Card 1: Doctor / Clinician */}
          <div 
            onClick={() => navigate('/doctor-login')}
            className="group relative bg-white/80 backdrop-blur-md rounded-2xl border border-blue-100 p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            
            <div>
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>👨‍⚕️ Doctor / Clinician</span>
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Manage patients, conduct communication assessments, generate reports, and monitor clinical progress.
              </p>
            </div>

            <button 
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors shadow-xs hover:shadow-md flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
            >
              <span>Continue as Doctor</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-200" />
            </button>
          </div>

          {/* Card 2: Parent / Caregiver */}
          <div 
            onClick={() => navigate('/parent-login')}
            className="group relative bg-white/80 backdrop-blur-md rounded-2xl border border-emerald-100 p-8 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

            <div>
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>👨‍👩‍👧 Parent / Caregiver</span>
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Track your child's progress, view caregiver reports, access home activities, and learning resources.
              </p>
            </div>

            <button 
              className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-xs hover:shadow-md flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
            >
              <span>Continue as Parent</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-200" />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Communication Assessment Tool. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
