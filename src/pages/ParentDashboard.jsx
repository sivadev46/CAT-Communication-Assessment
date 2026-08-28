import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ClipboardCheck, FileText, ArrowRight, ShieldCheck, Video, Clock } from 'lucide-react';
import AssessmentEngine from '../components/Assessment/AssessmentEngine';
import { calculateAge } from '../utils/ageUtils';

export default function ParentDashboard() {
  const { user, logoutUser } = useAuth();
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'assessment' | 'reports'

  // Linked Child Data for Parent
  const [linkedChild] = useState({
    id: 'child-101',
    name: 'Aarav Kumar',
    patient_id_code: 'CAT-2026-00124',
    date_of_birth: '2026-05-12',
    gender: 'Male',
    therapistName: 'Dr. Sarah Jenkins, SLP',
  });

  const ageInfo = calculateAge(linkedChild.date_of_birth);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-emerald-100">
            PARENT / CAREGIVER PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Welcome, {user?.name || user?.fullName || 'Parent'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
            Monitor your child’s pre-intentional communication milestones and complete guided at-home assessment activities.
          </p>
        </div>

        <button
          onClick={() => setActiveView(activeView === 'assessment' ? 'overview' : 'assessment')}
          className="px-6 py-3.5 rounded-2xl bg-white text-emerald-800 font-extrabold text-sm hover:bg-emerald-50 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto hover:scale-[1.02]"
        >
          <ClipboardCheck className="w-5 h-5 text-emerald-700" />
          <span>{activeView === 'assessment' ? 'Back to Overview' : 'Start Assessment'}</span>
        </button>
      </div>

      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Child Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Linked Ward / Child Information
              </h2>
              <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                {linkedChild.patient_id_code}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-gray-500 dark:text-slate-400 font-semibold">Child Full Name</span>
                <p className="text-base font-bold text-gray-900 dark:text-slate-100 mt-1">{linkedChild.name}</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-gray-500 dark:text-slate-400 font-semibold">Exact Calculated Age</span>
                <p className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-1">{ageInfo.formatted}</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-gray-500 dark:text-slate-400 font-semibold">Assigned Clinician</span>
                <p className="text-base font-bold text-gray-900 dark:text-slate-100 mt-1">{linkedChild.therapistName}</p>
              </div>
            </div>
          </div>

          {/* Module 1 Assessment Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  MODULE 1
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  0–3 MONTHS
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                Pre-Intentional Communication Tool
              </h3>
              <p className="text-xs text-gray-600 dark:text-slate-400 max-w-xl">
                Contains 21 guided activities to observe auditory responsiveness, visual attention, and vocal expressions at home.
              </p>
            </div>

            <button
              onClick={() => setActiveView('assessment')}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <span>Continue Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeView === 'assessment' && (
        <AssessmentEngine
          patient={linkedChild}
          role="parent"
          onExit={() => setActiveView('overview')}
        />
      )}
    </div>
  );
}
