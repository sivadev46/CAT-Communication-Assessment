import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import ChromaMascot from '../ChromaMascot';

// Typewriter greetings list (Tamil, Hindi, English)
const GREETINGS = [
  "வணக்கம்",
  "नमस्ते",
  "Welcome to CAT"
];

export default function VaniHero() {
  // Typewriter effect state
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter animation loop
  useEffect(() => {
    const currentFullText = GREETINGS[greetingIndex];
    let typingSpeed = isDeleting ? 40 : 90;

    if (!isDeleting && displayText === currentFullText) {
      const timeout = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentFullText.substring(0, prev.length - 1)
          : currentFullText.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, greetingIndex]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* LEFT SIDE: Vani Mascot Showcase */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[360px] w-full">
        <div className="w-full relative">
          <ChromaMascot />
        </div>
      </div>

      {/* RIGHT SIDE: Typewriter Greetings & Introductory Text */}
      <div className="lg:col-span-7 flex flex-col justify-center items-start space-y-4 px-2 md:px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-700 text-white text-xs font-black tracking-wide shadow-md">
          <Activity className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>COMMUNICATION ASSESSMENT TOOL (CAT)</span>
        </div>

        {/* Typewriter Greeting Loop */}
        <div className="min-h-[44px] md:min-h-[56px] flex items-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-purple-950 tracking-tight leading-tight flex items-center gap-2">
            <span>{displayText}</span>
            <span className="w-1.5 h-8 md:h-10 bg-purple-700 animate-ping inline-block rounded-full" />
          </h2>
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-purple-950 tracking-tight leading-snug">
            Clinical Speech & Language <span className="text-purple-700">Assessment Portal</span>
          </h1>
          <p className="text-sm md:text-base text-purple-900 mt-2 font-semibold leading-relaxed max-w-2xl">
            Empowering therapists, caregivers, and learners with dynamic 4-scale evaluation, parent video review, and AI-assisted communication progress tracking. Meet <span className="font-extrabold text-purple-950 underline decoration-amber-400 decoration-2">Vani</span>, your interactive CAT guide.
          </p>
        </div>
      </div>
    </div>
  );
}
