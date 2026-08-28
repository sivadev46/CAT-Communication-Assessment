import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const RESPONSE_OPTIONS = [
  {
    value: '0-25',
    range: '0–25%',
    label: 'Minimal response',
    color: 'hover:border-amber-400 border-gray-200 dark:border-slate-700',
    selectedColor: 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
  },
  {
    value: '25-50',
    range: '25–50%',
    label: 'Low response',
    color: 'hover:border-blue-400 border-gray-200 dark:border-slate-700',
    selectedColor: 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
  },
  {
    value: '50-80',
    range: '50–80%',
    label: 'Moderate response',
    color: 'hover:border-emerald-400 border-gray-200 dark:border-slate-700',
    selectedColor: 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
  },
  {
    value: '80-100',
    range: '80–100%',
    label: 'High response',
    color: 'hover:border-purple-400 border-gray-200 dark:border-slate-700',
    selectedColor: 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300'
  }
];

export default function AssessmentScale({ selectedValue, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
        Select Observed Response Level:
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {RESPONSE_OPTIONS.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between text-left cursor-pointer ${
                isSelected
                  ? option.selectedColor + ' shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-800/80 ' + option.color
              }`}
            >
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${option.badgeBg} mb-1.5`}>
                  {option.range}
                </span>
                <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                  {option.label}
                </p>
              </div>

              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 dark:border-slate-600'
              }`}>
                {isSelected && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
