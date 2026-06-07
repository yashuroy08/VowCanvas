import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from '@phosphor-icons/react';

const ease = [0.23, 1, 0.32, 1];

export default function PremiumPreloader({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExiting(true), 600);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            clipPath: 'circle(0% at 50% 50%)',
            transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[100] bg-rose-blush flex flex-col items-center justify-center select-none"
        >
          {/* Animated Background Mesh */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="mesh-gradient opacity-30 blur-[120px]" 
          />
          <div className="noise-overlay opacity-[0.06]" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, filter: 'blur(15px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease }}
            className="flex flex-col items-center gap-12 relative z-10"
          >
            {/* Pulsing Heart Logo */}
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute inset-[-20px] bg-rose-medium/20 blur-2xl rounded-full"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.08, 1],
                }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="w-20 h-20 bg-white border border-white/80 rounded-[40px] shadow-2xl shadow-rose-deep/10 flex items-center justify-center relative z-10"
              >
                <Heart weight="fill" className="w-10 h-10 text-rose-medium" />
              </motion.div>
            </div>

            {/* Cinematic Branding */}
            <div className="flex flex-col items-center gap-4 text-center">
              <motion.h1 
                initial={{ letterSpacing: '0.1em' }}
                animate={{ letterSpacing: '0.3em' }}
                transition={{ duration: 4, ease: 'linear' }}
                className="font-cormorant italic text-5xl md:text-6xl text-rose-dark-accent"
              >
                Lovecraft
              </motion.h1>
              
              <div className="h-[1px] w-12 bg-rose-border/40 my-2" />
              
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-rose-deep/40 pl-[0.5em]">
                Eternalizing your story
              </span>
            </div>

            {/* Precision Counter */}
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-xl font-light text-rose-deep/60 tabular-nums">
                  {percent.toString().padStart(3, '0')}
                </span>
                <span className="text-[10px] font-bold text-rose-deep/20 uppercase tracking-widest">Loading</span>
              </div>
              
              <div className="w-64 h-[1px] bg-rose-border/20 relative overflow-hidden">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: percent / 100 }}
                  className="absolute inset-0 bg-rose-deep origin-left"
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
