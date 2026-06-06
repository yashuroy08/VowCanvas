import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Smooth springing cursor position
  const cursorX = useSpring(-100, { stiffness: 500, damping: 28, mass: 0.5 });
  const cursorY = useSpring(-100, { stiffness: 500, damping: 28, mass: 0.5 });
  
  // Slower trailing dot
  const trailingX = useSpring(-100, { stiffness: 150, damping: 20, mass: 0.8 });
  const trailingY = useSpring(-100, { stiffness: 150, damping: 20, mass: 0.8 });

  useEffect(() => {
    // Enable custom cursor styling in CSS
    document.documentElement.classList.add('custom-cursor-enabled');

    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      trailingX.set(e.clientX);
      trailingY.set(e.clientY);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleHoverStart = (e) => {
      const target = e.target.closest('a, button, input, textarea, select, [role="button"], label, .interactive');
      if (target) {
        setIsHovering(true);
      }
    };
    
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Use event delegation for hover states
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [cursorX, cursorY, trailingX, trailingY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main glass dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.8 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      </motion.div>

      {/* Trailing outline */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
        style={{
          x: trailingX,
          y: trailingY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 0.4
        }}
      >
        <div className="w-10 h-10 border border-white rounded-full" />
      </motion.div>
    </>
  );
}
