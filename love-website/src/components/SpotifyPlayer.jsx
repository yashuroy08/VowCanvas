import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDataStore from '../store/useDataStore';

const DEFAULT_PLAYLIST = [
  {
    title: "Young and Beautiful",
    artist: "Lana Del Rey",
    url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d7/0b/8a/d70b8adf-8a27-aafa-76a4-f59200be9ab0/mzaf_6008955516336655319.plus.aac.p.m4a",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/e3/e3/13/e3e31393-abf5-e9b1-edc4-20ede35d0c75/13UMGIM43701.rgb.jpg/500x500bb.jpg"
  },
  {
    title: "Say Yes To Heaven",
    artist: "Lana Del Rey",
    url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ca/f9/11/caf911f4-6ea5-6889-37ec-8d2a3d050fce/mzaf_11121553984364330632.plus.aac.p.m4a",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b2/20/8e/b2208e82-df49-5897-139d-39f4cdbc91a9/23UMGIM48049.rgb.jpg/500x500bb.jpg"
  },
  {
    title: "Love",
    artist: "Lana Del Rey",
    url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/1d/71/65/1d71652e-392a-71ec-3ff0-71e2663b92e6/mzaf_18084598624687350460.plus.aac.p.m4a",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/fc/d3/81/fcd381c9-451f-0917-da01-06678a92b85c/17UMGIM90308.rgb.jpg/500x500bb.jpg"
  },
  {
    title: "Video Games",
    artist: "Lana Del Rey",
    url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/47/26/17/472617f8-9b82-7cc8-8b52-fee8e767174d/mzaf_11594634014908206633.plus.aac.p.m4a",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/59/10/66/591066ea-3c85-3dfe-ef82-ffdbbcdfc8b9/12UMGIM00033.rgb.jpg/500x500bb.jpg"
  },
  {
    title: "Blue Jeans",
    artist: "Lana Del Rey",
    url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5b/d6/e7/5bd6e7b1-77f1-189f-52d6-ff4fc4b52a56/mzaf_4532656931262352677.plus.aac.p.m4a",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/59/10/66/591066ea-3c85-3dfe-ef82-ffdbbcdfc8b9/12UMGIM00033.rgb.jpg/500x500bb.jpg"
  },
  {
    title: "Margaret (feat. Bleachers)",
    artist: "Lana Del Rey",
    url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/75/41/47/754147c1-5950-996c-0708-f1f3b6acf5fa/mzaf_8273778161329814649.plus.aac.p.m4a",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/7c/c4/e5/7cc4e501-6b09-b379-bb54-a40de4615aa3/22UM1IM33313.rgb.jpg/500x500bb.jpg"
  },
  {
    title: "Let The Light In (feat. Father John Misty)",
    artist: "Lana Del Rey",
    url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8f/a7/18/8fa718a4-be4d-f88b-c423-fb2ffe4f450c/mzaf_11832529804772586002.plus.aac.p.m4a",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/7c/c4/e5/7cc4e501-6b09-b379-bb54-a40de4615aa3/22UM1IM33313.rgb.jpg/500x500bb.jpg"
  },
  {
    title: "Stargirl Interlude (feat. Lana Del Rey)",
    artist: "The Weeknd",
    url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a7/16/b7/a716b74a-911e-66a9-a16b-1c8513594c9d/mzaf_10411273511987175106.plus.aac.p.m4a",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e2/61/f8/e261f8c1-73db-9a7a-c89e-1068f19970e0/16UMGIM67863.rgb.jpg/500x500bb.jpg"
  }
];

const SOUND_WAVE_DURATIONS = [
  0.8, 1.1, 0.6, 0.9, 0.7, 1.2, 0.5, 1.0, 0.8,
  1.1, 0.6, 0.9, 0.7, 1.2, 0.5, 1.0, 0.8, 0.9
];

