import { motion } from 'framer-motion';

export default function SectionDivider({ label }) {
  return (
    <div className="flex items-center justify-center gap-4 py-12 select-none">
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 80, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="h-[0.5px] bg-gradient-to-r from-transparent to-[#e8a0b0]" 
      />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex items-center gap-2"
      >
        <motion.svg 
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="w-3.5 h-3.5 text-rose-soft/70 fill-none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          aria-hidden="true"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </motion.svg>
        <span className="font-lato text-[10px] tracking-[5px] uppercase text-rose-soft font-light">
          {label}
        </span>
        <motion.svg 
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.3 }}
          className="w-3.5 h-3.5 text-rose-soft/70 fill-none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          aria-hidden="true"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </motion.svg>
      </motion.div>
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 80, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="h-[0.5px] bg-gradient-to-l from-transparent to-[#e8a0b0]" 
      />
    </div>
  );
}
