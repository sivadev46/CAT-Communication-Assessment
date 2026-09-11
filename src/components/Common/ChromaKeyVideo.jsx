import React, { useEffect, useRef, useState } from 'react';
import defaultVideo from '../../assets/Cat_logo_animation_with_movement_202609101338.mp4';

/**
 * ChromaKeyVideo
 * 
 * Reusable real-time canvas-based Chroma-Key video processor.
 * 
 * Props:
 * - src: Video file URL / asset (defaults to Cat_logo_animation_with_movement_202609101338.mp4)
 * - isCircular: Boolean - whether to wrap inside circular mask (rounded-full overflow-hidden)
 * - loop: Boolean - whether to loop playback (false for loader, true for hero mascot)
 * - onComplete: Function - callback fired when video completes
 * - className: String - additional container CSS classes
 * - canvasClassName: String - additional canvas CSS classes
 */
export default function ChromaKeyVideo({
  src = defaultVideo,
  isCircular = true,
  loop = false,
  onComplete,
  className = "",
  canvasClassName = ""
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);
  const completedRef = useRef(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let isDestroyed = false;

    // Real-time Canvas Frame Processor for Chroma Keying
    const processFrame = () => {
      if (isDestroyed) return;

      if (video && canvas && video.readyState >= 2 && !video.paused && !video.ended) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const vw = video.videoWidth || 1920;
          const vh = video.videoHeight || 1080;

          if (canvas.width !== vw || canvas.height !== vh) {
            canvas.width = vw;
            canvas.height = vh;
          }

          ctx.drawImage(video, 0, 0, vw, vh);

          const frame = ctx.getImageData(0, 0, vw, vh);
          const data = frame.data;
          const len = data.length;

          // RGB Chroma-Key Algorithm: Key out green screen pixels & despill edges
          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const maxRB = Math.max(r, b);
            const greenDiff = g - maxRB;

            // Detect pure/chroma green pixels (high green relative to max of R and B)
            if (g > 60 && greenDiff > 16) {
              if (greenDiff > 36) {
                // Background pixel: set alpha to completely transparent
                data[i + 3] = 0;
              } else {
                // Edge transition pixel: smooth alpha blend & remove green spill
                const alpha = Math.max(0, Math.min(255, ((36 - greenDiff) / 20) * 255));
                data[i + 3] = alpha;
                data[i + 1] = maxRB; // Despill green fringing
              }
            }
          }

          ctx.putImageData(frame, 0, 0);
        }
      }

      animFrameId.current = requestAnimationFrame(processFrame);
    };

    // Playback with Autoplay Policy Fallback
    const startPlayback = async () => {
      try {
        setIsVideoLoaded(true);
        video.muted = false;
        await video.play();
      } catch (err) {
        // Fallback to muted autoplay if unmuted is restricted by browser
        console.warn("Unmuted autoplay restricted; playing muted fallback:", err);
        video.muted = true;
        video.play().catch((e) => console.error("Playback error:", e));
      }
    };

    const handleEnded = () => {
      if (loop) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        handleFinish();
      }
    };

    const handleLoadedMetadata = () => {
      const dur = video.duration;
      if (!loop && dur && !isNaN(dur) && dur > 0) {
        // Safety timeout matching video duration + 0.3s
        setTimeout(() => {
          handleFinish();
        }, (dur + 0.3) * 1000);
      }
    };

    // Unmute on first user touch/click if initially muted by browser policy
    const handleUserInteraction = () => {
      if (video && video.muted) {
        video.muted = false;
        video.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });

    video.addEventListener('canplay', startPlayback);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    if (video.readyState >= 2) {
      startPlayback();
    }

    video.load();
    animFrameId.current = requestAnimationFrame(processFrame);

    return () => {
      isDestroyed = true;
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      video.removeEventListener('canplay', startPlayback);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [src, loop]);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${
        isCircular ? 'rounded-full overflow-hidden' : ''
      } ${className}`}
    >
      {/* Off-screen source video element */}
      <video
        ref={videoRef}
        src={src}
        playsInline
        autoPlay
        loop={loop}
        preload="auto"
        className="absolute w-1 h-1 opacity-0 pointer-events-none -top-9999 -left-9999"
      />

      {/* Real-time Chroma-Keyed Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain pointer-events-none ${canvasClassName}`}
      />
    </div>
  );
}
