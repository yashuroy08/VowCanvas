import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import Hero from './sections/Hero';
import ReasonsSection from './sections/ReasonsSection';
import LetterSection from './sections/LetterSection';
import MemoriesSection from './sections/MemoriesSection';
import PromisesSection from './sections/PromisesSection';
import SurpriseSection from './sections/SurpriseSection';
import Footer from './sections/Footer';
import HeartClickEffect from './components/HeartClickEffect';
import MouseGlowEffect from './components/MouseGlowEffect';
import PremiumPreloader from './components/PremiumPreloader';
import SpotifyPlayer from './components/SpotifyPlayer';
import LinkedListConnector from './components/LinkedListConnector';
import SaaSSidebarNav from './components/SaaSSidebarNav';
import ExpiredLink from './components/ExpiredLink';
import useDataStore, { DEFAULT_DATA } from './store/useDataStore';
import LZString from 'lz-string';

// Representing Sections as a true Linked List data structure
const surpriseNode = {
  id: 'surprise',
  name: 'Surprise',
  label: 'Your Special Surprise',
  next: null
};

const promisesNode = {
  id: 'promises',
  name: 'Promises',
  label: 'What I Promise You',
  next: surpriseNode
};

const memoriesNode = {
  id: 'memories',
  name: 'Memories',
  label: 'Our Shared Memories',
  next: promisesNode
};

const letterNode = {
  id: 'letter',
  name: 'Letter',
  label: "My Heart's Letter",
  next: memoriesNode
};

const reasonsNode = {
  id: 'our-story',
  name: 'Reasons',
  label: 'Why I Love You',
  next: letterNode
};

const heroNode = {
  id: 'hero',
  name: 'Home',
  label: 'Entrance',
  next: reasonsNode
};

// Head of the Linked List
const HEAD_NODE = heroNode;

// Helper function to traverse the Linked List and build a flat array for rendering and hooks
const traverseLinkedList = (head) => {
  const nodes = [];
  let curr = head;
  while (curr) {
    nodes.push(curr);
    curr = curr.next;
  }
  return nodes;
};

const SECTIONS_LIST = traverseLinkedList(HEAD_NODE);
const SECTIONS_IDS = SECTIONS_LIST.map(node => node.id);

