import React from 'react';
import { Layers, ClipboardList, Users, ShieldCheck, Video, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Assessment Modules', value: '8 (1 Active)', icon: Layers, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' },
    { title: 'Module 1 Activities', value: '21 Activities', icon: ClipboardList, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
    { title: 'Registered Therapists', value: '2 Clinicians', icon: Users, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60' },
    { title: 'Registered Parents', value: '2 Caregivers', icon: ShieldCheck, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          NIEPMD Administration Portal
        </h1>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
          Manage clinical assessment modules, activity media, and user accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-slate-100 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/admin-modules')}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
            Manage Modules
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Publish or lock assessment modules (Modules 1–8) and update clinical parameters.
          </p>
        </div>

        <div
          onClick={() => navigate('/admin-activities')}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
            Manage Activities & Media
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Edit the 21 Module 1 activities, upload NIEPMD activity images and instructional videos.
          </p>
        </div>

        <div
          onClick={() => navigate('/admin-users')}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm hover:border-purple-500 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors">
            Manage Users & Patient Links
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Create clinician and parent accounts and manage Patient ID code linkages.
          </p>
        </div>
      </div>
    </div>
  );
}
