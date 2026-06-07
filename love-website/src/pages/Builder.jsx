import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import LZString from 'lz-string';
import { DEFAULT_DATA } from '../store/useDataStore';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '99388c3b2a0929b882d2b3758d4a512f';

const STEPS = [
  { id: 'hero', label: '1. Recipient & Style', desc: 'Theme & layout options' },
  { id: 'reasons', label: '2. Story', desc: 'Why you love them' },
  { id: 'letter', label: '3. Letter', desc: 'Choose a writing prompt' },
  { id: 'memories', label: '4. Memories', desc: 'Photos & captions' },
  { id: 'promises', label: '5. Promises', desc: 'Your commitments' },
  { id: 'surprise', label: '6. Surprise', desc: 'Blowing the candle' },
];

const LETTER_TEMPLATES = {
  anniversary: "My Love,\n\nHappy anniversary. Looking back at our time together, I am filled with so much gratitude. You make every ordinary day feel extraordinary. Loving you is the easiest and most beautiful thing I've ever done.\n\nThank you for your warmth, your patience, and your endless laughter. Here's to another year of shared dreams, cozy mornings, and beautiful adventures.\n\nForever and always yours.",
  valentines: "Dearest,\n\nHappy Valentine's Day. Today is a celebration of love, but with you, every single day feels like Valentine's. You are my safe place, my soft landing, and my greatest adventure.\n\nThank you for holding my hand, sharing your life with me, and making me smile even on the hardest days. You hold my whole heart.\n\nWith all my love.",
  apology: "My Dearest,\n\nI am writing this because sometimes words fail me when we are face-to-face. I want to sincerely apologize for my mistakes. You mean the absolute world to me, and the last thing I ever want to do is hurt you.\n\nThank you for your grace, your patience, and for giving us the space to grow. I promise to listen better, love harder, and be the partner you truly deserve.\n\nAlways yours.",
  justbecause: "Hey You,\n\nNo special occasion today: just a quiet moment where I couldn't stop thinking about you. I wanted to write this to remind you how much you are loved, just because of who you are.\n\nThank you for being you, for your kindness, and for bringing so much light into my world. You make my life complete.\n\nLove you to the moon and back."
};

// Hold to Delete Component (Emil-Style Asymmetric Timing)
function HoldToDelete({ onDelete, className }) {
  const [isHolding, setIsHolding] = useState(false);

  return (
    <button
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
      onMouseLeave={() => setIsHolding(false)}
      onTouchStart={() => setIsHolding(true)}
      onTouchEnd={() => setIsHolding(false)}
      className={`relative overflow-hidden group interactive-scale ${className}`}
    >
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      
      {/* Progress Overlay (Asymmetric: 1.5s in, 160ms out) */}
      <motion.div
        className="absolute inset-0 bg-red-500/20 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHolding ? 1 : 0 }}
        transition={{ 
          duration: isHolding ? 1.5 : 0.16, 
          ease: isHolding ? "linear" : [0.23, 1, 0.32, 1] 
        }}
        onAnimationComplete={() => {
          if (isHolding) {
            onDelete();
            setIsHolding(false);
          }
        }}
      />
    </button>
  );
}

const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_DURATION = 120; // 120 seconds (2 minutes)

