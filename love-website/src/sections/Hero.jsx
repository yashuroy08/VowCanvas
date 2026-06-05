import { motion } from 'framer-motion';
import FlowerCrown from '../components/FlowerCrown';

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

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)', scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function Hero({ startAnimation }) {
  const heroRevealVariants = {
    hidden: { opacity: 0, scale: 1.05, filter: 'blur(12px)' },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1],
        delayChildren: 0.2
      }
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-between py-16 px-6 bg-[radial-gradient(ellipse_at_50%_0%,#ffe0ea_0%,#fff0f3_60%)] overflow-hidden">
      {/* Decorative background grid vector lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id="heroGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(224, 96, 128, 0.15)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>

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
            className="font-cormorant text-[clamp(56px,11vw,104px)] font-light leading-[1.05] text-rose-deep"
          >
            <motion.span variants={wordVariants} className="inline-block mr-3">For</motion.span> <br />
            <motion.span variants={wordVariants} className="inline-block italic font-semibold">My Love</motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={startAnimation ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(6px)' }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant italic text-[20px] md:text-[24px] text-rose-medium mt-8"
          >
            A garden of words, grown just for you
          </motion.p>
        </div>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0, y: 10 }}
        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="flex flex-col items-center gap-1 py-4 px-6 select-none animate-pulse-down cursor-pointer focus:outline-none z-10"
        onClick={() => {
          document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' });
        }}
        aria-label="Scroll down to Our Story"
      >
        <span className="font-lato text-[10px] tracking-[4px] uppercase text-rose-soft">
          ↓ scroll ↓
        </span>
      </motion.button>
    </section>
  );
}
