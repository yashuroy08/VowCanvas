import { motion } from 'framer-motion';

// Sakura (Blossom)
const SakuraIcon = () => (
  <svg className="w-6 h-6 text-rose-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5c.3-1.8 1.8-3 3.6-2.5 1.4.4 2.1 1.7 1.8 3-1 2.5-3.6 3.6-5.4 3-1.8-.3-3-1.8-2.5-3.6.4-1.4 1.7-2.1 3-1.8 2.5 1 3.6 3.6 3 5.4-.3 1.8-1.8 3-3.6 2.5-1.4-.4-2.1-1.7-1.8-3 1-2.5 3.6-3.6 5.4-3 1.8.3 3 1.8 2.5 3.6-.4 1.4-1.7 2.1-3 1.8-2.5-1-3.6-3.6-3-5.4" />
    <circle cx="12" cy="12" r="1.5" className="fill-rose-medium/20 text-rose-medium" />
  </svg>
);

// Rose
const RoseIcon = () => (
  <svg className="w-6 h-6 text-rose-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 8c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 16c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4z" />
    <circle cx="12" cy="12" r="1" className="fill-rose-deep text-rose-deep" />
  </svg>
);

// Lotus (Tulip)
const TulipIcon = () => (
  <svg className="w-6 h-6 text-rose-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-3.5 0-6.5-3.5-6.5-7.5C5.5 9.5 8.5 5 12 3c3.5 2 6.5 6.5 6.5 10.5 0 4-3 7.5-6.5 7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5 0-3-3.5-3-7.5 0-3.5 1.5-7 3-10.5 1.5 3.5 3 7 3 10.5 0 4-1.5 7.5-3 7.5z" />
  </svg>
);

// Sparkle Heart
const HeartIcon = () => (
  <svg className="w-6 h-6 text-rose-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ICONS = [SakuraIcon, RoseIcon, TulipIcon, HeartIcon, TulipIcon, RoseIcon, SakuraIcon];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export default function FlowerCrown() {
  return (
    <motion.div 
      aria-hidden="true"
      className="flex justify-center gap-4 select-none py-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {ICONS.map((IconComp, index) => (
        <motion.div 
          key={index} 
          variants={itemVariants}
          whileHover={{ 
            scale: 1.25, 
            rotate: index % 2 === 0 ? 15 : -15, 
            filter: 'drop-shadow(0 4px 6px rgba(224,96,128,0.25))' 
          }}
          className="cursor-pointer transition-all duration-300"
        >
          <IconComp />
        </motion.div>
      ))}
    </motion.div>
  );
}
