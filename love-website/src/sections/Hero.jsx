import { motion } from 'framer-motion';
import FlowerCrown from '../components/FlowerCrown';

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-between py-16 px-6 bg-[radial-gradient(ellipse_at_50%_0%,#ffe0ea_0%,#fff0f3_60%)] overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <FlowerCrown />
        
        <div className="text-center select-none">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="font-cormorant text-[clamp(56px,11vw,104px)] font-light leading-none text-rose-deep"
          >
            For <br />
            <span className="italic font-semibold">My Love</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
            className="font-cormorant italic text-[20px] md:text-[24px] text-rose-medium mt-6"
          >
            A garden of words, grown just for you
          </motion.p>
        </div>
      </div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col items-center gap-1 select-none animate-pulse-down cursor-pointer focus:outline-none"
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
