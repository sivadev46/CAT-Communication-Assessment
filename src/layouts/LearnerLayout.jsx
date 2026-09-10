import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  User,
} from 'lucide-react';
import logoNiepmd from '../assets/logo_niepmd.jpg';

export default function LearnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/learner-login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/learner-dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Learning Modules',
      path: '/learner-learning-modules',
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-purple-50/40 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b-2 border-purple-100 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-xl text-purple-900 hover:bg-purple-100 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={logoNiepmd}
              alt="NIEPMD"
              className="w-9 h-9 object-contain rounded-xl border border-purple-200 bg-white p-0.5 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-purple-950 text-base leading-none tracking-tight">
                  CAT Learner Portal
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-700 text-white hidden sm:inline-block shadow-xs">
                  NIEPMD
                </span>
              </div>
              <p className="text-[11px] font-semibold text-purple-800 mt-0.5">
                Communication Learning & Activity Space
              </p>
            </div>
          </div>
        </div>

        {/* User Info & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-purple-50/80 border border-purple-200 px-3 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black text-purple-950 leading-tight">
                {user?.fullName || 'Learner'}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-purple-700 font-bold">
                <span>Role: Learner</span>
                {user?.learnerId && (
                  <>
                    <span>•</span>
                    <span className="bg-purple-200/80 text-purple-900 px-1.5 py-0.2 rounded font-mono font-extrabold">
                      {user.learnerId}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2.5 text-purple-700 hover:text-red-600 hover:bg-red-50 border border-purple-200 hover:border-red-200 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-purple-950/40 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Learner Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-purple-100 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile Sidebar Header */}
          <div className="p-4 border-b border-purple-100 md:hidden flex justify-between items-center bg-purple-50/60">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-700" />
              <span className="font-extrabold text-purple-950 text-sm">Learner Navigation</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Nav Items */}
          <div className="p-4 space-y-1">
            <div className="text-[10px] font-black uppercase text-purple-600 tracking-wider px-3 mb-2">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-purple-700 text-white shadow-md shadow-purple-900/10'
                        : 'text-purple-900 hover:bg-purple-50 hover:text-purple-950'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Decorative Learner Helper Box */}
          <div className="mx-4 mt-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 shadow-xs">
            <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>Learning Tip</span>
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed font-medium">
              Explore activities daily to strengthen your receptive and expressive communication skills.
            </p>
          </div>

          {/* Sidebar Footer Logout */}
          <div className="p-4 border-t border-purple-100 bg-purple-50/30">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-purple-900 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left cursor-pointer border border-transparent hover:border-red-200"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
