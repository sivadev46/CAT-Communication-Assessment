import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ClipboardCheck, FileText, ArrowRight, Heart, Calendar } from 'lucide-react';
import AssessmentEngine from '../components/Assessment/AssessmentEngine';
import Reports from './Reports';
import { calculateAge } from '../utils/ageUtils';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'assessment' | 'reports'

  // Linked Child Data for Parent
  const [linkedChild] = useState({
    id: 'child-101',
    full_name: 'Aarav Kumar',
    name: 'Aarav Kumar',
    patient_id_code: 'CAT-2026-00124',
    date_of_birth: '2026-05-12',
    gender: 'Male',
    therapistName: 'Dr. Sarah Jenkins, SLP',
  });

  const ageInfo = calculateAge(linkedChild.date_of_birth);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 text-white font-sans">
      {/* Header Banner */}
      <div className="bg-[#121218] border border-[#27273A] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            PARENT / CAREGIVER PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {user?.name || user?.fullName || 'Parent'}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg">
            Monitor your child’s communication milestones and complete guided at-home assessment sessions with optional video recordings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeView !== 'overview' && (
            <button
              onClick={() => setActiveView('overview')}
              className="px-4 py-2.5 rounded-xl bg-[#1A1A24] border border-[#27273A] hover:border-[#FFE600] text-gray-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Dashboard
            </button>
          )}

          <button
            onClick={() => setActiveView(activeView === 'assessment' ? 'overview' : 'assessment')}
            className="px-5 py-3 rounded-xl bg-[#FFE600] text-black font-extrabold text-xs hover:bg-[#FACC15] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <ClipboardCheck className="w-4 h-4 text-black" />
            <span>{activeView === 'assessment' ? 'Back to Overview' : 'Start Assessment'}</span>
          </button>
        </div>
      </div>

      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Child Profile Card */}
          <div className="bg-[#121218] rounded-2xl border border-[#27273A] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27273A] pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                <span>Linked Ward Information</span>
              </h2>
              <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-lg bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/30">
                {linkedChild.patient_id_code}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-[#1A1A24] rounded-xl border border-[#27273A]">
                <span className="text-gray-400 font-semibold block">Child Full Name</span>
                <p className="text-base font-extrabold text-white mt-1">{linkedChild.full_name}</p>
              </div>

              <div className="p-4 bg-[#1A1A24] rounded-xl border border-[#27273A]">
                <span className="text-gray-400 font-semibold block">Date of Birth</span>
                <p className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>{linkedChild.date_of_birth}</span>
                </p>
              </div>

              <div className="p-4 bg-[#1A1A24] rounded-xl border border-[#27273A]">
                <span className="text-gray-400 font-semibold block">Exact Dynamic Age</span>
                <p className="text-base font-extrabold text-[#FFE600] mt-1">{ageInfo.formatted}</p>
              </div>

              <div className="p-4 bg-[#1A1A24] rounded-xl border border-[#27273A]">
                <span className="text-gray-400 font-semibold block">Gender</span>
                <p className="text-base font-bold text-white mt-1">{linkedChild.gender}</p>
              </div>
            </div>
          </div>

          {/* Module 1 Assessment Access Card */}
          <div className="bg-[#121218] rounded-2xl border border-[#27273A] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/30">
                  MODULE 1
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  0–3 MONTHS
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Pre-Intentional Communication Tool
              </h3>
              <p className="text-xs text-gray-300 max-w-xl">
                Evaluate foundational auditory responsiveness, visual attention, and vocal expressions with step-by-step guidance and optional video recordings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('reports')}
                className="px-4 py-3 rounded-xl bg-[#1A1A24] hover:bg-[#27273A] border border-[#27273A] text-gray-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#FFE600]" />
                <span>View Reports</span>
              </button>

              <button
                onClick={() => setActiveView('assessment')}
                className="px-6 py-3 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold text-xs shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Continue Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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

      {activeView === 'reports' && (
        <div className="space-y-4">
          <button
            onClick={() => setActiveView('overview')}
            className="px-4 py-2 rounded-xl bg-[#1A1A24] border border-[#27273A] text-gray-300 hover:text-white text-xs font-bold"
          >
            ← Back to Overview
          </button>
          <Reports />
        </div>
      )}
    </div>
  );
}
