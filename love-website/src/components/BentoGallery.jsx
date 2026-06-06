import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BentoGallery({ items, theme }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const getGridClasses = (index) => {
    // Return custom grid spans for desktop based on item index to create asymmetric rhythm
    const pattern = [
      'md:col-span-2 md:row-span-2 h-[220px] md:h-[400px]', // Large Featured
      'md:col-span-1 md:row-span-1 h-[130px] md:h-[190px]',
      'md:col-span-1 md:row-span-1 h-[130px] md:h-[190px]',
      'md:col-span-1 md:row-span-2 h-[220px] md:h-[400px]', // Tall Portrait
      'md:col-span-2 md:row-span-1 h-[130px] md:h-[190px]', // Wide Landscape
      'md:col-span-1 md:row-span-1 h-[130px] md:h-[190px]',
    ];
    return pattern[index % pattern.length] || 'md:col-span-1 md:row-span-1 h-[130px] md:h-[190px]';
  };

  const bgCard = theme === 'midnight' 
    ? 'bg-white/5 border-white/10' 
    : theme === 'lavender'
      ? 'bg-[#e8dbfc]/30 border-[#3e1b6f]/10'
      : theme === 'sunset'
        ? 'bg-[#fcede6]/40 border-[#7e2d14]/10'
        : 'bg-white/40 border-black/5';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-auto">
        {items.map((item, index) => (
          <motion.div
            key={index}
            layoutId={`bento-card-${index}`}
            onClick={() => setSelectedImage({ ...item, index })}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`rounded-3xl overflow-hidden border backdrop-blur-sm cursor-pointer relative group flex flex-col justify-end shadow-md transition-all duration-300 hover:shadow-xl ${getGridClasses(index)} ${bgCard}`}
          >
            {/* Image */}
            <div className="absolute inset-0 overflow-hidden bg-black/5">
              <img
                src={item.image}
                alt={item.text}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 p-5 md:p-6 text-left">
              <span className="font-sans text-[9px] font-bold tracking-[3px] uppercase text-rose-300/80 mb-1 block">
                0{index + 1}
              </span>
              <h3 className="font-cormorant text-lg md:text-xl italic text-rose-100 leading-tight font-light">
                {item.text}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              layoutId={`bento-card-${selectedImage.index}`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-[#0a0206]/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Image Frame */}
              <div className="aspect-[4/3] w-full bg-neutral-900 border-b border-white/5 relative">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.text}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Caption details */}
              <div className="p-6 md:p-8 flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[4px] uppercase text-rose-500">
                  Memory 0{selectedImage.index + 1}
                </span>
                <p className="font-cormorant text-xl md:text-2xl text-white italic leading-relaxed">
                  "{selectedImage.text}"
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
