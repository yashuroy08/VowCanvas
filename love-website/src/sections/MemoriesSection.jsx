import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';
import CircularGallery from '../components/CircularGallery';

const GALLERY_ITEMS = [
  { image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800', text: 'The First Date' },
  { image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800', text: 'A Walk in the Rain' },
  { image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800', text: 'Summer Sunsets' },
  { image: 'https://images.unsplash.com/photo-1501908731398-23592c872374?auto=format&fit=crop&q=80&w=800', text: 'Coffee Mornings' },
  { image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&q=80&w=800', text: 'Stargazing Nights' },
  { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', text: 'Our Adventures' }
];

export default function MemoriesSection() {
  return (
    <section id="memories" className="py-16 md:py-24 max-w-4xl mx-auto px-6">
      <SectionDivider label="Our story" />
      
      <div className="text-center mb-16 select-none">
        <h2 className="font-cormorant text-[clamp(32px,5vw,52px)] font-light text-rose-deep leading-tight">
          Moments I hold close
        </h2>
        <p className="font-cormorant italic text-[18px] md:text-[20px] text-rose-medium mt-4">
          A collection of the little things that have made us, us.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[520px] relative rounded-3xl overflow-hidden bg-rose-50/5 border border-pink-200/10"
      >
        <CircularGallery 
          items={GALLERY_ITEMS}
          bend={1.5}
          textColor="#7a2038"
          borderRadius={0.06}
          scrollEase={0.02}
          fontUrl="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,700&display=swap"
          font="italic bold 28px Cormorant Garamond"
        />
      </motion.div>
    </section>
  );
}
