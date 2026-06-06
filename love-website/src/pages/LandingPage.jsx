import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [mockupTab, setMockupTab] = useState('intro'); // 'intro' | 'letter' | 'candle'
  const [candleLit, setCandleLit] = useState(true);
  const [introCounter, setIntroCounter] = useState(0);

  // Live presets for users to test styles/grids directly in the hero
  const [activeTheme, setActiveTheme] = useState('classic'); // 'classic' | 'midnight' | 'lavender' | 'sunset'
  const [activeGrid, setActiveGrid] = useState('circular'); // 'circular' | 'cylinder' | 'bento'

  // Hover states for feature cards to enable mouse-tracking gradient glow
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleFeatureMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Auto-increment the loader counter when on the intro tab for a dynamic demo feel
  useEffect(() => {
    if (mockupTab !== 'intro') {
      setIntroCounter(0);
      return;
    }
    const interval = setInterval(() => {
      setIntroCounter((prev) => {
        if (prev >= 100) return 0; // Loop back
        return prev + 1;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [mockupTab]);

  // Mockup theme background mapping
  const MOCK_THEME_CLASSES = {
    classic: 'bg-[#fff0f3] text-[#8b1a3a] border-rose-200/50',
    midnight: 'bg-[#090306] text-[#ffeef2] border-red-950/40',
    lavender: 'bg-[#f6f1fb] text-[#3e1b6f] border-violet-200/50',
    sunset: 'bg-[#fffbf7] text-[#7e2d14] border-orange-200/50',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] font-sans selection:bg-[#e11d48]/30 overflow-x-hidden">
      
      {/* 1. Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/75 border-b border-white/5 h-16 flex items-center justify-between px-6 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#e11d48] fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>LoveCraft</span>
        </div>
        <div>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="bg-[#e11d48] hover:bg-[#be123c] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none"
            >
              Create Yours
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section (Split Screen with Asymmetric Sandbox Controls) */}
      <section className="relative min-h-[calc(100dvh-64px)] max-w-[1400px] mx-auto px-6 md:px-8 flex flex-col lg:flex-row items-center justify-between pt-12 lg:pt-0 pb-16 overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e11d48]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Left Column - Copy & Sandbox Selector */}
        <div className="w-full lg:w-[50%] relative z-10 flex flex-col items-start pr-0 lg:pr-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-[#e11d48] text-sm font-bold tracking-[0.2em] uppercase mb-5"
          >
            For the ones you love
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.02] text-white font-semibold"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Turn your love story into a living website
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className="text-lg text-white/65 max-w-[48ch] leading-relaxed mt-6"
          >
            Create a cinematic, interactive love letter with photos, music, and candle-blowing surprises — shared in one link.
          </motion.p>

          {/* Interactive Sandbox Toggles in Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.25 }}
            className="mt-8 p-3 md:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] w-full max-w-md"
          >
            <span className="text-[11px] font-bold tracking-wider uppercase text-white/45 block mb-3">Live Customizer Sandbox</span>
            <div className="space-y-3">
              {/* Theme Presets */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-white/70">Theme Style</span>
                <div className="flex gap-1.5">
                  {['classic', 'midnight', 'lavender', 'sunset'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTheme(t)}
                      className={`text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md cursor-pointer transition-all ${activeTheme === t ? 'bg-[#e11d48] text-white' : 'bg-white/5 text-white/40 hover:text-white/80'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Presets */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-white/70">Gallery Grid</span>
                <div className="flex gap-1.5">
                  {['circular', 'cylinder', 'bento'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setActiveGrid(g)}
                      className={`text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md cursor-pointer transition-all ${activeGrid === g ? 'bg-[#e11d48] text-white' : 'bg-white/5 text-white/40 hover:text-white/80'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
            className="mt-8"
          >
            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold px-10 py-4 rounded-full text-base tracking-wide transition-all duration-300 shadow-lg shadow-[#e11d48]/25 cursor-pointer focus:outline-none"
              >
                Create Yours
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
          className="w-full lg:w-[45%] mt-12 lg:mt-0 relative z-10"
        >
          <div className="relative w-full aspect-[4/5] bg-white/[0.01] border border-white/10 rounded-[32px] p-2 md:p-4 pt-10 md:pt-12 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Browser Chrome Controls */}
            <div className="absolute top-4 left-5 flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>

            {/* Interactive Mockup Tabs switcher using fluid layout indicator */}
            <div className="absolute top-2.5 right-4 flex bg-white/[0.04] border border-white/5 p-0.5 rounded-lg z-20">
              {['intro', 'letter', 'candle'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMockupTab(tab)}
                  className="relative px-3 py-1.5 text-[9px] font-bold tracking-wider uppercase rounded-md cursor-pointer transition-colors duration-200 z-10 focus:outline-none select-none"
                  style={{
                    color: mockupTab === tab ? '#ffffff' : 'rgba(255, 255, 255, 0.45)'
                  }}
                >
                  {mockupTab === tab && (
                    <motion.div
                      layoutId="activeMockupTab"
                      className="absolute inset-0 bg-[#e11d48] rounded-md -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>

            {/* Interactive Mockup Content Window dynamically styling based on active customizer theme */}
            <div className={`w-full h-full rounded-2xl border transition-all duration-500 relative overflow-hidden flex flex-col items-center justify-center p-6 ${MOCK_THEME_CLASSES[activeTheme]}`}>
              
              <AnimatePresence mode="wait">
                {mockupTab === 'intro' && (
                  <motion.div
                    key="intro-tab"
                    initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.95 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full h-full flex flex-col items-center justify-center text-center relative"
                  >
                    <div className="w-32 h-32 rounded-full bg-[#e11d48]/5 blur-2xl absolute" />
                    
                    {/* Romantic quote */}
                    <div className="mb-4 max-w-[200px] z-10">
                      <p className="italic opacity-70 leading-relaxed text-[13px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                        "Every love story is beautiful, but ours is my favorite"
                      </p>
                    </div>

                    {/* Center line */}
                    <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent my-2 z-10" />

                    {/* "crafted with love" */}
                    <span className="text-[7px] uppercase tracking-[0.3em] opacity-30 mt-2 z-10" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      crafted with love
                    </span>

                    {/* Progress Bar & Loader */}
                    <div className="flex flex-col items-center gap-2 mt-8 z-10">
                      <span className="font-light text-[9px] tracking-widest opacity-40 tabular-nums" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {String(introCounter).padStart(3, '0')}
                      </span>
                      <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden mt-1">
                        <div 
                          className="absolute inset-y-0 left-0 transition-all duration-100" 
                          style={{ 
                            width: `${introCounter}%`,
                            background: 'linear-gradient(90deg, rgba(225,29,72,0.4), rgba(225,29,72,0.8))'
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {mockupTab === 'letter' && (
                  <motion.div
                    key="letter-tab"
                    initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.95 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full h-full flex flex-col items-center justify-center text-center relative"
                  >
                    {/* Visual indicators for different grid types in preview */}
                    <div className="w-full h-full flex flex-col items-center justify-center relative p-2">
                      {activeGrid === 'circular' && (
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-bold tracking-widest uppercase opacity-40 mb-3">WebGL circular view</span>
                          <div className="flex gap-2 items-center justify-center py-4 scale-90">
                            {[0, 1, 2].map(i => (
                              <div key={i} className="w-14 aspect-[3/4] rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rotate-[-6deg] odd:rotate-[6deg] overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeGrid === 'cylinder' && (
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-bold tracking-widest uppercase opacity-40 mb-3">3D Cylinder view</span>
                          <div className="w-28 h-28 rounded-full border border-dashed border-black/20 dark:border-white/20 flex items-center justify-center animate-spin" style={{ animationDuration: '12s' }}>
                            <div className="w-10 h-14 rounded-lg bg-black/10 dark:bg-white/10 border border-black/5 -translate-y-8" />
                            <div className="w-10 h-14 rounded-lg bg-black/10 dark:bg-white/10 border border-black/5 translate-y-8" />
                          </div>
                        </div>
                      )}

                      {activeGrid === 'bento' && (
                        <div className="flex flex-col items-center w-full">
                          <span className="text-[8px] font-bold tracking-widest uppercase opacity-40 mb-3">Bento layout view</span>
                          <div className="grid grid-cols-3 gap-1.5 w-full max-w-[200px]">
                            <div className="col-span-2 h-10 rounded-md bg-black/10 dark:bg-white/10 border border-black/5" />
                            <div className="col-span-1 h-14 rounded-md bg-black/10 dark:bg-white/10 border border-black/5 row-span-2" />
                            <div className="col-span-1 h-8 rounded-md bg-black/10 dark:bg-white/10 border border-black/5" />
                            <div className="col-span-1 h-8 rounded-md bg-black/10 dark:bg-white/10 border border-black/5" />
                          </div>
                        </div>
                      )}

                      <p className="text-[12px] opacity-75 text-center mt-4 max-w-[22ch] font-medium leading-normal">
                        "Every moment made perfect by you."
                      </p>
                    </div>
                  </motion.div>
                )}

                {mockupTab === 'candle' && (
                  <motion.div
                    key="candle-tab"
                    initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.95 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full h-full flex flex-col items-center justify-center text-center relative cursor-pointer select-none"
                    onClick={() => setCandleLit(!candleLit)}
                  >
                    {candleLit ? (
                      <div className="flex flex-col items-center justify-center z-10">
                        <div className="w-24 h-24 rounded-full bg-orange-500/10 blur-xl absolute animate-pulse" />
                        
                        {/* Candle Flame SVG */}
                        <motion.svg 
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          className="w-8 h-8 text-orange-500 fill-current mb-3" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2S9 7 9 11s3 6 3 6 3-2 3-6-3-9-3-9z" />
                        </motion.svg>
                        <p className="text-xs tracking-wider uppercase mt-4 opacity-50">Click to Blow out 🕯️</p>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.96, filter: 'blur(2px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        className="flex flex-col items-center justify-center z-10"
                      >
                        <svg className="w-8 h-8 text-[#e11d48] fill-current mb-4" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <p className="text-sm leading-tight max-w-[20ch]">
                          "You hold my whole heart."
                        </p>
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCandleLit(true);
                          }}
                          className="mt-6 text-[9px] font-bold tracking-wider uppercase bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Relight Candle
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. How it works */}
      <section className="bg-[#fafafa] text-[#171717] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8">
          <h2 className="text-4xl md:text-5xl tracking-tight font-bold mb-16" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Three steps. One unforgettable gift.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="border-t border-neutral-200 pt-8">
              <div className="text-[#e11d48] text-6xl font-bold opacity-25 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>01</div>
              <h3 className="font-bold text-xl mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Write</h3>
              <p className="text-base text-neutral-600 max-w-[38ch] leading-relaxed">
                Pour your heart out. Write your letters, list your reasons, and set your promises for the future.
              </p>
            </div>
            <div className="border-t border-neutral-200 pt-8">
              <div className="text-[#e11d48] text-6xl font-bold opacity-25 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>02</div>
              <h3 className="font-bold text-xl mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Upload</h3>
              <p className="text-base text-neutral-600 max-w-[38ch] leading-relaxed">
                Add your most cherished photos to build a 3D rotating cylinder gallery of your shared memories.
              </p>
            </div>
            <div className="border-t border-neutral-200 pt-8">
              <div className="text-[#e11d48] text-6xl font-bold opacity-25 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>03</div>
              <h3 className="font-bold text-xl mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Share</h3>
              <p className="text-base text-neutral-600 max-w-[38ch] leading-relaxed">
                Get a single, compressed link. No accounts needed. Everything is securely encoded in the URL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Showcase - Asymmetric Bento Grid Layout */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8">
          <h2 className="text-4xl md:text-5xl text-white tracking-tight font-bold mb-16" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Crafted with love. Built with code.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {[
              {
                title: "WebGL Circular Ribbon",
                desc: "A fluid, curved WebGL ribbon of your photos that users can swipe and drag on desktop or touch screens.",
                colSpan: "md:col-span-2"
              },
              {
                title: "Blowing the Candle",
                desc: "Interactive mic-detection that allows your partner to blow out a digital candle to reveal the final message.",
                colSpan: "md:col-span-1"
              },
              {
                title: "Curated Playlists",
                desc: "Integrated romantic soundtracks that adjust volume and blend tracks during scene transitions.",
                colSpan: "md:col-span-1"
              },
              {
                title: "Complete Serverless Privacy",
                desc: "No databases, no accounts, no tracking. Every word, letter, and photo is compressed and stored directly inside the URL.",
                colSpan: "md:col-span-2"
              }
            ].map((feat, index) => (
              <motion.div 
                key={index}
                onMouseMove={(e) => handleFeatureMouseMove(e, index)}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className={`bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 md:p-10 flex flex-col justify-end min-h-[260px] relative overflow-hidden group cursor-pointer ${feat.colSpan}`}
                style={{
                  '--x': hoveredFeature === index ? `${mousePos.x}px` : '50%',
                  '--y': hoveredFeature === index ? `${mousePos.y}px` : '50%',
                }}
              >
                {/* Mouse-tracking glow gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(350px circle at var(--x) var(--y), rgba(225, 29, 72, 0.07), transparent 80%)`
                  }}
                />
                
                {/* Visual card subtle border highlight */}
                <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none group-hover:border-[#e11d48]/15 transition-colors duration-300" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#e11d48]" />
                    <h3 className="text-2xl text-white font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>{feat.title}</h3>
                  </div>
                  <p className="text-white/60 text-base leading-relaxed max-w-[50ch]">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* 5. CTA Banner */}
      <section className="py-24 border-t border-white/[0.05] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#e11d48]/10 rounded-[100%] blur-[100px] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 text-center relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl text-white tracking-tight font-bold mb-10" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Ready to make someone's heart skip?
          </h2>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold px-10 py-4 rounded-full text-base tracking-wide transition-all duration-300 shadow-lg shadow-[#e11d48]/25 cursor-pointer focus:outline-none"
            >
              Create Yours
            </motion.button>
          </Link>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-8 border-t border-white/[0.05] text-center">
        <p className="text-white/40 text-sm tracking-wide uppercase">Built with ♡ and code</p>
      </footer>

    </div>
  );
}
