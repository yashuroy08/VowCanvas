import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';

export default function LetterSection() {
  return (
    <section id="letter" className="py-16 md:py-24 max-w-4xl mx-auto px-6">
      <SectionDivider label="From my heart" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative bg-white/80 border border-pink-200 rounded-3xl p-8 md:p-14 shadow-sm mt-8 overflow-hidden"
      >
        {/* Oversized Quote */}
        <span className="absolute top-2 left-6 font-cormorant text-[130px] font-light text-[#f9d0d9] select-none leading-none z-0" aria-hidden="true">
          “
        </span>
        
        <blockquote className="relative z-10 font-cormorant italic text-[20px] md:text-[22px] font-light text-[#6b1c32] leading-[2.1] whitespace-pre-line">
          {"My Love,\n\nThere are not enough words in this world to hold everything I feel for you. You walked into my life and rearranged everything — quietly, gently — until suddenly the world made sense in a way it never had before.\n\nYou are the person I reach for in the dark, the first thought I wake to, the reason I believe in beauty. Being loved by you is the greatest gift I have ever been given, and loving you — that is my greatest joy.\n\nForever and always, in every life, I would choose you."}
        </blockquote>

        <div className="text-right mt-9 relative z-10 font-cormorant italic text-[18px] md:text-[20px] text-[#b04060]">
          — Yours, always ♡
        </div>
      </motion.div>
    </section>
  );
}
