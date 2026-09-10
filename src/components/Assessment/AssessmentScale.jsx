import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SCALE_OPTIONS = [
  {
    value: '0-25',
    displayRange: '0–25%',
    description: 'Minimal / Initial response observed'
  },
  {
    value: '25-50',
    displayRange: '25–50%',
    description: 'Emerging / Low response level'
  },
  {
    value: '50-80',
    displayRange: '50–80%',
    description: 'Moderate / In-progress response level'
  },
  {
    value: '80-100',
    displayRange: '80–100%',
    description: 'High / Consistent response observed'
  }
];

export default function AssessmentScale({ selectedValue, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#FFE600]">
        Select Response Scale:
      </label>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {SCALE_OPTIONS.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between text-left cursor-pointer ${
                isSelected
                  ? 'border-[#FFE600] bg-[#FFE600]/15 text-white ring-2 ring-[#FFE600]/40 shadow-[0_0_12px_rgba(255,230,0,0.2)] scale-[1.01]'
                  : 'border-[#27273A] bg-[#121218] hover:border-gray-500 text-gray-200 hover:bg-[#1A1A24]'
              }`}
            >
              <div className="space-y-1">
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-sm sm:text-base font-extrabold ${
                    isSelected
                      ? 'bg-[#FFE600] text-black shadow-sm'
                      : 'bg-[#1A1A24] text-[#FFE600] border border-[#27273A]'
                  }`}
                >
                  {opt.displayRange}
                </span>
                <p className="text-xs text-gray-300 font-medium hidden sm:block">
                  {opt.description}
                </p>
              </div>

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                  isSelected
                    ? 'border-[#FFE600] bg-[#FFE600] text-black font-bold'
                    : 'border-gray-600 bg-[#1A1A24] text-transparent'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
