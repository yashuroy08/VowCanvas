import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';
import MagneticButton from '../components/MagneticButton';
import useDataStore from '../store/useDataStore';
import CircularGallery from '../components/CircularGallery';
import CylinderGallery from '../components/CylinderGallery';
import BentoGallery from '../components/BentoGallery';

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
      className="min-h-screen w-full flex flex-col justify-between py-12 overflow-hidden select-none relative bg-transparent scroll-mt-16"
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
            {gridStyle === 'cylinder' && "Scroll up and down to rotate the cylinder wheel of our moments."}
            {gridStyle === 'bento' && "Tap any grid item below to expand and view the full details."}
          </p>
        </div>
      </div>

      {/* Dynamic Gallery Viewport Selection */}
      <div className="flex-grow w-full z-10 mt-8 mb-6">
        {gridStyle === 'circular' && (
          <div className="h-[350px] sm:h-[450px] md:h-[550px] w-full relative overflow-hidden">
            <CircularGallery 
              items={galleryItems}
              bend={3}
              textColor={textColor}
              borderRadius={0.05}
              scrollEase={0.03}
              scrollSpeed={2.2}
              font="bold 28px Outfit"
              fontUrl="https://fonts.googleapis.com/css2?family=Outfit:wght@700&display=swap"
            />
          </div>
        )}

        {gridStyle === 'cylinder' && (
          <CylinderGallery 
            items={galleryItems} 
            theme={theme} 
          />
        )}

        {gridStyle === 'bento' && (
          <BentoGallery 
            items={galleryItems} 
            theme={theme} 
          />
        )}
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
