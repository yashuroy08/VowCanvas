import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';
import MagneticButton from '../components/MagneticButton';
import useDataStore from '../store/useDataStore';
import ScratchCard from '../components/ScratchCard';

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -50, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    x: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 60, damping: 14 }
  }
};

export default function PromisesSection({ onNext }) {
  const promises = useDataStore((state) => state.data.promises);

  return (
    <section id="promises" className="py-10 md:py-24 max-w-2xl mx-auto px-4 md:px-6 w-full">
      <SectionDivider label="My promises to you" />
      
      <div className="text-center mb-10 md:mb-16 select-none">
        <h2 className="font-cormorant text-[clamp(24px,4.5vw,44px)] font-light text-rose-deep leading-tight">
          What I promise you, every single day
        </h2>
      </div>

      <motion.ul
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col"
      >
        {promises.map((promise, index) => {
          const content = (
            <>
              <motion.svg 
                whileHover={{ scale: 1.35, rotate: [0, -10, 10, 0] }}
                className="w-5 h-5 text-rose-soft group-hover:text-rose-medium fill-current mt-1 flex-shrink-0 transition-colors duration-300" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </motion.svg>
              
              <div className="flex-1">
                <p className="font-cormorant text-[15px] md:text-[21px] text-rose-deep leading-[1.6] group-hover:translate-x-1 transition-transform duration-300">
                  {promise}
                </p>
              </div>
            </>
          );

          return (
            <motion.li
              key={index}
              variants={itemVariants}
            >
              <ScratchCard>
                <div className="flex items-start gap-4 md:gap-5 group w-full">
                  {content}
                </div>
              </ScratchCard>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* Next Chapter Button */}
      <div className="flex justify-center mt-8 md:mt-12 mb-2 select-none w-full">
        <MagneticButton>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="flex items-center gap-2.5 font-lato text-[10px] tracking-[3px] uppercase px-7 py-4 bg-rose-medium hover:bg-rose-deep text-rose-light-accent rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none"
          >
            <span>Open my surprise</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
            </svg>
          </motion.button>
        </MagneticButton>
      </div>
    </section>
  );
}
