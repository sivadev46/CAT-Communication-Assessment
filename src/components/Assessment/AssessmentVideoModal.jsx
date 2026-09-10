import React from 'react';
import { X, Play } from 'lucide-react';

export default function AssessmentVideoModal({ isOpen, onClose, videoUrl, title }) {
  if (!isOpen) return null;

  // Convert YouTube URL to Embed format if needed
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    
    // Match youtube.com/watch?v=XYZ or youtu.be/XYZ
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#121218] border border-[#27273A] rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl space-y-0">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#27273A] flex items-center justify-between bg-[#1A1A24]">
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <Play className="w-5 h-5 text-[#FFE600] fill-[#FFE600]" />
            <span>Activity Video Demonstration: {title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`Demonstration: ${title}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              No video demonstration configured for this activity.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#27273A] bg-[#121218] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#FFE600] text-black font-bold text-xs hover:bg-[#FACC15] transition-colors cursor-pointer shadow-md"
          >
            Close Video
          </button>
        </div>
      </div>
    </div>
  );
}
