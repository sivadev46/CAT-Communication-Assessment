import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import mascotVideo from '../assets/shruthi_mascot.mp4';

export default function ChromaMascot() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);

  const [hasEnded, setHasEnded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Chroma key algorithm with smart character crop & zoom for Shruthi
  const processFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      animFrameId.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (video.videoWidth && video.videoHeight) {
      // Focus crop on Shruthi mascot in center of video
      const cropW = video.videoWidth * 0.45;
      const cropH = video.videoHeight * 0.95;
      const cropX = (video.videoWidth - cropW) / 2;
      const cropY = video.videoHeight * 0.02;

      if (canvas.width !== cropW || canvas.height !== cropH) {
        canvas.width = cropW;
        canvas.height = cropH;
      }

      ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;
      const len = data.length;

      // Green key filtering loop
      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const maxRB = Math.max(r, b);
        const greenDiff = g - maxRB;

        if (greenDiff > 18 && g > 70) {
          if (greenDiff > 40) {
            data[i + 3] = 0; // Transparent green background
          } else {
            const alpha = Math.max(0, 255 - (greenDiff - 18) * 12);
            data[i + 3] = alpha;
            data[i + 1] = maxRB; // Despill green edge
          }
        }
      }

      ctx.putImageData(frame, 0, 0);
    }

    animFrameId.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = async () => {
      setIsLoaded(true);
      try {
        video.muted = false;
        await video.play();
        setIsMuted(false);
        setAutoplayBlocked(false);
      } catch (err) {
        console.warn("Unmuted autoplay restricted by browser policy. Falling back to muted autoplay:", err);
        video.muted = true;
        setIsMuted(true);
        setAutoplayBlocked(true);
        video.play().catch((e) => console.error("Muted autoplay failed:", e));
      }
    };

    const handleEnded = () => {
      // Loop continuously
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    };

    // User gesture handler to enable audio on first document interaction
    const handleUserInteraction = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
        setAutoplayBlocked(false);
        videoRef.current.play().catch(() => {});
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    if (video.readyState >= 2) {
      attemptPlay();
    }

    video.addEventListener('loadeddata', attemptPlay);
    video.addEventListener('canplay', attemptPlay);
    video.addEventListener('playing', () => setIsLoaded(true));
    video.addEventListener('ended', handleEnded);

    video.load();
    animFrameId.current = requestAnimationFrame(processFrame);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      video.removeEventListener('loadeddata', attemptPlay);
      video.removeEventListener('canplay', attemptPlay);
      video.removeEventListener('playing', () => setIsLoaded(true));
      video.removeEventListener('ended', handleEnded);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (autoplayBlocked) setAutoplayBlocked(false);
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[480px] md:min-h-[640px] lg:min-h-[740px]">
      {/* Off-screen HTML5 source video element */}
      <video
        ref={videoRef}
        src={mascotVideo}
        playsInline
        autoPlay
        loop
        preload="auto"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          top: '-9999px',
          left: '-9999px'
        }}
      />

      {/* Main Canvas rendering transparent 3D Mascot with high scaling */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Soft background aura glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-amber-300/20 to-purple-400/20 rounded-full blur-3xl transform scale-95 pointer-events-none" />

        <canvas
          ref={canvasRef}
          className="w-auto h-[480px] md:h-[650px] lg:h-[750px] max-h-[85vh] drop-shadow-[0_20px_40px_rgba(126,34,206,0.25)] relative z-10 transition-transform duration-300 transform hover:scale-[1.02]"
        />

        {/* Floating Sound Status Badge / Quick Unmute Indicator */}
        {isLoaded && (
          <button
            onClick={toggleSound}
            className="absolute bottom-2 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-purple-200 shadow-md text-xs font-semibold text-purple-950 hover:text-purple-700 transition-all cursor-pointer group"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-purple-600 animate-pulse" />
                <span className="text-purple-800">Click anywhere to enable sound</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Vani Audio Active</span>
              </>
            )}
          </button>
        )}

        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xs rounded-3xl z-20">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-sm font-bold text-purple-950">Loading Vani Mascot...</span>
          </div>
        )}
      </div>
    </div>
  );
}



