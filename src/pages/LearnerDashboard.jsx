import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCompletedCount } from '../utils/learnerProgress';
import { LEARNER_ACTIVITIES } from '../data/learnerActivities';
import {
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  FolderKanban,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function LearnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [completedCount, setCompletedCount] = useState(() => getCompletedCount(user));

  useEffect(() => {
    setCompletedCount(getCompletedCount(user));
  }, [user]);

  const totalActivities = LEARNER_ACTIVITIES.length || 32;
  const progressPercent = Math.min(100, Math.round((completedCount / totalActivities) * 100));

  const stats = [
    {
      title: 'Activities Completed',
      value: String(completedCount),
      subtitle: `${completedCount} of ${totalActivities} activities done`,
      icon: CheckCircle2,
      color: 'text-purple-700',
      bg: 'bg-purple-100',
      border: 'border-purple-200',
    },
    {
      title: 'Current Progress',
      value: `${progressPercent}%`,
      subtitle: 'Overall curriculum progress',
      icon: TrendingUp,
      color: 'text-purple-700',
      bg: 'bg-purple-100',
      border: 'border-purple-200',
    },
    {
      title: 'Learning Categories',
      value: '8',
      subtitle: 'Available activity categories',
      icon: FolderKanban,
      color: 'text-purple-700',
      bg: 'bg-purple-100',
      border: 'border-purple-200',
    },
    {
      title: 'Active Badges',
      value: String(Math.floor(completedCount / 4)),
      subtitle: 'Earned achievement milestones',
      icon: Award,
      color: 'text-purple-700',
      bg: 'bg-purple-100',
      border: 'border-purple-200',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-900 rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 right-20 -mb-20 w-48 h-48 rounded-full bg-purple-500/10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-purple-100 text-xs font-bold mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Welcome to your CAT Learning Space</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-2">
            Hello, {user?.fullName || 'Learner'}! 👋
          </h1>
          <p className="text-sm sm:text-base text-purple-100 leading-relaxed font-medium">
            Explore interactive communication activities, strengthen receptive and expressive skills, and track your learning milestones at your own pace.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/learner-learning-modules')}
              className="inline-flex items-center gap-2 bg-white text-purple-950 hover:bg-purple-50 font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm"
            >
              <BookOpen className="w-4 h-4 text-purple-700" />
              <span>Go to Learning Modules</span>
              <ArrowRight className="w-4 h-4 text-purple-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Stat Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-purple-950">Learning Overview</h2>
          <span className="text-xs text-purple-700 font-bold bg-purple-100 px-2.5 py-1 rounded-lg">
            Active Stats
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-purple-100 p-5 shadow-sm hover:border-purple-300 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-900">{stat.title}</span>
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-purple-950 mb-1">{stat.value}</div>
                <div className="text-[11px] text-purple-800 font-medium">{stat.subtitle}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Modules CTA Section */}
      <div className="bg-white rounded-3xl border-2 border-purple-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-purple-700 font-extrabold text-xs uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Curriculum Activities</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-purple-950">
              Ready to practice communication activities?
            </h3>
            <p className="text-xs sm:text-sm text-purple-900 leading-relaxed font-medium">
              We have organized 8 core categories containing receptive and expressive activities designed to support your speech and language development.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                🔷 Receptive Activities
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
                🟣 Expressive Activities
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end">
            <button
              onClick={() => navigate('/learner-learning-modules')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-md hover:shadow-purple-700/20 transition-all cursor-pointer text-sm"
            >
              <span>Explore All Modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
