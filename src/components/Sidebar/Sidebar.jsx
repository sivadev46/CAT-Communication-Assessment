import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  Video,
  Glasses,
  LogOut,
  Puzzle
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logoutUser } = useAuth();
  const isParent = user?.role === 'parent';

  const navItems = isParent
    ? [
        { name: 'Dashboard', path: '/parent-dashboard', icon: LayoutDashboard },
        { name: 'Teaching Videos', path: '/teaching-videos', icon: Video },
        { name: 'Therapy Activities', path: '/therapy-activities', icon: Puzzle },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Patients', path: '/patients', icon: Users },
        { name: 'Assessment', path: '/assessment', icon: ClipboardCheck },
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'VR Assessment', path: '/vr', icon: Glasses },
      ];

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 md:hidden flex justify-between items-center">
          <span className="font-bold text-gray-900 dark:text-slate-100">Navigation</span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => {
                  const isCurrentActive = isActive || (item.path.includes('#') && window.location.pathname + window.location.hash === item.path);
                  return `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isCurrentActive
                      ? isParent
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border-l-4 border-emerald-600 pl-2.5'
                        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold border-l-4 border-blue-600 pl-2.5'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-850/60 hover:text-gray-900 dark:hover:text-slate-200'
                  }`;
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 mt-auto">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-colors cursor-pointer ${
              isParent
                ? 'text-gray-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400'
                : 'text-gray-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400'
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
