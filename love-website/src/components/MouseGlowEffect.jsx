import { useEffect, useState } from 'react';

export default function MouseGlowEffect() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-0 rounded-full w-[450px] h-[450px] blur-[80px] transition-opacity duration-700 ease-out"
      style={{
        left: position.x - 225,
        top: position.y - 225,
        opacity: opacity * 0.45,
        background: 'radial-gradient(circle, rgba(255,182,193,0.3) 0%, rgba(255,228,230,0.15) 50%, transparent 80%)',
        willChange: 'left, top, opacity',
      }}
    />
  );
}
