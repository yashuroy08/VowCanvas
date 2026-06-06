import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';
import MagneticButton from '../components/MagneticButton';
import useDataStore from '../store/useDataStore';

// State-based Typewriter: reveals one character at a time via interval
function Typewriter({ text, speed = 30, onComplete }) {
  const [displayedCount, setDisplayedCount] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    setDisplayedCount(0);
    completedRef.current = false;
  }, [text]);

  useEffect(() => {
    if (displayedCount >= text.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        if (onComplete) onComplete();
      }
      return;
    }
    const timer = setTimeout(() => {
      setDisplayedCount(prev => prev + 1);
    }, speed);
    return () => clearTimeout(timer);
  }, [displayedCount, text.length, speed, onComplete]);

  return (
    <span className="inline">
      {text.slice(0, displayedCount)}
      {displayedCount < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-[2px] h-[1em] bg-rose-deep/70 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

// Flickering Candle Flame SVG — with large invisible hover hitbox for "blow" gesture
const FlickeringFlame = ({ x, y, duration = 0.8, onBlow }) => (
  <motion.g
    style={{ transformOrigin: `${x}px ${y}px`, cursor: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fbbf24\' stroke-width=\'1.5\'><path d=\'M12 2C8 7 4 10 4 14a8 8 0 0016 0c0-4-4-7-8-12z\'/><path d=\'M12 22v-2\'/><path d=\'M8 18c0-2.2 1.8-4 4-4s4 1.8 4 4\'/></svg>") 16 16, pointer' }}
    animate={{
      scaleY: [1, 1.25, 0.9, 1.15, 1],
      scaleX: [1, 0.85, 1.1, 0.9, 1],
      rotate: [-3, 3, -1, 2, 0]
    }}
    transition={{
      repeat: Infinity,
      duration: duration,
      ease: "easeInOut"
    }}
    className="text-amber-500 fill-current filter drop-shadow-[0_-2px_6px_rgba(245,158,11,0.85)]"
  >
    {/* Large invisible hover zone (24x24 centered above wick) for easy blow */}
    <rect
      x={x - 12} y={y - 22} width={24} height={24}
      fill="transparent"
      onMouseEnter={onBlow}
      onClick={onBlow}
    />
    {/* Visible flame */}
    <path 
      d="M50 0 C70 50 80 80 80 110 A30 30 0 0 1 20 110 C20 80 30 50 50 0 Z" 
      transform={`translate(${x - 6}, ${y - 13.2}) scale(0.12)`}
    />
  </motion.g>
);

const BIRTHDAY_WISHES = [
  "Happy Birthday! 🎉",
  "You are my universe ✨",
  "Make a wish! 🎂",
  "I love you! 💖",
  "Forever yours 🌹",
  "My favorite person 💑",
  "Wishing you joy 🌟",
  "My heart belongs to you 💕",
  "Happy Birthday, Love! 🎈"
];

export default function SurpriseSection({ isBlackout, setIsBlackout, onReset, onComplete }) {
  const surprise = useDataStore((state) => state.data.surprise);
  const [envelopeState, setEnvelopeState] = useState('sealed'); // 'sealed', 'open', 'revealed'
  const [candles, setCandles] = useState([true, true, true]); // 3 lit candles
  const [puffs, setPuffs] = useState([]); // Smoke particles
  const [confetti, setConfetti] = useState([]);
  const [allBlownOut, setAllBlownOut] = useState(false);
  const [messageRead, setMessageRead] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState([]);

  const spawnFloatingText = () => {
    const content = BIRTHDAY_WISHES[Math.floor(Math.random() * BIRTHDAY_WISHES.length)];
    const x = Math.random() * 70 + 15; // 15vw to 85vw
    const y = Math.random() * 50 + 20; // 20vh to 70vh
    const scale = Math.random() * 0.3 + 0.95;
    const rotate = Math.random() * 20 - 10;
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    
    setFloatingTexts(prev => [...prev, { id, content, x, y, scale, rotate }]);
    
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

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

  const cakeContainerRef = useRef(null);

  // Hover-to-blow handler — candles extinguish when you "breathe" over them
  const handleBlowCandle = useCallback((index, e) => {
    if (!candles[index]) return;
    
    // Extinguish candle
    const nextCandles = [...candles];
    nextCandles[index] = false;
    setCandles(nextCandles);

    // Compute smoke puff relative location
    const scale = 160 / 200;
    let localX = 100;
    let localY = 28;
    if (index === 0) { localX = 79; localY = 34; }
    else if (index === 2) { localX = 121; localY = 34; }

    // Try to get SVG element from the event target's parent chain
    let svgEl = null;
    if (e && e.currentTarget) {
      svgEl = e.currentTarget.ownerSVGElement || e.currentTarget.closest('svg');
    }
    if (!svgEl && cakeContainerRef.current) {
      svgEl = cakeContainerRef.current.querySelector('svg');
    }

    if (svgEl) {
      const svgRect = svgEl.getBoundingClientRect();
      const parentEl = svgEl.parentElement;
      const parentRect = parentEl.getBoundingClientRect();
      const svgLeft = svgRect.left - parentRect.left;
      const svgTop = svgRect.top - parentRect.top;
      
      const xPos = svgLeft + localX * scale;
      const yPos = svgTop + localY * scale;

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
    }

    // Check if all candles are blown out
    if (nextCandles.every(c => !c)) {
      setAllBlownOut(true);
      triggerConfetti();
      
      // Lower the music volume smoothly
      window.dispatchEvent(new CustomEvent('lower-love-song'));

      // Spawn initial batch of birthday text bubbles
      for (let i = 0; i < 6; i++) {
        setTimeout(() => spawnFloatingText(), i * 350);
      }
      if (onComplete) {
        onComplete();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles]);

  useEffect(() => {
    if (!allBlownOut) return;
    const interval = setInterval(() => {
      spawnFloatingText();
    }, 1500);
    return () => clearInterval(interval);
  }, [allBlownOut]);

  // Reset surprise state
  const handleReset = () => {
    setEnvelopeState('sealed');
    setCandles([true, true, true]);
    setConfetti([]);
    setAllBlownOut(false);
    setMessageRead(false);
    setFloatingTexts([]);
    if (setIsBlackout) {
      setIsBlackout(false);
    }
    if (onReset) {
      onReset();
    }
  };

  return (
    <section 
      id="surprise" 
      className={
        isBlackout 
          ? "fixed inset-0 z-50 bg-[#070104] flex flex-col items-center justify-center p-6 overflow-y-auto select-none transition-all duration-[1000ms]" 
          : "py-10 md:py-24 max-w-4xl mx-auto px-4 md:px-6 relative text-center w-full"
      }
    >
      <SectionDivider label="Surprise" />

      {/* Fullscreen isolated ambient space starry background */}
      {isBlackout && (
        <div className="fixed inset-0 bg-[#070104] z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,26,58,0.18)_0%,transparent_80%)]" />
          
          {/* Starry particles */}
          {Array.from({ length: 22 }).map((_, i) => {
            const size = Math.random() * 3.5 + 1.2;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-rose-light-accent/80"
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  opacity: [0.1, 0.9, 0.1],
                  scale: [0.7, 1.3, 0.7],
                  y: [0, -35, 0]
                }}
                transition={{
                  duration: Math.random() * 4 + 4,
                  delay: Math.random() * 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>
      )}

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

      <div className={`text-center mb-8 md:mb-12 select-none ${isBlackout ? 'text-white' : ''}`}>
        <h2 className={`font-cormorant text-[clamp(24px,4.5vw,44px)] font-light leading-tight ${isBlackout ? 'text-rose-light-accent' : 'text-rose-deep'}`}>
          A surprise for you
        </h2>
        <p className={`font-cormorant italic text-[15px] md:text-[18px] lg:text-[20px] mt-3 md:mt-4 ${isBlackout ? 'text-rose-soft' : 'text-rose-medium'}`}>
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
              className="relative w-[90vw] max-w-[340px] h-[220px] select-none"
            >
              {/* Back side of Envelope Pocket */}
              <div className="absolute inset-0 bg-rose-light-accent/65 border border-rose-border/50 rounded-2xl shadow-xl z-0 transition-colors duration-500" />

              {/* Letter Card (Inside Envelope - slides up in state 'open') */}
              <motion.div
                animate={envelopeState === 'open' ? { y: -80, scale: 0.95 } : { y: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-6 top-4 bottom-4 bg-rose-blush rounded-xl shadow-inner border border-rose-border/30 p-4 flex flex-col items-center justify-center z-10 transition-colors duration-500"
              >
                <div className="w-12 h-0.5 bg-rose-border/40 rounded mb-2" />
                <div className="w-16 h-0.5 bg-rose-border/20 rounded" />
              </motion.div>

              {/* Front flap of Envelope Pocket */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-rose-light-accent/80 via-rose-light-accent/40 to-transparent border-t border-rose-border/30 rounded-2xl z-20 pointer-events-none transition-colors duration-500"
                style={{
                  clipPath: 'polygon(0% 45%, 50% 100%, 100% 45%, 100% 100%, 0% 100%)'
                }}
              />

              {/* Left and Right overlapping fold shadows */}
              <div 
                className="absolute inset-0 bg-rose-light-accent/40 rounded-2xl z-20 pointer-events-none transition-colors duration-500"
                style={{
                  clipPath: 'polygon(0% 45%, 0% 100%, 50% 100%)'
                }}
              />
              <div 
                className="absolute inset-0 bg-rose-light-accent/50 rounded-2xl z-20 pointer-events-none transition-colors duration-500"
                style={{
                  clipPath: 'polygon(100% 45%, 50% 100%, 100% 100%)'
                }}
              />

              {/* Top Folding Flap */}
              <motion.div
                animate={envelopeState === 'open' ? { rotateX: 180, y: -1 } : { rotateX: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                originY={0}
                style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
                className="absolute inset-x-0 top-0 h-[100px] bg-rose-light-accent/85 border-x border-rose-border/40 rounded-b-2xl shadow-sm z-30 transition-colors duration-500"
              >
                {/* Visual triangle fold shape */}
                <div 
                  className="w-full h-full bg-rose-light-accent/90 border-b border-rose-border/30 rounded-b-2xl"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)'
                  }}
                />
              </motion.div>

              {/* Pulse Glow under Wax Seal */}
              {envelopeState === 'sealed' && (
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 z-40 w-12 h-12 bg-rose-medium/20 rounded-full blur-md animate-pulse pointer-events-none" />
              )}

              {/* Wax Seal / Heart Button */}
              <AnimatePresence>
                {envelopeState === 'sealed' && (
                  <MagneticButton className="absolute top-[80px] left-1/2 -translate-x-1/2 z-40">
                    <motion.button
                      exit={{ scale: 0.4, opacity: 0, rotate: 45 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => setEnvelopeState('open')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 bg-rose-medium hover:bg-rose-deep border border-rose-border rounded-full flex items-center justify-center shadow-lg focus:outline-none cursor-pointer"
                      aria-label="Break wax seal and open envelope"
                    >
                      <svg className="w-5 h-5 text-rose-light-accent fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </motion.button>
                  </MagneticButton>
                )}
              </AnimatePresence>

              {/* Pull Card Button (Displays after flap opens) */}
              {envelopeState === 'open' && (
                <MagneticButton className="absolute top-[120px] left-1/2 -translate-x-1/2 z-40">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEnvelopeState('revealed');
                      if (setIsBlackout) setIsBlackout(true);
                      // Start music at moderate volume when card is opened
                      window.dispatchEvent(new CustomEvent('play-love-song-soft'));
                    }}
                    className="font-lato text-[10px] tracking-[3px] uppercase px-5 py-3.5 bg-rose-medium text-rose-light-accent hover:bg-rose-deep rounded-full shadow-md focus:outline-none cursor-pointer"
                  >
                    ♡ Open Card
                  </motion.button>
                </MagneticButton>
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
              className="relative max-w-xl w-full bg-rose-blush/95 border border-rose-border/60 rounded-3xl p-5 md:p-12 shadow-xl backdrop-blur-md mt-4 select-none overflow-hidden transition-colors duration-500"
            >
              {/* Cardstock border details */}
              <div className="absolute inset-4 border border-rose-border/25 rounded-2xl pointer-events-none" />

              {/* Persistent Back Button — always visible in the cake section */}
              <MagneticButton className="absolute top-5 left-5 z-30">
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={handleReset}
                  className="flex items-center gap-1.5 font-lato text-[10px] tracking-[2px] uppercase text-rose-soft/70 hover:text-rose-deep transition-colors duration-300 focus:outline-none cursor-pointer group"
                  aria-label="Back to previous section"
                >
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </motion.button>
              </MagneticButton>

              {/* Retrigger Confetti Button (Celebration state) */}
              {allBlownOut && (
                <button 
                  onClick={triggerConfetti} 
                  className="absolute top-6 right-6 text-rose-medium hover:text-rose-deep p-2 rounded-full hover:bg-rose-border/20 transition-colors focus:outline-none z-20 cursor-pointer"
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
              <div ref={cakeContainerRef} className="relative flex justify-center mb-6 h-36 select-none z-0">
                <svg className="w-40 h-full text-rose-medium fill-none stroke-current" viewBox="0 0 200 160" strokeWidth="1.2">
                  {/* Plate */}
                  <ellipse cx="100" cy="140" rx="75" ry="12" strokeWidth="1" />
                  
                  {/* Bottom Tier */}
                  <path d="M40 100 C 40 115, 160 115, 160 100 L 160 135 C 160 145, 40 145, 40 135 Z" fill="var(--rose-light-accent)" fillOpacity="0.4" />
                  <path d="M40 100 C 40 110, 160 110, 160 100" />
                  <path d="M40 115 C 40 125, 160 125, 160 115" strokeDasharray="3,3" />

                  {/* Top Tier */}
                  <path d="M60 65 C 60 78, 140 78, 140 65 L 140 98 C 140 108, 60 108, 60 98 Z" fill="var(--rose-gradient-start)" fillOpacity="0.6" />
                  <path d="M60 65 C 60 73, 140 73, 140 65" />
                  
                  {/* Drips details */}
                  <path d="M60 65 C 65 72, 70 70, 75 65 C 80 75, 88 72, 95 65 C 102 70, 108 72, 115 65 C 122 75, 128 70, 133 65 C 137 72, 140 68, 140 65" stroke="var(--rose-medium)" fill="var(--rose-medium)" />

                  {/* Candles Cylinders */}
                  {/* Left Candle */}
                  <rect x="75" y="38" width="8" height="27" rx="2" fill="var(--rose-medium-accent)" stroke="currentColor" strokeWidth="1" />
                  <path d="M79 38V34" stroke="currentColor" />

                  {/* Middle Candle */}
                  <rect x="96" y="32" width="8" height="33" rx="2" fill="var(--rose-soft)" stroke="currentColor" strokeWidth="1" />
                  <path d="M100 32V28" stroke="currentColor" />

                  {/* Right Candle */}
                  <rect x="117" y="38" width="8" height="27" rx="2" fill="var(--rose-medium-accent)" stroke="currentColor" strokeWidth="1" />
                  <path d="M121 38V34" stroke="currentColor" />

                  {/* Left Flame — hover to blow */}
                  {candles[0] && (
                    <FlickeringFlame x={79} y={34} duration={0.65} onBlow={(e) => handleBlowCandle(0, e)} />
                  )}

                  {/* Middle Flame — hover to blow */}
                  {candles[1] && (
                    <FlickeringFlame x={100} y={28} duration={0.85} onBlow={(e) => handleBlowCandle(1, e)} />
                  )}

                  {/* Right Flame — hover to blow */}
                  {candles[2] && (
                    <FlickeringFlame x={121} y={34} duration={0.7} onBlow={(e) => handleBlowCandle(2, e)} />
                  )}
                </svg>
              </div>

              {/* Interactive prompts / Typewriter Letter reveal */}
              <div className="z-10 relative">
                {!allBlownOut ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center"
                  >
                    <h3 className="font-cormorant italic text-[24px] font-semibold text-rose-deep mb-2">
                      Make a Wish...
                    </h3>
                    <p className="font-lato text-[10px] tracking-[3px] uppercase text-rose-soft animate-pulse">
                      💨 Hover over the flames to blow them out
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                  >
                    <h3 className="font-cormorant italic text-[20px] md:text-[30px] font-bold text-rose-deep mb-4">
                      Happy Birthday, My Love!
                    </h3>
                    <p className="font-cormorant italic text-[15px] md:text-[18px] lg:text-[20px] text-rose-dark-accent leading-[1.8] md:leading-[2.1] mb-8 px-2 min-h-[120px]">
                      <Typewriter 
                        text={surprise.message}
                        speed={35}
                        onComplete={() => setMessageRead(true)}
                      />
                    </p>

                    {/* Stage 3 Controls (appears only after blowing and reading the message) */}
                    {messageRead && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-wrap justify-center gap-4 mt-6"
                      >
                        <MagneticButton>
                          <button
                            onClick={handleReset}
                            className="font-lato text-[10px] tracking-[2px] uppercase px-5 py-3.5 text-rose-soft hover:text-rose-deep rounded-full transition-colors duration-300 focus:outline-none cursor-pointer"
                          >
                            ♡ Reset Card
                          </button>
                        </MagneticButton>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Floating Birthday Wish Bubbles */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
        <AnimatePresence>
          {floatingTexts.map((txt) => (
            <motion.div
              key={txt.id}
              initial={{ scale: 0, opacity: 0, x: `${txt.x}vw`, y: `${txt.y}vh`, rotate: txt.rotate }}
              animate={{ 
                scale: [0, 1.2, 1], 
                opacity: [0, 1, 1, 0],
                y: `${txt.y - 18}vh` // drift upwards
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 4, ease: "easeOut" }}
              className="absolute px-4 py-2.5 rounded-2xl bg-rose-blush/90 backdrop-blur-md border border-rose-border text-rose-deep font-cormorant italic text-sm md:text-md shadow-lg flex items-center justify-center whitespace-nowrap"
            >
              {txt.content}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
