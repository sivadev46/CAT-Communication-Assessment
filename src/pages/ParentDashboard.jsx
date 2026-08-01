import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Calendar, PlayCircle, BookOpen, AlertCircle, FileText, LogOut, Sparkles, TrendingUp, CheckCircle, Video } from 'lucide-react';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const parentEmail = localStorage.getItem('cat_parent_email') || 'parent@cat.com';

  useEffect(() => {
    // Check local mock authentication for parent
    const isAuth = localStorage.getItem('cat_parent_authenticated');
    if (!isAuth) {
      navigate('/parent-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('cat_parent_authenticated');
    localStorage.removeItem('cat_parent_email');
    navigate('/');
  };

  const childName = "Leo";
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 font-sans text-slate-800 pb-12">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-emerald-100/80 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-100">
              <Heart className="w-5.5 h-5.5 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base block leading-none">CAT Caregiver</span>
              <span className="text-[10px] text-emerald-600 font-semibold tracking-wider uppercase mt-0.5 block">Parent Portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-700 block">{parentEmail}</span>
              <span className="text-[10px] text-slate-400 font-semibold">Child Profile: {childName}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-red-200 text-xs font-semibold text-slate-600 hover:text-red-650 rounded-xl bg-white hover:bg-red-50/50 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
          
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>Interactive Care Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, parent!
            </h1>
            <p className="text-sm md:text-base text-emerald-750 font-medium">
              Here is your daily tracking overview for <strong className="text-slate-900">{childName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 self-start md:self-auto z-10">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Future Release Disclaimer Alert */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3.5 shadow-sm">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm leading-snug">Developer Preview Notice</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              This module will be expanded in future versions. The dashboard currently displays mock metrics, clinical templates, and sample caregiver activities. In subsequent updates, this portal will synch with live clinician reports, active milestones tracking, and telehealth video conferences.
            </p>
          </div>
        </div>

        {/* Three Column Widget Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: Child Progress Tracker & Latest Caregiver Report */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Child Progress Card */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span>Child Progress Metrics</span>
                  </h2>
                  <p className="text-xs text-slate-500">Milestone compliance and vocabulary metrics</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Overall Index: 78%</span>
              </div>

              {/* Progress items */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Receptive Vocabulary (Words understood)</span>
                    <span className="text-emerald-600">85% Compliance</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Expressive Language (Spoken words/Gestures)</span>
                    <span className="text-emerald-600">72% Compliance</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Social Communication (Eye contact, Joint attention)</span>
                    <span className="text-emerald-600">77% Compliance</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: '77%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Caregiver Report Card */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span>Latest Caregiver Report</span>
                  </h2>
                  <p className="text-xs text-slate-500">Speech pathology clinical summaries simplified for parents</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">CAT Standardized Evaluation Report</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Generated 3 days ago</span>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed font-medium">
                  "{childName} has demonstrated prominent progression in phonological awareness, specifically matching auditory syllables to visual cues. Speech articulation rate of tri-syllable items was successfully measured with an 80% accuracy. Recommendations include structured visual-pointing sessions."
                </p>
                <div className="flex justify-end">
                  <button className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors cursor-pointer">
                    Download Full PDF Report
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMN 2: Quick Widgets (Activities, Videos, Appointments) */}
          <div className="space-y-8">
            
            {/* Home Activities */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-md font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-emerald-600" />
                  <span>Home Activities</span>
                </h2>
                <p className="text-[11px] text-slate-500">Therapist recommended daily tasks</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50 rounded-xl transition-all cursor-pointer flex gap-3">
                  <div className="p-2 bg-emerald-600/10 rounded-lg text-emerald-655 flex-shrink-0 h-fit">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">Visual Naming Game</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Point to household objects and vocalize name (15 mins/day).</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50 rounded-xl transition-all cursor-pointer flex gap-3">
                  <div className="p-2 bg-emerald-600/10 rounded-lg text-emerald-655 flex-shrink-0 h-fit">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">Rhythmic Syllables Clapping</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Clap together on word-syllables during story time (10 mins/day).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teaching Videos */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-md font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-4.5 h-4.5 text-emerald-600" />
                  <span>Teaching Videos</span>
                </h2>
                <p className="text-[11px] text-slate-500">Interactive guidance tutorials</p>
              </div>

              <div className="space-y-3">
                <div className="group p-3 bg-slate-50 hover:bg-slate-100 border border-slate-250/50 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <PlayCircle className="w-7 h-7 text-emerald-600 group-hover:scale-105 transition-transform" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">Introduction to Phonetics</h4>
                      <p className="text-[10px] text-slate-400">Duration: 8 mins</p>
                    </div>
                  </div>
                </div>

                <div className="group p-3 bg-slate-50 hover:bg-slate-100 border border-slate-250/50 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <PlayCircle className="w-7 h-7 text-emerald-600 group-hover:scale-105 transition-transform" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">Interactive Play Strategies</h4>
                      <p className="text-[10px] text-slate-400">Duration: 12 mins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-md font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-emerald-600" />
                  <span>Upcoming Appointments</span>
                </h2>
                <p className="text-[11px] text-slate-500">Next clinical consult sessions</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">Milestone Assessment Review</span>
                    <span className="text-[10px] font-bold text-blue-650 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">In Clinic</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    With Dr. Sarah • Wednesday, Aug 12 at 10:30 AM
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
