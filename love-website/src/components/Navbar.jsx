import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const NAV_LINKS = [
  { name: 'Our Story', href: '#our-story' },
  { name: 'Letter', href: '#letter' },
  { name: 'Memories', href: '#memories' },
  { name: 'Promises', href: '#promises' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fff0f3]/85 backdrop-blur-md border-b border-rose-border/40 select-none">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-1.5 font-cormorant text-[22px] font-semibold text-rose-deep group"
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
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="inline-block font-lato text-[12px] tracking-[2px] uppercase text-rose-soft hover:text-rose-deep transition-colors duration-300"
              >
                {link.name}
              </motion.a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden text-rose-deep p-1 focus:outline-none"
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
            className="md:hidden overflow-hidden border-t border-rose-border/20 bg-[#fff0f3]"
          >
            <ul className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="font-lato text-[12px] tracking-[2px] uppercase text-rose-soft hover:text-rose-deep py-2 block transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
