import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';

const MEMORIES = [
  {
    emoji: "🌅",
    title: "The first day",
    desc: "The moment I saw you and everything else became background noise"
  },
  {
    emoji: "🌧️",
    title: "Rainy evenings",
    desc: "Every storm made perfect just because I got to share it with you"
  },
  {
    emoji: "🌙",
    title: "Late nights",
    desc: "Talking until the world went quiet and time stopped mattering"
  },
  {
    emoji: "✈️",
    title: "Our adventures",
    desc: "Every road, every new place — made extraordinary by your company"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export default function MemoriesSection() {
  return (
    <section id="memories" className="py-16 md:py-24 max-w-4xl mx-auto px-6">
      <SectionDivider label="Our story" />
      
      <div className="text-center mb-16 select-none">
        <h2 className="font-cormorant text-[clamp(32px,5vw,52px)] font-light text-rose-deep leading-tight">
          Moments I hold close
        </h2>
        <p className="font-cormorant italic text-[18px] md:text-[20px] text-rose-medium mt-4">
          A collection of the little things that have made us, us.
        </p>
      </div>

      <motion.ul
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {MEMORIES.map((mem, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="bg-gradient-to-br from-[#fff5f7] to-[#ffe8ee] border border-pink-200/60 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]"
          >
            <span className="text-[34px] mb-4 select-none" role="img" aria-hidden="true">
              {mem.emoji}
            </span>
            <h3 className="font-cormorant text-[22px] font-semibold text-rose-deep mb-2">
              {mem.title}
            </h3>
            <p className="font-lato text-[13px] font-light text-[#b06070] leading-[1.8] max-w-xs">
              {mem.desc}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
