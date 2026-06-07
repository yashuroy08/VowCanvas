import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import MagneticButton from '../components/MagneticButton';
import useDataStore from '../store/useDataStore';

export default function LetterSection({ onNext }) {
  const letter = useDataStore((state) => state.data.letter);
  const memories = useDataStore((state) => state.data.memories);
  const containerRef = useRef(null);
  
  // Use in-view to trigger animations when section is reached
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const paragraphs = letter.split('\n\n').filter(Boolean);

  // Take the first memory image to use as a subtle parallax background
  const bgImage = memories && memories.length > 0 ? memories[0].image : null;

  return (
    <section id="letter" ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center py-16 md:py-24 overflow-hidden">
      
      {/* Subtle Background Image with Parallax & Blur */}
      {bgImage && (
        <motion.div 
          className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={isInView ? { opacity: 0.15, scale: 1 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <img 
            src={bgImage} 
            alt="Memory Background" 
            className="w-full h-full object-cover mix-blend-multiply blur-sm"
          />
        </motion.div>
      )}

      {/* Foreground Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8">
        
        <motion.div 
          className="relative bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-8 md:p-14 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden"
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          
          {/* Decorative Quote Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={isInView ? { scale: 1, opacity: 0.2, rotate: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <svg className="absolute -top-6 -left-6 w-28 h-28 md:w-40 md:h-40 text-rose-medium fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </motion.div>
          
          {/* Letter Text */}
          <blockquote className="relative z-10 font-cormorant italic text-[19px] md:text-[24px] lg:text-[28px] font-light text-rose-dark-accent leading-[1.85] md:leading-[2.1]">
            {paragraphs.map((p, i) => (
              <motion.p 
                key={i} 
                className="mb-6 last:mb-0"
                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.8, delay: 0.3 + (i * 0.15), ease: [0.16, 1, 0.3, 1] }}
              >
                {p}
              </motion.p>
            ))}
          </blockquote>

          {/* Signature & Next Button */}
          <div className="flex flex-col items-end mt-12 relative z-10">
            <motion.div 
              className="font-cormorant italic text-[20px] md:text-[24px] text-rose-medium"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + (paragraphs.length * 0.15) }}
            >
              Yours, always
            </motion.div>
            
            <motion.div 
              className="mt-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + (paragraphs.length * 0.15) }}
            >
              <MagneticButton>
                <button
                  onClick={onNext}
                  className="flex items-center gap-2.5 font-lato text-[11px] tracking-[3px] uppercase px-8 py-4 bg-rose-deep text-rose-blush rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none backdrop-blur-sm"
                >
                  <span>See our memories</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
                  </svg>
                </button>
              </MagneticButton>
            </motion.div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
