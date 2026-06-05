import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';

const REASONS = [
  "The way your eyes light up when you talk about something you love",
  "Your laugh — the one that makes the whole room feel warmer instantly",
  "How you make the most ordinary moments feel magical and rare",
  "Your strength, your softness, your endlessly beautiful heart",
  "The way home feels like wherever you happen to be",
  "Every quiet moment and every adventure — made perfect by you"
];

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
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 }
  }
};

export default function ReasonsSection() {
  return (
    <section id="our-story" className="py-16 md:py-24 max-w-6xl mx-auto px-6">
      <SectionDivider label="Why I love you" />
      
      <div className="text-center mb-16 select-none">
        <h2 className="font-cormorant text-[clamp(32px,5vw,52px)] font-light text-rose-deep leading-tight">
          A thousand reasons, here are just a few
        </h2>
        <p className="font-cormorant italic text-[18px] md:text-[20px] text-rose-medium mt-4">
          Every single day you give me more reasons to fall in love with you all over again.
        </p>
      </div>

      <motion.ul 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
      >
        {REASONS.map((reason, index) => {
          const numStr = String(index + 1).padStart(2, '0');
          return (
            <motion.li
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -6, 
                boxShadow: "0 16px 40px rgba(180,60,90,0.12)"
              }}
              className="bg-white/75 backdrop-blur-sm border border-pink-200/60 rounded-2xl p-8 flex flex-col justify-between min-h-[200px]"
            >
              <div className="font-cormorant text-[48px] font-light text-pink-200 leading-none mb-4 select-none">
                {numStr}
              </div>
              <p className="font-cormorant text-[18px] text-[#7a2038] leading-[1.7]">
                {reason}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
