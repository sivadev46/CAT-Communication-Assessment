import React from 'react';

export default function HomeFooter() {
  return (
    <footer className="w-full bg-[#ffffcc] py-6 px-4 border-t border-purple-200/80 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <p className="text-xs font-bold text-purple-950">
            © {new Date().getFullYear()} Communication Assessment Tool (CAT). All Rights Reserved.
          </p>
          <p className="text-[11px] text-purple-800 font-semibold mt-0.5">
            Developed by NIEPMD & Rajalakshmi Engineering College
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-purple-800">
          <span className="px-2.5 py-1 rounded-full bg-purple-100 border border-purple-200">
            v2.0 Production
          </span>
        </div>
      </div>
    </footer>
  );
}
