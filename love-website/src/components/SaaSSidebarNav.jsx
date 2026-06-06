import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from './MagneticButton';

const STEPS = [
  { label: "Home", id: "hero" },
  { label: "Reasons", id: "our-story" },
  { label: "Letter", id: "letter" },
  { label: "Memories", id: "memories" },
  { label: "Promises", id: "promises" },
  { label: "Surprise", id: "surprise" }
];

const THEMES = [
  { id: 'classic', name: 'Classic Rose', color: 'bg-[#ffb3c6]' },
  { id: 'midnight', name: 'Midnight Love', color: 'bg-[#ff4d6d]' },
  { id: 'lavender', name: 'Lavender Dream', color: 'bg-[#a788e5]' },
  { id: 'sunset', name: 'Sunset Glow', color: 'bg-[#ea8a68]' }
];

export default function SaaSSidebarNav({ activeNode, unlockedDepth, onNodeClick, theme, setTheme, onReset }) {
  const [shakingNode, setShakingNode] = useState(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const isSharedLink = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('d');

  const handleNodeClick = (index, id) => {
    if (index <= unlockedDepth) {
      onNodeClick(index, id);
    } else {
      setShakingNode(index);
      setTimeout(() => setShakingNode(null), 500);
    }
  };

  return (
    <>
      {/* 
        DESKTOP SIDEBAR NAVIGATION (pinned on the left)
      */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-5 bg-rose-blush/80 backdrop-blur-xl border border-rose-border/50 p-4 py-6 rounded-3xl shadow-xl select-none w-16">
        {/* Reset / Home Logo */}
        <MagneticButton strength={0.4} range={50}>
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.95 }}
            className="text-rose-medium p-1 cursor-pointer focus:outline-none"
            title="Reset to Top"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.button>
        </MagneticButton>

        <div className="w-8 h-[1px] bg-rose-border/30 my-1" />

        {/* Navigation Dots */}
        <div className="flex flex-col gap-4">
          {STEPS.map((step, index) => {
            const isCurrent = activeNode === index;
            const isUnlocked = index <= unlockedDepth;
            const isShaking = shakingNode === index;

            return (
              <div key={step.id} className="relative group flex items-center justify-center">
                {/* Tooltip Label (floats to the right of the sidebar) */}
                <div className="absolute left-12 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-rose-deep text-rose-light-accent text-[10px] tracking-[2px] uppercase px-3 py-1.5 rounded-xl border border-rose-border/45 shadow-md whitespace-nowrap font-lato z-50">
                  {step.label} {!isUnlocked && "🔒"}
                </div>

                <MagneticButton range={30} strength={0.3}>
                  <motion.button
                    onClick={() => handleNodeClick(index, step.id)}
                    animate={isShaking ? { x: [-4, 4, -4, 4, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    whileHover={isUnlocked ? { scale: 1.15 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer ${
                      isCurrent
                        ? 'border-2 border-rose-medium bg-rose-medium/15 text-rose-deep shadow-sm'
                        : isUnlocked
                          ? 'border border-rose-soft bg-rose-light-accent/30 text-rose-soft hover:bg-rose-light-accent/50'
                          : 'border border-rose-border/30 bg-transparent text-rose-soft/30 cursor-not-allowed'
                    }`}
                  >
                    {isUnlocked ? (
                      isCurrent ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-medium animate-pulse" />
                      ) : (
                        <svg className="w-3 h-3 text-rose-soft" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )
                    ) : (
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                      </svg>
                    )}
                  </motion.button>
                </MagneticButton>
              </div>
            );
          })}
        </div>

        <div className="w-8 h-[1px] bg-rose-border/30 my-1" />

        {/* Desktop Theme Switcher Button */}
        <div className="relative">
          <MagneticButton strength={0.4} range={40}>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 focus:outline-none cursor-pointer ${showThemeMenu ? 'bg-rose-medium/20 text-rose-deep' : 'text-rose-soft hover:text-rose-deep'}`}
              title="Switch Theme"
            >
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 00.22 17.5l-.004.03a15.427 15.427 0 001.127 5.385l.008.022a.75.75 0 001.378-.04l.518-2.443a2.902 2.902 0 011.961-2.1l1.533-.44a3 3 0 001.89-1.89l.44-1.533a2.902 2.902 0 012.1-1.961l2.443-.518a.75.75 0 00.04-1.378l-.022-.008a15.427 15.427 0 00-5.385-1.127l-.03.004a3 3 0 00-1.378 9.31z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 12.5a3 3 0 106 0 3 3 0 00-6 0z" />
              </svg>
            </motion.button>
          </MagneticButton>

          <AnimatePresence>
            {showThemeMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowThemeMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -10 }}
                  transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                  className="absolute left-12 bottom-0 w-44 bg-rose-blush/95 backdrop-blur-2xl border border-rose-border/60 rounded-2xl shadow-xl py-2 z-40 overflow-hidden"
                  style={{ transformOrigin: 'left bottom' }}
                >
                  <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-rose-soft font-bold border-b border-rose-border/30 mb-1 font-lato">
                    Romantic Themes
                  </div>
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full px-3 py-1.5 flex items-center gap-2.5 text-left font-lato text-xs hover:bg-rose-border/20 transition-colors duration-200 cursor-pointer ${theme === t.id ? 'font-bold text-rose-deep bg-rose-border/10' : 'text-rose-soft hover:text-rose-deep'}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${t.color} border border-black/10`} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Create Your Own Link - Only show if NOT a shared link */}
        {!isSharedLink && (
          <>
            <div className="w-8 h-[1px] bg-rose-border/30 my-1" />
            <MagneticButton strength={0.4} range={40}>
              <Link to="/create">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-rose-soft hover:text-rose-deep transition-colors duration-300"
                  title="Create Your Own"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </motion.div>
              </Link>
            </MagneticButton>
          </>
        )}
      </div>

      {/* 
        MOBILE NAVIGATION DOCK (pinned at the top center)
      */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center gap-3 bg-rose-blush/80 backdrop-blur-xl border border-rose-border/50 p-2.5 px-4 rounded-full shadow-lg select-none max-w-[90vw] overflow-x-auto scrollbar-none">
        {/* Reset / Home */}
        <MagneticButton strength={0.35} range={35}>
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-rose-medium p-1 cursor-pointer focus:outline-none flex-shrink-0"
          >
            <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.button>
        </MagneticButton>

        <div className="w-[1px] h-5 bg-rose-border/30 flex-shrink-0" />

        {/* Dots */}
        <div className="flex items-center gap-3">
          {STEPS.map((step, index) => {
            const isCurrent = activeNode === index;
            const isUnlocked = index <= unlockedDepth;
            const isShaking = shakingNode === index;

            return (
              <motion.button
                key={step.id}
                onClick={() => handleNodeClick(index, step.id)}
                animate={isShaking ? { x: [-3, 3, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                whileTap={isUnlocked ? { scale: 0.93 } : {}}
                className={`w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
                  isCurrent
                    ? 'border border-rose-medium bg-rose-medium/15 text-rose-deep'
                    : isUnlocked
                      ? 'border border-rose-soft bg-rose-light-accent/30 text-rose-soft'
                      : 'border border-rose-border/30 bg-transparent text-rose-soft/30'
                }`}
              >
                {isUnlocked ? (
                  isCurrent ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-medium" />
                  ) : (
                    <svg className="w-2.5 h-2.5 text-rose-soft" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )
                ) : (
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="w-[1px] h-5 bg-rose-border/30 flex-shrink-0" />

        {/* Mobile Theme Switcher */}
        <div className="relative flex-shrink-0">
          <MagneticButton strength={0.35} range={35}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`w-6.5 h-6.5 rounded-full flex items-center justify-center transition-colors duration-300 focus:outline-none cursor-pointer ${showThemeMenu ? 'bg-rose-medium/20 text-rose-deep' : 'text-rose-soft'}`}
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 00.22 17.5l-.004.03a15.427 15.427 0 001.127 5.385l.008.022a.75.75 0 001.378-.04l.518-2.443a2.902 2.902 0 011.961-2.1l1.533-.44a3 3 0 001.89-1.89l.44-1.533a2.902 2.902 0 012.1-1.961l2.443-.518a.75.75 0 00.04-1.378l-.022-.008a15.427 15.427 0 00-5.385-1.127l-.03.004a3 3 0 00-1.378 9.31z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 12.5a3 3 0 106 0 3 3 0 00-6 0z" />
              </svg>
            </motion.button>
          </MagneticButton>
        </div>

        {/* Create Your Own - Only show if NOT a shared link */}
        {!isSharedLink && (
          <>
            <div className="w-[1px] h-5 bg-rose-border/30 flex-shrink-0" />
            <MagneticButton strength={0.35} range={35}>
              <Link to="/create" className="flex-shrink-0 block">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-rose-soft transition-colors duration-300"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </motion.div>
              </Link>
            </MagneticButton>
          </>
        )}
      </div>

      {/* MOBILE THEME DROPDOWN MENU (positioned fixed relative to viewport to avoid clipping) */}
      <AnimatePresence>
        {showThemeMenu && (
          <div className="md:hidden">
            <div className="fixed inset-0 z-45 bg-black/10 backdrop-blur-[1px]" onClick={() => setShowThemeMenu(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-48 bg-rose-blush/95 backdrop-blur-2xl border border-rose-border/60 rounded-2xl shadow-xl py-2.5 z-50 overflow-hidden"
            >
              <div className="px-3.5 py-1.5 text-[10px] uppercase tracking-widest text-rose-soft font-bold border-b border-rose-border/30 mb-1.5 font-lato">
                Romantic Themes
              </div>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full px-3.5 py-2 flex items-center gap-3 text-left font-lato text-xs hover:bg-rose-border/20 transition-colors duration-200 cursor-pointer ${theme === t.id ? 'font-bold text-rose-deep bg-rose-border/10' : 'text-rose-soft'}`}
                >
                  <span className={`w-3 h-3 rounded-full ${t.color} border border-black/10`} />
                  <span>{t.name}</span>
                </button>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
