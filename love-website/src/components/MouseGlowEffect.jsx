import { useEffect, useState } from 'react';
import useDataStore from '../store/useDataStore';

export default function MouseGlowEffect() {
  const { isPlaying, volume } = useDataStore(state => state.audioState);
  const [position, setPosition] = useState({ x: -500, y: -500 });
  const [opacity, setOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for mobile/touch
    const isTouch = window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window;
    if (isTouch) {
      setIsMobile(true);
      return;
    }

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      className={`fixed pointer-events-none z-0 rounded-full w-[450px] h-[450px] blur-[80px] transition-opacity duration-700 ease-out ${
        isPlaying ? 'animate-pulse' : ''
      }`}
      style={{
        left: 0,
        top: 0,
        opacity: opacity * (isPlaying ? 0.6 : 0.45),
        transform: `translate3d(${position.x - 225}px, ${position.y - 225}px, 0) scale(${isPlaying ? 1 + volume * 0.2 : 1})`,
        background: 'radial-gradient(circle, rgba(255,182,193,0.3) 0%, rgba(255,228,230,0.15) 50%, transparent 80%)',
        willChange: 'transform, opacity',
      }}
    />
  );
}
