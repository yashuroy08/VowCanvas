import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import FlowerCrown from '../components/FlowerCrown';
import MagneticButton from '../components/MagneticButton';
import useDataStore from '../store/useDataStore';

const titleContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

export default function Hero({ startAnimation, onNext }) {
  const heroData = useDataStore((state) => state.data.hero);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const isTouchDevice = typeof window !== 'undefined' && (window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window);

  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  // Layer 1 (Foreground - fast movement)
  const fgX = useTransform(springX, [-0.5, 0.5], [-50, 50]);
  const fgY = useTransform(springY, [-0.5, 0.5], [-50, 50]);

  // Layer 2 (Midground - moderate movement)
  const mgX = useTransform(springX, [-0.5, 0.5], [-25, 25]);
  const mgY = useTransform(springY, [-0.5, 0.5], [-25, 25]);

  // Layer 3 (Background - slow movement)
  const bgX = useTransform(springX, [-0.5, 0.5], [15, -15]);
  const bgY = useTransform(springY, [-0.5, 0.5], [15, -15]);

  const handleMouseMove = (e) => {
    if (isTouchDevice) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    x.set((clientX / innerWidth) - 0.5);
    y.set((clientY / innerHeight) - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  const heroRevealVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.05, 
      filter: isTouchDevice ? 'none' : 'blur(12px)' 
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'none',
      transition: {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1],
        delayChildren: 0.2
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      filter: isTouchDevice ? 'none' : 'blur(10px)', 
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'none',
      scale: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-between py-10 md:py-16 px-4 md:px-6 overflow-hidden select-none transition-colors duration-500 w-full"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, var(--rose-gradient-start) 0%, var(--rose-gradient-end) 60%)'
      }}
    >
      {/* Decorative background grid vector lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id="heroGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--rose-border)" strokeOpacity="0.25" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>

      {/* Parallax Floating Layer 3 (Background - slow matching mouse) */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute top-[20%] left-[12%] w-7 h-7 text-rose-300/30 fill-current" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg className="absolute bottom-[35%] right-[15%] w-8 h-8 text-rose-300/20 fill-current" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>

      {/* Parallax Floating Layer 2 (Midground - moderate movement) */}
      <motion.div style={{ x: mgX, y: mgY }} className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute top-[45%] right-[10%] w-10 h-10 text-rose-400/20 fill-none stroke-current" strokeWidth="1" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg className="absolute bottom-[20%] left-[20%] w-12 h-12 text-rose-400/15 fill-none stroke-current" strokeWidth="1" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </motion.div>

      {/* Parallax Floating Layer 1 (Foreground - fast opposite movement) */}
      <motion.div style={{ x: fgX, y: fgY }} className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute top-[15%] right-[22%] w-14 h-14 text-rose-medium/20 fill-none stroke-current" strokeWidth="0.8" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg className="absolute bottom-[25%] left-[8%] w-16 h-16 text-rose-medium/10 fill-none stroke-current" strokeWidth="0.6" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>

      <motion.div 
        variants={heroRevealVariants}
        initial="hidden"
        animate={startAnimation ? "visible" : "hidden"}
        className="flex-1 flex flex-col items-center justify-center gap-10 z-10"
      >
        <FlowerCrown />
        
        <div className="text-center select-none">
          <motion.h1 
            variants={titleContainer}
            initial="hidden"
            animate={startAnimation ? "visible" : "hidden"}
            className="font-cormorant text-[clamp(36px,9vw,96px)] font-light leading-[1.05] text-rose-deep"
          >
            <motion.span variants={wordVariants} className="inline-block mr-3">For</motion.span> <br />
            <motion.span variants={wordVariants} className="inline-block italic font-semibold">{heroData.name}</motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={startAnimation ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(6px)' }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant italic text-[16px] md:text-[20px] lg:text-[24px] text-rose-medium mt-6 md:mt-8"
          >
            A garden of words, grown just for you
          </motion.p>
        </div>
      </motion.div>

      <MagneticButton className="z-10">
        <motion.button 
          initial={{ opacity: 0, y: 15 }}
          animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="relative flex items-center justify-center gap-3 px-8 py-4 bg-rose-deep text-rose-blush rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer focus:outline-none transition-all duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] group"
          onClick={onNext}
          aria-label="Continue to Our Story"
        >
          {/* Subtle pulse ring behind button */}
          <div className="absolute inset-0 rounded-full border border-rose-deep/50 animate-ping opacity-20 group-hover:opacity-0" style={{ animationDuration: '3s' }}></div>
          <span className="font-lato text-[12px] tracking-[4px] uppercase font-semibold">
            Begin
          </span>
          <svg className="w-4 h-4 fill-current animate-bounce mt-1" viewBox="0 0 24 24">
            <path d="M12 16l-6-6h4V4h4v6h4l-6 6z" />
          </svg>
        </motion.button>
      </MagneticButton>
    </section>
  );
}
