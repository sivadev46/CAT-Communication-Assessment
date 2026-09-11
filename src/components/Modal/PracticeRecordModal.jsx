import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  X,
  Sparkles,
  UserCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  LoaderCircle,
  BookOpen,
  Info
} from 'lucide-react';
import Button from '../Button/Button';
import { submissionService } from '../../services/submissionService';

export default function PracticeRecordModal({
  isOpen,
  onClose,
  activity = null,
  childName = 'Your Child',
  patientId = null,
  reportId = null,
  assessmentId = null,
  doctorName = 'Dr. Sarah Jenkins',
  clinicianId = null,
  onSuccess = null
}) {
  const [stream, setStream] = useState(null);
  const [permissionError, setPermissionError] = useState(null);
  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'recorded' | 'uploading' | 'success' | 'error'
  const [videoBlob, setVideoBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [videoBase64, setVideoBase64] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [notes, setNotes] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const liveVideoRef = useRef(null);
  const recordedVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  const activityTitle = activity?.title || 'Home Speech Practice Session';
  const activityCategory = activity?.category || 'Speech & Language';

  // Format timer seconds into MM:SS format
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Start / Acquire Camera & Microphone Stream
  const initCamera = async () => {
    setPermissionError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      setStream(mediaStream);
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera/Microphone access error:', err);
      let msg = 'Could not access camera and microphone. Please allow permissions in your browser.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera and microphone permissions were denied. Please enable them in your browser site settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera or microphone found on this device.';
      }
      setPermissionError(msg);
    }
  };

  // Cleanup media tracks
  const stopTracks = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Lifecycle on modal open/close
  useEffect(() => {
    if (isOpen) {
      setRecordingState('idle');
      setVideoBlob(null);
      setPreviewUrl(null);
      setVideoBase64(null);
      setTimerSeconds(0);
      setNotes('');
      setUploadError(null);
      setSubmissionResult(null);
      initCamera();
    } else {
      stopTracks();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      stopTracks();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isOpen]);

  // Bind stream to live video element
  useEffect(() => {
    if (stream && liveVideoRef.current && recordingState === 'idle') {
      liveVideoRef.current.srcObject = stream;
    }
  }, [stream, recordingState]);

  // Start MediaRecorder
  const startRecording = () => {
    if (!stream) return;

    recordedChunksRef.current = [];
    setTimerSeconds(0);
    setUploadError(null);

    let mimeType = 'video/webm;codecs=vp8,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }
    }

    try {
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setVideoBlob(blob);
        setPreviewUrl(url);

        // Convert to Base64 for reliable transmission
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoBase64(reader.result);
        };
        reader.readAsDataURL(blob);

        setRecordingState('recorded');
      };

      mediaRecorder.start(250); // Slice chunks every 250ms
      setRecordingState('recording');

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start MediaRecorder:', err);
      setUploadError('Failed to initialize video recording on this browser.');
    }
  };

  // Stop MediaRecorder
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  // Re-record / reset
  const handleReRecord = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setVideoBlob(null);
    setPreviewUrl(null);
    setVideoBase64(null);
    setTimerSeconds(0);
    setUploadError(null);
    setRecordingState('idle');
    initCamera();
  };

  // Toggle Microphone Mute
  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  };

  // Helper to reliably convert Blob to Base64
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Upload and Send Recording to Doctor
  const handleSendToDoctor = async () => {
    setRecordingState('uploading');
    setUploadError(null);

    try {
      let finalBase64 = videoBase64;
      if (!finalBase64 && videoBlob) {
        finalBase64 = await convertBlobToBase64(videoBlob);
      }

      if (!finalBase64) {
        setUploadError('No video recording data found to submit.');
        setRecordingState('error');
        return;
      }

      const payload = {
        patientId,
        reportId,
        assessmentId,
        clinicianId,
        activityId: activity?.id || 'act-practice',
        activityTitle,
        activityCategory,
        duration: timerSeconds,
        formattedDuration: formatTime(timerSeconds),
        notes,
        videoBase64: finalBase64
      };

      const res = await submissionService.createSubmission(payload);
      if (res.success) {
        setSubmissionResult(res.data);
        setRecordingState('success');
        if (onSuccess) {
          onSuccess(res.data);
        }
      } else {
        setUploadError(res.message || 'Failed to submit recording. Please try again.');
        setRecordingState('error');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setUploadError(
        err.response?.data?.message ||
          'Network error occurred while uploading recording. Please check your connection and try again.'
      );
      setRecordingState('error');
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && recordingState !== 'uploading') {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm font-sans animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden transition-all">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Practice & Record</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Caregiver
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Child: <strong className="text-slate-700 dark:text-slate-200">{childName}</strong> • Clinician: <strong className="text-slate-700 dark:text-slate-200">{doctorName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={recordingState === 'uploading'}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Activity Banner */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 p-3.5 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  {activityCategory}
                </span>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                  {activityTitle}
                </h4>
              </div>
            </div>

            <div className="text-right flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <UserCheck className="w-3 h-3 text-emerald-600" />
              <span>{doctorName}</span>
            </div>
          </div>

          {/* Success State Banner */}
          {recordingState === 'success' ? (
            <div className="py-8 px-4 text-center space-y-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center border-2 border-emerald-500">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Recording Sent Successfully!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your practice recording for <strong>{activityTitle}</strong> has been securely shared with <strong>{doctorName}</strong> for clinical review.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 text-left">
                <Clock className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">Duration: {formatTime(timerSeconds)}</p>
                  <p className="text-[10px] text-slate-400">Status: Sent for Clinician Review</p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white rounded-xl shadow-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Permission Alert if camera denied */}
              {permissionError && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-start gap-2.5 text-amber-800 dark:text-amber-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                  <div className="flex-1">
                    <p className="font-bold">Camera Access Required</p>
                    <p className="mt-0.5 leading-relaxed">{permissionError}</p>
                    <button
                      onClick={initCamera}
                      className="mt-2 text-[11px] font-bold text-amber-900 dark:text-amber-200 underline cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Error Alert */}
              {uploadError && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <div className="flex-1">
                    <p className="font-bold">Unable to Send Recording</p>
                    <p className="mt-0.5 leading-relaxed">{uploadError}</p>
                    <button
                      onClick={handleSendToDoctor}
                      className="mt-2 text-[11px] font-bold text-rose-900 dark:text-rose-200 underline cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Live Video Preview & Playback Container */}
              <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                
                {/* Live Camera Stream */}
                {(recordingState === 'idle' || recordingState === 'recording') && (
                  <video
                    ref={liveVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover -scale-x-100 ${isCameraOff ? 'hidden' : 'block'}`}
                  />
                )}

                {/* Camera Disabled Placeholder */}
                {isCameraOff && (recordingState === 'idle' || recordingState === 'recording') && (
                  <div className="text-center text-slate-400 space-y-2">
                    <VideoOff className="w-10 h-10 mx-auto opacity-50" />
                    <p className="text-xs">Camera preview is paused</p>
                  </div>
                )}

                {/* Recorded Video Playback */}
                {previewUrl && (recordingState === 'recorded' || recordingState === 'uploading' || recordingState === 'error') && (
                  <video
                    ref={recordedVideoRef}
                    src={previewUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                )}

                {/* Recording Live Indicator & Timer */}
                {recordingState === 'recording' && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-rose-600/90 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-xs animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>REC</span>
                    <span>{formatTime(timerSeconds)}</span>
                  </div>
                )}

                {/* Mic and Camera Controls overlay (when idle) */}
                {recordingState === 'idle' && stream && (
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                    <button
                      onClick={toggleMic}
                      className={`p-2 rounded-lg backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isMicMuted ? 'bg-rose-600/80 text-white hover:bg-rose-700' : 'bg-black/60 text-white hover:bg-black/80'
                      }`}
                      title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                    >
                      {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={toggleCamera}
                      className={`p-2 rounded-lg backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isCameraOff ? 'bg-rose-600/80 text-white hover:bg-rose-700' : 'bg-black/60 text-white hover:bg-black/80'
                      }`}
                      title={isCameraOff ? 'Enable camera' : 'Disable camera'}
                    >
                      {isCameraOff ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Uploading Overlay */}
                {recordingState === 'uploading' && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-30 flex flex-col items-center justify-center text-white space-y-3">
                    <LoaderCircle className="w-8 h-8 text-emerald-400 animate-spin" />
                    <div className="text-center">
                      <p className="text-sm font-bold">Uploading Practice Video...</p>
                      <p className="text-[11px] text-slate-400">Sending recording to {doctorName}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Parent Notes */}
              {(recordingState === 'recorded' || recordingState === 'error') && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Notes for Clinician (Optional)</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      e.g. How did your child respond during this activity?
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Leo loved this activity and pronounced 4 items clearly on the first try!"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        {recordingState !== 'success' && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
            {recordingState === 'idle' && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Ready to record. Click button when prepared.</span>
              </div>
            )}

            {(recordingState === 'recorded' || recordingState === 'error') && (
              <Button
                variant="outline"
                onClick={handleReRecord}
                disabled={recordingState === 'uploading'}
                className="text-xs flex items-center gap-1.5 border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-record</span>
              </Button>
            )}

            <div className="flex items-center gap-2.5 ml-auto">
              {recordingState === 'idle' && (
                <>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="text-xs border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </Button>
                  <button
                    onClick={startRecording}
                    disabled={!stream || !!permissionError}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    <span>Start Recording</span>
                  </button>
                </>
              )}

              {recordingState === 'recording' && (
                <button
                  onClick={stopRecording}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-bold shadow-md transition-all cursor-pointer animate-pulse"
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                  <span>Stop Recording ({formatTime(timerSeconds)})</span>
                </button>
              )}

              {(recordingState === 'recorded' || recordingState === 'error') && (
                <button
                  onClick={handleSendToDoctor}
                  disabled={recordingState === 'uploading'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Doctor ({doctorName})</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
