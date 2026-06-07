import { motion } from 'framer-motion';
import { InstagramLogo, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';

const OrnateDivider = () => (
  <svg className="w-56 h-8 text-rose-soft/40 fill-none" viewBox="0 0 200 30" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    <path strokeLinecap="round" d="M10 15h180M100 5c-5 0-5 20 0 20s5-20 0-20M75 15c0-4 5-4 5 0s-5 4-5 0M125 15c0-4-5-4-5 0s5 4-5 0" />
    <path d="M96 15c1-1 2-2 4-2s3 1 4 2-2 2-4 2-3-1-4-2z" fill="currentColor" />
  </svg>
);

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
        {/* Top ornate flourish */}
        <OrnateDivider />

        {/* Beating Heart SVG */}
        <motion.svg
          animate={{ 
            scale: [1, 1.15, 1, 1.1, 1],
            filter: [
              'drop-shadow(0 2px 6px rgba(224,96,128,0.3))',
              'drop-shadow(0 4px 14px rgba(224,96,128,0.5))',
              'drop-shadow(0 2px 6px rgba(224,96,128,0.3))',
              'drop-shadow(0 3px 10px rgba(224,96,128,0.4))',
              'drop-shadow(0 2px 6px rgba(224,96,128,0.3))'
            ]
          }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-14 h-14 text-rose-medium fill-current cursor-default select-none"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Beating red heart"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </motion.svg>

        {/* Main Text */}
        <h2 className="font-cormorant italic text-[26px] md:text-[30px] font-light text-rose-deep mt-2 select-none">
          You are my favourite everything.
        </h2>

        {/* Sub Text */}
        <p className="font-lato italic text-[14px] text-rose-soft mt-1 select-none">
          Made with all the love in the world · just for you
        </p>

        {/* Bottom ornate flourish */}
        <OrnateDivider />

        {/* Social Links */}
        <div className="flex gap-8 mt-8 items-center">
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-rose-soft/60 hover:text-rose-deep transition-colors">
            <InstagramLogo size={22} weight="bold" />
          </a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-rose-soft/60 hover:text-rose-deep transition-colors">
            <GithubLogo size={22} weight="bold" />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-rose-soft/60 hover:text-rose-deep transition-colors">
            <LinkedinLogo size={22} weight="bold" />
          </a>
        </div>
      </motion.div>
    </footer>
  );
}
