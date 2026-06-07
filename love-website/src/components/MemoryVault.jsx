import React, { useState } from 'react';
import { motion } from 'framer-motion';

const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const MediaRenderer = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isVideo = src?.match(/\.(mp4|webm|mov|ogg)$/i) || src?.includes('video');
  const youtubeId = getYouTubeId(src);
  
  if (youtubeId) {
    return (
      <div className={`${className} relative overflow-hidden bg-black`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3`}
          title="YouTube Video"
          className="absolute inset-0 w-full h-full border-none pointer-events-none scale-[1.5]"
          allow="autoplay; encrypted-media"
          onLoad={() => setIsLoaded(true)}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={`${className} object-cover`}
      />
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={`${className} object-cover`}
    />
  );
};

export default function MemoryVault({ items }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const renderItem = (item, i, setKey) => {
    const isHovered = hoveredIndex === `${setKey}-${i}`;
    const isAnyHovered = hoveredIndex !== null;
    
    return (
      <motion.div
        key={`${setKey}-${i}`}
        onMouseEnter={() => setHoveredIndex(`${setKey}-${i}`)}
        onMouseLeave={() => setHoveredIndex(null)}
        className="relative shrink-0 cursor-pointer group"
        animate={{
          scale: isHovered ? 1.05 : isAnyHovered ? 0.95 : 1,
          opacity: isHovered ? 1 : isAnyHovered ? 0.5 : 1,
          filter: isHovered ? 'blur(0px)' : isAnyHovered ? 'blur(2px)' : 'blur(0px)',
          z: isHovered ? 50 : 0
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Main Image/Video Card */}
        <div className="w-[200px] h-[280px] md:w-[260px] md:h-[360px] rounded-2xl overflow-hidden shadow-2xl relative border border-white/40 bg-black/5 transition-all duration-500">
          <MediaRenderer 
            src={item.image} 
            alt={item.text}
            className="w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Dark Gradient Overlay for Caption */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Caption Reveal */}
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <p className="font-cormorant text-lg md:text-xl text-white italic tracking-wide drop-shadow-md">
              {item.text}
            </p>
          </div>
        </div>

        {/* Glass Floor Reflection */}
        <div 
          className="w-[200px] h-[280px] md:w-[260px] md:h-[360px] rounded-2xl overflow-hidden mt-2 scale-y-[-1] opacity-30 blur-[1px] pointer-events-none absolute left-0"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, black 90%)',
            maskImage: 'linear-gradient(to bottom, transparent 10%, black 90%)'
          }}
        >
          <MediaRenderer 
            src={item.image} 
            alt=""
            className="w-full h-full"
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full py-8 md:py-16 bg-rose-blush/30 overflow-hidden perspective-[1200px]">
      
      {/* Marquee Track Container with fade edges */}
      <div 
        className="group relative flex w-full h-[600px] md:h-[750px] items-start pt-4 md:pt-10"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        {/* The scrolling track */}
        <div className="flex animate-marquee w-max">
          
          {/* First Set */}
          <div className="flex gap-8 md:gap-16 px-4 md:px-8 items-center">
            {items.map((item, i) => renderItem(item, i, 'set1'))}
          </div>
          
          {/* Second Set (identical duplicate for seamless loop) */}
          <div className="flex gap-8 md:gap-16 px-4 md:px-8 items-center">
            {items.map((item, i) => renderItem(item, i, 'set2'))}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          /* Translate exactly halfway across the container, since it contains two identical sets */
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          /* Adjust duration based on number of items */
          animation: marquee ${Math.max(20, items.length * 8)}s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
