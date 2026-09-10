import React, { useState } from 'react';
import { Video, Check, X, Clock, Play, Trash2, AlertCircle } from 'lucide-react';
import Modal from '../Modal/Modal';

export default function ParentReviewManager({
  submissions = [],
  onApprove,
  onReject,
  onDeleteVideo
}) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all'
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter submissions
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending_review' || s.review_status === 'pending_review');
  const displayedList = activeTab === 'pending' ? pendingSubmissions : submissions;

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    if (onDeleteVideo) {
      await onDeleteVideo(deleteTarget.id || deleteTarget._id, deleteTarget.video_path || deleteTarget.videoPath);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="bg-[#121218] rounded-2xl border border-[#27273A] p-4 sm:p-6 shadow-xl space-y-4 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#27273A]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-[#FFE600]" />
            <span>Parent Session Reviews</span>
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Review parent-recorded session videos, approve response levels, or safely delete files.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1A1A24] border border-[#27273A] p-1 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#FFE600] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending ({pendingSubmissions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#FFE600] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Submissions ({submissions.length})
          </button>
        </div>
      </div>

      {displayedList.length === 0 ? (
        <div className="py-12 text-center bg-[#1A1A24] rounded-xl border border-dashed border-[#27273A]">
          <Clock className="w-10 h-10 text-gray-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-200">
            No submissions found
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'There are currently no parent-submitted sessions waiting for clinical review.'
              : 'No recorded parent sessions logged yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedList.map((item) => {
            const statusVal = item.review_status || item.status || 'pending_review';
            const isPending = statusVal === 'pending_review';
            const patientName = item.patients?.full_name || item.patientName || 'Aarav Kumar';
            const patientCode = item.patients?.patient_id_code || item.patientIdCode || 'CAT-2026-00124';
            const activityTitle = item.assessment_activities?.title || item.activityTitle || 'Activity Recording';

            return (
              <div
                key={item.id || item._id}
                className="p-4 rounded-xl border border-[#27273A] bg-[#1A1A24] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {patientName}
                    </span>
                    <span className="text-xs font-mono text-[#FFE600]">({patientCode})</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isPending
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : statusVal === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {isPending ? 'Pending Review' : statusVal}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#FFE600]">
                    Activity: <span className="text-gray-200">{activityTitle}</span>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                    <span>
                      Parent Scale: <strong className="text-white">{item.selected_range || item.selectedRange || '50–80%'}</strong>
                    </span>
                    <span>•</span>
                    <span>Submitted: {item.created_at || item.submittedAt ? new Date(item.created_at || item.submittedAt).toLocaleDateString() : 'Today'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(item.video_url || item.videoUrl) && (
                    <button
                      type="button"
                      onClick={() => setSelectedVideoUrl(item.video_url || item.videoUrl)}
                      className="px-3.5 py-2 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      Watch Video
                    </button>
                  )}

                  {isPending && (
                    <>
                      <button
                        type="button"
                        onClick={() => onApprove && onApprove(item.id || item._id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject && onReject(item.id || item._id)}
                        className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}

                  {/* SAFE DELETE VIDEO BUTTON */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-xl bg-[#121218] hover:bg-red-950/60 border border-[#27273A] hover:border-red-800 text-gray-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Delete Recording File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
        <div className="p-4 sm:p-6 bg-[#121218] text-white">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center border border-[#27273A]">
            {selectedVideoUrl && (
              <video src={selectedVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Video Deletion"
      >
        <div className="p-5 space-y-4 bg-[#121218] text-white">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <h4 className="font-bold text-sm">Delete this recorded video?</h4>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            This action cannot be undone. The video storage object will be permanently removed.
            <br /><strong className="text-white">Note:</strong> Deleting this video will NOT delete the patient record or assessment responses.
          </p>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 bg-[#1A1A24] border border-[#27273A]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md"
            >
              Delete Video File
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
