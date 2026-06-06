import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/* ─── Particle seed generator ──────────────────────────────────── */
function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,            // % position
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,        // 1-3px
    isRose: Math.random() > 0.5,
    duration: 8 + Math.random() * 7,    // 8-15s drift
    driftX: (Math.random() - 0.5) * 60, // px drift range
    driftY: (Math.random() - 0.5) * 40,
    delay: Math.random() * 2,
  }));
}

/* ─── Main Component ───────────────────────────────────────────── */
export default function LoveJetIntro({ onComplete }) {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const curtainLeftRef = useRef(null);
  const curtainRightRef = useRef(null);
  const lineLeftRef = useRef(null);
  const lineRightRef = useRef(null);
  const quoteContainerRef = useRef(null);
  const craftedRef = useRef(null);
  const counterRef = useRef(null);
  const progressTrackRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressGlowRef = useRef(null);
  const flashRef = useRef(null);
  const particlesContainerRef = useRef(null);
  const expandLineRef = useRef(null);

  const particles = useMemo(() => generateParticles(13), []);

  const quote = 'Every love story is beautiful, but ours is my favorite';

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ── Gather DOM refs ─────────────────────────────────────── */
    const charEls = container.querySelectorAll('.intro-char');
    const particleEls = container.querySelectorAll('.intro-particle');

    /* ── Master timeline ─────────────────────────────────────── */
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    /* ─────────────────────────────────────────────────────────
       PHASE 0: Initial state — everything hidden
    ────────────────────────────────────────────────────────── */
    gsap.set(container, { opacity: 1 });
    gsap.set([lineLeftRef.current, lineRightRef.current], { scaleX: 0 });
    gsap.set(charEls, { opacity: 0, y: 14 });
    gsap.set(craftedRef.current, { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(progressBarRef.current, { scaleX: 0 });
    gsap.set(progressGlowRef.current, { opacity: 0 });
    gsap.set(flashRef.current, { opacity: 0 });
    gsap.set(expandLineRef.current, { scaleX: 0, opacity: 0 });
    gsap.set([curtainLeftRef.current, curtainRightRef.current], { xPercent: 0 });

    /* ─────────────────────────────────────────────────────────
       PHASE 1: Entrance — screen fade-in + center line draw
       (0s → 1s)
    ────────────────────────────────────────────────────────── */
    // Fade entire container in from black
    tl.from(container, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, 0);

    // Center line draws outward from center (left half + right half)
    tl.to(lineLeftRef.current, {
      scaleX: 1,
      duration: 0.9,
      ease: 'power3.inOut',
    }, 0.2);

    tl.to(lineRightRef.current, {
      scaleX: 1,
      duration: 0.9,
      ease: 'power3.inOut',
    }, 0.2);

    // Particles drift in (staggered fade-in)
    tl.to(particleEls, {
      opacity: (i) => particles[i]?.isRose ? 0.15 : 0.08,
      duration: 1.5,
      stagger: 0.08,
      ease: 'power1.out',
    }, 0.3);

    // Start particle drifting (long duration, looping)
    particleEls.forEach((el, i) => {
      const p = particles[i];
      if (!p) return;
      gsap.to(el, {
        x: p.driftX,
        y: p.driftY,
        duration: p.duration,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: p.delay,
      });
      // Subtle opacity pulsing
      gsap.to(el, {
        opacity: (p.isRose ? 0.08 : 0.04),
        duration: 2 + Math.random() * 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: p.delay + 0.5,
      });
    });

    /* ─────────────────────────────────────────────────────────
       PHASE 2: Text reveal — quote + "crafted with love"
       (1s → 3.5s)
    ────────────────────────────────────────────────────────── */
    // Letter-by-letter staggered reveal of romantic quote
    tl.to(charEls, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: 'power2.out',
    }, 1.0);

    // "crafted with love" clip-path reveal from left
    tl.to(craftedRef.current, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2,
      ease: 'power2.inOut',
    }, 1.6);

    /* ─────────────────────────────────────────────────────────
       PHASE 3: Counter + progress bar (overlapping)
       (1s → 4.5s)
    ────────────────────────────────────────────────────────── */
    const counterObj = { val: 0 };
    const counterDuration = 3.5;

    tl.to(counterObj, {
      val: 100,
      duration: counterDuration,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.innerText = String(Math.floor(counterObj.val)).padStart(3, '0');
        }
      },
    }, 1.0);

    // Progress bar fill
    tl.to(progressBarRef.current, {
      scaleX: 1,
      duration: counterDuration,
      ease: 'power2.inOut',
    }, 1.0);

    // Milestone pulses at 25%, 50%, 75%, 100%
    const milestones = [0.25, 0.50, 0.75, 1.0];
    milestones.forEach((pct) => {
      const pulseTime = 1.0 + counterDuration * pct;
      tl.to(progressGlowRef.current, {
        opacity: 0.8,
        duration: 0.1,
        ease: 'power2.in',
      }, pulseTime - 0.05);
      tl.to(progressGlowRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      }, pulseTime + 0.05);
    });

    /* ─────────────────────────────────────────────────────────
       PHASE 4: Climax — blur out + line expand + flash
       (4s → 5s)
    ────────────────────────────────────────────────────────── */
    // Quote blurs and fades upward
    tl.to(quoteContainerRef.current, {
      opacity: 0,
      y: -30,
      filter: 'blur(12px)',
      duration: 0.7,
      ease: 'power2.in',
    }, 4.0);

    // "crafted with love" fades out
    tl.to(craftedRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, 4.0);

    // Original center lines fade
    tl.to([lineLeftRef.current, lineRightRef.current], {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.in',
    }, 4.0);

    // Full-width expansion line appears and expands
    tl.set(expandLineRef.current, { opacity: 1 }, 4.2);
    tl.to(expandLineRef.current, {
      scaleX: 1,
      duration: 0.6,
      ease: 'expo.out',
    }, 4.2);

    // Counter & progress fade
    tl.to([counterRef.current, progressTrackRef.current], {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    }, 4.2);

    // Particles fade out
    tl.to(particleEls, {
      opacity: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power1.in',
    }, 4.1);

    // White flash
    tl.to(flashRef.current, {
      opacity: 0.06,
      duration: 0.1,
      ease: 'power2.in',
    }, 4.5);
    tl.to(flashRef.current, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.out',
    }, 4.6);

    // Expansion line fades after flash
    tl.to(expandLineRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.out',
    }, 4.7);

    /* ─────────────────────────────────────────────────────────
       PHASE 5: Curtain reveal — split from center
       (5s → 5.8s)
    ────────────────────────────────────────────────────────── */
    tl.to(curtainLeftRef.current, {
      xPercent: -100,
      duration: 0.8,
      ease: 'expo.inOut',
    }, 5.0);

    tl.to(curtainRightRef.current, {
      xPercent: 100,
      duration: 0.8,
      ease: 'expo.inOut',
    }, 5.0);

  }, { scope: containerRef });

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-auto select-none"
      style={{ opacity: 0 }}
    >
      {/* ── Curtain panels (for the split reveal) ──────────── */}
      <div
        ref={curtainLeftRef}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#050505]"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={curtainRightRef}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#050505]"
        style={{ willChange: 'transform' }}
      />

      {/* ── Main visual layer ──────────────────────────────── */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-[#050505] flex items-center justify-center overflow-hidden"
      >
        {/* Subtle ambient radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vmax] h-[50vmax] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(225,29,72,0.04) 0%, transparent 65%)',
          }}
        />

        {/* ── Floating particles ─────────────────────────── */}
        <div ref={particlesContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="intro-particle absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                opacity: 0,
                background: p.isRose
                  ? 'rgba(225,29,72,0.3)'
                  : 'rgba(255,255,255,0.2)',
                boxShadow: p.isRose
                  ? '0 0 6px rgba(225,29,72,0.2)'
                  : '0 0 4px rgba(255,255,255,0.1)',
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>

        {/* ── Central content group ──────────────────────── */}
        <div className="relative z-10 flex flex-col items-center w-full px-8">

          {/* Romantic quote — above the line */}
          <div
            ref={quoteContainerRef}
            className="mb-8 max-w-[600px] text-center"
            style={{ willChange: 'transform, opacity, filter' }}
          >
            <p
              className="font-cormorant italic text-white/70 leading-relaxed"
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
              }}
              aria-hidden="true"
            >
              {/* Split quote into characters, preserving spaces */}
              {quote.split('').map((char, i) => (
                <span
                  key={i}
                  className="intro-char inline-block"
                  style={{
                    opacity: 0,
                    willChange: 'transform, opacity',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </p>
          </div>

          {/* ── Center horizontal line (two halves) ──────── */}
          <div className="relative w-[clamp(200px,40vw,400px)] h-[1px] flex items-center">
            {/* Left half — scales from center (right edge) to left */}
            <div
              ref={lineLeftRef}
              className="absolute top-0 right-1/2 w-1/2 h-full origin-right"
              style={{
                background: 'linear-gradient(270deg, rgba(255,255,255,0.35), rgba(255,255,255,0.03))',
                willChange: 'transform',
              }}
            />
            {/* Right half — scales from center (left edge) to right */}
            <div
              ref={lineRightRef}
              className="absolute top-0 left-1/2 w-1/2 h-full origin-left"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.03))',
                willChange: 'transform',
              }}
            />
          </div>

          {/* "crafted with love" — below the line */}
          <div
            ref={craftedRef}
            className="mt-5"
            style={{
              clipPath: 'inset(0 100% 0 0)',
              willChange: 'clip-path, opacity',
            }}
          >
            <span
              className="text-white/25 uppercase"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.3em',
              }}
            >
              crafted with love
            </span>
          </div>

          {/* ── Counter + progress system ─────────────────── */}
          <div
            ref={progressTrackRef}
            className="flex flex-col items-center gap-3 mt-16"
            style={{ willChange: 'opacity' }}
          >
            <span
              ref={counterRef}
              className="font-extralight text-white/20 tabular-nums"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
                letterSpacing: '-0.05em',
              }}
            >
              000
            </span>
            {/* Progress bar track */}
            <div className="relative w-[120px] h-[1px] overflow-hidden">
              {/* Background track */}
              <div className="absolute inset-0 bg-white/[0.06]" />
              {/* Filled bar */}
              <div
                ref={progressBarRef}
                className="absolute inset-0 origin-left"
                style={{
                  background: 'linear-gradient(90deg, rgba(225,29,72,0.4), rgba(225,29,72,0.8))',
                  willChange: 'transform',
                }}
              />
              {/* Milestone glow overlay */}
              <div
                ref={progressGlowRef}
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 60%, rgba(225,29,72,1))',
                  boxShadow: '0 0 12px rgba(225,29,72,0.6)',
                  opacity: 0,
                  willChange: 'opacity',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Full-width expansion line (Phase 4) ────────── */}
        <div
          ref={expandLineRef}
          className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.5) 70%, transparent 100%)',
            transformOrigin: 'center',
            willChange: 'transform, opacity',
          }}
        />

        {/* ── White flash overlay ────────────────────────── */}
        <div
          ref={flashRef}
          className="absolute inset-0 bg-white pointer-events-none"
          style={{
            opacity: 0,
            willChange: 'opacity',
          }}
        />
      </div>
    </div>
  );
}
