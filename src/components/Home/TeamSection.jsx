import React from 'react';
import { User } from 'lucide-react';
import logoNiepmd from '../../assets/logo_niepmd.jpg';
import logoRec from '../../assets/logo_rec.png';

const NIEPMD_TEAM = [
  { name: 'Nachiketa Rout', role: 'HOD' },
  { name: 'Mrs. Julie Sandra', role: 'Clinical Supervisor Grade I' },
  { name: 'Akalya', role: 'Team Member' },
  { name: 'Srinidhi', role: 'Team Member' },
  { name: 'Harini', role: 'Team Member' },
  { name: 'Akila', role: 'Team Member' },
];

const REC_TEAM = [
  { name: 'Dr. S. Poonkuzhali', role: 'Faculty / Team Lead' },
  { name: 'Mrs. D. Sorna Shanthi', role: 'Faculty / Team Member' },
  { name: 'Dr. Priya Vijay', role: 'Faculty / Team Member' },
];

export default function TeamSection() {
  return (
    <section className="mt-12 w-full space-y-10">

      {/* ========================================================================= */}
      {/* 1. NIEPMD TEAM SECTION                                                    */}
      {/* ========================================================================= */}
      <div className="bg-white/90 backdrop-blur-xs rounded-3xl border-2 border-purple-200/90 p-6 md:p-8 shadow-xl shadow-purple-900/5">

        {/* Institutional Header */}
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-purple-100">
          <img
            src={logoNiepmd}
            alt="NIEPMD Logo"
            className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-2xl bg-white p-1 border-2 border-purple-200 shadow-sm flex-shrink-0"
          />
          <div>
            <h3 className="text-xl md:text-2xl font-black text-purple-950 tracking-tight">
              NIEPMD
            </h3>
            <p className="text-xs md:text-sm text-purple-800 font-bold leading-snug">
              National Institute for Empowerment of Persons with Multiple Disabilities (Divyangjan)
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NIEPMD_TEAM.map((member, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#ffffcc]/70 border border-purple-200/80 hover:border-purple-500 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-300 text-purple-800 flex items-center justify-center font-bold text-sm shadow-inner group-hover:bg-purple-700 group-hover:text-white transition-colors flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold text-purple-950 truncate">
                  {member.name}
                </h4>
                <p className="text-xs font-semibold text-purple-700 mt-0.5 truncate">
                  {member.role === 'Team Member' ? '' : `(${member.role})`}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. RAJALAKSHMI ENGINEERING COLLEGE TEAM SECTION                          */}
      {/* ========================================================================= */}
      <div className="bg-white/90 backdrop-blur-xs rounded-3xl border-2 border-purple-200/90 p-6 md:p-8 shadow-xl shadow-purple-900/5">

        {/* Institutional Header */}
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-purple-100">
          <img
            src={logoRec}
            alt="Rajalakshmi Engineering College Logo"
            className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-2xl bg-white p-1 border-2 border-purple-200 shadow-sm flex-shrink-0"
          />
          <div>
            <h3 className="text-xl md:text-2xl font-black text-purple-950 tracking-tight">
              RAJALAKSHMI ENGINEERING COLLEGE
            </h3>
            <p className="text-xs md:text-sm text-purple-800 font-bold leading-snug">
              Autonomous Institution, affiliated to Anna University
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REC_TEAM.map((member, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#ffffcc]/70 border border-purple-200/80 hover:border-purple-500 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm shadow-inner group-hover:bg-purple-700 group-hover:text-white transition-colors flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold text-purple-950 truncate">
                  {member.name}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
