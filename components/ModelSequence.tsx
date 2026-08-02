'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frameCount = 175;
const currentFrame = (index: number) => 
  `/Model_lifts_hand_to_camera_202607131314_frames/frame_${String(index).padStart(3, '0')}.png`;

export default function ModelSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    // Preload images
    const images: HTMLImageElement[] = [];
    const airpods = { frame: 1 }; 

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    let currentFrameVal = 1;
    let targetFrameVal = 1;
    const maxSpeed = 1.5; // maximum frames to jump per tick (normal play speed)
    let animationFrameId: number;

    const render = () => {
      if (!canvas || !context) return;
      const frameIndex = Math.max(1, Math.min(frameCount, Math.round(currentFrameVal)));
      const img = images[frameIndex - 1];
      if (!img || !img.complete) return;
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate scale to "cover" the canvas area
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    // Ensure first frame is drawn once loaded
    images[0].onload = render;

    // Handle initial resize to set canvas size
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Setup GSAP scroll trigger
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=3000', // Scroll length
        pin: true,
        onUpdate: (self) => {
          targetFrameVal = 1 + self.progress * (frameCount - 1);
        }
      });

      // Tapes fly in right before the canvas drops
      gsap.from('.police-tape-tl', {
        x: '-30vw', y: '-30vh', opacity: 0,
        scrollTrigger: { trigger: containerRef.current, start: 'top bottom', end: 'top 70%', scrub: 1 }
      });
      gsap.from('.police-tape-tr', {
        x: '30vw', y: '-30vh', opacity: 0,
        scrollTrigger: { trigger: containerRef.current, start: 'top bottom', end: 'top 70%', scrub: 1 }
      });

      // Hanging Canvas Animation - Drops down from the tapes
      gsap.from('.hanging-canvas-wrapper', {
        y: '-100vh',
        rotationX: -60,
        transformOrigin: 'top center',
        opacity: 0,
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', end: 'top top', scrub: 1 }
      });

      const loop = () => {
        if (Math.abs(targetFrameVal - currentFrameVal) > 0.1) {
          if (targetFrameVal > currentFrameVal) {
            currentFrameVal = Math.min(targetFrameVal, currentFrameVal + maxSpeed);
          } else {
            currentFrameVal = Math.max(targetFrameVal, currentFrameVal - maxSpeed);
          }
          render();
        }
        animationFrameId = requestAnimationFrame(loop);
      };
      animationFrameId = requestAnimationFrame(loop);

      // Optional text animations
      gsap.fromTo(".seq-text-1", 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, y: 0, 
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=500',
            scrub: true,
          }
        }
      );
      gsap.to(".seq-text-1", {
        opacity: 0, y: -50,
        scrollTrigger: {
          trigger: containerRef.current,
          start: '+=1000',
          end: '+=1500',
          scrub: true,
        }
      });
      
      gsap.fromTo(".seq-text-2", 
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, scale: 1, 
          scrollTrigger: {
            trigger: containerRef.current,
            start: '+=1800',
            end: '+=2400',
            scrub: true,
          }
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#050505] overflow-hidden" style={{ perspective: '2000px' }}>
      
      <div className="hanging-canvas-wrapper absolute inset-0 transform-gpu bg-black origin-top">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Overlay text elements inside the hanging wrapper */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6">
          <h2 className="seq-text-1 text-center text-4xl md:text-6xl font-extralight tracking-[0.2em] text-white/90"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ELEGANCE IN MOTION
          </h2>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6">
          <h2 className="seq-text-2 text-center text-3xl md:text-5xl font-light tracking-[0.1em] text-[#C8A46A] mix-blend-screen opacity-0"
          >
            Discover The Details
          </h2>
        </div>
      </div>
      
      {/* Police Tapes Holding the Canvas (Top Only) */}
      <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
        
        {/* Tape Top-Left */}
        <div className="police-tape-tl absolute flex items-center h-12 sm:h-16 bg-yellow-400 text-black font-black uppercase text-xl sm:text-2xl tracking-[0.2em] shadow-2xl border-y-4 border-black whitespace-nowrap" 
             style={{ width: '100vw', left: '-30vw', top: '10vh', transform: 'rotate(-45deg)' }}>
          <div className="flex animate-marquee">
            {Array(16).fill("VREWKRIYA EXPERIENCES // DO NOT CROSS // ").map((t, i) => (
              <span key={i} className="px-4 flex items-center shrink-0">
                {t}
                <span className="inline-block w-8 h-8 mx-4" style={{ background: 'repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)' }}></span>
              </span>
            ))}
          </div>
        </div>

        {/* Tape Top-Right */}
        <div className="police-tape-tr absolute flex items-center h-12 sm:h-16 bg-yellow-400 text-black font-black uppercase text-xl sm:text-2xl tracking-[0.2em] shadow-2xl border-y-4 border-black whitespace-nowrap" 
             style={{ width: '100vw', right: '-30vw', top: '10vh', transform: 'rotate(45deg)' }}>
          <div className="flex animate-marquee" style={{ animationDirection: 'reverse' }}>
            {Array(16).fill("RESTRICTED AREA // CINEMATIC STORYTELLING // ").map((t, i) => (
              <span key={i} className="px-4 flex items-center shrink-0">
                {t}
                <span className="inline-block w-8 h-8 mx-4" style={{ background: 'repeating-linear-gradient(-45deg, #000, #000 10px, transparent 10px, transparent 20px)' }}></span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
