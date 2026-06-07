import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';

export default function ScratchCard({ children, height = 100 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 150 });
  const isDrawing = useRef(false);

  // Measure container to set exact canvas resolution
  useLayoutEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth || 800, height: Math.max(offsetHeight, height) || 150 });
    }
  }, [height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed || dimensions.width === 0) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Premium Metallic/Foil scratch-off texture
    const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
    gradient.addColorStop(0, '#94a3b8'); // slate-400
    gradient.addColorStop(0.5, '#cbd5e1'); // slate-300
    gradient.addColorStop(1, '#64748b'); // slate-500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Add noise pattern for metallic scratch ticket feel
    for (let i = 0; i < (dimensions.width * dimensions.height) / 50; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.1)';
      ctx.fillRect(Math.random() * dimensions.width, Math.random() * dimensions.height, 2, 2);
    }
    
    // Add instruction text
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH HERE ✨', dimensions.width / 2, dimensions.height / 2);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 45; // slightly smaller brush for more accurate scratching
    ctx.globalCompositeOperation = 'destination-out';

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * dimensions.width,
        y: ((clientY - rect.top) / rect.height) * dimensions.height
      };
    };

    const handlePointerDown = (e) => {
      isDrawing.current = true;
      const pos = getMousePos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      if (e.cancelable) e.preventDefault();
    };

    const handlePointerMove = (e) => {
      if (!isDrawing.current) return;
      const pos = getMousePos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      if (e.cancelable) e.preventDefault();
      checkReveal();
    };

    const handlePointerUp = () => {
      isDrawing.current = false;
    };

    const checkReveal = () => {
      if (isRevealed) return;
      
      const imageData = ctx.getImageData(0, 0, dimensions.width, dimensions.height);
      const pixels = imageData.data;
      let clearPixels = 0;
      
      // Check every 32nd pixel to be fast
      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] === 0) clearPixels++;
      }
      
      const clearPercentage = clearPixels / (pixels.length / 32);
      if (clearPercentage > 0.4) { // reveal after 40% is scratched
        setIsRevealed(true);
      }
    };

    const options = { passive: false };

    canvas.addEventListener('mousedown', handlePointerDown, options);
    canvas.addEventListener('mousemove', handlePointerMove, options);
    canvas.addEventListener('mouseup', handlePointerUp, options);
    canvas.addEventListener('mouseleave', handlePointerUp, options);

    canvas.addEventListener('touchstart', handlePointerDown, options);
    canvas.addEventListener('touchmove', handlePointerMove, options);
    canvas.addEventListener('touchend', handlePointerUp, options);

    return () => {
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('mouseleave', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchmove', handlePointerMove);
      canvas.removeEventListener('touchend', handlePointerUp);
    };
  }, [isRevealed, dimensions]);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden rounded-xl shadow-sm border border-rose-border/50 bg-white/80 mb-3 mt-1 w-full" 
      style={{ minHeight: height }}
    >
      {/* Hidden Content (Blurred until revealed) */}
      <div className={`absolute inset-0 flex items-center p-5 z-0 transition-all duration-700 ease-out ${isRevealed ? 'opacity-100 blur-none' : 'opacity-10 blur-[8px]'}`}>
        {children}
      </div>

      {/* Scratchable Canvas Surface */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className={`absolute inset-0 w-full h-full z-10 touch-none transition-all duration-700 ease-in ${isRevealed ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 cursor-crosshair'}`}
        style={{
          boxShadow: isRevealed ? 'none' : 'inset 0 4px 6px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.1)'
        }}
      />
      
      {/* Extra "Scratch Me" UI overlay that fades when user starts interacting, just in case canvas text isn't enough */}
      {!isRevealed && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="bg-black/40 text-white backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase animate-pulse shadow-xl border border-white/20">
            Scratch to reveal
          </div>
        </div>
      )}
    </div>
  );
}
