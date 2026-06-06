import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';
import MagneticButton from '../components/MagneticButton';
import useDataStore from '../store/useDataStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95, filter: 'blur(6px)' },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 70, damping: 16 }
  }
};

export default function ReasonsSection({ onNext }) {
  const reasons = useDataStore((state) => state.data.reasons);

  return (
    <section id="our-story" className="py-10 md:py-24 max-w-6xl mx-auto px-4 md:px-6 relative w-full">
      <SectionDivider label="Why I love you" />
      
      <div className="text-center mb-16 select-none">
        <h2 className="font-cormorant text-[clamp(24px,4.5vw,44px)] font-light text-rose-deep leading-tight">
          A thousand reasons, here are just a few
        </h2>
        <p className="font-cormorant italic text-[15px] md:text-[18px] lg:text-[20px] text-rose-medium mt-3 md:mt-4">
          Every single day you give me more reasons to fall in love with you all over again.
        </p>
      </div>

      <motion.ul 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
      >
        {reasons.map((reason, index) => {
          const numStr = String(index + 1).padStart(2, '0');
          return (
            <motion.li
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 20px 45px rgba(0,0,0,0.06)"
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative bg-rose-blush/30 backdrop-blur-md border border-rose-border/40 rounded-2xl p-5 md:p-8 flex flex-col justify-between min-h-[160px] md:min-h-[210px] overflow-hidden group transition-all duration-300 hover:border-rose-medium/60"
            >
              {/* Inner glowing card gradient hover background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-light-accent/15 to-rose-blush/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="font-cormorant text-[36px] md:text-[48px] font-light text-rose-border group-hover:text-rose-soft/85 leading-none mb-3 md:mb-4 select-none flex justify-between items-start transition-colors duration-300">
                <span>{numStr}</span>
                <svg className="w-5 h-5 text-rose-soft/30 group-hover:text-rose-medium/70 transition-colors duration-300 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              
              <p className="font-cormorant text-[15px] md:text-[19px] text-rose-deep leading-[1.7] z-10">
                {reason}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* Next Chapter Button */}
      <div className="flex justify-center mt-8 md:mt-14 mb-2 select-none w-full">
        <MagneticButton>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="flex items-center gap-2.5 font-lato text-[10px] tracking-[3px] uppercase px-7 py-4 bg-rose-medium hover:bg-rose-deep text-rose-light-accent rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none"
          >
            <span>Read my letter</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
            </svg>
          </motion.button>
        </MagneticButton>
      </div>
    </section>
  );
}
