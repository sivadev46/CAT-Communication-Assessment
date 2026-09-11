import React, { useState, useEffect } from 'react';
import {
  Play,
  X,
  MessageSquare,
  UserCheck,
  AlertCircle,
  LoaderCircle,
  CheckCircle,
  Clock,
  Check
} from 'lucide-react';
import Button from '../Button/Button';
import { submissionService } from '../../services/submissionService';

export default function VideoPlayerModal({
  isOpen,
  onClose,
  submission = null,
  isClinicianView = false,
  onReviewed = null
}) {
  const [feedback, setFeedback] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [currentSubmission, setCurrentSubmission] = useState(submission);

  useEffect(() => {
    setCurrentSubmission(submission);
    setFeedback(submission?.clinicianFeedback || '');
    setReviewError(null);
  }, [submission]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !currentSubmission) return null;

  const patientName = currentSubmission.patientId?.fullName || 'Patient';
  const parentName = currentSubmission.parentId?.fullName || 'Caregiver';
  const doctorName = currentSubmission.clinicianId?.fullName || 'Dr. Sarah Jenkins';
  const formattedDate = new Date(
    currentSubmission.sentAt || currentSubmission.createdAt
  ).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleReviewSubmission = async () => {
    setIsSubmittingReview(true);
    setReviewError(null);
    try {
      const res = await submissionService.reviewSubmission(currentSubmission._id, feedback);
      if (res.success && res.data) {
        setCurrentSubmission(res.data);
        if (onReviewed) {
          onReviewed(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to review submission:', err);
      setReviewError(err.response?.data?.message || 'Failed to update review status.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Reviewed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3 h-3 text-emerald-600" />
            Reviewed
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Clock className="w-3 h-3 text-blue-600" />
            Pending Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {status || 'Recorded'}
          </span>
        );
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm font-sans animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Play className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {currentSubmission.activityTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Child: <strong className="text-slate-700 dark:text-slate-200">{patientName}</strong> • Submitted: <strong>{formattedDate}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {renderStatusBadge(currentSubmission.status)}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video & Info Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Video Player */}
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center relative">
            {currentSubmission.videoUrl ? (
              <video
                key={currentSubmission._id || currentSubmission.videoUrl}
                src={currentSubmission.videoUrl}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Video player load error:', e.currentTarget.error, currentSubmission.videoUrl);
                }}
              />
            ) : (
              <div className="text-center p-6 text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
                <p className="text-xs font-semibold">No video URL found for this submission.</p>
              </div>
            )}
          </div>

          {/* Details Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patient Details</span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{patientName}</p>
              <p className="text-[11px] text-slate-500">
                {currentSubmission.patientId?.diagnosis || 'Speech Therapy'}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recording Details</span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Duration: {currentSubmission.formattedDuration || '0:15'}
              </p>
              <p className="text-[11px] text-slate-500">
                Category: {currentSubmission.activityCategory || 'Language'}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Clinician</span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{doctorName}</p>
              <p className="text-[11px] text-slate-500">Caregiver: {parentName}</p>
            </div>
          </div>

          {/* Parent Practice Notes */}
          {currentSubmission.notes && (
            <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-xl space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Parent Practice Notes</span>
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                "{currentSubmission.notes}"
              </p>
            </div>
          )}

          {/* Clinician Review & Feedback Section */}
          {currentSubmission.status === 'Reviewed' ? (
            <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 p-4 rounded-xl space-y-1.5">
              <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Clinician Feedback & Guidance</span>
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {currentSubmission.clinicianFeedback ||
                  'Excellent progress demonstrated. Continue with daily recommended home sessions.'}
              </p>
              {currentSubmission.reviewedAt && (
                <p className="text-[10px] text-slate-400 pt-1">
                  Reviewed on {new Date(currentSubmission.reviewedAt).toLocaleDateString()} by {doctorName}
                </p>
              )}
            </div>
          ) : isClinicianView ? (
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clinician Review & Feedback</span>
              </h4>

              {reviewError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{reviewError}</span>
                </div>
              )}

              <textarea
                rows={3}
                placeholder="Add clinical observation notes and guidance for the caregiver (optional)..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleReviewSubmission}
                  disabled={isSubmittingReview}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmittingReview ? (
                    <>
                      <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Review...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark as Reviewed</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs border-slate-200 dark:border-slate-700"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
