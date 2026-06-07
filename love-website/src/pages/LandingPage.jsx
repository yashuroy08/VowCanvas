import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { ArrowUpRight, Heart, EnvelopeSimple, Sparkle, ArrowRight, Camera, InstagramLogo, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

/**
 * <design_plan>
 * Approach: Emil-Style Minimalist (High Polish)
 * 1. Design Read: Premium romantic storytelling platform with native-feeling spring interactions.
 * 2. Hero: Artistic Asymmetry with inline image reacting to useSpring mouse-tracking.
 * 3. Interactions: Every CTA uses .interactive-scale (scale(0.97) on active).
 * 4. Easing: Custom cubic-bezier(0.23, 1, 0.32, 1) for snappy feedback.
 * 5. AIDA Structure:
 *    - Attention: Hero with spring physics.
 *    - Interest: Gapless Bento Grid with subtle blurs.
 *    - Desire: Staggered reveal list (no heavy scroll-hijack).
 *    - Action: Massive high-contrast footer.
 * </design_plan>
 */

const transition = { duration: 0.8, ease: [0.23, 1, 0.32, 1] };

export default function LandingPage() {
  const containerRef = useRef(null);
  
  // Mouse Spring Tracking for Hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 30, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const moveX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const moveY = useTransform(springY, [-0.5, 0.5], [-30, 30]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <main 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="overflow-x-hidden w-full max-w-full bg-rose-blush text-rose-deep font-outfit selection:bg-rose-deep/30 relative"
    >
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      {/* Navigation: Minimalist Split */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg px-8 py-4 rounded-full flex items-center gap-12">
        <div className="font-bold tracking-widest uppercase text-xs flex items-center gap-2">
          <Heart weight="fill" className="w-4 h-4 text-rose-medium" />
          LOVECRAFT
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-deep/40">
          <a href="#experience" className="hover:text-rose-deep transition-colors">Experience</a>
          <a href="#artistry" className="hover:text-rose-deep transition-colors">Artistry</a>
        </div>
        <Link to="/create">
          <button className="interactive-scale bg-rose-deep text-white px-6 py-2 rounded-full text-xs font-bold shadow-md">
            Create Yours
          </button>
        </Link>
      </nav>

      {/* Attention: Hero (Artistic Asymmetry + Spring Micro-Interactions) */}
      <section className="relative w-full min-h-[100dvh] flex flex-col justify-center px-8 md:px-24 pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl w-full mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={transition}
          >
            <h1 className="text-[clamp(3.5rem,8.5vw,9rem)] leading-[0.9] tracking-tight font-medium text-rose-dark-accent max-w-6xl">
              We shape 
              <span className="inline-block w-[14vw] h-[7vw] rounded-full align-middle bg-cover bg-center mx-4 border-2 border-white shadow-2xl" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800)'}}></span> 
              digital spaces for your <span className="italic font-cormorant font-light">deepest</span> affections.
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.2 }}
            className="mt-16 flex flex-col md:flex-row items-start md:items-center gap-12"
          >
            <Link to="/create">
              <button className="interactive-scale bg-rose-deep text-white px-10 py-5 rounded-full font-bold flex items-center gap-3 shadow-2xl shadow-rose-deep/20 text-lg">
                Get Started <ArrowUpRight weight="bold" />
              </button>
            </Link>
            <p className="max-w-xs text-rose-deep/50 font-medium leading-relaxed text-sm">
              A minimalist sanctuary for your shared memories. Beautiful by default, private by design.
            </p>
          </motion.div>
        </div>

        {/* Artistic Asymmetry: Floating Spring Asset */}
        <motion.div 
          style={{ x: moveX, y: moveY }}
          className="absolute right-[-2vw] bottom-[15vh] w-[40vw] h-[55vh] rounded-[48px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(139,26,58,0.15)] border border-white/40 hidden md:block"
        >
          <img 
            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200" 
            alt="Cinematic Romance" 
            className="w-full h-full object-cover brightness-[0.95] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-blush/20 to-transparent mix-blend-overlay"></div>
        </motion.div>

        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--rose-deep) 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>
      </section>

      {/* Interest: Gapless Bento Grid (Dense & Symmetrical) */}
      <section id="experience" className="py-32 px-8 md:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 grid-auto-rows-[300px] grid-flow-dense gap-0 border border-rose-border rounded-[48px] overflow-hidden shadow-2xl shadow-rose-deep/5">
            
            {/* 2x2 Feature */}
            <div className="col-span-1 md:col-span-2 row-span-2 border border-rose-border/50 relative overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-deep/80 via-rose-deep/10 to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12 text-white">
                <h3 className="text-3xl font-semibold tracking-tight mb-4">Timeless Keepsake</h3>
                <p className="text-white/70 text-sm max-w-xs leading-relaxed">A permanent sanctuary for the moments that define your journey together.</p>
              </div>
            </div>

            {/* 1x1 Metric (Emil-Style Minimal) */}
            <div className="col-span-1 row-span-1 border border-rose-border/50 bg-white p-12 flex flex-col justify-between">
              <Heart size={28} weight="fill" className="text-rose-medium opacity-50" />
              <div>
                <span className="text-5xl font-bold tracking-tighter">100%</span>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-deep/30 mt-2">Private Encryption</p>
              </div>
            </div>

            {/* 1x1 Visual */}
            <div className="col-span-1 row-span-1 border border-rose-border/50 bg-rose-light-accent/10 p-12 flex items-center justify-center relative group overflow-hidden">
               <Sparkle size={40} weight="thin" className="text-rose-medium animate-pulse" />
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"></div>
            </div>

            {/* 2x1 Horizontal Reveal */}
            <div className="col-span-1 md:col-span-2 row-span-1 border border-rose-border/50 bg-white p-12 flex items-center justify-between group cursor-pointer active:bg-rose-blush transition-colors duration-500 interactive-scale">
              <div className="max-w-md">
                <h4 className="text-xl font-semibold mb-2">Native Fluidity</h4>
                <p className="text-sm text-rose-deep/40 leading-relaxed">Interfaces that feel right. Every interaction is tuned to the rhythm of your touch.</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-rose-border flex items-center justify-center group-hover:bg-rose-deep group-hover:text-white transition-all duration-300">
                <ArrowRight size={20} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Desire: Staggered "Artistry" Section (No Scroll Hijack) */}
      <section id="artistry" className="py-48 px-8 md:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-24 items-start">
          <div className="w-full md:w-1/2 sticky top-32">
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-cormorant italic leading-[0.9] text-rose-dark-accent mb-8">
              The Beauty of <br /> Invisible Details.
            </h2>
            <p className="max-w-sm text-rose-deep/50 leading-relaxed text-lg">
              We believe software is a craft. Every easing curve and every spring is an invitation to feel more deeply.
            </p>
            <div className="mt-12 w-16 h-px bg-rose-border/50"></div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-12 pt-8">
             {[
               { title: "Encrypted Letters", desc: "Your words are for their eyes only. End-to-end security is our standard.", icon: <EnvelopeSimple size={24} /> },
               { title: "Memory Ribbons", desc: "Fluid galleries that breathe and move with your interaction.", icon: <Camera size={24} /> },
               { title: "Sensory Motion", desc: "Interactive petals and physics-based reveals that delight the senses.", icon: <Sparkle size={24} /> }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 10, scale: 0.98 }}
                 whileInView={{ opacity: 1, y: 0, scale: 1 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.6, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                 className="p-10 bg-white border border-rose-border/30 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-rose-deep/5 transition-all duration-500 group"
               >
                 <div className="w-12 h-12 rounded-2xl bg-rose-blush flex items-center justify-center text-rose-medium mb-6 group-hover:scale-110 transition-transform duration-500">
                   {item.icon}
                 </div>
                 <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                 <p className="text-rose-deep/40 leading-relaxed text-sm">{item.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Action: Massive Footer CTA (High Contrast) */}
      <footer className="py-48 px-8 md:px-24 bg-white border-t border-rose-border/20">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={transition}
            className="font-cormorant text-[clamp(4rem,14vw,16rem)] font-medium italic tracking-tighter leading-[0.8] text-rose-dark-accent mb-24"
          >
            Seal your <br /> story forever.
          </motion.h2>
          
          <Link to="/create">
            <button className="interactive-scale bg-rose-deep text-white px-20 py-8 rounded-full text-2xl font-bold flex items-center gap-6 shadow-2xl shadow-rose-deep/30 group">
              Create Yours <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform duration-500" />
            </button>
          </Link>

          <div className="w-full h-px bg-rose-border/10 mt-48 mb-12"></div>
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-bold uppercase tracking-[0.3em] text-rose-deep/30">
            <div className="flex items-center gap-2">
              <Heart weight="fill" className="text-rose-medium opacity-40" />
              <span>LOVECRAFT DIGITAL 2026</span>
            </div>
            <div className="flex gap-8 items-center">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-rose-deep transition-colors flex items-center gap-2">
                <InstagramLogo size={18} weight="bold" />
                <span>Instagram</span>
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-rose-deep transition-colors flex items-center gap-2">
                <GithubLogo size={18} weight="bold" />
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-rose-deep transition-colors flex items-center gap-2">
                <LinkedinLogo size={18} weight="bold" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
