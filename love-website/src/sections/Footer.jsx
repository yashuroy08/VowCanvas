import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="py-24 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Top floral border */}
        <div className="text-[22px] tracking-[6px] opacity-[0.55] select-none" role="img" aria-hidden="true">
          🌸 🌹 🌷 🤍 🌷 🌹 🌸
        </div>

        {/* Beating Heart */}
        <motion.div
          animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="text-[72px] cursor-default select-none"
          role="img"
          aria-label="Beating red heart"
        >
          ❤️
        </motion.div>

        {/* Main Text */}
        <h2 className="font-cormorant italic text-[26px] md:text-[30px] font-light text-rose-deep mt-2 select-none">
          You are my favourite everything.
        </h2>

        {/* Sub Text */}
        <p className="font-lato italic text-[14px] text-rose-soft mt-1 select-none">
          Made with all the love in the world · just for you
        </p>

        {/* Bottom floral border */}
        <div className="text-[22px] tracking-[6px] opacity-[0.55] select-none mt-4" role="img" aria-hidden="true">
          🌸 🌹 🌷 🤍 🌷 🌹 🌸
        </div>
      </motion.div>
    </footer>
  );
}
