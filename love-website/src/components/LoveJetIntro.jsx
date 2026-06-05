import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoveJetIntro({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show the intro for 3.4 seconds to allow the rose to fully bloom
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 3400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Luxury-style progress counter (0% to 100%)
  useEffect(() => {
    const duration = 2600; // count up in 2.6 seconds
    const interval = 20; // update every 20ms
    const totalSteps = duration / interval;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const current = Math.min((step / totalSteps) * 100, 100);
      setProgress(Math.floor(current));
      if (current >= 100) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Floating background sparkles/hearts
  const sparkles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      yStart: '110vh',
      yEnd: '-10vh',
      size: Math.random() * (14 - 6) + 6,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 3,
    }));
  }, []);

  // SVG Paths for the blooming rose outline
  const stemPath = "M100 200 Q100 155, 115 125";
  const leafLeft = "M100 170 C80 165, 70 145, 98 140 C99 150, 95 165, 100 170 Z";
  const leafRight = "M106 150 C125 145, 135 125, 112 125 C110 133, 112 145, 107 150 Z";
  
  // Overlapping rose petals for an organic look
  const outerPetals = "M90 120 C70 110, 65 80, 90 60 C105 45, 125 45, 140 60 C165 80, 160 110, 140 120 C120 130, 110 125, 115 120 C130 110, 145 95, 140 75 C135 55, 115 55, 95 75 C85 90, 90 110, 105 115 Z";
  const middlePetals = "M100 100 C90 90, 92 73, 105 67 C118 63, 130 75, 125 90 C120 103, 112 105, 108 100 C102 93, 110 80, 118 83 C122 87, 115 97, 108 100 C105 100, 102 97, 100 100 Z";
  const innerBud = "M110 90 C105 85, 108 77, 115 77 C120 77, 122 85, 115 90 C112 93, 108 90, 110 90 Z";

  const stemVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 0.9, ease: "easeInOut" }
    }
  };

  const leafVariants = {
    hidden: { pathLength: 0, opacity: 0, scale: 0.8 },
    visible: { 
      pathLength: 1, 
      opacity: 0.9,
      scale: 1,
      transition: { delay: 0.5, duration: 0.8, ease: "easeOut" }
    }
  };

  const petalVariants = {
    hidden: { pathLength: 0, opacity: 0, scale: 0.9 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      scale: 1,
      transition: { delay: 0.9, duration: 1.5, ease: "easeInOut" }
    }
  };

  const fillVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.05, 
      transition: { delay: 1.8, duration: 1.2 }
    }
  };

  // Staggered letters variants
  const headingText = "A message of love is blooming";
  const letters = Array.from(headingText);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 1.1 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 12, filter: 'blur(3px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-gradient-to-tr from-[#fff3f4] via-[#fff0f3] to-[#fff6f7] flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto"
        >
          {/* Ambient Floating Blur Orbs */}
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[15%] left-[15%] w-[320px] h-[320px] bg-pink-300/10 rounded-full blur-[80px] pointer-events-none"
          />
          <motion.div
            animate={{
              x: [0, -40, 20, 0],
              y: [0, 30, -40, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] bg-rose-200/15 rounded-full blur-[90px] pointer-events-none"
          />

          {/* Sparkles Floating Upwards */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {sparkles.map((sp) => (
              <motion.svg
                key={sp.id}
                initial={{ opacity: 0, y: sp.yStart, x: sp.x, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 0.7, 0.7, 0],
                  y: sp.yEnd,
                  scale: [0.5, 1.2, 1.2, 0.5]
                }}
                transition={{ 
                  delay: sp.delay,
                  duration: sp.duration,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="absolute text-rose-medium/20 fill-current"
                style={{ width: sp.size, height: sp.size }}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </motion.svg>
            ))}
          </div>

          {/* Elegant Blooming Rose Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="z-10 flex flex-col items-center gap-7"
          >
            {/* SVG Rose Container with Border Pulsing */}
            <div className="relative w-64 h-64 flex items-center justify-center bg-white/50 backdrop-blur-md border border-pink-200/40 rounded-full shadow-[0_8px_32px_rgba(244,63,94,0.03)] p-6">
              
              {/* Outer soft breathing ring */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-rose-300/30"
              />

              <svg 
                viewBox="0 0 200 220" 
                fill="none" 
                className="w-full h-full drop-shadow-[0_2px_8px_rgba(244,63,94,0.15)]"
                aria-hidden="true"
              >
                {/* Stem (green/olive tone) */}
                <motion.path 
                  d={stemPath} 
                  stroke="#65a30d" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  variants={stemVariants}
                  initial="hidden"
                  animate="visible"
                />

                {/* Left Leaf */}
                <motion.path 
                  d={leafLeft} 
                  stroke="#65a30d" 
                  strokeWidth="1.5" 
                  strokeLinejoin="round"
                  variants={leafVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path 
                  d={leafLeft} 
                  fill="#65a30d" 
                  variants={fillVariants}
                  initial="hidden"
                  animate="visible"
                />

                {/* Right Leaf */}
                <motion.path 
                  d={leafRight} 
                  stroke="#65a30d" 
                  strokeWidth="1.5" 
                  strokeLinejoin="round"
                  variants={leafVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path 
                  d={leafRight} 
                  fill="#65a30d" 
                  variants={fillVariants}
                  initial="hidden"
                  animate="visible"
                />

                {/* Rose Outer Petals */}
                <motion.path 
                  d={outerPetals} 
                  stroke="#be123c" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={petalVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path 
                  d={outerPetals} 
                  fill="#f43f5e" 
                  variants={fillVariants}
                  initial="hidden"
                  animate="visible"
                />

                {/* Rose Middle Petals */}
                <motion.path 
                  d={middlePetals} 
                  stroke="#e11d48" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={petalVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path 
                  d={middlePetals} 
                  fill="#f43f5e" 
                  variants={fillVariants}
                  initial="hidden"
                  animate="visible"
                />

                {/* Rose Inner Bud */}
                <motion.path 
                  d={innerBud} 
                  stroke="#fda4af" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={petalVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path 
                  d={innerBud} 
                  fill="#f43f5e" 
                  variants={fillVariants}
                  initial="hidden"
                  animate="visible"
                />
              </svg>
            </div>

            {/* Glowing blur base behind the rose */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-300/10 rounded-full blur-3xl pointer-events-none" />

            {/* Title & description */}
            <div className="text-center flex flex-col items-center justify-center">
              {/* Staggered letter title */}
              <motion.h2 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="font-cormorant text-[28px] md:text-[34px] font-light text-rose-deep select-none flex flex-wrap justify-center gap-[1px]"
              >
                {letters.map((char, index) => (
                  <motion.span 
                    key={index} 
                    variants={letterVariants}
                    style={{ display: char === ' ' ? 'inline-block' : 'inline' }}
                    className={char === ' ' ? 'w-2' : ''}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h2>

              <div className="mt-3 flex flex-col items-center gap-1">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.65 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                  className="font-lato text-[9px] tracking-[4px] uppercase text-rose-soft select-none"
                >
                  Preparing your surprise
                </motion.p>
                {/* Elegant numerical percentage counter */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-cormorant italic text-[20px] font-semibold text-rose-medium/85 select-none mt-1"
                >
                  {progress}%
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
