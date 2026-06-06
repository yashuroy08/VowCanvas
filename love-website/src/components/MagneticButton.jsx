import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function MagneticButton({ children, className = '', range = 60, strength = 0.35, ...props }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const rect = el.getBoundingClientRect();
      
      // Calculate coordinates relative to the center of the element
      const x = clientX - (rect.left + rect.width / 2);
      const y = clientY - (rect.top + rect.height / 2);
      
      const distance = Math.hypot(x, y);

      if (distance < range) {
        // Magnetic pull toward mouse
        gsap.to(el, {
          x: x * strength,
          y: y * strength,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto"
        });
      } else {
        // Soft snapback physics
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1.1, 0.6)",
          overwrite: "auto"
        });
      }
    };

    const handleMouseLeave = () => {
      // Bouncy reset animation
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1.2, 0.5)",
        overwrite: "auto"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [range, strength]);

  return (
    <div 
      ref={buttonRef} 
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
