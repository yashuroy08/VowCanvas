import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600',
    title: 'The First Date',
    desc: 'Under the warm city lights, laughing about everything and nothing.'
  },
  {
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600',
    title: 'A Walk in the Rain',
    desc: 'Sharing a single umbrella, not caring at all about the storm.'
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    title: 'Summer Sunsets',
    desc: 'Watching the sky paint itself in shades of gold and pink.'
  },
  {
    url: 'https://images.unsplash.com/photo-1501908731398-23592c872374?auto=format&fit=crop&q=80&w=600',
    title: 'Quiet Coffee Mornings',
    desc: 'The best conversations are the ones whispered over warm cups.'
  },
  {
    url: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&q=80&w=600',
    title: 'Stargazing Nights',
    desc: 'Counting stars and realizing they pale in comparison to you.'
  },
  {
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600',
    title: 'Endless Adventures',
    desc: 'Every road leads to somewhere beautiful when you are by my side.'
  }
];

function CircularCard({ img, angle, radius, rotateSpring, onClick }) {
  const cardRotation = useTransform(rotateSpring, (r) => {
    const totalRot = (r + angle) % 360;
    return totalRot < 0 ? totalRot + 360 : totalRot;
  });

  // Calculate opacity and scale based on rotation angle to make it slide smoothly around
  const opacity = useTransform(cardRotation, [0, 90, 180, 270, 360], [1, 0.45, 0.15, 0.45, 1]);
  const scale = useTransform(cardRotation, [0, 90, 180, 270, 360], [1, 0.85, 0.7, 0.85, 1]);

  return (
    <motion.div
      className="absolute w-full h-full rounded-2xl overflow-hidden border border-pink-200/50 bg-white/80 shadow-md cursor-pointer"
      style={{
        rotateY: angle,
        z: radius,
        opacity: opacity,
        scale: scale,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 15px 35px rgba(244,63,94,0.15)"
      }}
      onClick={onClick}
    >
      <img
        src={img.url}
        alt={img.title}
        className="w-full h-full object-cover pointer-events-none"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent p-4 flex flex-col justify-end text-left">
        <h4 className="font-cormorant text-[18px] font-semibold text-white leading-tight">
          {img.title}
        </h4>
      </div>
    </motion.div>
  );
}

export default function CircularGallery() {
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const rotateSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const [activeImage, setActiveImage] = useState(null);

  const cardCount = IMAGES.length;
  const radius = 260; // Radius in pixels for 3D layout spacing

  const handleDrag = (event, info) => {
    // Horizontal drag updates rotation
    x.set(x.get() + info.delta.x * 0.6);
  };

  return (
    <div 
      className="relative w-full h-[450px] flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ perspective: '1000px' }}
    >
      {/* 3D Ring Container */}
      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={handleDrag}
        style={{
          rotateY: rotateSpring,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-[180px] h-[260px] flex items-center justify-center"
      >
        {IMAGES.map((img, i) => {
          const angle = i * (360 / cardCount);
          return (
            <CircularCard
              key={i}
              img={img}
              angle={angle}
              radius={radius}
              rotateSpring={rotateSpring}
              onClick={() => setActiveImage(img)}
            />
          );
        })}
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 pointer-events-auto cursor-default"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col gap-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-rose-soft hover:text-rose-deep p-1.5 bg-rose-50/50 rounded-full transition-colors z-25 focus:outline-none"
                onClick={() => setActiveImage(null)}
                aria-label="Close details dialog"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <img
                src={activeImage.url}
                alt={activeImage.title}
                className="w-full h-[320px] object-cover rounded-2xl"
              />
              <div className="px-2 pb-2">
                <h3 className="font-cormorant text-[24px] font-semibold text-rose-deep leading-tight mb-2">
                  {activeImage.title}
                </h3>
                <p className="font-lato text-[14px] text-rose-muted leading-relaxed">
                  {activeImage.desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
