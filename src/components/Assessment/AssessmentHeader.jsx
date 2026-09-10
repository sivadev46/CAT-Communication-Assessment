import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

export default function AssessmentHeader({
  moduleName = 'Pre-Intentional Communication Tool',
  activityTitle = 'Startle response to loud sudden noises',
  currentStep = 1,
  totalSteps = 21,
  onBack,
  onExit,
}) {
  const completionPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-[#121218] border border-[#27273A] p-4 sm:p-5 rounded-2xl shadow-md space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {/* 1. TOP TITLE */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFE600] bg-[#FFE600]/10 border border-[#FFE600]/30 px-2.5 py-0.5 rounded-md">
              COMMUNICATION ASSESSMENT TOOL
            </span>
          </div>

          {/* 2. MODULE NAME */}
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
            {moduleName}
          </h2>

          {/* 3. ACTIVITY NAME */}
          <p className="text-sm font-semibold text-[#FFE600] flex items-center gap-2">
            <span>Activity {currentStep}:</span>
            <span className="text-gray-200 font-medium">{activityTitle}</span>
          </p>
        </div>

        {/* Exit / Action controls */}
        <div className="flex items-center gap-2 shrink-0">
          {onBack && currentStep > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl text-gray-300 hover:text-white bg-[#1A1A24] border border-[#27273A] hover:border-[#FFE600] transition-colors cursor-pointer"
              title="Previous Activity"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-[#1A1A24] border border-[#27273A] hover:border-[#FFE600] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-red-400" />
              <span>Exit</span>
            </button>
          )}
        </div>
      </div>

      {/* ASSESSMENT COMPLETION PROGRESS BAR */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-xs font-bold text-gray-300">
          <span className="text-gray-400">ASSESSMENT COMPLETION</span>
          <span className="text-[#FFE600]">
            Activity {currentStep} of {totalSteps} ({completionPercentage}%)
          </span>
        </div>

        <div className="w-full bg-[#1A1A24] border border-[#27273A] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#FFE600] h-full transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(255,230,0,0.5)]"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
