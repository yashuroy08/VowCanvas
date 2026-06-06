/* eslint-disable react-hooks/purity */
import { useMemo } from 'react';
import useDataStore from '../store/useDataStore';

const PETAL_COLORS = [
  'var(--rose-soft)',
  'var(--rose-medium)',
  'var(--rose-deep)',
  'var(--rose-medium-accent)',
  'var(--rose-light-accent)',
];

const RoseBlossom = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Outer petals */}
    <path d="M50 5 C62 5, 85 15, 85 45 C85 70, 68 85, 50 85 C32 85, 15 70, 15 45 C15 15, 38 5, 50 5 Z" fill="currentColor" fillOpacity="0.75" />
    {/* Mid petals */}
    <path d="M50 18 C58 18, 76 25, 76 46 C76 64, 62 76, 50 76 C38 76, 24 64, 24 46 C24 25, 42 18, 50 18 Z" fill="currentColor" fillOpacity="0.9" />
    {/* Outline details */}
    <path d="M35 35 C22 42, 22 62, 38 72 C50 80, 62 72, 65 72 M65 35 C78 42, 78 62, 62 72" stroke="var(--rose-border)" strokeWidth="2.5" strokeOpacity="0.6" strokeLinecap="round" />
    {/* Center Swirl */}
    <path d="M50 32 C58 32, 64 38, 64 48 C64 56, 56 62, 50 62 C44 62, 36 56, 36 48 C36 38, 42 32, 50 32 Z" fill="currentColor" />
    <path d="M50 38 C54 38, 58 41, 58 46 C58 50, 54 54, 50 54 C46 54, 42 50, 42 46 C42 41, 46 38, 50 38 Z" fill="var(--rose-light-accent)" />
    <path d="M47 43 C49 41, 52 41, 53 43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const RosePetal = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M50 15 C75 5, 95 30, 85 60 C75 80, 55 90, 50 90 C45 90, 25 80, 15 60 C5 30, 25 5, 50 15 Z" fill="currentColor" />
    <path d="M50 25 C65 20, 80 40, 75 58 C70 70, 55 78, 50 78" stroke="var(--rose-light-accent)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 4" opacity="0.6" />
  </svg>
);

const RoseBud = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Calyx & Stem */}
    <path d="M42 65 C45 68, 55 68, 58 65 C58 75, 42 75, 42 65 Z" fill="#22c55e" fillOpacity="0.85" />
    <path d="M50 68 L50 90" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" strokeOpacity="0.85" />
    {/* Rose bud body */}
    <path d="M35 35 C35 15, 50 10, 50 10 C50 10, 65 15, 65 35 C65 55, 58 65, 50 65 C42 65, 35 55, 35 35 Z" fill="currentColor" fillOpacity="0.85" />
    <path d="M40 38 C40 25, 48 20, 50 20 C52 20, 60 25, 60 38 C60 50, 55 58, 50 58 C45 58, 40 50, 40 38 Z" fill="currentColor" />
    <path d="M35 35 C42 45, 58 45, 65 35" stroke="var(--rose-border)" strokeWidth="2.5" strokeOpacity="0.75" />
  </svg>
);

export default function PetalRain() {
  const { isPlaying, volume } = useDataStore(state => state.audioState);

  const petals = useMemo(() => {
    return Array.from({ length: 35 }).map((_, index) => {
      const typeRand = Math.random();
      const type = typeRand < 0.22 ? 'blossom' : typeRand < 0.44 ? 'bud' : 'petal';
      const size = Math.random() * (32 - 12) + 12; // Size between 12px and 32px
      const left = Math.random() * 100; // Position between 0% and 100% vw
      const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      const duration = Math.random() * (22 - 9) + 9; // Duration between 9s and 22s
      const delay = Math.random() * 15; // Delay up to 15s
      const swayDistance = (Math.random() * 80 - 40); // Sway between -40px and +40px
      const swayRotation = (Math.random() * 360 + 180) * (Math.random() < 0.5 ? 1 : -1); // Rotate 180 to 540 degrees
      
      // Cinematic depth-of-field blur: small background petals and large foreground petals are blurred.
      const blur = size < 16 ? '1.5px' : size > 26 ? '0.8px' : '0px';
      // 3D shadow on larger petals
      const shadow = size > 22 ? '0 4px 10px rgba(0, 0, 0, 0.08)' : 'none';

      return {
        id: index,
        type,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}vw`,
          color: color,
          '--duration': `${duration}s`,
          animationDelay: `${delay}s`,
          '--sway-distance': `${swayDistance}px`,
          '--sway-rotation': `${swayRotation}deg`,
          filter: `blur(${blur})`,
          boxShadow: shadow,
          transform: `rotate(${Math.random() * 360}deg)`
        }
      };
    });
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className={`petal absolute top-[-60px] opacity-0 transition-all duration-700 ${
            isPlaying ? 'animate-fall-sway scale-[1.05]' : 'animate-fall-sway scale-100'
          }`}
          style={{
            ...petal.style,
            transform: `${petal.style.transform} ${isPlaying ? `scale(${1 + volume * 0.2})` : 'scale(1)'}`
          }}
        >
          {petal.type === 'blossom' && <RoseBlossom />}
          {petal.type === 'bud' && <RoseBud />}
          {petal.type === 'petal' && <RosePetal />}
        </div>
      ))}
    </div>
  );
}
