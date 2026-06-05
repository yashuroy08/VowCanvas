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
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
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
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col"
      >
        {PROMISES.map((promise, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className={`flex items-start gap-4 py-5 ${
              index === PROMISES.length - 1 ? '' : 'border-b border-[#f5d0d8]'
            }`}
          >
            <div className="w-[8px] h-[8px] rounded-full bg-[#e06080] mt-2.5 flex-shrink-0" aria-hidden="true" />
            <p className="font-cormorant text-[21px] text-[#7a2038] leading-[1.6]">
              {promise}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
