import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';
import MagneticButton from '../components/MagneticButton';
import useDataStore from '../store/useDataStore';

export default function LetterSection({ onNext }) {
  const letter = useDataStore((state) => state.data.letter);

  return (
    <section id="letter" className="py-10 md:py-24 max-w-4xl mx-auto px-4 md:px-6 relative w-full">
      <SectionDivider label="From my heart" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96, filter: 'blur(12px)' }}
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-rose-blush/60 border border-rose-border/40 rounded-3xl p-5 md:p-14 shadow-sm mt-8 overflow-hidden transition-colors duration-500"
      >
        {/* Oversized Quote SVG */}
        <svg className="absolute -top-2 -left-2 w-20 h-20 md:w-32 md:h-32 text-rose-light-accent opacity-35 select-none z-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        
        <blockquote className="relative z-10 font-cormorant italic text-[15px] md:text-[20px] lg:text-[22px] font-light text-rose-dark-accent leading-[1.8] md:leading-[2.1] whitespace-pre-line">
          {letter}
        </blockquote>

        <div className="flex flex-col items-end mt-10 relative z-10 select-none">
          <div className="font-cormorant italic text-[15px] md:text-[18px] lg:text-[20px] text-rose-medium-accent">
            — Yours, always
          </div>
          {/* Cursive animated heart drawing flourish */}
          <svg className="w-24 h-8 text-rose-medium-accent/50 mt-1" viewBox="0 0 120 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.path 
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.6, ease: 'easeInOut' }}
              d="M10 15 C 35 15, 40 5, 55 15 C 70 25, 80 5, 90 15 C 95 20, 100 20, 110 15"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>

      {/* Next Chapter Button */}
      <div className="flex justify-center mt-8 md:mt-12 mb-2 select-none w-full">
        <MagneticButton>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="flex items-center gap-2.5 font-lato text-[10px] tracking-[3px] uppercase px-7 py-4 bg-rose-medium hover:bg-rose-deep text-rose-light-accent rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none"
          >
            <span>See our memories</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
            </svg>
          </motion.button>
        </MagneticButton>
      </div>
    </section>
  );
}
