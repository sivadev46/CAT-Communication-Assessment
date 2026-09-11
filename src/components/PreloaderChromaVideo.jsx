import React, { useEffect, useRef, useCallback } from 'react';
// CAT LOGO.mp4 — preloader video, chroma-keyed to remove green background
// shruthi_mascot.mp4 / ChromaMascot.jsx are UNCHANGED in the Assessment Portal
import catLogoVideo from '../assets/CAT LOGO.mp4';

/**
 * PreloaderChromaVideo
 * ─────────────────────────────────────────────────────────────────────────────
 * Draws CAT LOGO.mp4 frame-by-frame onto a transparent canvas with per-pixel
 * green-screen removal.  The canvas fills the parent circular container
 * (overflow:hidden + border-radius:50%) which clips it to a perfect circle.
 *
 * Chroma-key strategy — DUAL TEST (catches all shades of green):
 *   Test A  –  Raw green channel clearly dominates both red AND blue
 *   Test B  –  HSL hue in green range AND saturation above floor
 *   Either test passing → pixel is keyed transparent
 *
 * Scaling — COVER:
 *   Video is upscaled so its shortest dimension fills CANVAS_SIZE.
 *   The circular overflow:hidden clips the excess.
 *   The logo fills the entire circle with zero empty white gap.
 */

const CANVAS_SIZE      = 512;   // Square canvas resolution

// Test A — raw green dominance (catches vivid/bright green backgrounds instantly)
const GREEN_DOMINANCE  = 25;    // G must exceed BOTH R and B by at least this

// Test B — HSL thresholds
const HUE_LOW          = 70;    // green hue lower bound (°) — catches yellow-green
const HUE_HIGH         = 165;   // green hue upper bound (°) — catches cyan-green
const SAT_MIN          = 0.12;  // low floor — catches de-saturated BG green
const LUM_MIN          = 0.06;  // preserve absolute darks (black outlines)
const HARD_THRESH      = 0.28;  // score ≥ → alpha 0
const SOFT_THRESH      = 0.09;  // score < → keep opaque; between → feather

export default function PreloaderChromaVideo() {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const running   = useRef(true);

  const rgbToHsl = (r8, g8, b8) => {
    const r = r8 / 255, g = g8 / 255, b = b8 / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    if      (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else                h = ((r - g) / d + 4) / 6;
    return [h * 360, s, l];
  };

  const processFrame = useCallback(() => {
    if (!running.current) return;

    const video  = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) {
      rafRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (canvas.width !== CANVAS_SIZE || canvas.height !== CANVAS_SIZE) {
      canvas.width  = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
    }

    // COVER scaling: shortest edge fills CANVAS_SIZE, circular clip handles overflow
    const videoAspect = vw / vh;
    let drawW, drawH;
    if (videoAspect >= 1) {
      drawH = CANVAS_SIZE;
      drawW = CANVAS_SIZE * videoAspect;
    } else {
      drawW = CANVAS_SIZE;
      drawH = CANVAS_SIZE / videoAspect;
    }
    const drawX = (CANVAS_SIZE - drawW) / 2;
    const drawY = (CANVAS_SIZE - drawH) / 2;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.drawImage(video, 0, 0, vw, vh, drawX, drawY, drawW, drawH);

    const frame = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const d = frame.data;

    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;

      const r = d[i], g = d[i + 1], b = d[i + 2];

      // Test A: raw green dominance — vivid green BG pixels
      if (g - r > GREEN_DOMINANCE && g - b > GREEN_DOMINANCE) {
        d[i + 3] = 0;
        continue;
      }

      // Test B: HSL hue-based key — de-saturated / near-neutral greens
      const [h, s, l] = rgbToHsl(r, g, b);
      if (h < HUE_LOW || h > HUE_HIGH || s < SAT_MIN || l < LUM_MIN) continue;

      const score = (1 - Math.min(1, Math.abs(h - 120) / 50)) * s;

      if (score >= HARD_THRESH) {
        d[i + 3] = 0;
      } else if (score >= SOFT_THRESH) {
        const t  = (score - SOFT_THRESH) / (HARD_THRESH - SOFT_THRESH);
        d[i + 3] = Math.round(255 * (1 - t));
        d[i + 1] = Math.round(g * (1 - t) + ((r + b) / 2) * t); // spill suppression
      }
    }

    ctx.putImageData(frame, 0, 0);
    rafRef.current = requestAnimationFrame(processFrame);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    running.current = true;

    const tryPlay = async () => {
      try { video.muted = false; await video.play(); }
      catch {
        video.muted = true;
        video.play().catch(e => console.warn('PreloaderChromaVideo: autoplay blocked', e));
      }
    };

    const unlockAudio = () => {
      if (video.muted) { video.muted = false; video.play().catch(() => {}); }
    };
    window.addEventListener('click',      unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('keydown',    unlockAudio, { once: true });

    if (video.readyState >= 2) tryPlay();
    else video.addEventListener('canplay', tryPlay, { once: true });

    rafRef.current = requestAnimationFrame(processFrame);

    return () => {
      running.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('click',      unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown',    unlockAudio);
      video.pause();
    };
  }, [processFrame]);

  return (
    <>
      {/* Source video hidden off-screen — canvas reads its frames */}
      <video
        ref={videoRef}
        src={catLogoVideo}
        playsInline
        autoPlay
        muted
        preload="auto"
        style={{
          position: 'absolute',
          width: 1, height: 1,
          opacity: 0,
          pointerEvents: 'none',
          top: -9999, left: -9999,
        }}
      />

      {/*
        Canvas — transparent bg so parent's bg-white shows through keyed areas.
        CANVAS_SIZE × CANVAS_SIZE pixel grid, CSS scales to 100%×100% of container.
        COVER mode fills the whole circle; circular overflow-hidden clips overflow.
      */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: 'transparent',
        }}
      />
    </>
  );
}

