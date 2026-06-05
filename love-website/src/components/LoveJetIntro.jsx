/* eslint-disable react-hooks/purity */
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoveJetIntro({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2800); // Intro lasts 2.8 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Trailing sparkles/hearts (generated once on mount to respect hook purity rules)
  const trailParticles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const delay = 0.2 + i * 0.1;
      const progress = i / 19;
      const x = `${-10 + progress * 120}vw`;
      // Create a wave path simulating lift, drag dips
      const y = `${75 - Math.sin(progress * Math.PI * 2.5) * 35 - progress * 40}vh`;
      const size = Math.random() * (12 - 6) + 6;
      const jitter = Math.random() * 20 - 10;
      return { id: i, delay, x, y, size, jitter };
    });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#fff0f3] flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto"
        >
          {/* Sky background clouds (subtle SVGs) */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
            <svg className="absolute top-[20%] left-[10%] w-48 h-20 text-rose-medium" viewBox="0 0 100 40" fill="currentColor" aria-hidden="true">
              <path d="M10 30 a15 15 0 0 1 20 -10 a15 15 0 0 1 25 5 a15 15 0 0 1 25 -5 a15 15 0 0 1 15 15 z" />
            </svg>
            <svg className="absolute top-[50%] right-[15%] w-64 h-28 text-rose-medium" viewBox="0 0 100 40" fill="currentColor" aria-hidden="true">
              <path d="M10 30 a15 15 0 0 1 20 -10 a15 15 0 0 1 25 5 a15 15 0 0 1 25 -5 a15 15 0 0 1 15 15 z" />
            </svg>
          </div>

          {/* Aerodynamic path lines (thin dashed vectors drawing) */}
          <svg className="absolute inset-0 w-full h-full text-rose-border/30 fill-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
              d="M -50 650 Q 200 250, 450 400 T 950 150 T 1500 -100"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="5,5"
            />
          </svg>

          {/* Particle Trails */}
          {trailParticles.map((particle) => (
            <motion.svg
              key={particle.id}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ 
                opacity: [0, 0.8, 0], 
                scale: [0.2, 1, 0.4],
                y: `calc(${particle.y} + ${particle.jitter}px)`
              }}
              transition={{ delay: particle.delay, duration: 0.8, ease: 'easeOut' }}
              className="absolute text-rose-medium/40 fill-current"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
              }}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </motion.svg>
          ))}

          {/* The Jet */}
          <motion.div
            initial={{ 
              x: '-20vw', 
              y: '80vh', 
              rotate: -35,
              scale: 0.8
            }}
            animate={{
              x: ['-20vw', '15vw', '38vw', '55vw', '75vw', '95vw', '120vw'],
              y: ['80vh', '48vh', '35vh', '50vh', '33vh', '45vh', '-20vh'],
              // Banking angles reflecting lift, drag, and turns
              rotate: [-35, -45, -15, 25, -20, -40, -55],
              scale: [0.8, 1, 1.1, 0.9, 1.05, 1, 0.7]
            }}
            transition={{
              duration: 2.4,
              ease: 'easeInOut',
              times: [0, 0.2, 0.4, 0.55, 0.75, 0.9, 1]
            }}
            className="absolute z-20"
            style={{
              width: '60px',
              height: '60px',
            }}
          >
            {/* Elegant SVG Paper Jet with Heart Wing Emblem */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full text-rose-deep drop-shadow-[0_4px_12px_rgba(244,63,94,0.3)]" aria-hidden="true">
              {/* Airplane body */}
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              {/* Heart logo on the wing */}
              <path 
                d="M17 9.5c-.5-.5-1.2-.5-1.7 0l-.3.3-.3-.3c-.5-.5-1.2-.5-1.7 0s-.5 1.2 0 1.7l2 2 2-2c.5-.5.5-1.2 0-1.7z" 
                fill="#f43f5e" 
                stroke="none" 
              />
            </svg>
          </motion.div>

          {/* Intro Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.95, 1, 1, 0.95],
              filter: ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(2px)']
            }}
            transition={{ 
              duration: 2.2, 
              times: [0, 0.2, 0.8, 1],
              ease: 'easeInOut'
            }}
            className="text-center z-10"
          >
            <h2 className="font-cormorant text-[28px] md:text-[36px] font-light text-rose-deep select-none">
              A message is flying in...
            </h2>
            <p className="font-lato text-[11px] tracking-[4px] uppercase text-rose-soft mt-2 select-none">
              Get ready ♡
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
