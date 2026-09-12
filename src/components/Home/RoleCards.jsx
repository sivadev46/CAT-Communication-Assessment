import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import DoctorScrubsAvatar from '../Common/DoctorScrubsAvatar';
import ParentAvatar from '../Common/ParentAvatar';
import LearnerAvatar from '../Common/LearnerAvatar';

export default function RoleCards() {
  const navigate = useNavigate();

  return (
    <div className="mt-8 w-full">
      <div className="mb-4">
        <h3 className="text-xs font-black text-purple-800 tracking-wider uppercase">
          Select your portal to continue:
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full items-stretch">
        
        {/* 1. THERAPIST PORTAL CARD */}
        <div 
          onClick={() => navigate('/doctor-login')}
          className="group relative bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg shadow-purple-900/5 hover:border-purple-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden h-full"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-700" />
          <div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs overflow-hidden">
              <DoctorScrubsAvatar className="w-12 h-12" />
            </div>
            <h4 className="text-lg font-extrabold text-purple-950 mb-1">
              Therapist Portal
            </h4>
            <p className="text-xs text-purple-900 leading-relaxed mb-4 font-medium">
              Manage patients, conduct 4-scale assessments, review parent videos & generate reports.
            </p>
          </div>
          <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
            <span>Therapist Login</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. PARENT PORTAL CARD */}
        <div 
          onClick={() => navigate('/parent-login')}
          className="group relative bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg shadow-purple-900/5 hover:border-purple-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden h-full"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-800" />
          <div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs overflow-hidden">
              <ParentAvatar className="w-12 h-12" />
            </div>
            <h4 className="text-lg font-extrabold text-purple-950 mb-1">
              Parent Portal
            </h4>
            <p className="text-xs text-purple-900 leading-relaxed mb-4 font-medium">
              Register with Patient ID, assess ward, record video sessions & track child reports.
            </p>
          </div>
          <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
            <span>Parent Portal</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3. LEARNER PORTAL CARD */}
        <div 
          onClick={() => navigate('/learner-login')}
          className="group relative bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg shadow-purple-900/5 hover:border-purple-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden h-full"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-700" />
          <div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs overflow-hidden">
              <LearnerAvatar className="w-12 h-12" />
            </div>
            <h4 className="text-lg font-extrabold text-purple-950 mb-1">
              Learner Portal
            </h4>
            <p className="text-xs text-purple-900 leading-relaxed mb-4 font-medium">
              Practice, learn, and track your communication progress.
            </p>
          </div>
          <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
            <span>Learner Login</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
