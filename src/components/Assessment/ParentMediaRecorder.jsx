import React, { useState, useRef, useEffect } from 'react';
import { Video, Square, Play, RotateCcw, CheckCircle2, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { catSupabaseService } from '../../services/catSupabase';

export default function ParentMediaRecorder({
  patientId,
  activityId,
  selectedRange,
  onRecordingComplete,
  onCancel,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const previewVideoRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      videoChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoPreviewUrl(url);

        // Stop camera tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing camera/microphone:', err);
      setErrorMsg('Could not access camera or microphone. Please check browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleReRecord = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setRecordedBlob(null);
    setVideoPreviewUrl(null);
    setRecordingTime(0);
    startRecording();
  };

  const handleSubmitSessionVideo = async () => {
    if (!recordedBlob) return;

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const videoRecord = await catSupabaseService.uploadParentVideoBlob(
        patientId,
        activityId,
        recordedBlob,
        recordingTime,
        selectedRange
      );

      if (onRecordingComplete) {
        onRecordingComplete(videoRecord);
      }
    } catch (err) {
      console.error('Error submitting video:', err);
      setErrorMsg('Failed to upload session video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#121218] border border-[#27273A] rounded-2xl p-4 sm:p-5 space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#FFE600] font-bold text-xs sm:text-sm">
          <Video className="w-4 h-4" />
          <span>Parent Session Recording</span>
        </div>
        {recordingTime > 0 && (
          <span className="text-xs font-mono font-bold bg-[#1A1A24] px-3 py-1 rounded-md border border-[#27273A] text-gray-200">
            ⏱ {formatTime(recordingTime)}
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Recording in Progress State */}
      {isRecording && (
        <div className="p-6 bg-[#1A1A24] border border-red-500/50 rounded-xl text-center space-y-4 animate-pulse">
          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto animate-ping" />
          <p className="text-sm font-bold text-white">Recording Parent Session...</p>
          <button
            type="button"
            onClick={stopRecording}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Stop Recording</span>
          </button>
        </div>
      )}

      {/* Preview Recorded Video State */}
      {!isRecording && videoPreviewUrl && (
        <div className="space-y-3">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-[#27273A]">
            <video
              ref={previewVideoRef}
              src={videoPreviewUrl}
              controls
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReRecord}
              className="px-4 py-2 rounded-xl bg-[#1A1A24] hover:bg-[#27273A] text-gray-300 font-bold text-xs border border-[#27273A] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-record</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitSessionVideo}
              disabled={isUploading}
              className="px-6 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Uploading Video...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Session Video</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Initial State (Not recording, no video yet) */}
      {!isRecording && !videoPreviewUrl && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-gray-400">
            Record a short video demonstration for your therapist to review.
          </p>
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-2 rounded-xl bg-[#1A1A24] text-gray-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={startRecording}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Start Recording</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