export default function App() {
  const [introPlaying, setIntroPlaying] = useState(() => {
    return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('skipIntro')
      ? false
      : true;
  });

  const [isExpired, setIsExpired] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('love-theme') || 'classic';
    }
    return 'classic';
  });

  const [activeNode, setActiveNode] = useState(0);
  const [unlockedDepth, setUnlockedDepth] = useState(0);
  const [animatingConnector, setAnimatingConnector] = useState(null);
  const [isBlackout, setIsBlackout] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [surpriseCompleted, setSurpriseCompleted] = useState(false);
  const setData = useDataStore((state) => state.setData);

  useEffect(() => {
    // Check for encoded data in URL
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('d');
    const shortId = urlParams.get('id');

    if (encodedData) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          
          // Expiration Check (24 hours = 86,400,000 ms)
          if (parsed.createdAt) {
            const age = Date.now() - parsed.createdAt;
            if (age > 24 * 60 * 60 * 1000) {
              setIsExpired(true);
              return;
            }
          }

          setData({ ...DEFAULT_DATA, ...parsed });
          if (parsed.styleTheme) {
            setTheme(parsed.styleTheme);
          }
        }
      } catch (e) {
        console.error("Failed to parse URL data", e);
      }
    } else if (shortId) {
      // Fetch from backend disk cache
      fetch(`/api/wishes/${shortId}`)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(parsed => {
          setData({ ...DEFAULT_DATA, ...parsed });
          if (parsed.styleTheme) {
            setTheme(parsed.styleTheme);
          }
        })
        .catch(e => {
          console.error("Failed to load server wish", e);
        });
    }
  }, [setData]);

  // Synchronize builder active section in preview mode
  useEffect(() => {
    if (introPlaying || isExpired) return;
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get('activeStep');
    if (stepParam !== null) {
      const stepIndex = parseInt(stepParam, 10);
      if (!isNaN(stepIndex)) {
        // Unlock all sections up to this step index
        setUnlockedDepth(prev => Math.max(prev, stepIndex));
        
        // Smoothly scroll the preview viewport to the current section
        const node = SECTIONS_LIST[stepIndex];
        if (node) {
          setTimeout(() => {
            const el = document.getElementById(node.id);
            if (el) {
              el.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
          }, 350);
        }
      }
    }
  }, [introPlaying, isExpired]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('love-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (introPlaying || isBlackout) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [introPlaying, isBlackout]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, null, ' ');
    }
  }, []);

  // Intersection Observer Scroll Spy to track active node
  useEffect(() => {
    if (introPlaying || isExpired) return;

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = SECTIONS_IDS.indexOf(entry.target.id);
          if (index !== -1) {
            setActiveNode(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    SECTIONS_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      SECTIONS_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [introPlaying, isExpired]);

  // Spotlight mouse listener
  useEffect(() => {
    if (!isBlackout) return;
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isBlackout]);

  const handleNodeClick = (index, id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextNode = (index) => {
    if (index >= SECTIONS_LIST.length - 1) return;
    
    // Trigger animated pointer line drawing
    setAnimatingConnector(index);
    
    // Unlock next depth and scroll target into view mid-way through animation
    setTimeout(() => {
      setUnlockedDepth(prev => Math.max(prev, index + 1));
      
      const nextNode = SECTIONS_LIST[index].next;
      if (nextNode) {
        const el = document.getElementById(nextNode.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 450);
  };

  const handleReset = () => {
    setIsBlackout(false);
    setUnlockedDepth(0);
    setAnimatingConnector(null);
    setSurpriseCompleted(false);
    setTimeout(() => {
      const el = document.getElementById('hero');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const isPreviewMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('activeStep');

  // Hide scrollbars in the preview iframe by adding a class to <html>
  useEffect(() => {
    if (isPreviewMode) {
      document.documentElement.classList.add('preview-mode');
    }
    return () => {
      document.documentElement.classList.remove('preview-mode');
    };
  }, [isPreviewMode]);

  if (isExpired) {
    return <ExpiredLink />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Premium Preloader Animation */}
      {introPlaying && <PremiumPreloader onComplete={() => setIntroPlaying(false)} />}

      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      
      {/* Custom cursor element */}
      <CustomCursor />

      {/* Interactive Cursor Aura */}
      <MouseGlowEffect />

      {/* Floating Heart Particle Click Effect */}
      <HeartClickEffect />
      
      {/* Floating Spotify Music Card */}
      {!introPlaying && <SpotifyPlayer isBlackout={isBlackout} />}

      {/* SaaS Stepper dot navigation & Theme Settings Control (Hidden in preview mode to save space) */}
      {!introPlaying && !isBlackout && !isPreviewMode && (
        <SaaSSidebarNav
          activeNode={activeNode}
          unlockedDepth={unlockedDepth}
          onNodeClick={handleNodeClick}
          theme={theme}
          setTheme={setTheme}
          onReset={handleReset}
        />
      )}

      {/* Cinematic Spotlight Mask */}
      <AnimatePresence>
        {isBlackout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 pointer-events-none z-35"
            style={{
              background: `radial-gradient(circle 240px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(7,1,4,0.97) 100%)`
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Foreground Content */}
      <div className={`relative z-10 flex flex-col min-h-screen transition-opacity duration-1000 ${isBlackout ? 'bg-black/20' : ''}`}>
        
        {/* Adjusted padding on mobile (px-2) and desktop left margin (pl-0 in preview mode) */}
        <main className={`flex-grow pt-4 md:pt-16 w-full max-w-5xl mx-auto px-2 md:px-8 ${isPreviewMode ? 'md:pl-0' : 'md:pl-20'}`}>
          
          {SECTIONS_LIST.map((node, index) => {
            const isUnlocked = index <= unlockedDepth;
            
            // Choose component dynamically
            let component = null;
            switch (node.id) {
              case 'hero':
                component = <Hero startAnimation={!introPlaying} onNext={() => handleNextNode(0)} />;
                break;
              case 'our-story':
                component = <ReasonsSection onNext={() => handleNextNode(1)} />;
                break;
              case 'letter':
                component = <LetterSection onNext={() => handleNextNode(2)} />;
                break;
              case 'memories':
                component = <MemoriesSection theme={theme} onNext={() => handleNextNode(3)} />;
                break;
              case 'promises':
                component = <PromisesSection onNext={() => handleNextNode(4)} />;
                break;
              case 'surprise':
                component = (
                  <SurpriseSection 
                    isBlackout={isBlackout}
                    setIsBlackout={setIsBlackout} 
                    onReset={handleReset}
                    onComplete={() => setSurpriseCompleted(true)}
                  />
                );
                break;
              default:
                break;
            }

            return (
              <div key={node.id} className="relative w-full">
                {/* Render vertical curved connector line if not the first node */}
                {index > 0 && (
                  <LinkedListConnector
                    fromNode={index - 1}
                    toNode={index}
                    isUnlocked={index <= unlockedDepth}
                    isAnimating={animatingConnector === index - 1}
                    onTransitionComplete={() => setAnimatingConnector(null)}
                  />
                )}
                
                {/* Section node content container with premium transition */}
                <div
                  id={node.id}
                  className={`w-full transition-all duration-[1000ms] scroll-mt-10 md:scroll-mt-16 ${
                    isUnlocked 
                      ? `opacity-100 ${isBlackout && node.id === 'surprise' ? '' : 'blur-none scale-100'} pointer-events-auto` 
                      : 'opacity-10 blur-[4px] scale-[0.98] pointer-events-none'
                  } ${node.id === 'hero' ? 'min-h-[calc(100vh-64px)] flex items-center justify-center' : ''}`}
                >
                  {component}
                </div>
              </div>
            );
          })}

          {/* Render TAIL Pointer to NULL Node at the end when surprise is completed */}
          {surpriseCompleted && !isBlackout && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full flex flex-col items-center mt-4 pb-24"
            >
              <LinkedListConnector
                fromNode={5}
                toNode={6} // Node 6 represents NULL/Infinity
                isUnlocked={true}
                isAnimating={false}
                onTransitionComplete={null}
              />
            </motion.div>
          )}

        </main>
        
        {!isBlackout && <Footer />}
      </div>
    </div>
  );
}
