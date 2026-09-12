import React from 'react';
import { Target, Sparkles } from 'lucide-react';

export default function AimOfCAT() {
  return (
    <section className="mt-12 w-full">
      <div className="relative bg-white/90 backdrop-blur-xs rounded-3xl border-2 border-purple-200/90 p-6 md:p-8 shadow-xl shadow-purple-900/5 overflow-hidden">
        {/* Top decorative accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-700 via-purple-500 to-amber-500" />

        {/* Subtle background glow */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-purple-100/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Target Icon Badge */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-purple-100 border-2 border-purple-300 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Target className="w-8 h-8 md:w-10 md:h-10 text-purple-700" />
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Core Mission</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-purple-950 tracking-tight">
              Aim of Communication Assessment Tool
            </h2>

            <p className="text-base md:text-lg text-purple-900 font-bold leading-relaxed mt-2 max-w-3xl">
              To identify the language level of the child so as to make a language appropriate therapy plan for the child.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