const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const MediaRenderer = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isVideo = src?.match(/\.(mp4|webm|mov|ogg)$/i) || src?.includes('video');
  const youtubeId = getYouTubeId(src);
  
  if (youtubeId) {
    return (
      <div className={`${className} relative overflow-hidden bg-black`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1`}
          title="YouTube Video"
          className="absolute inset-0 w-full h-full border-none pointer-events-none scale-[1.3]"
          allow="autoplay; encrypted-media"
          onLoad={() => setIsLoaded(true)}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className={`${className} relative overflow-hidden bg-black/10`}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-rose-deep/30 border-t-rose-deep rounded-full animate-spin" />
          </div>
        )}
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden bg-black/5`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-rose-deep/10 border-t-rose-deep/30 rounded-full animate-spin" />
        </div>
      )}
      <img 
        src={src} 
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default function Builder() {
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(DEFAULT_DATA)));
  const [activeStep, setActiveStep] = useState(0);
  const [shareLink, setShareLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // 'Uploading...' | 'Optimizing...'
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [skipIntro, setSkipIntro] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dragIndex, setDragIndex] = useState(null); // -1 for surprise, 0+ for memories
  
  // Real-time preview iframe URL
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewSynced, setIsPreviewSynced] = useState(true);

  // Clear error after 5s
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const hasExistingVideo = (excludeIndex = -1, excludeSurprise = false) => {
    const memoriesVideo = formData.memories.some((m, idx) => {
      if (idx === excludeIndex) return false;
      return m.image?.match(/\.(mp4|webm|mov|ogg)$/i) || m.image?.includes('video');
    });
    const surpriseVideo = !excludeSurprise && (formData.surprise.videoUrl?.match(/\.(mp4|webm|mov|ogg)$/i) || formData.surprise.videoUrl?.includes('video'));
    return memoriesVideo || surpriseVideo;
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => resolve(0);
      video.src = URL.createObjectURL(file);
    });
  };

  // Helper to generate the URL for the preview iframe
  const generatePreviewUrl = (data = formData, skipLoader = skipIntro) => {
    try {
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(data));
      const url = `${window.location.origin}/?d=${compressed}${skipLoader ? '&skipIntro=true' : ''}&activeStep=${activeStep}`;
      return url;
    } catch (e) {
      console.error(e);
      return '';
    }
  };

  // Sync the preview iframe URL
  const syncPreview = () => {
    setIsSyncing(true);
    const url = generatePreviewUrl(formData, skipIntro);
    setPreviewUrl(url);
    setIsPreviewSynced(true);
    setTimeout(() => setIsSyncing(false), 600);
  };

  // Keep track of unsynced changes
  useEffect(() => {
    setIsPreviewSynced(false);
  }, [formData, skipIntro]);

  // Initial sync & sync on step change
  useEffect(() => {
    syncPreview();
  }, [activeStep]);

  // Client-side Token-Bucket Image Upload Rate Limiter (5 uploads per 5 minutes)
  const checkUploadRateLimit = () => {
    const now = Date.now();
    const uploads = JSON.parse(localStorage.getItem('upload_timestamps') || '[]');
    const activeUploads = uploads.filter(t => now - t < 5 * 60 * 1000); // 5 minutes window
    
    if (activeUploads.length >= 10) { // Increased for better UX with videos
      return false; // Limit exceeded
    }
    
    activeUploads.push(now);
    localStorage.setItem('upload_timestamps', JSON.stringify(activeUploads));
    return true;
  };

  // Upload image to Imgbb
  const uploadToImgbb = async (file) => {
    const data = new FormData();
    data.append('image', file);
    data.append('key', IMGBB_API_KEY);
    data.append('expiration', 86400); // Auto delete after 1 day

    const res = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: data
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Upload failed');
    return json.data.url;
  };

  const handleMediaUpload = async (e, index, isSurprise = false) => {
    const file = e.target.files[0];
    if (!file) return;

    // Type detection
    const isVideo = file.type.startsWith('video/');
    
    if (isVideo) {
      // Direct video upload is technically unsupported by the current image-hosting provider.
      setErrorMessage("To ensure your story plays flawlessly across all devices, please use the YouTube Streaming Fallback for videos.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage("The image is too large. Please keep it under 10MB.");
      return;
    }

    if (!checkUploadRateLimit()) {
      setErrorMessage("Upload rate limit reached. Please wait a few minutes before adding more memories.");
      setIsUploading(false);
      setUploadProgress(null);
      return;
    }

    setIsUploading(true);
    setUploadProgress('Uploading...');
    
    try {
      const url = await uploadToImgbb(file);
      if (isSurprise) {
        setFormData(prev => ({ ...prev, surprise: { ...prev.surprise, videoUrl: url } }));
      } else {
        setFormData(prev => {
          const newData = { ...prev };
          newData.memories[index].image = url;
          return newData;
        });
      }
    } catch (err) {
      setErrorMessage("Failed to upload: " + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleImageUpload = (e, index) => handleMediaUpload(e, index, false);
  const handleSurpriseUpload = (e) => handleMediaUpload(e, null, true);

  const generateFinalLink = () => {
    const finalData = { ...formData, createdAt: Date.now() };
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(finalData));
    // Use production URL for final sharing, fallback to current origin for dev
    const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? window.location.origin 
      : 'https://lovecraft-cards.vercel.app';
    const url = `${baseUrl}/?d=${compressed}`;
    setShareLink(url);
    setShowSuccessModal(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragIndex(index);
  };

  const handleDragLeave = () => {
    setDragIndex(null);
  };

  const handleDrop = (e, index, isSurprise = false) => {
    e.preventDefault();
    setDragIndex(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      const mockEvent = { target: { files: [file] } };
      handleMediaUpload(mockEvent, index, isSurprise);
    }
  };

  const nextStep = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const applyTemplate = (key) => {
    if (confirm("Applying a template will overwrite your current letter. Would you like to proceed?")) {
      setFormData({
        ...formData,
        letter: LETTER_TEMPLATES[key]
      });
    }
  };

  return (
    <div className="min-h-screen bg-rose-blush text-rose-deep font-sans selection:bg-rose-deep/30 overflow-x-hidden flex flex-col builder-page relative">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      {/* Navbar */}
      <nav className="h-16 border-b border-rose-border/50 bg-rose-blush/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-8 max-w-[1500px] mx-auto w-full sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-white/40 border border-white/60 shadow-sm flex items-center justify-center cursor-pointer text-rose-deep/60 hover:text-rose-deep hover:bg-white/60 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.div>
          </Link>
          <span className="font-bold tracking-tight text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>LoveCraft Builder</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile Preview Trigger */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowPreviewModal(true)}
            className="md:hidden bg-white/40 border border-white/60 shadow-sm px-4 py-1.5 rounded-full text-xs font-semibold text-rose-deep/80 hover:text-rose-deep cursor-pointer"
          >
            👁️ Preview
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={generateFinalLink}
            disabled={isUploading}
            className="bg-rose-deep hover:bg-rose-dark active:scale-[0.97] transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] disabled:opacity-50 text-white px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors cursor-pointer shadow-lg shadow-rose-deep/20 focus:outline-none"
          >
            Generate Link
          </motion.button>
        </div>
      </nav>

      {/* Main Workspace Layout */}
      <div className="flex-grow max-w-[1500px] w-full mx-auto px-1 md:px-6 py-2 md:py-8 flex flex-col md:flex-row gap-4 md:gap-8 items-start relative h-[calc(100vh-64px)]">
        
        {/* Left-most Column: Stepper Indicators (Desktop Only) */}
        <div className="hidden lg:flex flex-col gap-6 w-56 sticky top-24 shrink-0 select-none">
          <div className="text-rose-deep/50 text-[10px] font-bold uppercase tracking-wider mb-2">Build Steps</div>
          <div className="relative pl-4 border-l border-rose-border flex flex-col gap-8">
            {STEPS.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className="flex flex-col items-start text-left group focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {/* Active stretching indicator (Emil-Style) */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeStepIndicator"
                          className="absolute inset-0 bg-rose-deep rounded-full -z-10"
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        />
                      )}
                      <div 
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                          isActive 
                            ? 'text-white border-transparent' 
                            : isCompleted 
                              ? 'bg-rose-medium/20 border-rose-medium/30 text-rose-medium' 
                              : 'bg-white/40 border-rose-border/50 text-rose-deep/50 group-hover:text-rose-deep group-hover:border-rose-border group-hover:bg-white/80'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                    </div>
                    <span 
                      className={`text-xs font-semibold tracking-wide transition-colors duration-200 ${
                        isActive ? 'text-rose-deep font-bold' : 'text-rose-deep/60 group-hover:text-rose-deep'
                      }`}
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-rose-deep/50 pl-9 mt-0.5 group-hover:text-rose-deep/70 transition-colors">
                    {step.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Column: Form Fields Card */}
        <div className="flex-grow w-full md:max-w-2xl lg:max-w-none h-full overflow-y-auto pr-0 md:pr-4 select-none pb-24">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              layoutId="builderMain"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="bg-transparent md:bg-white/50 md:border md:border-white/60 shadow-xl shadow-rose-deep/5 backdrop-blur-md rounded-2xl p-1 md:p-8 relative"
            >
              <h2 className="text-2xl font-semibold mb-6 text-rose-dark-accent" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {STEPS[activeStep].label.split('. ')[1]}
              </h2>

              {/* Step 0: Hero Recipient & Theme Selectors */}
              {activeStep === 0 && (
                <div className="space-y-6">
                  {/* Recipient Name Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-rose-deep/60 mb-2">Recipient Name</label>
                    <input 
                      type="text"
                      className="w-full bg-white/60 border border-white/80 rounded-xl p-3.5 text-rose-deep focus:outline-none focus:border-rose-deep focus:ring-1 focus:ring-rose-deep placeholder-rose-deep/40 transition-all duration-200 text-sm font-medium"
                      value={formData.hero.name}
                      onChange={e => setFormData({ ...formData, hero: { name: e.target.value } })}
                      placeholder="e.g. Evelyn"
                    />
                  </div>

                  {/* Theme Presets */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-rose-deep/60 mb-3">Styling Theme</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'classic', label: 'Classic Rose', desc: 'Soft pink background with crimson accents' },
                        { id: 'midnight', label: 'Midnight Crimson', desc: 'Dark charcoal canvas with deep rose highlights' },
                        { id: 'lavender', label: 'Lavender Dream', desc: 'Dreamy light purple styling with violet tokens' },
                        { id: 'sunset', label: 'Sunset Amber', desc: 'Warm chalk background with rich orange details' }
                      ].map(themeItem => (
                        <button
                          key={themeItem.id}
                          onClick={() => setFormData({ ...formData, styleTheme: themeItem.id })}
                          className={`p-4 rounded-xl text-left border cursor-pointer transition-all duration-200 focus:outline-none ${formData.styleTheme === themeItem.id ? 'border-rose-deep bg-rose-blush shadow-md' : 'border-white/60 bg-white/40 shadow-sm hover:border-rose-border'}`}
                        >
                          <span className="block text-xs font-bold text-rose-deep mb-1">{themeItem.label}</span>
                          <span className="block text-[10px] text-rose-deep/60 leading-normal">{themeItem.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Grid Preset */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-rose-deep/60 mb-3">Gallery Layout Style</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'circular', label: 'WebGL Ribbon', desc: 'Curved panoramic pan' },
                        { id: 'bento', label: 'Bento Grid', desc: 'Asymmetric layout' },
                        { id: 'marquee', label: 'Cinematic Marquee', desc: 'Endless smooth scroll' }
                      ].map(gridItem => (
                        <button
                          key={gridItem.id}
                          onClick={() => setFormData({ ...formData, gridStyle: gridItem.id })}
                          className={`p-3.5 rounded-xl text-left border cursor-pointer transition-all duration-200 focus:outline-none ${formData.gridStyle === gridItem.id ? 'border-rose-deep bg-rose-blush shadow-md' : 'border-white/60 bg-white/40 shadow-sm hover:border-rose-border'}`}
                        >
                          <span className="block text-xs font-bold text-rose-deep mb-1">{gridItem.label}</span>
                          <span className="block text-[9px] text-rose-deep/60 leading-normal">{gridItem.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Reasons why you love them */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-rose-deep/60 leading-relaxed mb-4">List the little reasons why they hold a special place in your heart. Click any text area to edit.</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {formData.reasons.map((reason, i) => (
                      <div key={i} className="bg-white/60 border border-white/80 shadow-sm p-4 rounded-xl flex gap-3 items-start relative group">
                        <span className="text-[10px] font-bold text-rose-deep opacity-60 mt-1.5 font-mono">{String(i + 1).padStart(2, '0')}</span>
                        <textarea 
                          className="flex-grow bg-transparent border-none focus:ring-0 p-0 text-rose-deep/80 focus:text-rose-deep text-sm leading-relaxed resize-none h-16 focus:outline-none"
                          value={reason}
                          onChange={e => {
                            const newReasons = [...formData.reasons];
                            newReasons[i] = e.target.value;
                            setFormData({ ...formData, reasons: newReasons });
                          }}
                        />
                        <button 
                          onClick={() => {
                            const newReasons = formData.reasons.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, reasons: newReasons });
                          }}
                          className="text-rose-deep/20 hover:text-rose-deep transition-colors p-1.5 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer self-center"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormData({ ...formData, reasons: [...formData.reasons, "I love how you..."] })}
                    className="mt-4 text-xs bg-white/40 border border-white/60 shadow-sm hover:bg-white/60 text-rose-deep/80 py-2 px-4 rounded-xl font-semibold cursor-pointer transition-all focus:outline-none"
                  >
                    + Add Reason
                  </motion.button>
                </div>
              )}

              {/* Step 2: The Letter & Writing Templates */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  {/* Template Prompt Helpers */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-rose-deep/60 mb-2">Need inspiration? Choose a writing prompt:</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        { id: 'anniversary', label: 'Anniversary' },
                        { id: 'valentines', label: "Valentine's" },
                        { id: 'apology', label: 'Apology' },
                        { id: 'justbecause', label: 'Just Because' }
                      ].map(template => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => applyTemplate(template.id)}
                          className="bg-white/40 border border-white/60 shadow-sm hover:bg-rose-light-accent hover:border-rose-border text-rose-deep/80 hover:text-rose-deep px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          ✍️ {template.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    className="w-full bg-white/60 border border-white/80 rounded-xl p-4 h-56 focus:outline-none focus:border-rose-deep focus:ring-1 focus:ring-rose-deep text-rose-deep/85 focus:text-rose-deep text-sm leading-relaxed resize-y font-normal"
                    value={formData.letter}
                    onChange={e => setFormData({ ...formData, letter: e.target.value })}
                    placeholder="Dearest..."
                  />
                </div>
              )}

              {/* Step 3: Memories Gallery */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-rose-deep/60 leading-relaxed mb-4">Upload or drag and drop pictures and short videos that tell your story. They will arrange into an interactive 3D rotating cylinder.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.memories.map((mem, i) => (
                      <div key={i} className="bg-white/60 border border-white/80 shadow-sm p-4 rounded-xl flex flex-col gap-3 relative group">
                        
                        <div 
                          onDragOver={(e) => handleDragOver(e, i)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, i)}
                          className={`relative aspect-[4/3] rounded-lg overflow-hidden border transition-all duration-300 flex items-center justify-center ${dragIndex === i ? 'border-rose-deep bg-rose-deep/5 scale-[1.02]' : 'border-white/10 bg-rose-blush/30'}`}
                        >
                          {isUploading && !mem.image ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-6 h-6 border-2 border-rose-deep border-t-transparent rounded-full animate-spin" />
                              <span className="text-[10px] font-bold text-rose-deep/60 uppercase tracking-wider">{uploadProgress || 'Uploading...'}</span>
                            </div>
                          ) : mem.image ? (
                            <>
                              <MediaRenderer src={mem.image} alt="preview" className="w-full h-full object-cover" />
                              <label className="absolute bottom-2 right-2 bg-black/75 hover:bg-black text-rose-deep text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors border border-white/10 select-none z-20">
                                {isUploading ? '...' : 'Change'}
                                <input type="file" accept="image/*,video/*" className="hidden" disabled={isUploading} onChange={e => handleImageUpload(e, i)} />
                              </label>
                            </>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors text-rose-deep/60 select-none">
                              <svg className="w-6 h-6 mb-1 text-rose-deep opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="text-[11px] font-medium">{dragIndex === i ? 'Drop to Upload' : 'Upload or Drag Media'}</span>
                              <input type="file" accept="image/*,video/*" className="hidden" disabled={isUploading} onChange={e => handleImageUpload(e, i)} />
                            </label>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <input 
                            type="text"
                            className="w-full bg-white/60 border border-white/80 rounded-lg p-2.5 text-xs text-rose-deep focus:outline-none focus:border-rose-deep transition-all placeholder-rose-deep/40"
                            value={mem.text}
                            onChange={e => {
                              const newMems = [...formData.memories];
                              newMems[i].text = e.target.value;
                              setFormData({ ...formData, memories: newMems });
                            }}
                            placeholder="e.g. Our First Date"
                          />
                        </div>

                        <HoldToDelete 
                          onDelete={() => {
                            const newMems = formData.memories.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, memories: newMems });
                          }}
                          className="absolute top-2 right-2 w-8 h-8 text-rose-deep/50 hover:text-red-500 bg-white/80 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormData({ ...formData, memories: [...formData.memories, { image: '', text: '' }] })}
                    className="mt-4 text-xs bg-white/40 border border-white/60 shadow-sm hover:bg-white/60 text-rose-deep/80 py-2 px-4 rounded-xl font-semibold cursor-pointer transition-all focus:outline-none interactive-scale"
                  >
                    + Add Photo Slot
                  </motion.button>
                </div>
              )}

              {/* Step 4: Your Promises */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <p className="text-xs text-rose-deep/60 leading-relaxed mb-4">Write pledges or promises you want to make to them. Keep them sweet and sincere.</p>
                  
                  <div className="space-y-3">
                    {formData.promises.map((promise, i) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          type="text"
                          className="flex-grow bg-white/60 border border-white/80 rounded-xl p-3 text-sm text-rose-deep focus:outline-none focus:border-rose-deep focus:ring-1 focus:ring-rose-deep transition-all"
                          value={promise}
                          onChange={e => {
                            const newPromises = [...formData.promises];
                            newPromises[i] = e.target.value;
                            setFormData({ ...formData, promises: newPromises });
                          }}
                        />
                        <HoldToDelete 
                          onDelete={() => {
                            const newPromises = formData.promises.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, promises: newPromises });
                          }}
                          className="w-11 h-11 rounded-xl text-rose-deep/40 hover:text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormData({ ...formData, promises: [...formData.promises, "I promise to..."] })}
                    className="mt-4 text-xs bg-white/40 border border-white/60 shadow-sm hover:bg-white/60 text-rose-deep/80 py-2 px-4 rounded-xl font-semibold cursor-pointer transition-all focus:outline-none interactive-scale"
                  >
                    + Add Promise
                  </motion.button>
                </div>
              )}

              {/* Step 5: Surprise Message */}
              {activeStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-rose-deep/60 mb-2">Final Surprise Message</label>
                    <p className="text-xs text-rose-deep/60 leading-relaxed mb-3">This message is revealed with a glowing surprise after they blow out the digital candle.</p>
                    <textarea 
                      className="w-full bg-white/60 border border-white/80 rounded-xl p-4 h-36 focus:outline-none focus:border-rose-deep focus:ring-1 focus:ring-rose-deep text-rose-deep/85 focus:text-rose-deep text-sm leading-relaxed resize-y font-normal"
                      value={formData.surprise.message}
                      onChange={e => setFormData({ ...formData, surprise: { ...formData.surprise, message: e.target.value } })}
                      placeholder="Write the final sweet words..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-rose-deep/60 mb-2">Secret Video Reveal (Optional)</label>
                    <p className="text-xs text-rose-deep/60 leading-relaxed mb-4">Upload or drag and drop a secret video. If your video is over 2GB, use the YouTube fallback below.</p>
                    
                    <div className="flex flex-col gap-6">
                      <div className="bg-white/60 border border-white/80 shadow-sm p-4 rounded-xl flex flex-col gap-3 relative group max-w-sm">
                        <div 
                          onDragOver={(e) => handleDragOver(e, -1)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, -1, true)}
                          className={`relative aspect-video rounded-lg overflow-hidden border transition-all duration-300 flex items-center justify-center ${dragIndex === -1 ? 'border-rose-deep bg-rose-deep/5 scale-[1.02]' : 'border-white/10 bg-rose-blush/30'}`}
                        >
                          {isUploading && !formData.surprise.videoUrl ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-6 h-6 border-2 border-rose-deep border-t-transparent rounded-full animate-spin" />
                              <span className="text-[10px] font-bold text-rose-deep/60 uppercase tracking-wider">{uploadProgress || 'Processing...'}</span>
                            </div>
                          ) : formData.surprise.videoUrl ? (
                            <>
                              <MediaRenderer src={formData.surprise.videoUrl} className="w-full h-full object-cover" />
                              <label className="absolute bottom-2 right-2 bg-black/75 hover:bg-black text-rose-deep text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors border border-white/10 select-none z-20">
                                {isUploading ? '...' : 'Change'}
                                <input type="file" accept="video/*" className="hidden" disabled={isUploading} onChange={handleSurpriseUpload} />
                              </label>
                            </>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors text-rose-deep/60 select-none">
                              <svg className="w-6 h-6 mb-1 text-rose-deep opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span className="text-[11px] font-medium">{dragIndex === -1 ? 'Drop Video Here' : 'Upload or Drag Video'}</span>
                              <input type="file" accept="video/*" className="hidden" disabled={isUploading} onChange={handleSurpriseUpload} />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* YouTube Fallback UI */}
                      <div className="bg-rose-blush/20 border border-rose-border/30 p-5 rounded-2xl max-w-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93 0.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-0.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-deep/70">YouTube Streaming Fallback</span>
                        </div>
                        <p className="text-[10px] text-rose-deep/50 leading-relaxed mb-4">
                          If your video is too large or fails to upload, you can paste a YouTube link here. We will stream it directly into your story.
                        </p>
                        <input 
                          type="text"
                          placeholder="Paste YouTube URL (e.g. youtube.com/watch?v=...)"
                          className="w-full bg-white/60 border border-white/80 rounded-xl p-3 text-[11px] text-rose-deep focus:outline-none focus:border-rose-deep transition-all placeholder:text-rose-deep/30"
                          value={formData.surprise.videoUrl?.includes('youtube') || formData.surprise.videoUrl?.includes('youtu.be') ? formData.surprise.videoUrl : ''}
                          onChange={(e) => setFormData({ ...formData, surprise: { ...formData.surprise, videoUrl: e.target.value } })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Back / Next Nav controls */}
              <div className="mt-8 pt-6 border-t border-rose-border/50 flex justify-between items-center select-none">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={activeStep === 0}
                  onClick={prevStep}
                  className="px-4 py-2 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-deep/60 hover:text-rose-deep hover:bg-white/5 disabled:opacity-20 cursor-pointer focus:outline-none interactive-scale"
                >
                  Back
                </motion.button>
                
                {activeStep < STEPS.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={nextStep}
                    className="bg-white/10 hover:bg-white/80 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-deep cursor-pointer focus:outline-none interactive-scale"
                  >
                    Next Step
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={generateFinalLink}
                    disabled={isUploading}
                    className="bg-rose-deep hover:bg-rose-dark active:scale-[0.97] transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white cursor-pointer focus:outline-none shadow-lg shadow-rose-deep/20 interactive-scale"
                  >
                    Generate Link
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Right Column: Live Mockup Viewport (Desktop Only) */}
        <div className="hidden md:flex flex-col items-center shrink-0 w-80 sticky top-24 select-none">
          <div className="w-full flex items-center justify-between px-2 mb-4">
            <span className="text-[10px] font-bold text-rose-deep/50 uppercase tracking-wider flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isPreviewSynced ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              {isPreviewSynced ? 'Preview Synced' : 'Sync Needed'}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSkipIntro(!skipIntro)}
                className="text-[9px] font-bold tracking-wider text-rose-deep/60 hover:text-rose-deep uppercase transition-colors focus:outline-none select-none cursor-pointer interactive-scale"
              >
                {skipIntro ? '⚡ Skip Intro' : '🎬 View Intro'}
              </button>
              <button
                onClick={syncPreview}
                className="text-[9px] bg-white/40 border border-white/60 shadow-sm hover:bg-white/60 hover:border-white/20 text-rose-deep/70 px-2.5 py-1 rounded-md transition-all font-bold uppercase tracking-wider cursor-pointer interactive-scale"
              >
                Sync
              </button>
            </div>
          </div>

          {/* Smartphone bezel frame */}
          <div className={`relative w-80 aspect-[9/18.5] bg-black border-[12px] border-neutral-900 rounded-[42px] shadow-[0_25px_60px_-15px_rgba(225,29,72,0.1)] overflow-hidden border-solid outline outline-1 outline-white/10 transition-all duration-500 ${isSyncing ? 'blur-[2px] opacity-80 scale-[0.99]' : 'blur-0 opacity-100 scale-100'}`}>
            {/* Dynamic Island Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-neutral-900/60 rounded-full ml-auto mr-3 border border-rose-border/50" />
            </div>
            
            {/* Iframe View */}
            {previewUrl ? (
              <iframe 
                src={previewUrl}
                title="Love Website Preview"
                className="w-full h-full border-none pointer-events-auto bg-rose-blush"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-rose-blush text-center p-6 text-rose-deep/50">
                <svg className="w-8 h-8 mb-3 text-rose-deep/10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Preparing preview...</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Floating Action Button for Mobile Preview */}
      <AnimatePresence>
        {showPreviewModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center md:hidden"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full h-[90dvh] bg-rose-blush rounded-t-[32px] border-t border-white/10 flex flex-col relative overflow-hidden"
            >
              {/* Header */}
              <div className="h-14 border-b border-rose-border/50 px-6 flex items-center justify-between select-none">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-deep/60">Live Preview Mockup</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSkipIntro(!skipIntro)}
                    className="text-[9px] font-bold tracking-wider text-rose-deep/60 uppercase cursor-pointer interactive-scale"
                  >
                    {skipIntro ? '⚡ Skip Intro' : '🎬 View Intro'}
                  </button>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="w-8 h-8 bg-white/40 border border-white/60 shadow-sm rounded-full flex items-center justify-center text-rose-deep/70 hover:text-rose-deep cursor-pointer interactive-scale"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Responsive Iframe Frame */}
              <div className="flex-grow p-4 pb-8 flex items-center justify-center">
                <div className={`w-full h-full max-w-sm rounded-[32px] overflow-hidden border border-white/10 bg-rose-blush transition-all duration-500 ${isSyncing ? 'blur-[2px] scale-[0.98]' : 'blur-0 scale-100'}`}>
                  <iframe 
                    src={previewUrl}
                    title="Mobile Preview Frame"
                    className="w-full h-full border-none pointer-events-auto bg-rose-blush"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Link Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              layoutId="builderMain"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-lg bg-white shadow-2xl border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col items-center relative overflow-hidden select-none"
            >
              {/* Checkmark drawing SVG */}
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>

              <h3 className="text-rose-deep text-2xl font-bold tracking-tight mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Link is Ready!</h3>
              <p className="text-rose-deep/60 mb-6 text-center text-xs md:text-sm leading-relaxed max-w-sm">Share this special link with your loved one. All custom details and photos are compressed and encrypted directly inside the URL.</p>
              
              <div className="w-full flex flex-col gap-3">
                <input 
                  readOnly
                  value={shareLink}
                  onClick={(e) => e.target.select()}
                  className="w-full p-3.5 border border-white/10 rounded-xl bg-white/[0.03] text-rose-deep/80 text-xs font-mono focus:outline-none select-all text-center tracking-tight"
                />
                
                <div className="flex flex-col sm:flex-row w-full gap-3 mt-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={copyLink}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-rose-deep font-semibold py-3 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm focus:outline-none interactive-scale"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.25" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Copy Link
                  </motion.button>
                  <a 
                    href={shareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white/5 hover:bg-white/60 border border-white/10 text-rose-deep font-semibold py-3 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-center cursor-pointer shadow-sm text-sm interactive-scale"
                  >
                    <svg className="w-4 h-4 text-rose-deep" fill="none" stroke="currentColor" strokeWidth="2.25" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview Link
                  </a>
                </div>
              </div>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-rose-deep/50 hover:text-rose-deep p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer focus:outline-none interactive-scale"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Error Toast */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] bg-[#1a050a]/90 backdrop-blur-md border border-red-500/20 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-[90vw]"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-white text-xs font-medium leading-relaxed">{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="ml-auto text-white/40 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
