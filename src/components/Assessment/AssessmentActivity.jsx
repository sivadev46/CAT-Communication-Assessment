import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle, Video } from 'lucide-react';
import AssessmentScale from './AssessmentScale';
import AssessmentVideoModal from './AssessmentVideoModal';
import ParentMediaRecorder from './ParentMediaRecorder';

export default function AssessmentActivity({
  activity,
  patientId,
  selectedRange,
  onRangeChange,
  onSubmit,
  isParentRole = false,
  isSubmitting = false,
}) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [recordSessionToggle, setRecordSessionToggle] = useState(false);
  const [videoRecordingData, setVideoRecordingData] = useState(null);

  if (!activity) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
        <p className="text-gray-500">Loading activity details...</p>
      </div>
    );
  }

  const handleSubmitActivity = () => {
    if (!selectedRange) return;
    onSubmit({
      activityId: activity.id,
      selectedRange,
      videoSubmission: videoRecordingData,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 sm:p-6 lg:p-8 shadow-sm space-y-6">
      {/* Activity Category Badge & Title */}
      <div className="space-y-2">
        {activity.category && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            {activity.category}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
          {activity.title}
        </h2>
        {activity.description && (
          <p className="text-sm text-gray-600 dark:text-slate-400">
            {activity.description}
          </p>
        )}
      </div>

      <hr className="border-gray-100 dark:border-slate-800" />

      {/* NIEPMD Activity Image */}
      <div className="space-y-3">
        <div className="relative rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 flex items-center justify-center p-2 sm:p-4 max-h-[380px]">
          {activity.image_url || activity.imagePath ? (
            <img
              src={activity.image_url || activity.imagePath}
              alt={activity.title}
              className="max-h-[340px] w-auto max-w-full object-contain rounded-xl"
            />
          ) : (
            <div className="py-16 text-center text-gray-400">
              [NIEPMD Activity Image Placeholder]
            </div>
          )}
        </div>

        {/* Watch Video Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-blue-600 dark:fill-blue-400" />
            Watch Video
          </button>
          {!activity.video_url && !activity.youtubeUrl && (
            <span className="text-xs text-gray-400 italic">Video not available yet</span>
          )}
        </div>
      </div>

      <hr className="border-gray-100 dark:border-slate-800" />

      {/* Response Scale Options */}
      <AssessmentScale
        selectedValue={selectedRange}
        onChange={onRangeChange}
      />

      {/* Parent Optional Video Recording */}
      {isParentRole && (
        <div className="pt-2 space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-850/60 rounded-xl border border-gray-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-rose-500" />
              <div>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                  Record this session?
                </span>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Upload a short video for your therapist to review.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRecordSessionToggle(!recordSessionToggle)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                recordSessionToggle
                  ? 'bg-rose-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
              }`}
            >
              {recordSessionToggle ? 'ON' : 'OFF'}
            </button>
          </div>

          {recordSessionToggle && (
            <ParentMediaRecorder
              patientId={patientId}
              activityId={activity.id}
              onRecordingComplete={(recData) => {
                setVideoRecordingData(recData);
              }}
              onCancel={() => setRecordSessionToggle(false)}
            />
          )}

          {videoRecordingData && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Video recording attached ({videoRecordingData.durationSeconds || 0}s)
              </span>
              <button
                type="button"
                onClick={() => setVideoRecordingData(null)}
                className="text-rose-600 hover:underline font-semibold"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* Submit & Continue Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSubmitActivity}
          disabled={!selectedRange || isSubmitting}
          className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer ${
            selectedRange && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:scale-[1.01]'
              : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <span>{isSubmitting ? 'Saving...' : 'Submit & Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Instructional Video Modal */}
      <AssessmentVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={activity.video_url || activity.youtubeUrl}
        title={activity.title}
      />
    </div>
  );
}
