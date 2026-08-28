import React, { useState, useRef, useEffect } from 'react';
import { Video, Square, RefreshCw, CheckCircle2, Play, AlertTriangle } from 'lucide-react';
import Button from '../Button/Button';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

export default function ParentMediaRecorder({
  patientId,
  activityId,
  onRecordingComplete,
  onCancel,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [permissionError, setPermissionError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const timerRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const liveStreamRef = useRef(null);

  useEffect(() => {
    return () => {
      stopTracks();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [previewUrl]);

  const stopTracks = () => {
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach((track) => track.stop());
      liveStreamRef.current = null;
    }
  };

  const startRecording = async () => {
    setPermissionError(null);
    videoChunksRef.current = [];
    setRecordedBlob(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      liveStreamRef.current = stream;

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        stopTracks();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Camera/Microphone permission denied or unsupported:', err);
      setPermissionError('Camera/microphone access was denied or is not supported by your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleReRecord = () => {
    setRecordedBlob(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    startRecording();
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleUploadAndSubmit = async () => {
    if (!recordedBlob) return;
    setIsUploading(true);

    try {
      let finalPath = `parent_${patientId}_act_${activityId}_${Date.now()}.webm`;
      let publicUrl = previewUrl;

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.storage
          .from('parent-sessions')
          .upload(finalPath, recordedBlob, {
            contentType: 'video/webm',
            upsert: true,
          });

        if (error) {
          console.warn('Supabase storage upload error:', error);
        } else if (data?.path) {
          finalPath = data.path;
          const { data: urlData } = supabase.storage.from('parent-sessions').getPublicUrl(finalPath);
          if (urlData?.publicUrl) publicUrl = urlData.publicUrl;
        }
      }

      onRecordingComplete({
        videoPath: finalPath,
        videoUrl: publicUrl,
        durationSeconds: recordingTime,
      });
    } catch (err) {
      console.error('Failed to submit recording:', err);
      onRecordingComplete({
        videoPath: `local_recording_${Date.now()}.webm`,
        videoUrl: previewUrl,
        durationSeconds: recordingTime,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Video className="w-5 h-5 text-rose-400" />
          Record Assessment Session
        </h3>
        {isRecording && (
          <span className="inline-flex items-center gap-2 text-xs font-semibold bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Recording {formatTimer(recordingTime)}
          </span>
        )}
      </div>

      {permissionError && (
        <div className="bg-rose-950/60 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
          <div>{permissionError}</div>
        </div>
      )}

      {/* Video Viewport */}
      <div className="aspect-video w-full rounded-xl bg-slate-950 overflow-hidden relative border border-slate-800 flex items-center justify-center">
        {!isRecording && !previewUrl && (
          <div className="text-center p-6 space-y-3">
            <Video className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Click Start Recording below to capture a short video of your child performing this activity at home.
            </p>
          </div>
        )}

        {/* Live Camera Feed */}
        <video
          ref={videoPreviewRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isRecording ? 'block' : 'hidden'}`}
        />

        {/* Recorded Video Playback */}
        {previewUrl && !isRecording && (
          <video src={previewUrl} controls className="w-full h-full object-contain bg-black" />
        )}
      </div>

      {/* Recording Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {!isRecording && !previewUrl && (
          <button
            type="button"
            onClick={startRecording}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            type="button"
            onClick={stopRecording}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Square className="w-4 h-4 fill-white" />
            Stop Recording
          </button>
        )}

        {previewUrl && !isRecording && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReRecord}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-record
            </button>
            <button
              type="button"
              onClick={handleUploadAndSubmit}
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isUploading ? 'Uploading Video...' : 'Attach Recorded Video'}
            </button>
          </div>
        )}

        {onCancel && !isRecording && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors ml-auto"
          >
            Skip Recording
          </button>
        )}
      </div>
    </div>
  );
}
