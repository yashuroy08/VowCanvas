import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';

// SVG Birthday Cake Icon
const CakeIcon = () => (
  <svg className="w-16 h-16 text-rose-medium fill-none stroke-current mx-auto mb-4" viewBox="0 0 24 24" strokeWidth="1.2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16v11H4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 10c0-1.5 1-2.5 3-2.5s3 1 3 2.5m-6 0c0-1.5-1-2.5-3-2.5S0 8.5 0 10m12 0c0-1.5 1-2.5 3-2.5s3 1 3 2.5m0 0c0-1.5-1-2.5-3-2.5S9 8.5 9 10" />
    {/* Candles */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 10V6m5 4V5m5 5V6" />
    {/* Candle Flames */}
    <path d="M7 4.5c.3-.5.5-.5.7 0s.1.8-.7.8-.7-.3-.7-.8zm5-1c.3-.5.5-.5.7 0s.1.8-.7.8-.7-.3-.7-.8zm5 1c.3-.5.5-.5.7 0s.1.8-.7.8-.7-.3-.7-.8z" fill="#f59e0b" stroke="none" />
    {/* Stand */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 21h20" />
  </svg>
);

export default function SurpriseSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [confetti, setConfetti] = useState([]);

  // Generate confetti items
  const triggerConfetti = () => {
    const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#f59e0b', '#10b981', '#3b82f6'];
    const particles = Array.from({ length: 60 }).map((_, index) => {
      const startX = Math.random() * 100; // 0vw to 100vw
      const sway = Math.random() * 20 - 10; // -10vw to 10vw
      const duration = Math.random() * (4.5 - 2.5) + 2.5; // 2.5s to 4.5s
      const delay = Math.random() * 0.5;
      const size = Math.random() * (12 - 6) + 6;
      const rotateEnd = Math.random() * 720 - 360;
      const shape = Math.random() > 0.4 ? 'square' : 'circle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return { id: index, startX, sway, duration, delay, size, rotateEnd, shape, color };
    });
    setConfetti(particles);
  };

  const handleOpenBox = () => {
    setIsOpen(true);
    triggerConfetti();
  };

  const handleCloseBox = () => {
    setIsOpen(false);
    setConfetti([]);
  };

  return (
    <section id="surprise" className="py-16 md:py-24 max-w-4xl mx-auto px-6 relative text-center">
      <SectionDivider label="Surprise" />

      {/* Confetti Render */}
      <AnimatePresence>
        {isOpen && confetti.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -50, x: `${p.startX}vw`, rotate: 0, opacity: 1 }}
            animate={{ 
              y: '105vh', 
              x: `${p.startX + p.sway}vw`, 
              rotate: p.rotateEnd,
              opacity: [1, 1, 0.4, 0] 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
            className="fixed pointer-events-none"
            style={{
              top: 0,
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              borderRadius: p.shape === 'circle' ? '50%' : '2px',
              zIndex: 9999,
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          />
        ))}
      </AnimatePresence>

      <div className="text-center mb-12 select-none">
        <h2 className="font-cormorant text-[clamp(32px,5vw,52px)] font-light text-rose-deep leading-tight">
          A Little Surprise for You
        </h2>
        <p className="font-cormorant italic text-[18px] md:text-[20px] text-rose-medium mt-4">
          Click the gift below to open a special birthday message.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="gift-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 cursor-pointer"
              onClick={handleOpenBox}
            >
              {/* Interactive Gift Box */}
              <motion.div
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, -2, 2, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5, 
                  ease: 'easeInOut' 
                }}
                className="relative group p-4"
              >
                {/* Glow behind box */}
                <div className="absolute inset-0 bg-rose-200/20 blur-2xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-500" />
                
                <svg className="w-32 h-32 text-rose-medium fill-none stroke-current relative z-10" viewBox="0 0 24 24" strokeWidth="1.2">
                  {/* Lid */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18v3H3z" />
                  {/* Box Base */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 11h16v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z" />
                  {/* Ribbon horizontal */}
                  <path d="M12 8v13" stroke="#f43f5e" strokeWidth="1.5" />
                  {/* Ribbon vertical */}
                  <path d="M3 9.5h18" stroke="#f43f5e" strokeWidth="1.5" />
                  {/* Bow */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.5-2-3-2-3 0 0 1 1.5 1 3 0 1.5 1 3 1 3 0 0-2-1.5-2-3 0z" fill="#f43f5e" />
                </svg>
              </motion.div>

              <span className="font-lato text-[11px] tracking-[4px] uppercase text-rose-soft animate-pulse">
                ♡ click to open ♡
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="letter-revealed"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="relative max-w-xl w-full bg-white/90 border border-pink-200 rounded-3xl p-8 md:p-12 shadow-md backdrop-blur-sm mt-4 select-none"
            >
              {/* Confetti sparkle spark */}
              <button 
                onClick={triggerConfetti} 
                className="absolute top-4 right-4 text-rose-soft hover:text-rose-medium p-1.5 rounded-full hover:bg-rose-50 transition-colors focus:outline-none"
                aria-label="Trigger confetti burst"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1.81-5.096L2.094 14.09 7.2 13.28l1.81-5.097 1.81 5.097 5.096.81-5.096 1.81zM18.813 5.904L18 11l-1.81-5.096L11.094 4.09 16.2 3.28l1.81-5.097 1.81 5.097 5.096.81-5.096 1.81z" />
                </svg>
              </button>

              <CakeIcon />

              <h3 className="font-cormorant italic text-[24px] md:text-[28px] font-semibold text-rose-deep mb-4">
                Happy Birthday, My Love!
              </h3>
              
              <p className="font-cormorant italic text-[18px] md:text-[20px] text-[#6b1c32] leading-[2] mb-6">
                "May your day be filled with as much light, joy, and laughter as you bring into my life every single day. You deserve the entire universe and more. Wishing you the happiest and most magical year ahead. I love you, always."
              </p>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={triggerConfetti}
                  className="font-lato text-[11px] tracking-[2px] uppercase px-4 py-2 border border-rose-border text-rose-soft hover:text-rose-deep hover:bg-rose-50 rounded-full transition-colors duration-300 focus:outline-none"
                >
                  🎉 Confetti
                </button>
                <button
                  onClick={handleCloseBox}
                  className="font-lato text-[11px] tracking-[2px] uppercase px-4 py-2 bg-rose-medium text-white hover:bg-rose-deep rounded-full shadow-sm hover:shadow transition-all duration-300 focus:outline-none"
                >
                  ♡ Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
