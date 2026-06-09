import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeartClickEffect() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      const id = Date.now() + Math.random();
      const size = Math.random() * (28 - 14) + 14; // 14px to 28px
      const rotate = Math.random() * 80 - 40; // -40 to 40 deg
      const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#fb7185'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const isTouch = window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window;
      
      const newHeart = {
        id,
        x: e.clientX,
        y: e.clientY,
        size,
        rotate,
        color,
        sway: Math.random() * 60 - 30,
        isTouch
      };

      setHearts((prev) => [...prev, newHeart].slice(-20)); // Limit to max 20 active hearts to save memory
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const removeHeart = (id) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.svg
            key={heart.id}
            initial={{ opacity: 1, scale: 0.3, x: heart.x - heart.size / 2, y: heart.y - heart.size / 2 }}
            animate={{ 
              opacity: [1, 0.9, 0],
              scale: [0.3, 1.2, 1.6], 
              y: heart.y - 150, // Float up
              x: heart.x - heart.size / 2 + heart.sway, // Sway left/right
              rotate: heart.rotate * 1.5
            }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => removeHeart(heart.id)}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: heart.size,
              height: heart.size,
              color: heart.color,
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 1.5,
              filter: heart.isTouch ? 'none' : 'drop-shadow(0 2px 8px rgba(244,63,94,0.3))'
            }}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  );
}
