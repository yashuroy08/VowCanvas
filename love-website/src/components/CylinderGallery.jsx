import { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function CylinderGallery({ items, theme }) {
  const triggerRef = useRef(null);
  const wheelRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Mouse coordinates tracking for hover popup preview
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 18 });

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY + 20);
  };

  const N = Math.max(3, items.length);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 500;
  
  // Calculate smaller card sizes and radius on mobile viewports
  const cardWidth = isMobile ? 150 : 300;
  const cardHeight = isMobile ? 200 : 400;
  const radius = isMobile 
    ? Math.max(130, 80 / Math.sin(Math.PI / N))
    : Math.max(280, 160 / Math.sin(Math.PI / N));

  useGSAP(() => {
    if (!wheelRef.current || !triggerRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        pin: true,
        scrub: 1.2,
        start: "top top",
        end: "+=1200",
        invalidateOnRefresh: true,
      }
    });
    tl.to(wheelRef.current, {
      rotateY: -360,
      ease: "none"
    });
  }, { scope: triggerRef, dependencies: [items.length] });

  // Theme-specific glass styles
  const bgCard = theme === 'midnight' 
    ? 'bg-white/5 border-white/10' 
    : theme === 'lavender'
      ? 'bg-[#e8dbfc]/30 border-[#3e1b6f]/10'
      : theme === 'sunset'
        ? 'bg-[#fcede6]/40 border-[#7e2d14]/10'
        : 'bg-white/40 border-black/5';

  return (
    <div 
      ref={triggerRef} 
      onMouseMove={handleMouseMove}
      className="w-full flex items-center justify-center relative overflow-visible py-8 md:py-20 select-none scroll-mt-24"
    >
      <div className="perspective-[1000px] md:perspective-[1500px] w-full flex items-center justify-center overflow-visible">
        <div 
          ref={wheelRef} 
          className="relative"
          style={{ 
            width: `${cardWidth}px`, 
            height: `${cardHeight}px`, 
            transformStyle: 'preserve-3d', 
            willChange: 'transform' 
          }}
        >
          {items.map((item, index) => {
            const angle = index * (360 / items.length);
            const isFocused = hoveredIndex === index;
            const isDimmed = hoveredIndex !== null && !isFocused;

            return (
              <div 
                key={index} 
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`absolute inset-0 rounded-2xl overflow-hidden border backdrop-blur-sm shadow-lg ${bgCard}`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) ${isFocused ? 'scale(1.05)' : 'scale(1)'}`,
                  transformStyle: 'preserve-3d',
                  opacity: isDimmed ? 0.25 : 1,
                  filter: isDimmed ? 'blur(2px)' : 'none',
                  transition: 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1), filter 0.45s cubic-bezier(0.23, 1, 0.32, 1)',
                  cursor: 'pointer',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="absolute inset-0 overflow-hidden bg-black/5">
                  <img 
                    src={item.image} 
                    alt={item.text}
                    className="absolute inset-0 w-full h-full object-cover origin-center filter brightness-90 transition-all duration-700 pointer-events-none"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3.5 md:p-6">
                  <span className="font-sans text-[8px] md:text-[10px] font-semibold tracking-[4px] uppercase text-rose-300/80 mb-0.5 md:mb-1">
                    0{index + 1}
                  </span>
                  <h3 className="font-cormorant text-[14px] md:text-[22px] italic text-rose-100 leading-tight font-light">
                    {item.text}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popover */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="fixed pointer-events-none z-50 hidden md:block"
            style={{
              left: springX,
              top: springY,
              x: '-50%',
              y: '-115%'
            }}
          >
            <div className="w-[230px] bg-[#0c0507]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col items-center">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-neutral-900 border border-white/5">
                <img 
                  src={items[hoveredIndex].image} 
                  alt={items[hoveredIndex].text}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-cormorant italic text-[15px] text-rose-100 text-center leading-tight px-1">
                {items[hoveredIndex].text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
