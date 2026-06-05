import PetalRain from './components/PetalRain';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import ReasonsSection from './sections/ReasonsSection';
import LetterSection from './sections/LetterSection';
import MemoriesSection from './sections/MemoriesSection';
import PromisesSection from './sections/PromisesSection';
import Footer from './sections/Footer';
import HeartClickEffect from './components/HeartClickEffect';
import MouseGlowEffect from './components/MouseGlowEffect';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background layer */}
      <PetalRain />
      
      {/* Interactive Cursor Aura */}
      <MouseGlowEffect />

      {/* Floating Heart Particle Click Effect */}
      <HeartClickEffect />
      
      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Hero />
          <ReasonsSection />
          <LetterSection />
          <MemoriesSection />
          <PromisesSection />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
