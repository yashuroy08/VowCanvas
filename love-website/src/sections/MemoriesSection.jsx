import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';
import CircularGallery from '../components/CircularGallery';

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
        className="w-full"
      >
        <CircularGallery />
      </motion.div>
    </section>
  );
}
