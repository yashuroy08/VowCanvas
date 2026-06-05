import React, { useEffect, useState } from 'react';

const PETAL_COLORS = ['#ffb3c6', '#ff85a1', '#ff4d79', '#ffd6e0', '#ff8fa3'];

export default function PetalRain() {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const generatedPetals = Array.from({ length: 35 }).map((_, index) => {
      const size = Math.random() * (26 - 8) + 8; // Size between 8px and 26px
      const left = Math.random() * 100; // Position between 0% and 100% vw
      const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      const duration = Math.random() * (18 - 7) + 7; // Duration between 7s and 18s
      const delay = Math.random() * 12; // Delay up to 12s
      
      return {
        id: index,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}vw`,
          backgroundColor: color,
          '--duration': `${duration}s`,
          animationDelay: `${delay}s`,
          borderRadius: '150% 0 150% 0',
        }
      };
    });
    setPetals(generatedPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal absolute top-[-60px] animate-fall opacity-0"
          style={petal.style}
        />
      ))}
    </div>
  );
}
