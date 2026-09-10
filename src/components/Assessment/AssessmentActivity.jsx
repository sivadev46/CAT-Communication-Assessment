import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, ArrowLeft, CheckCircle, Video, Maximize2, X } from 'lucide-react';
import AssessmentScale from './AssessmentScale';
import AssessmentVideoModal from './AssessmentVideoModal';
import ParentMediaRecorder from './ParentMediaRecorder';

export default function AssessmentActivity({
  activity,
  moduleName = 'Pre-Intentional Communication Tool',
  patientId,
  selectedRange,
  onRangeChange,
  onSubmit,
  onPrevious,
  isFirstStep = false,
  isLastStep = false,
  isParentRole = false,
  isSubmitting = false,
}) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isImageFullscreenOpen, setIsImageFullscreenOpen] = useState(false);
  const [recordSessionToggle, setRecordSessionToggle] = useState(false);
  const [videoRecordingData, setVideoRecordingData] = useState(null);

  // Close image lightbox on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isImageFullscreenOpen) {
        setIsImageFullscreenOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageFullscreenOpen]);

  if (!activity) {
    return (
      <div className="p-8 text-center bg-[#121218] rounded-2xl border border-[#27273A] text-gray-400">
        Loading activity details...
      </div>
    );
  }

  const videoUrl = activity.video_url || activity.youtubeUrl || '';
  const imageUrl = activity.image_url || activity.imagePath || '';

  const handleSubmitActivity = () => {
    if (!selectedRange) return;
    onSubmit({
      activityId: activity.id,
      selectedRange,
      videoSubmission: videoRecordingData,
    });
  };

  return (
    <div className="bg-[#121218] border border-[#27273A] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between max-h-[calc(100vh-140px)] min-h-[540px] space-y-4">
      {/* 4. ACTIVITY IMAGE CONTAINER (Main visual focus) */}
      <div className="relative rounded-xl overflow-hidden bg-[#0A0A0E] border border-[#27273A] flex items-center justify-center p-2 min-h-[220px] max-h-[300px] group">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={activity.title || 'Activity Image'}
            className="max-h-[280px] w-auto max-w-full object-contain rounded-lg shadow-md"
          />
        ) : (
          <div className="py-12 text-center text-gray-500 text-xs">
            [ NIEPMD Activity Demonstration Image ]
          </div>
        )}

        {/* ⛶ Full Screen Button on Image */}
        {imageUrl && (
          <button
            type="button"
            onClick={() => setIsImageFullscreenOpen(true)}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black text-[#FFE600] text-xs font-bold border border-[#FFE600]/40 shadow-lg backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
            title="View Full Screen Image"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>⛶ Full Screen</span>
          </button>
        )}
      </div>

      {/* 5. WATCH VIDEO BUTTON (Directly below image) */}
      <div className="flex items-center justify-between px-1">
        {videoUrl ? (
          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black text-xs font-extrabold shadow-md transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>▶ Watch Video</span>
          </button>
        ) : (
          <span className="text-xs text-gray-500 italic">No video demonstration configured</span>
        )}

        {/* Optional parent recording status badge */}
        {isParentRole && videoRecordingData && (
          <span className="text-xs text-[#FFE600] font-bold flex items-center gap-1 bg-[#FFE600]/10 px-2.5 py-1 rounded-md border border-[#FFE600]/30">
            <CheckCircle className="w-3.5 h-3.5" /> Video Recorded
          </span>
        )}
      </div>

      {/* 6. FOUR SCALE OPTIONS */}
      <AssessmentScale
        selectedValue={selectedRange}
        onChange={onRangeChange}
      />

      {/* Parent Optional Recording Section */}
      {isParentRole && (
        <div className="space-y-3 pt-1">
          <div className="p-3 bg-[#1A1A24] rounded-xl border border-[#27273A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-gray-200">
                Record this session?
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRecordSessionToggle(!recordSessionToggle)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                recordSessionToggle
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#27273A] text-gray-300 hover:text-white'
              }`}
            >
              {recordSessionToggle ? 'ON' : 'OFF'}
            </button>
          </div>

          {recordSessionToggle && (
            <ParentMediaRecorder
              patientId={patientId}
              activityId={activity.id}
              selectedRange={selectedRange}
              onRecordingComplete={(recData) => {
                setVideoRecordingData(recData);
              }}
              onCancel={() => setRecordSessionToggle(false)}
            />
          )}
        </div>
      )}

      {/* 7. PREVIOUS & SUBMIT / CONTINUE BUTTONS (Bottom) */}
      <div className="pt-2 flex items-center justify-between border-t border-[#27273A]">
        {/* ← Previous Button */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep || isSubmitting}
          className={`px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border ${
            !isFirstStep && !isSubmitting
              ? 'bg-[#1A1A24] hover:bg-[#27273A] text-white border-[#27273A] hover:border-[#FFE600] cursor-pointer'
              : 'bg-[#121218] text-gray-600 border-[#1A1A24] cursor-not-allowed opacity-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Previous</span>
        </button>

        {/* Submit & Continue / Complete Assessment Button */}
        <button
          type="button"
          onClick={handleSubmitActivity}
          disabled={!selectedRange || isSubmitting}
          className={`px-6 py-3 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
            selectedRange && !isSubmitting
              ? 'bg-[#FFE600] hover:bg-[#FACC15] text-black shadow-[#FFE600]/20 hover:scale-[1.02]'
              : 'bg-[#27273A] text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>
            {isSubmitting
              ? 'Saving...'
              : isLastStep
              ? 'Complete Assessment'
              : 'Submit & Continue →'}
          </span>
          {!isLastStep && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Instructional Video Modal */}
      <AssessmentVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={videoUrl}
        title={activity.title}
      />

      {/* FULL SCREEN IMAGE LIGHTBOX MODAL */}
      {isImageFullscreenOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setIsImageFullscreenOpen(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
              title="Close Full Screen (ESC)"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={imageUrl}
              alt={activity.title}
              className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl shadow-2xl"
            />

            <p className="mt-4 text-xs font-bold text-[#FFE600] bg-black/60 px-4 py-2 rounded-full border border-[#FFE600]/30 text-center">
              {activity.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