export default function SpotifyPlayer({ isBlackout }) {
  const setAudioState = useDataStore((state) => state.setAudioState);
  
  const [playlist, setPlaylist] = useState(DEFAULT_PLAYLIST);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const audioRef = useRef(null);
  const track = playlist[currentTrackIndex] || DEFAULT_PLAYLIST[0];

  // Dynamic API Fetch
  useEffect(() => {
    const fetchLanaSongs = async () => {
      try {
        const res = await fetch('https://itunes.apple.com/search?term=Lana+Del+Rey&entity=song&limit=100');
        if (!res.ok) throw new Error('API network response error');
        const data = await res.json();
        
        const ROMANCE_KEYWORDS = [
          "young and beautiful",
          "say yes to heaven",
          "love",
          "video games",
          "blue jeans",
          "margaret",
          "let the light in",
          "stargirl interlude",
          "without you",
          "mariners apartment complex",
          "cherry",
          "cinnamon girl",
          "born to die"
        ];

        const filtered = data.results
          .filter(item => {
            if (!item.trackName || !item.previewUrl) return false;
            const name = item.trackName.toLowerCase();
            return ROMANCE_KEYWORDS.some(keyword => name.includes(keyword));
          })
          .map(item => ({
            title: item.trackName,
            artist: item.artistName || "Lana Del Rey",
            url: item.previewUrl,
            cover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb.jpg', '500x500bb.jpg') : 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=200'
          }));

        // Deduplicate
        const seen = new Set();
        const deduplicated = [];
        for (const song of filtered) {
          const normalizedTitle = song.title.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').replace(/\s*\[.*?\]\s*/g, '').trim();
          if (!seen.has(normalizedTitle)) {
            seen.add(normalizedTitle);
            deduplicated.push(song);
          }
        }

        if (deduplicated.length > 0) {
          setPlaylist(deduplicated);
        }
      } catch (err) {
        console.warn("Failed to fetch Lana Del Rey songs from API, using premium defaults:", err);
      }
    };

    fetchLanaSongs();
  }, []);

  // Auto-play toggle on user gesture / state change / blackout dampening
  useEffect(() => {
    if (audioRef.current) {
      const targetVolume = isBlackout ? (isMuted ? 0 : volume * 0.35) : (isMuted ? 0 : volume);
      audioRef.current.volume = targetVolume;
      setAudioState({ volume: targetVolume });
    }
  }, [volume, isMuted, isBlackout, setAudioState]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Audio autoplay prevented. Awaiting user interaction.", err);
          setIsPlaying(false);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, playlist]);

  // Music event handlers for envelope & candle interactions
  useEffect(() => {
    // Plays music at moderate volume when envelope is first opened
    const handleSoftPlay = () => {
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : 0.35;
        setIsPlaying(true);
        audioRef.current.play().then(() => {
          setAudioState({ isPlaying: true });
        }).catch(err => {
          console.log("Audio play failed on soft trigger: ", err);
          setIsPlaying(false);
          setAudioState({ isPlaying: false });
        });
      }
    };

    // Smoothly lowers music when candles are blown
    const handleLowerVolume = () => {
      if (audioRef.current && !isMuted) {
        // Smooth volume fade over 800ms
        const startVol = audioRef.current.volume;
        const targetVol = 0.15;
        const steps = 16;
        const stepTime = 800 / steps;
        let step = 0;
        const fadeInterval = setInterval(() => {
          step++;
          const progress = step / steps;
          // Ease-out curve
          const eased = 1 - Math.pow(1 - progress, 3);
          audioRef.current.volume = startVol + (targetVol - startVol) * eased;
          if (step >= steps) clearInterval(fadeInterval);
        }, stepTime);
      }
    };

    // Full volume play trigger (legacy event)
    const handlePlayTrigger = () => {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play().then(() => {
          setAudioState({ isPlaying: true });
        }).catch(err => {
          console.log("Audio play failed on trigger event: ", err);
          setAudioState({ isPlaying: false });
        });
      }
    };

    window.addEventListener('play-love-song-soft', handleSoftPlay);
    window.addEventListener('lower-love-song', handleLowerVolume);
    window.addEventListener('play-love-song', handlePlayTrigger);
    return () => {
      window.removeEventListener('play-love-song-soft', handleSoftPlay);
      window.removeEventListener('lower-love-song', handleLowerVolume);
      window.removeEventListener('play-love-song', handlePlayTrigger);
    };
  }, [isMuted, volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioState({ isPlaying: false });
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAudioState({ isPlaying: true });
      }).catch(err => {
        console.log("Audio play failed: ", err);
        setIsPlaying(false);
        setAudioState({ isPlaying: false });
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    setIsPlaying(true);
    setAudioState({ isPlaying: true });
    setCurrentTime(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
    setAudioState({ isPlaying: true });
    setCurrentTime(0);
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderExpandedContent = () => (
    <div className="w-full h-full flex flex-col">
      {/* Header / Collapse Trigger */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1.5 text-rose-soft">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-[3px] font-lato">Lana Del Rey Radio</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-2 hover:bg-rose-border/20 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer text-rose-soft hover:text-rose-deep"
          style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Close player"
        >
          {/* Universal Close X Icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Album Cover & Rotating Vinyl Disc */}
      <div className="flex gap-4 items-center mb-4 relative">
        <div className="relative w-24 h-24 flex-shrink-0">
          {/* Vinyl Grooves backing */}
          <div 
            className={`absolute inset-0 rounded-full bg-stone-900 border-[3px] border-stone-800 shadow-md ${isPlaying ? 'animate-spin' : ''}`}
            style={{ animationDuration: '8s' }}
          >
            <div className="absolute inset-1.5 rounded-full border border-stone-700/40" />
            <div className="absolute inset-3 rounded-full border border-stone-700/60" />
            <div className="absolute inset-4.5 rounded-full border border-stone-700/80" />
            {/* Album Cover Center Label */}
            <div className="absolute inset-6 rounded-full overflow-hidden border border-stone-900">
              <img src={track.cover} alt="album art" className="w-full h-full object-cover" />
            </div>
            {/* Center hole */}
            <div className="absolute inset-[43px] bg-rose-blush rounded-full shadow-inner border border-stone-900/40" />
          </div>
        </div>

        {/* Title & Artist & Animated Sound Waves */}
        <div className="flex-grow min-w-0 pr-1 flex flex-col justify-center">
          <div className="flex justify-between items-start gap-1">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold truncate font-lato">{track.title}</h4>
              <p className="text-[11px] text-rose-soft truncate font-lato">{track.artist}</p>
            </div>
            {/* Like Button */}
            <button 
              onClick={() => setIsLiked(!isLiked)} 
              className="p-2 hover:bg-rose-border/20 rounded-full transition-colors flex-shrink-0 focus:outline-none cursor-pointer"
              style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg 
                className={`w-4.5 h-4.5 transition-colors duration-300 ${isLiked ? 'fill-rose-medium text-rose-medium' : 'stroke-current text-rose-soft fill-none'}`} 
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          {/* Animated CSS Waveform Bar Visualizer */}
          <div className="flex items-end gap-[3px] h-6 mt-3">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="w-[3px] bg-rose-medium/80 rounded-t transition-all duration-300 origin-bottom"
                style={{
                  height: isPlaying ? '100%' : '3px',
                  animation: isPlaying ? `soundWave ${SOUND_WAVE_DURATIONS[i]}s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Progress Scrubbing Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full accent-rose-medium h-1 bg-rose-border/30 rounded-lg appearance-none cursor-pointer hover:h-1.5 transition-all duration-150"
        />
        <div className="flex justify-between text-[10px] text-rose-soft font-medium font-lato mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center px-1 mb-2">
        {/* Mute/Volume Toggle */}
        <div className="flex items-center gap-1.5 w-16">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-rose-border/20 rounded-full transition-colors text-rose-soft focus:outline-none cursor-pointer"
            style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.03c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-10 accent-rose-soft h-1 bg-rose-border/30 rounded-lg appearance-none cursor-pointer"
            title="Volume"
          />
        </div>

        {/* Music Playback Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Previous */}
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-rose-border/20 text-rose-soft hover:text-rose-deep rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Previous track"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-11 h-11 bg-rose-medium hover:bg-rose-deep text-rose-light-accent rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>

          {/* Next */}
          <button
            onClick={handleNext}
            className="p-2 hover:bg-rose-border/20 text-rose-soft hover:text-rose-deep rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Next track"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Looping / Info */}
        <div className="w-16 flex justify-end text-[10px] text-rose-soft font-semibold font-lato mr-1">
          <span>{currentTrackIndex + 1} / {playlist.length}</span>
        </div>
      </div>

      {/* Custom keyframes for Visualizer soundwave */}
      <style>{`
        @keyframes soundWave {
          0% { transform: scaleY(0.15); }
          10% { transform: scaleY(0.35); }
          30% { transform: scaleY(0.85); }
          55% { transform: scaleY(0.4); }
          70% { transform: scaleY(0.95); }
          85% { transform: scaleY(0.6); }
          100% { transform: scaleY(0.25); }
        }
      `}</style>
    </div>
  );

  return (
    <div className="z-40 select-none">
      {/* HTML5 Audio Node */}
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* MOBILE PLAYER (bottom right of mobile screens) */}
      <div className="md:hidden">
        <AnimatePresence initial={false}>
          {!isExpanded ? (
            // Collapsed play/music icon button
            <motion.div
              key="mobile-collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(true)}
                className="w-12 h-12 rounded-full bg-rose-medium hover:bg-rose-deep text-rose-light-accent flex items-center justify-center shadow-lg pointer-events-auto cursor-pointer relative"
                aria-label="Open music player"
              >
                {isPlaying && (
                  <span className="absolute inset-0 rounded-full border-2 border-rose-light-accent/30 animate-spin" style={{ animationDuration: '4s' }} />
                )}
                {/* Clean Music Note Icon */}
                <svg className="w-5 h-5 fill-current z-10" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </motion.button>
            </motion.div>
          ) : (
            // Expanded full player card
            <motion.div
              key="mobile-expanded"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <div className="w-[290px] bg-rose-blush/90 backdrop-blur-2xl border border-rose-border/60 text-rose-deep p-4 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
                {renderExpandedContent()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP MUSIC PLAYER (bottom right of desktop screens, expandable) */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <AnimatePresence initial={false}>
          {!isExpanded ? (
            // COLLAPSED MUSIC BUBBLE
            <motion.button
              key="collapsed"
              layoutId="spotify-player-card"
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 15 } }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 bg-rose-blush/85 backdrop-blur-xl border border-rose-border/50 text-rose-deep px-4 py-3 rounded-full shadow-lg hover:shadow-xl pointer-events-auto cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 w-full"
              >
                <div className="relative flex items-center justify-center">
                  {/* Spinning Mini Record */}
                  <div 
                    className={`w-9 h-9 rounded-full bg-rose-dark border-2 border-rose-border/40 flex items-center justify-center relative shadow-md overflow-hidden ${isPlaying ? 'animate-spin' : ''}`}
                    style={{ animationDuration: '6s' }}
                  >
                    <img src={track.cover} alt="album art" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute w-2.5 h-2.5 bg-rose-blush rounded-full border border-rose-dark/30" />
                  </div>
                  
                  {/* Mini visualizer bars overlay */}
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center gap-0.5 bg-black/35 rounded-full">
                      <div className="w-[2px] h-3 bg-rose-light-accent animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }} />
                      <div className="w-[2px] h-4 bg-rose-light-accent animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.8s' }} />
                      <div className="w-[2px] h-2.5 bg-rose-light-accent animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '0.5s' }} />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-start pr-1 max-w-[120px] md:max-w-[150px]">
                  <span className="text-[10px] uppercase tracking-widest text-rose-soft font-semibold font-lato">Now Playing</span>
                  <span className="text-xs font-semibold truncate w-full text-left font-lato">{track.title}</span>
                </div>

                {/* Pulsing indicator */}
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-medium opacity-75 ${isPlaying ? 'block' : 'hidden'}`}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-medium"></span>
                </span>
              </motion.div>
            </motion.button>
          ) : (
            // EXPANDED SPOTIFY CARD
            <motion.div
              key="expanded"
              layoutId="spotify-player-card"
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="w-[310px] md:w-[340px] bg-rose-blush/90 backdrop-blur-2xl border border-rose-border/60 text-rose-deep p-5 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {renderExpandedContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
