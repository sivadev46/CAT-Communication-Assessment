import React from 'react';
import ChromaKeyVideo from './ChromaKeyVideo';
import catLogoVideo from '../../assets/Cat_logo_animation_with_movement_202609101338.mp4';

/**
 * CatCircularVideoLoader
 * 
 * Embeds the uploaded Cat_logo_animation_with_movement_202609101338.mp4 inside
 * the circular frame of the loader with real-time green screen chroma keying.
 */
export default function CatCircularVideoLoader({ onComplete }) {
  return (
    <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
      <ChromaKeyVideo
        src={catLogoVideo}
        isCircular={true}
        loop={false}
        onComplete={onComplete}
        className="w-full h-full"
        canvasClassName="w-full h-full object-contain"
      />
    </div>
  );
}
