import React, { useState } from 'react';
import { Video, Check, X, Clock, Play, AlertCircle, Sparkles } from 'lucide-react';
import Modal from '../Modal/Modal';

export default function ParentReviewManager({ submissions = [], onApprove, onReject }) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all'

  // Filter submissions
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending_review');
  const displayedList = activeTab === 'pending' ? pendingSubmissions : submissions;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Parent Session Reviews
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Review and approve parent-recorded activity videos before updating official clinical progress.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
            }`}
          >
            Pending ({pendingSubmissions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
            }`}
          >
            All Submissions ({submissions.length})
          </button>
        </div>
      </div>

      {displayedList.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 dark:bg-slate-850/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
          <Clock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300">
            No submissions found
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'There are currently no parent-submitted sessions waiting for clinical review.'
              : 'No recorded parent sessions logged yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedList.map((item) => {
            const isPending = item.status === 'pending_review';
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-slate-100">
                      {item.patientName || 'Aarav Kumar'}
                    </span>
                    <span className="text-xs text-gray-400">({item.patientIdCode || 'CAT-2026-00124'})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isPending
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : item.status === 'approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {isPending ? 'Pending Review' : item.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                    Activity: {item.activityTitle || 'Startle Response to Loud Sudden Noises'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-slate-400 pt-1">
                    <span>
                      Parent selected: <strong className="text-gray-900 dark:text-slate-200">{item.selectedRange || '50–80%'}</strong>
                    </span>
                    <span>•</span>
                    <span>Submitted: {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Today'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {item.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedVideoUrl(item.videoUrl)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-blue-600 dark:fill-blue-400" />
                      Watch Recording
                    </button>
                  )}

                  {isPending && (
                    <>
                      <button
                        type="button"
                        onClick={() => onApprove && onApprove(item.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject && onReject(item.id)}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Preview Modal */}
      <Modal
        isOpen={Boolean(selectedVideoUrl)}
        onClose={() => setSelectedVideoUrl(null)}
        title="Parent Recorded Session Video"
        size="lg"
      >
        <div className="p-4 sm:p-6">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
            {selectedVideoUrl && (
              <video src={selectedVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
