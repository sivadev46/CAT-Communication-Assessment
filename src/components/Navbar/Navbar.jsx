import React from 'react';
import { Activity, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logoNiepmd from '../../assets/logo_niepmd.jpg';

export default function Navbar({ onToggleSidebar }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const isParent = user?.role === 'parent';

  return (
    <header className="h-16 bg-[#121218] border-b border-[#27273A] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* NIEPMD Brand & Project Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A1A24] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <img
            src={logoNiepmd}
            alt="NIEPMD"
            className="w-9 h-9 object-contain rounded-lg border border-[#27273A] bg-white p-0.5"
          />
          <div>
            <h1 className="font-extrabold text-white text-base leading-tight flex items-center gap-2">
              <span>{isParent ? 'CAT Caregiver' : 'CAT Platform'}</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/30 hidden sm:inline-block">
                NIEPMD
              </span>
            </h1>
            <p className="text-xs font-semibold text-gray-400">
              {isParent ? 'Parent / Caregiver Portal' : 'Clinical Assessment Tool'}
            </p>
          </div>
        </div>
      </div>

      {/* User Info & Sign Out */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-[#27273A] bg-[#1A1A24] text-[#FFE600] flex items-center justify-center font-bold text-xs shadow-inner">
            {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-white leading-none">{user?.fullName || 'User'}</p>
            <p className="text-[11px] text-[#FFE600] mt-0.5 font-semibold">
              {isParent ? 'Caregiver' : (user?.role || 'Therapist')}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
