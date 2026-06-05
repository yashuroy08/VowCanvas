import { useState, useEffect } from 'react';
import PetalRain from './components/PetalRain';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import ReasonsSection from './sections/ReasonsSection';
import LetterSection from './sections/LetterSection';
import MemoriesSection from './sections/MemoriesSection';
import PromisesSection from './sections/PromisesSection';
import SurpriseSection from './sections/SurpriseSection';
import Footer from './sections/Footer';
import HeartClickEffect from './components/HeartClickEffect';
import MouseGlowEffect from './components/MouseGlowEffect';
import LoveJetIntro from './components/LoveJetIntro';

export default function App() {
  const [introPlaying, setIntroPlaying] = useState(() => {
    return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('skipIntro')
      ? false
      : true;
  });

  useEffect(() => {
    if (introPlaying) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [introPlaying]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, null, ' ');
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Aerodynamic Love Jet Opening Animation */}
      {introPlaying && <LoveJetIntro onComplete={() => setIntroPlaying(false)} />}

      {/* Background layer */}
      <PetalRain />
      
      {/* Interactive Cursor Aura */}
      <MouseGlowEffect />

      {/* Floating Heart Particle Click Effect */}
      <HeartClickEffect />
      
      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-16">
          <Hero />
          <ReasonsSection />
          <LetterSection />
          <MemoriesSection />
          <PromisesSection />
          <SurpriseSection />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
