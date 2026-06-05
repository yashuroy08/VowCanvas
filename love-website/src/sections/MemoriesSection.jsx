import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';

const MEMORIES = [
  {
    icon: (
      <svg className="w-10 h-10 text-rose-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <motion.path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m10.607 10.607l.707-.707"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
          style={{ originX: '12px', originY: '12px' }}
        />
        <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16" />
      </svg>
    ),
    title: "The first day",
    desc: "The moment I saw you and everything else became background noise"
  },
  {
    icon: (
      <svg className="w-10 h-10 text-rose-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        <motion.path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M10 16v3m4-3v3m-8-2v3" 
          animate={{ y: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      </svg>
    ),
    title: "Rainy evenings",
    desc: "Every storm made perfect just because I got to share it with you"
  },
  {
    icon: (
      <svg className="w-10 h-10 text-rose-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        <motion.path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M17 3l.3.6.6.3-.6.3-.3.6-.3-.6-.6-.3.6-.3.3-.6z" 
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ originX: '17px', originY: '4px' }}
        />
      </svg>
    ),
    title: "Late nights",
    desc: "Talking until the world went quiet and time stopped mattering"
  },
  {
    icon: (
      <svg className="w-10 h-10 text-rose-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <motion.path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />
      </svg>
    ),
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
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
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
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {MEMORIES.map((mem, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 15px 35px rgba(244,63,94,0.06)",
              borderColor: "rgba(244,63,94,0.25)"
            }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#fff5f7] to-[#ffe8ee] border border-pink-200/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] transition-colors duration-300"
          >
            <div className="mb-4 select-none">
              {mem.icon}
            </div>
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
