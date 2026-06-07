import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';
import MagneticButton from '../components/MagneticButton';
import useDataStore from '../store/useDataStore';
import MemoryVault from '../components/MemoryVault';
import BentoGallery from '../components/BentoGallery';
import CircularGallery from '../components/CircularGallery';
import CylinderGallery from '../components/CylinderGallery';
import DomeGallery from '../components/DomeGallery';

const THEME_TEXT_COLORS = {
  classic: '#8b1a3a',
  midnight: '#ffeef2',
  lavender: '#3e1b6f',
  sunset: '#7e2d14'
};

export default function MemoriesSection({ theme, onNext }) {
  const memories = useDataStore((state) => state.data.memories);
  const gridStyle = useDataStore((state) => state.data.gridStyle) || 'circular';

  const textColor = useMemo(() => {
    return THEME_TEXT_COLORS[theme] || THEME_TEXT_COLORS.classic;
  }, [theme]);

  // Ensure default items if none are uploaded
  const galleryItems = useMemo(() => {
    return memories.map(m => ({
      image: m.image || 'https://picsum.photos/seed/love/400/600',
      text: m.text || 'Memory'
    }));
  }, [memories]);

  return (
    <section 
      id="memories" 
      className={`min-h-screen w-full flex flex-col justify-between py-12 select-none relative bg-transparent scroll-mt-16 ${gridStyle !== 'circular' ? '' : 'overflow-hidden'}`}
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 w-full flex-shrink-0 z-10">
        <SectionDivider label="Our story" />
        
        <div className="text-center mt-8">
          <h2 className="font-cormorant text-[clamp(30px,4.5vw,48px)] font-light text-rose-deep leading-tight">
            Moments I hold close
          </h2>
          <p className="font-cormorant italic text-[17px] md:text-[19px] text-rose-medium mt-3">
            {gridStyle === 'circular' && "Swipe or scroll to browse the curved ribbon of our memories."}
            {gridStyle === 'bento' && "Tap any grid item below to expand and view the full details."}
            {gridStyle === 'marquee' && "A cinematic, endless scroll of our most cherished moments."}
            {gridStyle === 'dome' && "Drag to explore our memories in an immersive 3D space."}
          </p>
        </div>
      </div>

      {/* Dynamic Gallery Viewport Selection */}
      <div className="flex-grow w-full z-10 mt-8 mb-6 overflow-hidden">
        {gridStyle === 'circular' && (
          <CircularGallery 
            items={galleryItems} 
            bend={3}
            scrollEase={0.02}
            borderRadius={0.05}
          />
        )}
        {gridStyle === 'bento' && <BentoGallery items={galleryItems} theme={theme} />}
        {gridStyle === 'marquee' && <MemoryVault items={galleryItems} />}
        {gridStyle === 'dome' && <DomeGallery items={galleryItems} />}
        
        {/* Fallback/Legacy */}
        {!['circular', 'bento', 'marquee', 'dome'].includes(gridStyle) && <MemoryVault items={galleryItems} />}
      </div>

      {/* Next Chapter Button */}
      <div className="max-w-4xl mx-auto px-6 flex justify-center mt-6 mb-2 w-full flex-shrink-0 z-10">
        <MagneticButton>
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="flex items-center gap-2.5 font-lato text-[10px] tracking-[3px] uppercase px-7 py-4 bg-rose-medium hover:bg-rose-deep text-rose-light-accent rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none cursor-pointer"
          >
            <span>See my promises</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
            </svg>
          </motion.button>
        </MagneticButton>
      </div>
    </section>
  );
}
