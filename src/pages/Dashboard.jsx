import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ClipboardCheck,
  FileText,
  Clock,
  PlusCircle,
  Video,
  CheckCircle2,
  ChevronRight,
  Calendar
} from 'lucide-react';
import Button from '../components/Button/Button';
import ParentReviewManager from '../components/Therapist/ParentReviewManager';
import { catSupabaseService } from '../services/catSupabase';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews'

  const [pendingVideos, setPendingVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const loadPendingSubmissions = async () => {
    setLoading(true);
    try {
      const subs = await catSupabaseService.getPendingVideoSubmissions();
      setPendingVideos(subs);
    } catch (err) {
      console.warn('Error loading pending videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingSubmissions();
  }, []);

  const handleApproveVideo = async (submissionId) => {
    await catSupabaseService.reviewParentVideo(submissionId, user?.id, 'approved');
    loadPendingSubmissions();
  };

  const handleRejectVideo = async (submissionId) => {
    await catSupabaseService.reviewParentVideo(submissionId, user?.id, 'rejected');
    loadPendingSubmissions();
  };

  const handleDeleteVideo = async (submissionId, videoPath) => {
    await catSupabaseService.deleteParentVideo(submissionId, videoPath);
    loadPendingSubmissions();
  };

  return (
    <div className="space-y-6 pb-12 text-white font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121218] p-6 rounded-2xl border border-[#27273A] shadow-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.fullName || 'Dr. Therapist'}
          </h1>
          <p className="text-sm font-semibold text-[#FFE600] mt-1">
            Communication Assessment Tool (CAT) • Clinical Workspace
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300 bg-[#1A1A24] px-3.5 py-2 rounded-xl border border-[#27273A]">
            <Calendar className="w-4 h-4 text-[#FFE600]" />
            <span>{currentDate}</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'reviews' ? 'overview' : 'reviews')}
            className="px-4 py-2.5 rounded-xl bg-[#FFE600] text-black font-extrabold text-xs hover:bg-[#FACC15] transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Video className="w-4 h-4 text-black" />
            <span>Parent Video Reviews ({pendingVideos.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Quick Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#121218] border border-[#27273A] p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase text-gray-400">Total Patients</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">12</h3>
                <p className="text-[11px] text-[#FFE600] mt-1 font-semibold">Active clinical files</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/30">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#121218] border border-[#27273A] p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase text-gray-400">Assessments</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">21</h3>
                <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Completed Module 1</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ClipboardCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#121218] border border-[#27273A] p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase text-gray-400">Parent Videos</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{pendingVideos.length}</h3>
                <p className="text-[11px] text-amber-400 mt-1 font-semibold">Pending review</p>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Video className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#121218] border border-[#27273A] p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase text-gray-400">Reports Generated</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">8</h3>
                <p className="text-[11px] text-indigo-400 mt-1 font-semibold">Clinical & AI Summaries</p>
              </div>
              <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-[#121218] border border-[#27273A] p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Clinical Shortcuts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => navigate('/assessment')}
                className="p-4 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold text-xs shadow-lg transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="w-5 h-5 text-black" />
                  <div className="text-left">
                    <span className="block text-sm">Start Assessment</span>
                    <span className="text-[11px] text-black/70 font-medium">Shared 4-scale engine</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-black" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/patients')}
                className="p-4 rounded-xl bg-[#1A1A24] hover:bg-[#27273A] border border-[#27273A] text-white font-bold text-xs shadow-md transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#FFE600]" />
                  <div className="text-left">
                    <span className="block text-sm">Manage Patients</span>
                    <span className="text-[11px] text-gray-400 font-medium">DOB & Patient ID generator</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/reports')}
                className="p-4 rounded-xl bg-[#1A1A24] hover:bg-[#27273A] border border-[#27273A] text-white font-bold text-xs shadow-md transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FFE600]" />
                  <div className="text-left">
                    <span className="block text-sm">Reports & PDF</span>
                    <span className="text-[11px] text-gray-400 font-medium">Gemini AI clinical summary</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Pending Parent Video Reviews Preview */}
          <ParentReviewManager
            submissions={pendingVideos}
            onApprove={handleApproveVideo}
            onReject={handleRejectVideo}
            onDeleteVideo={handleDeleteVideo}
          />
        </div>
      ) : (
        <ParentReviewManager
          submissions={pendingVideos}
          onApprove={handleApproveVideo}
          onReject={handleRejectVideo}
          onDeleteVideo={handleDeleteVideo}
        />
      )}
    </div>
  );
}
