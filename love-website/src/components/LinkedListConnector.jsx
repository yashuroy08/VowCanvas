import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function LinkedListConnector({ 
  toNode, 
  isUnlocked, 
  isAnimating, 
  onTransitionComplete 
}) {
  const pathD = "M 48 0 C 24 40, 72 120, 48 160";

  useEffect(() => {
    if (isAnimating) {
      // Trigger the completion callback after the path finishes drawing (1.2 seconds)
      const timer = setTimeout(() => {
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, onTransitionComplete]);

  // Display label descriptions for target sections
  const targetLabels = {
    1: "Why I Love You",
    2: "My Heart's Letter",
    3: "Our Shared Memories",
    4: "What I Promise You",
    5: "Your Special Surprise",
    6: "Infinite Love"
  };

  return (
    <div className="relative w-full flex flex-col items-center py-4 select-none h-48">
      {/* Connector Label */}
      <div className="absolute top-2 text-[10px] tracking-[4px] uppercase text-rose-soft/60 font-lato">
        {isAnimating ? "Connecting..." : isUnlocked ? "Connected" : "Locked"}
      </div>

      <div className="relative w-24 h-40 mt-6 flex justify-center">
        {/* SVG Wrapper */}
        <svg width="96" height="160" viewBox="0 0 96 160" className="absolute top-0 overflow-visible">
          {/* Base locked track */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--rose-border)"
            strokeWidth="1.5"
            strokeOpacity="0.35"
            strokeDasharray="4 4"
          />

          {/* Active drawing track */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="var(--rose-medium)"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isAnimating || isUnlocked ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(244,63,94,0.4))'
            }}
          />
        </svg>

        {/* Floating Heart Travel Agent */}
        <motion.div
          style={{
            offsetPath: `path('${pathD}')`,
            offsetRotate: "auto",
            transformOrigin: "center",
            x: "-50%",
            y: "-50%"
          }}
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: isAnimating || isUnlocked ? "100%" : "0%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-7 h-7 flex items-center justify-center text-rose-medium filter drop-shadow-[0_2px_6px_rgba(244,63,94,0.55)]"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>

        {/* Pulse wave ring when drawing */}
        {isAnimating && (
          <div 
            className="absolute top-0 w-8 h-8 rounded-full border border-rose-medium/40 animate-ping pointer-events-none"
            style={{
              offsetPath: `path('${pathD}')`,
              offsetDistance: "100%",
              x: "-50%",
              y: "-50%"
            }}
          />
        )}
      </div>

      {/* Target Node Bullet/Number Indicator */}
      <div className="absolute bottom-[-16px] z-20 flex flex-col items-center">
        <motion.div
          animate={isUnlocked ? { scale: [1, 1.15, 1], borderColor: "var(--rose-medium)" } : {}}
          transition={{ duration: 0.5 }}
          className={`w-9 h-9 rounded-full border flex items-center justify-center font-cormorant text-xs transition-colors duration-500 shadow-sm ${
            isUnlocked 
              ? 'bg-rose-blush border-rose-medium text-rose-deep font-bold' 
              : 'bg-rose-blush border-rose-border/40 text-rose-soft/60'
          }`}
        >
          {toNode === 6 ? "∞" : String(toNode + 1).padStart(2, '0')}
        </motion.div>
        
        {/* Hover Label for locked items */}
        <span className="text-[9px] tracking-widest text-rose-soft/80 mt-1.5 font-lato">
          {targetLabels[toNode] || ""}
        </span>
      </div>
    </div>
  );
}
