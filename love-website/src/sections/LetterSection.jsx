import { motion } from 'framer-motion';
import SectionDivider from '../components/SectionDivider';

export default function LetterSection() {
  return (
    <section id="letter" className="py-16 md:py-24 max-w-4xl mx-auto px-6 relative">
      <SectionDivider label="From my heart" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative bg-white/80 border border-pink-200/50 rounded-3xl p-8 md:p-14 shadow-sm mt-8 overflow-hidden"
      >
        {/* Oversized Quote SVG */}
        <svg className="absolute -top-2 -left-2 w-32 h-32 text-[#ffd9e2] opacity-35 select-none z-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        
        <blockquote className="relative z-10 font-cormorant italic text-[20px] md:text-[22px] font-light text-[#6b1c32] leading-[2.1] whitespace-pre-line">
          {"My Love,\n\nThere are not enough words in this world to hold everything I feel for you. You walked into my life and rearranged everything — quietly, gently — until suddenly the world made sense in a way it never had before.\n\nYou are the person I reach for in the dark, the first thought I wake to, the reason I believe in beauty. Being loved by you is the greatest gift I have ever been given, and loving you — that is my greatest joy.\n\nForever and always, in every life, I would choose you."}
        </blockquote>

        <div className="flex flex-col items-end mt-10 relative z-10 select-none">
          <div className="font-cormorant italic text-[18px] md:text-[20px] text-[#b04060]">
            — Yours, always
          </div>
          {/* Cursive animated heart drawing flourish */}
          <svg className="w-24 h-8 text-[#b04060]/50 mt-1" viewBox="0 0 120 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.path 
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.6, ease: 'easeInOut' }}
              d="M10 15 C 35 15, 40 5, 55 15 C 70 25, 80 5, 90 15 C 95 20, 100 20, 110 15"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
