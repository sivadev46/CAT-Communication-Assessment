import React from 'react';
import Modal from '../Modal/Modal';
import { Play, AlertCircle } from 'lucide-react';

export default function AssessmentVideoModal({ isOpen, onClose, videoUrl, title }) {
  if (!isOpen) return null;

  // Extract YouTube ID if it's a YouTube URL
  let embedUrl = null;
  if (videoUrl) {
    const youtubeMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/);
    if (youtubeMatch && youtubeMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Watch Demonstration Video'} size="lg">
      <div className="p-4 sm:p-6 space-y-4">
        {videoUrl ? (
          embedUrl ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={embedUrl}
                title={title || 'Activity Video'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <video src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
            </div>
          )
        ) : (
          <div className="p-8 text-center bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800 dark:text-slate-200">
              Video not available yet
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              NIEPMD instructional video for this specific activity will be added in upcoming content releases.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
