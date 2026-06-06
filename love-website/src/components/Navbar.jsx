import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const NAV_LINKS = [
  { name: 'Our Story', id: 'our-story' },
  { name: 'Letter', id: 'letter' },
  { name: 'Memories', id: 'memories' },
  { name: 'Promises', id: 'promises' },
  { name: 'Surprise', id: 'surprise' }
];

const THEMES = [
  { id: 'classic', name: 'Classic Rose', color: 'bg-[#ffb3c6]' },
  { id: 'midnight', name: 'Midnight Love', color: 'bg-[#ff4d6d]' },
  { id: 'lavender', name: 'Lavender Dream', color: 'bg-[#a788e5]' },
  { id: 'sunset', name: 'Sunset Glow', color: 'bg-[#ea8a68]' }
];

export default function Navbar({ theme, setTheme, activeSection, onSectionChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const sectionsList = ['hero', 'our-story', 'letter', 'memories', 'promises', 'surprise'];
  const sectionIndex = sectionsList.indexOf(activeSection);
  const progressPercent = sectionIndex >= 0 ? (sectionIndex / (sectionsList.length - 1)) * 100 : 0;

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    if (onSectionChange) {
      onSectionChange(id);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-rose-blush/85 backdrop-blur-md border-b border-rose-border/40 select-none transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); if (onSectionChange) onSectionChange('hero'); }}
          className="flex items-center gap-1.5 py-2 font-cormorant text-[22px] font-semibold text-rose-deep group"
        >
          <motion.svg 
            whileHover={{ scale: 1.25, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="w-5 h-5 text-rose-medium fill-current" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>
          <span className="group-hover:text-rose-medium transition-colors duration-300">My Love</span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <motion.a
                whileHover={{ scale: 1.08, y: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`inline-block py-4 px-1 font-lato text-[12px] tracking-[2px] uppercase transition-colors duration-300 ${activeSection === link.id ? 'text-rose-deep font-bold border-b border-rose-medium' : 'text-rose-soft hover:text-rose-deep'}`}
              >
                {link.name}
              </motion.a>
            </li>
          ))}

          {/* Theme Dropdown */}
          <li className="relative flex items-center">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center justify-center p-2 rounded-full hover:bg-rose-border/25 text-rose-soft hover:text-rose-deep transition-all duration-300 focus:outline-none"
              title="Switch Color Theme"
              aria-label="Toggle theme selection"
            >
              <svg className="w-[18px] h-[18px] fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 00.22 17.5l-.004.03a15.427 15.427 0 001.127 5.385l.008.022a.75.75 0 001.378-.04l.518-2.443a2.902 2.902 0 011.961-2.1l1.533-.44a3 3 0 001.89-1.89l.44-1.533a2.902 2.902 0 012.1-1.961l2.443-.518a.75.75 0 00.04-1.378l-.022-.008a15.427 15.427 0 00-5.385-1.127l-.03.004a3 3 0 00-1.378 9.31z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 12.5a3 3 0 106 0 3 3 0 00-6 0z" />
                <circle cx="18.5" cy="5.5" r="1.5" className="fill-current text-rose-medium" />
                <circle cx="14.5" cy="7.5" r="1" className="fill-current text-rose-soft" />
              </svg>
            </button>

            <AnimatePresence>
              {showThemeMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowThemeMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-10 w-48 bg-rose-blush/95 backdrop-blur-xl border border-rose-border/60 rounded-2xl shadow-xl py-2 z-20 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-rose-soft font-bold border-b border-rose-border/30 mb-1 font-lato">
                      Romantic Themes
                    </div>
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full px-3 py-2 flex items-center gap-3 text-left font-lato text-xs hover:bg-rose-border/20 transition-colors duration-200 ${theme === t.id ? 'font-bold text-rose-deep bg-rose-border/10' : 'text-rose-soft hover:text-rose-deep'}`}
                      >
                        <span className={`w-3 h-3 rounded-full ${t.color} border border-black/10`} />
                        <span>{t.name}</span>
                        {theme === t.id && (
                          <svg className="w-3.5 h-3.5 ml-auto text-rose-medium fill-current" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden text-rose-deep p-2.5 focus:outline-none"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-rose-border/20 bg-rose-blush transition-colors duration-500"
          >
            <ul className="px-6 py-5 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`font-lato text-[12px] tracking-[2px] uppercase py-2 block transition-colors duration-300 ${activeSection === link.id ? 'text-rose-deep font-bold' : 'text-rose-soft hover:text-rose-deep'}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}

              {/* Theme Grid in Mobile View */}
              <li className="border-t border-rose-border/20 pt-4 mt-2">
                <div className="text-[10px] uppercase tracking-widest text-rose-soft font-bold mb-3 font-lato">
                  Romantic Themes
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left font-lato text-[11px] transition-all duration-200 ${theme === t.id ? 'border-rose-medium bg-rose-border/20 text-rose-deep font-bold' : 'border-rose-border/30 bg-transparent text-rose-soft hover:text-rose-deep'}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${t.color} border border-black/10`} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Progress Bar & Heart Tracker */}
      <div className="absolute bottom-[-1.5px] left-0 right-0 h-[3px] bg-rose-border/10 overflow-visible pointer-events-none">
        <motion.div 
          className="h-full bg-rose-medium origin-left"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        <motion.div
          animate={{ left: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ x: "-50%" }}
          className="absolute top-1/2 -translate-y-1/2 text-rose-medium pointer-events-none"
        >
          <svg className="w-3.5 h-3.5 fill-current filter drop-shadow-[0_1px_2px_rgba(244,63,94,0.3)]" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      </div>
    </nav>
  );
}
