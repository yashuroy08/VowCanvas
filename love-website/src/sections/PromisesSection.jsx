import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';

const PROMISES = [
  "To love you on the hard days as much as the beautiful ones",
  "To make you laugh until your cheeks ache",
  "To be your safe place, always and without condition",
  "To choose you, again and again, without hesitation",
  "To grow alongside you, and to never stop trying",
  "To fill our life with flowers, warmth, and endless wonder"
];

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function PromisesSection() {
  return (
    <section id="promises" className="py-16 md:py-24 max-w-2xl mx-auto px-6">
      <SectionDivider label="My promises to you" />
      
      <div className="text-center mb-16 select-none">
        <h2 className="font-cormorant text-[clamp(32px,5vw,52px)] font-light text-rose-deep leading-tight">
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
        {PROMISES.map((promise, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className={`flex items-start gap-5 py-5 group ${
              index === PROMISES.length - 1 ? '' : 'border-b border-[#f5d0d8]/60'
            }`}
          >
            <motion.svg 
              whileHover={{ scale: 1.35, rotate: [0, -10, 10, 0] }}
              className="w-5 h-5 text-rose-soft group-hover:text-rose-medium fill-current mt-1 flex-shrink-0 transition-colors duration-300" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </motion.svg>
            <p className="font-cormorant text-[21px] text-[#7a2038] leading-[1.6] group-hover:translate-x-1 transition-transform duration-300">
              {promise}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
