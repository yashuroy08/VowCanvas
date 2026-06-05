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
    <section id="our-story" className="py-16 md:py-24 max-w-6xl mx-auto px-6 relative">
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
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
      >
        {REASONS.map((reason, index) => {
          const numStr = String(index + 1).padStart(2, '0');
          return (
            <motion.li
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 20px 45px rgba(244,63,94,0.08)",
                borderColor: "rgba(244,63,94,0.35)"
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative bg-white/60 backdrop-blur-md border border-pink-200/40 rounded-2xl p-8 flex flex-col justify-between min-h-[210px] overflow-hidden group transition-colors duration-300"
            >
              {/* Inner glowing card gradient hover background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/20 to-pink-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="font-cormorant text-[48px] font-light text-pink-200 group-hover:text-rose-soft/75 leading-none mb-4 select-none flex justify-between items-start transition-colors duration-300">
                <span>{numStr}</span>
                <svg className="w-5 h-5 text-rose-soft/20 group-hover:text-rose-medium/60 transition-colors duration-300 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              
              <p className="font-cormorant text-[19px] text-[#7a2038] leading-[1.7] z-10">
                {reason}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
