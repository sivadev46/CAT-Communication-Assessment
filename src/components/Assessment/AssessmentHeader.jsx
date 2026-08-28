import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import ProgressBar from '../ProgressBar/ProgressBar';

export default function AssessmentHeader({
  moduleTitle = 'Pre-Intentional Communication Tool',
  ageRange = '0–3 months',
  currentStep = 1,
  totalSteps = 21,
  onBack,
  onExit,
}) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                COMMUNICATION ASSESSMENT TOOL
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                {ageRange}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1">
              {moduleTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">
              Activity <strong className="text-gray-900 dark:text-slate-100">{currentStep}</strong> of {totalSteps}
            </span>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{percentage}% completed</div>
          </div>
          {onExit && (
            <button
              onClick={onExit}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              Save & Exit
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Progress Bar */}
      <ProgressBar
        progress={percentage}
        height="h-3"
        color="bg-gradient-to-r from-blue-500 to-indigo-600"
        animated={true}
      />
    </div>
  );
}
