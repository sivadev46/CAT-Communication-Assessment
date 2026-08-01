import React from 'react';
import { Activity, Bell, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const isParent = user?.role === 'parent';

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Logo & Project Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${isParent ? 'bg-emerald-600 shadow-emerald-100' : 'bg-blue-600'}`}>
            {isParent ? <Heart className="w-5.5 h-5.5 fill-white text-white" /> : <Activity className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight">
              {isParent ? 'CAT Caregiver' : 'CAT'}
            </h1>
            <p className={`text-xs font-medium hidden sm:block ${isParent ? 'text-emerald-600' : 'text-blue-600'}`}>
              {isParent ? 'Parent Portal' : 'Communication Assessment Tool'}
            </p>
          </div>
        </div>
      </div>

      {/* Action items: Notifications & Profile Avatar */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-semibold text-sm shadow-xs ${
            isParent
              ? 'bg-emerald-100 border-emerald-200 text-emerald-700'
              : 'bg-blue-100 border-blue-200 text-blue-700'
          }`}>
            {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : <User className="w-5 h-5" />}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-none">{user?.fullName || 'Parent Account'}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isParent ? 'Caregiver' : (user?.role || 'Clinician')}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

