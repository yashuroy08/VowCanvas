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
  justbecause: "Hey You,\n\nNo special occasion today — just a quiet moment where I couldn't stop thinking about you. I wanted to write this to remind you how much you are loved, just because of who you are.\n\nThank you for being you, for your kindness, and for bringing so much light into my world. You make my life complete.\n\nLove you to the moon and back."
};

export default function Builder() {
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(DEFAULT_DATA)));
  const [activeStep, setActiveStep] = useState(0);
  const [shareLink, setShareLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [skipIntro, setSkipIntro] = useState(true);
  
  // Real-time preview iframe URL
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewSynced, setIsPreviewSynced] = useState(true);

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
    const url = generatePreviewUrl(formData, skipIntro);
    setPreviewUrl(url);
    setIsPreviewSynced(true);
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
    
    if (activeUploads.length >= 5) {
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

    const res = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: data
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Upload failed');
    return json.data.url;
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!checkUploadRateLimit()) {
      alert("Upload rate limit exceeded. You can only upload 5 images every 5 minutes to prevent spamming the upload service.");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setFormData(prev => {
        const newData = { ...prev };
        newData.memories[index].image = url;
        return newData;
      });
    } catch (err) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const generateFinalLink = () => {
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(formData));
    const url = `${window.location.origin}/?d=${compressed}`;
    setShareLink(url);
    setShowSuccessModal(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
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
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] font-sans selection:bg-[#e11d48]/30 overflow-x-hidden flex flex-col builder-page">
      
      {/* Navbar */}
      <nav className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-8 max-w-[1500px] mx-auto w-full sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer text-white/60 hover:text-white hover:bg-white/10 transition-colors"
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
            className="md:hidden bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white cursor-pointer"
          >
            👁️ Preview
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={generateFinalLink}
            disabled={isUploading}
            className="bg-[#e11d48] hover:bg-[#be123c] disabled:opacity-50 text-white px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors cursor-pointer shadow-lg shadow-[#e11d48]/20 focus:outline-none"
          >
            Generate Link
          </motion.button>
        </div>
      </nav>

      {/* Main Workspace Layout */}
      <div className="flex-grow max-w-[1500px] w-full mx-auto px-3 md:px-6 py-4 md:py-8 flex flex-col md:flex-row gap-4 md:gap-8 items-start relative h-[calc(100vh-64px)]">
        
        {/* Left-most Column: Stepper Indicators (Desktop Only) */}
        <div className="hidden lg:flex flex-col gap-6 w-56 sticky top-24 shrink-0 select-none">
          <div className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">Build Steps</div>
          <div className="relative pl-4 border-l border-white/5 flex flex-col gap-8">
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
                      {/* Active glowing ring */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeStepGlow"
                          className="absolute -inset-1.5 bg-[#e11d48]/25 rounded-full blur-[4px] -z-10"
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        />
                      )}
                      <div 
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                          isActive 
                            ? 'bg-[#e11d48] border-[#e11d48] text-white' 
                            : isCompleted 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                              : 'bg-white/[0.02] border-white/10 text-white/30 group-hover:text-white/60 group-hover:border-white/20'
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
                        isActive ? 'text-white font-bold' : 'text-white/40 group-hover:text-white/60'
                      }`}
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/20 pl-9 mt-0.5 group-hover:text-white/35 transition-colors">
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-md rounded-2xl p-4 md:p-8 relative"
            >
              <h2 className="text-2xl font-semibold mb-6 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {STEPS[activeStep].label.split('. ')[1]}
              </h2>

              {/* Step 0: Hero Recipient & Theme Selectors */}
              {activeStep === 0 && (
                <div className="space-y-6">
                  {/* Recipient Name Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Recipient Name</label>
                    <input 
                      type="text"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] placeholder-white/20 transition-all duration-200 text-sm font-medium"
                      value={formData.hero.name}
                      onChange={e => setFormData({ ...formData, hero: { name: e.target.value } })}
                      placeholder="e.g. Evelyn"
                    />
                  </div>

                  {/* Theme Presets */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Styling Theme</label>
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
                          className={`p-4 rounded-xl text-left border cursor-pointer transition-all duration-200 focus:outline-none ${formData.styleTheme === themeItem.id ? 'border-[#e11d48] bg-[#e11d48]/5' : 'border-white/5 bg-white/[0.01] hover:border-white/15'}`}
                        >
                          <span className="block text-xs font-bold text-white mb-1">{themeItem.label}</span>
                          <span className="block text-[10px] text-white/40 leading-normal">{themeItem.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Grid Preset */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Gallery Layout Style</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'circular', label: 'WebGL Ribbon', desc: 'Curved panoramic pan' },
                        { id: 'cylinder', label: '3D Cylinder', desc: 'GSAP scroll wheel' },
                        { id: 'bento', label: 'Bento Grid', desc: 'Asymmetric layout' }
                      ].map(gridItem => (
                        <button
                          key={gridItem.id}
                          onClick={() => setFormData({ ...formData, gridStyle: gridItem.id })}
                          className={`p-3.5 rounded-xl text-left border cursor-pointer transition-all duration-200 focus:outline-none ${formData.gridStyle === gridItem.id ? 'border-[#e11d48] bg-[#e11d48]/5' : 'border-white/5 bg-white/[0.01] hover:border-white/15'}`}
                        >
                          <span className="block text-xs font-bold text-white mb-1">{gridItem.label}</span>
                          <span className="block text-[9px] text-white/40 leading-normal">{gridItem.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Reasons why you love them */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-white/40 leading-relaxed mb-4">List the little reasons why they hold a special place in your heart. Click any text area to edit.</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {formData.reasons.map((reason, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl flex gap-3 items-start relative group">
                        <span className="text-[10px] font-bold text-[#e11d48] opacity-60 mt-1.5 font-mono">{String(i + 1).padStart(2, '0')}</span>
                        <textarea 
                          className="flex-grow bg-transparent border-none focus:ring-0 p-0 text-white/80 focus:text-white text-sm leading-relaxed resize-none h-16 focus:outline-none"
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
                          className="text-white/20 hover:text-[#e11d48] transition-colors p-1.5 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer self-center"
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
                    className="mt-4 text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 py-2 px-4 rounded-xl font-semibold cursor-pointer transition-all focus:outline-none"
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Need inspiration? Choose a writing prompt:</label>
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
                          className="bg-white/5 border border-white/10 hover:bg-[#e11d48]/10 hover:border-[#e11d48]/30 text-white/80 hover:text-[#e11d48] px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          ✍️ {template.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 h-56 focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] text-white/85 focus:text-white text-sm leading-relaxed resize-y font-normal"
                    value={formData.letter}
                    onChange={e => setFormData({ ...formData, letter: e.target.value })}
                    placeholder="Dearest..."
                  />
                </div>
              )}

              {/* Step 3: Memories Gallery */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-white/40 leading-relaxed mb-4">Upload pictures that tell your story. They will arrange into an interactive 3D rotating cylinder.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.memories.map((mem, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl flex flex-col gap-3 relative group">
                        
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 bg-white/[0.01] flex items-center justify-center">
                          {mem.image ? (
                            <>
                              <img src={mem.image} alt="preview" className="w-full h-full object-cover" />
                              <label className="absolute bottom-2 right-2 bg-black/75 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors border border-white/10 select-none">
                                Change
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, i)} />
                              </label>
                            </>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors text-white/40 select-none">
                              <svg className="w-6 h-6 mb-1 text-[#e11d48] opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="text-[11px] font-medium">Upload Image</span>
                              <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, i)} />
                            </label>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <input 
                            type="text"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#e11d48] transition-all placeholder-white/20"
                            value={mem.text}
                            onChange={e => {
                              const newMems = [...formData.memories];
                              newMems[i].text = e.target.value;
                              setFormData({ ...formData, memories: newMems });
                            }}
                            placeholder="e.g. Our First Date"
                          />
                        </div>

                        <button 
                          onClick={() => {
                            const newMems = formData.memories.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, memories: newMems });
                          }}
                          className="absolute top-2 right-2 text-white/30 hover:text-red-400 bg-black/60 backdrop-blur-md p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormData({ ...formData, memories: [...formData.memories, { image: '', text: '' }] })}
                    className="mt-4 text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 py-2 px-4 rounded-xl font-semibold cursor-pointer transition-all focus:outline-none"
                  >
                    + Add Photo Slot
                  </motion.button>
                </div>
              )}

              {/* Step 4: Your Promises */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <p className="text-xs text-white/40 leading-relaxed mb-4">Write pledges or promises you want to make to them. Keep them sweet and sincere.</p>
                  
                  <div className="space-y-3">
                    {formData.promises.map((promise, i) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          type="text"
                          className="flex-grow bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all"
                          value={promise}
                          onChange={e => {
                            const newPromises = [...formData.promises];
                            newPromises[i] = e.target.value;
                            setFormData({ ...formData, promises: newPromises });
                          }}
                        />
                        <button 
                          onClick={() => {
                            const newPromises = formData.promises.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, promises: newPromises });
                          }}
                          className="px-3 text-white/40 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors cursor-pointer"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormData({ ...formData, promises: [...formData.promises, "I promise to..."] })}
                    className="mt-4 text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 py-2 px-4 rounded-xl font-semibold cursor-pointer transition-all focus:outline-none"
                  >
                    + Add Promise
                  </motion.button>
                </div>
              )}

              {/* Step 5: Surprise Message */}
              {activeStep === 5 && (
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Final Surprise Message</label>
                  <p className="text-xs text-white/40 leading-relaxed">This message is revealed with a glowing surprise after they blow out the digital candle.</p>
                  <textarea 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 h-36 focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] text-white/85 focus:text-white text-sm leading-relaxed resize-y font-normal"
                    value={formData.surprise.message}
                    onChange={e => setFormData({ ...formData, surprise: { ...formData.surprise, message: e.target.value } })}
                    placeholder="Write the final sweet words..."
                  />
                </div>
              )}

              {/* Back / Next Nav controls */}
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center select-none">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={activeStep === 0}
                  onClick={prevStep}
                  className="px-4 py-2 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-20 cursor-pointer focus:outline-none"
                >
                  Back
                </motion.button>
                
                {activeStep < STEPS.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={nextStep}
                    className="bg-white/10 hover:bg-white/15 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white cursor-pointer focus:outline-none"
                  >
                    Next Step
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={generateFinalLink}
                    disabled={isUploading}
                    className="bg-[#e11d48] hover:bg-[#be123c] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white cursor-pointer focus:outline-none shadow-lg shadow-[#e11d48]/20"
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
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isPreviewSynced ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              {isPreviewSynced ? 'Preview Synced' : 'Sync Needed'}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSkipIntro(!skipIntro)}
                className="text-[9px] font-bold tracking-wider text-white/40 hover:text-white uppercase transition-colors focus:outline-none select-none cursor-pointer"
              >
                {skipIntro ? '⚡ Skip Intro' : '🎬 View Intro'}
              </button>
              <button
                onClick={syncPreview}
                className="text-[9px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 px-2.5 py-1 rounded-md transition-all font-bold uppercase tracking-wider cursor-pointer"
              >
                Sync
              </button>
            </div>
          </div>

          {/* Smartphone bezel frame */}
          <div className="relative w-80 aspect-[9/18.5] bg-black border-[12px] border-neutral-900 rounded-[42px] shadow-[0_25px_60px_-15px_rgba(225,29,72,0.1)] overflow-hidden border-solid outline outline-1 outline-white/10">
            {/* Dynamic Island Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-neutral-900/60 rounded-full ml-auto mr-3 border border-white/5" />
            </div>
            
            {/* Iframe View */}
            {previewUrl ? (
              <iframe 
                src={previewUrl}
                title="Love Website Preview"
                className="w-full h-full border-none pointer-events-auto bg-[#0a0a0a]"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#070104] text-center p-6 text-white/30">
                <svg className="w-8 h-8 mb-3 text-white/10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="w-full h-[90dvh] bg-[#0c0508] rounded-t-[32px] border-t border-white/10 flex flex-col relative overflow-hidden"
            >
              {/* Header */}
              <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between select-none">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">Live Preview Mockup</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSkipIntro(!skipIntro)}
                    className="text-[9px] font-bold tracking-wider text-white/40 uppercase cursor-pointer"
                  >
                    {skipIntro ? '⚡ Skip Intro' : '🎬 View Intro'}
                  </button>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Responsive Iframe Frame */}
              <div className="flex-grow p-4 pb-8 flex items-center justify-center">
                <div className="w-full h-full max-w-sm rounded-[32px] overflow-hidden border border-white/10 bg-[#0a0a0a]">
                  <iframe 
                    src={previewUrl}
                    title="Mobile Preview Frame"
                    className="w-full h-full border-none pointer-events-auto bg-[#0a0a0a]"
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
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-lg bg-[#0e070a] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center relative overflow-hidden select-none"
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

              <h3 className="text-white text-2xl font-bold tracking-tight mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Link is Ready!</h3>
              <p className="text-white/40 mb-6 text-center text-xs md:text-sm leading-relaxed max-w-sm">Share this special link with your loved one. All custom details and photos are compressed and encrypted directly inside the URL.</p>
              
              <div className="w-full flex flex-col gap-3">
                <input 
                  readOnly
                  value={shareLink}
                  onClick={(e) => e.target.select()}
                  className="w-full p-3.5 border border-white/10 rounded-xl bg-white/[0.03] text-white/80 text-xs font-mono focus:outline-none select-all text-center tracking-tight"
                />
                
                <div className="flex flex-col sm:flex-row w-full gap-3 mt-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={copyLink}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm focus:outline-none"
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
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-center cursor-pointer shadow-sm text-sm"
                  >
                    <svg className="w-4 h-4 text-[#e11d48]" fill="none" stroke="currentColor" strokeWidth="2.25" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview Link
                  </a>
                </div>
              </div>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-white/30 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
