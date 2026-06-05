import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';

// Custom Typewriter Effect Component
function Typewriter({ text, delay = 0.03 }) {
  const characters = useMemo(() => Array.from(text), [text]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay
      }
    }
  };

  const charVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.span variants={containerVariants} initial="hidden" animate="visible" className="inline">
      {characters.map((char, index) => (
        <motion.span key={index} variants={charVariants}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Flickering Candle Flame SVG Component
const FlickeringFlame = () => (
  <motion.svg
    animate={{
      scaleY: [1, 1.25, 0.9, 1.15, 1],
      scaleX: [1, 0.85, 1.1, 0.9, 1],
      y: [0, -1, 0.5, -0.5, 0],
      rotate: [-3, 3, -1, 2, 0]
    }}
    transition={{
      repeat: Infinity,
      duration: 0.6 + Math.random() * 0.4,
      ease: "easeInOut"
    }}
    className="w-4 h-6 text-amber-500 fill-current drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] cursor-pointer"
    viewBox="0 0 100 150"
  >
    <path d="M50 0 C70 50 80 80 80 110 A30 30 0 0 1 20 110 C20 80 30 50 50 0 Z" />
  </motion.svg>
);

export default function SurpriseSection() {
  const [envelopeState, setEnvelopeState] = useState('sealed'); // 'sealed', 'open', 'revealed'
  const [candles, setCandles] = useState([true, true, true]); // 3 lit candles
  const [puffs, setPuffs] = useState([]); // Smoke particles
  const [confetti, setConfetti] = useState([]);
  const [allBlownOut, setAllBlownOut] = useState(false);

  // Trigger confetti celebration
  const triggerConfetti = () => {
    const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#f59e0b', '#10b981', '#3b82f6'];
    const particles = Array.from({ length: 80 }).map((_, index) => {
      const startX = Math.random() * 100;
      const sway = Math.random() * 25 - 12.5;
      const duration = Math.random() * (4.5 - 2.5) + 2.5;
      const delay = Math.random() * 0.4;
      const size = Math.random() * (12 - 6) + 6;
      const rotateEnd = Math.random() * 720 - 360;
      const shape = Math.random() > 0.4 ? 'square' : 'circle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      return { id: index, startX, sway, duration, delay, size, rotateEnd, shape, color };
    });
    setConfetti(particles);
  };

  // Click handler to blow out a candle
  const handleBlowCandle = (index, e) => {
    if (!candles[index]) return;
    
    // Extinguish candle
    const nextCandles = [...candles];
    nextCandles[index] = false;
    setCandles(nextCandles);

    // Create smoke puff particles at click location
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
    const xPos = rect.left - parentRect.left + rect.width / 2;
    const yPos = rect.top - parentRect.top;

    const newPuffs = Array.from({ length: 6 }).map((_, i) => ({
      id: `${index}-${i}-${Date.now()}`,
      x: xPos,
      y: yPos,
      size: Math.random() * 6 + 4,
      vx: Math.random() * 40 - 20,
      vy: -(Math.random() * 30 + 30),
      opacity: 0.6
    }));
    setPuffs(prev => [...prev, ...newPuffs]);
  };

  // Check if all candles are blown out
  useEffect(() => {
    if (envelopeState === 'revealed' && candles.every(c => !c) && !allBlownOut) {
      setAllBlownOut(true);
      triggerConfetti();
    }
  }, [candles, envelopeState, allBlownOut]);

  // Reset surprise state
  const handleReset = () => {
    setEnvelopeState('sealed');
    setCandles([true, true, true]);
    setConfetti([]);
    setAllBlownOut(false);
  };

  return (
    <section id="surprise" className="py-16 md:py-24 max-w-4xl mx-auto px-6 relative text-center">
      <SectionDivider label="Surprise" />

      {/* Celebration Confetti */}
      <AnimatePresence>
        {allBlownOut && confetti.map((p) => (
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
          A surprise for you
        </h2>
        <p className="font-cormorant italic text-[18px] md:text-[20px] text-rose-medium mt-4">
          {envelopeState !== 'revealed' 
            ? "Unseal the envelope to open a special birthday card."
            : !allBlownOut 
              ? "Make a wish and click the candles to blow them out! 🎂" 
              : "Happy Birthday! 🎉"}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[420px] relative">
        <AnimatePresence mode="wait">
          
          {/* STAGE 1 & 2: The Envelope Experience */}
          {envelopeState !== 'revealed' && (
            <motion.div
              key="envelope-stage"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="relative w-[340px] h-[220px] select-none"
            >
              {/* Back side of Envelope Pocket */}
              <div className="absolute inset-0 bg-[#fbf5f2] border border-[#f0ded5] rounded-2xl shadow-xl z-0" />

              {/* Letter Card (Inside Envelope - slides up in state 'open') */}
              <motion.div
                animate={envelopeState === 'open' ? { y: -80, scale: 0.95 } : { y: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-6 top-4 bottom-4 bg-white rounded-xl shadow-inner border border-rose-50 p-4 flex flex-col items-center justify-center z-10"
              >
                <div className="w-12 h-0.5 bg-rose-100 rounded mb-2" />
                <div className="w-16 h-0.5 bg-rose-50 rounded" />
              </motion.div>

              {/* Front flap of Envelope Pocket */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-[#fcf7f4] via-[#fdfaf8] to-transparent border-t border-pink-100/30 rounded-2xl z-20 pointer-events-none"
                style={{
                  clipPath: 'polygon(0% 45%, 50% 100%, 100% 45%, 100% 100%, 0% 100%)'
                }}
              />

              {/* Left and Right overlapping fold shadows */}
              <div 
                className="absolute inset-0 bg-[#fcf8f6]/70 rounded-2xl z-20 pointer-events-none"
                style={{
                  clipPath: 'polygon(0% 45%, 0% 100%, 50% 100%)'
                }}
              />
              <div 
                className="absolute inset-0 bg-[#faf4f2]/70 rounded-2xl z-20 pointer-events-none"
                style={{
                  clipPath: 'polygon(100% 45%, 50% 100%, 100% 100%)'
                }}
              />

              {/* Top Folding Flap */}
              <motion.div
                animate={envelopeState === 'open' ? { rotateX: 180, y: -1 } : { rotateX: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                style={{ originY: "top", transformStyle: "preserve-3d" }}
                className="absolute inset-x-0 top-0 h-[100px] bg-[#fbf5f2] border-x border-[#f0ded5] rounded-b-2xl shadow-sm z-30"
              >
                {/* Visual triangle fold shape */}
                <div 
                  className="w-full h-full bg-[#fdf8f6] border-b border-pink-100/30 rounded-b-2xl"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
                    backfaceVisibility: 'hidden'
                  }}
                />
              </motion.div>

              {/* Pulse Glow under Wax Seal */}
              {envelopeState === 'sealed' && (
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 z-40 w-12 h-12 bg-rose-400/20 rounded-full blur-md animate-pulse pointer-events-none" />
              )}

              {/* Wax Seal / Heart Button */}
              <AnimatePresence>
                {envelopeState === 'sealed' && (
                  <motion.button
                    exit={{ scale: 0.4, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setEnvelopeState('open')}
                    className="absolute top-[80px] left-1/2 -translate-x-1/2 z-40 w-12 h-12 bg-[#c23d5a] hover:bg-[#a12e47] border border-[#a8324d] rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-300 focus:outline-none"
                    aria-label="Break wax seal and open envelope"
                  >
                    <svg className="w-5 h-5 text-[#fcebed] fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Pull Card Button (Displays after flap opens) */}
              {envelopeState === 'open' && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setEnvelopeState('revealed')}
                  className="absolute top-[120px] left-1/2 -translate-x-1/2 z-40 font-lato text-[10px] tracking-[3px] uppercase px-5 py-3 bg-[#be123c] text-white hover:bg-rose-700 rounded-full shadow-md active:scale-95 transition-all duration-300 focus:outline-none"
                >
                  ♡ Open Card
                </motion.button>
              )}
            </motion.div>
          )}

          {/* STAGE 3: The Unfolded Letter / Candle Blowing Cake */}
          {envelopeState === 'revealed' && (
            <motion.div
              key="letter-revealed"
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="relative max-w-xl w-full bg-white/95 border border-pink-200 rounded-3xl p-8 md:p-12 shadow-xl backdrop-blur-md mt-4 select-none overflow-hidden"
            >
              {/* Cardstock border details */}
              <div className="absolute inset-4 border border-rose-100/40 rounded-2xl pointer-events-none" />

              {/* Retrigger Confetti Button (Celebration state) */}
              {allBlownOut && (
                <button 
                  onClick={triggerConfetti} 
                  className="absolute top-6 right-6 text-[#c23d5a] hover:text-[#9e2d44] p-2 rounded-full hover:bg-rose-50/50 transition-colors focus:outline-none z-20"
                  aria-label="Trigger confetti burst"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1.81-5.096L2.094 14.09 7.2 13.28l1.81-5.097 1.81 5.097 5.096.81-5.096 1.81zM18.813 5.904L18 11l-1.81-5.096L11.094 4.09 16.2 3.28l1.81-5.097 1.81 5.097 5.096.81-5.096 1.81z" />
                  </svg>
                </button>
              )}

              {/* Rendering Smoke Puffs */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                {puffs.map((puff) => (
                  <motion.div
                    key={puff.id}
                    initial={{ x: puff.x, y: puff.y, opacity: puff.opacity, scale: 0.2 }}
                    animate={{ 
                      x: puff.x + puff.vx, 
                      y: puff.y + puff.vy, 
                      opacity: 0,
                      scale: [0.2, 1.8, 2.5]
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute bg-neutral-400 rounded-full blur-[3px]"
                    style={{ width: puff.size, height: puff.size }}
                  />
                ))}
              </div>

              {/* Interactive Birthday Cake */}
              <div className="relative flex justify-center mb-6 h-36 select-none z-0">
                <svg className="w-40 h-full text-rose-medium fill-none stroke-current" viewBox="0 0 200 160" strokeWidth="1.2">
                  {/* Plate */}
                  <ellipse cx="100" cy="140" rx="75" ry="12" strokeWidth="1" />
                  
                  {/* Bottom Tier */}
                  <path d="M40 100 C 40 115, 160 115, 160 100 L 160 135 C 160 145, 40 145, 40 135 Z" fill="#fff9fb" />
                  <path d="M40 100 C 40 110, 160 110, 160 100" />
                  <path d="M40 115 C 40 125, 160 125, 160 115" strokeDasharray="3,3" />

                  {/* Top Tier */}
                  <path d="M60 65 C 60 78, 140 78, 140 65 L 140 98 C 140 108, 60 108, 60 98 Z" fill="#fffcfd" />
                  <path d="M60 65 C 60 73, 140 73, 140 65" />
                  
                  {/* Drips details */}
                  <path d="M60 65 C 65 72, 70 70, 75 65 C 80 75, 88 72, 95 65 C 102 70, 108 72, 115 65 C 122 75, 128 70, 133 65 C 137 72, 140 68, 140 65" stroke="#f472b6" fill="#f472b6" />

                  {/* Candles Cylinders */}
                  {/* Left Candle */}
                  <rect x="75" y="38" width="8" height="27" rx="2" fill="#fda4af" stroke="currentColor" strokeWidth="1" />
                  <path d="M79 38V34" stroke="currentColor" />

                  {/* Middle Candle */}
                  <rect x="96" y="32" width="8" height="33" rx="2" fill="#93c5fd" stroke="currentColor" strokeWidth="1" />
                  <path d="M100 32V28" stroke="currentColor" />

                  {/* Right Candle */}
                  <rect x="117" y="38" width="8" height="27" rx="2" fill="#fda4af" stroke="currentColor" strokeWidth="1" />
                  <path d="M121 38V34" stroke="currentColor" />
                </svg>

                {/* Left Flame */}
                {candles[0] && (
                  <div 
                    onClick={(e) => handleBlowCandle(0, e)}
                    className="absolute left-[70px] top-[14px] z-10 cursor-pointer"
                  >
                    <FlickeringFlame />
                  </div>
                )}

                {/* Middle Flame */}
                {candles[1] && (
                  <div 
                    onClick={(e) => handleBlowCandle(1, e)}
                    className="absolute left-[91px] top-[4px] z-10 cursor-pointer"
                  >
                    <FlickeringFlame />
                  </div>
                )}

                {/* Right Flame */}
                {candles[2] && (
                  <div 
                    onClick={(e) => handleBlowCandle(2, e)}
                    className="absolute left-[112px] top-[14px] z-10 cursor-pointer"
                  >
                    <FlickeringFlame />
                  </div>
                )}
              </div>

              {/* Interactive prompts / Typewriter Letter reveal */}
              <div className="z-10 relative">
                {!allBlownOut ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <h3 className="font-cormorant italic text-[24px] font-semibold text-rose-deep mb-2">
                      Make a Wish...
                    </h3>
                    <p className="font-lato text-[10px] tracking-[3px] uppercase text-rose-soft animate-pulse">
                      🕯️ Blow out each candle 🕯️
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                  >
                    <h3 className="font-cormorant italic text-[26px] md:text-[30px] font-bold text-rose-deep mb-4">
                      Happy Birthday, My Love!
                    </h3>
                    <p className="font-cormorant italic text-[18px] md:text-[20px] text-rose-dark-accent leading-[2.1] mb-8 px-2">
                      <Typewriter 
                        text='"May your day be filled with as much light, joy, and laughter as you bring into my life every single day. You deserve the entire universe and more. Wishing you the happiest and most magical year ahead. I love you, always."'
                        delay={0.035}
                      />
                    </p>

                    {/* Stage 3 Controls */}
                    <div className="flex justify-center gap-4 mt-6">
                      <button
                        onClick={triggerConfetti}
                        className="font-lato text-[10px] tracking-[2px] uppercase px-5 py-3.5 border border-rose-border/80 text-rose-soft hover:text-rose-deep hover:bg-rose-50/60 rounded-full transition-colors duration-300 focus:outline-none"
                      >
                        🎉 Celebration
                      </button>
                      <button
                        onClick={handleReset}
                        className="font-lato text-[10px] tracking-[2px] uppercase px-5 py-3.5 bg-rose-medium text-white hover:bg-rose-deep rounded-full shadow-sm hover:shadow transition-all duration-300 focus:outline-none"
                      >
                        ♡ Reset Card
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}
