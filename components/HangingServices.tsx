'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    title: "Social Media Management",
    desc: "Strategy, content calendars, community management & growth across every platform.",
    accent: "#ec4899",
    tag: "01",
  },
  {
    title: "Web Development",
    desc: "High-converting websites and digital experiences that feel as good as they perform.",
    accent: "#3b82f6",
    tag: "02",
  },
  {
    title: "Content Creation",
    desc: "Scroll-stopping visuals, reels, and storytelling that build culture, not just impressions.",
    accent: "#22c55e",
    tag: "03",
  },
  {
    title: "AI Automation",
    desc: "Smart workflows, chatbots, and AI-driven pipelines that save hours and multiply output.",
    accent: "#a855f7",
    tag: "04",
  },
  {
    title: "Paid Advertising",
    desc: "Full-funnel paid campaigns across Meta, Google & programmatic — engineered for ROAS.",
    accent: "#f97316",
    tag: "05",
  },
  {
    title: "Brand Strategy",
    desc: "Naming, identity, and positioning systems that give your brand a voice people remember.",
    accent: "#06b6d4",
    tag: "06",
  },
  {
    title: "SEO Optimization",
    desc: "Search strategies and editorial content that compound over time and dominate rankings.",
    accent: "#eab308",
    tag: "07",
  },
  {
    title: "Influencer Marketing",
    desc: "Strategic creator partnerships that drive authentic engagement and measurable conversions.",
    accent: "#ec4899",
    tag: "08",
  },
];

export function HangingServices() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stringRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const pinTarget = pinRef.current;
    const stringSvg = stringRef.current;
    if (!wrapper || !pinTarget || !stringSvg) return;

    const ctx = gsap.context(() => {
      const boards = gsap.utils.toArray<HTMLElement>('.service-board');
      const stringLine = stringSvg.querySelector('.string-line') as SVGPathElement;
      const stringHook = stringSvg.querySelector('.string-hook') as SVGElement;
      const stageTitle = wrapper.querySelector('.stage-title') as HTMLElement;
      const stageSub = wrapper.querySelector('.stage-sub') as HTMLElement;
      const spotlight = wrapper.querySelector('.spotlight') as HTMLElement;

      if (!stringLine || boards.length === 0) return;

      const totalBoards = boards.length;
      const scrollPerBoard = 1000;

      // Master timeline
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: `+=${(totalBoards + 3) * scrollPerBoard}`,
          pin: pinTarget,
          pinSpacing: true,
          scrub: 1.8,
          anticipatePin: 1,
        }
      });

      // ——— INITIAL STATES ———
      // String starts off-screen above, coiled up
      gsap.set(stringSvg, { y: -600, opacity: 0 });
      gsap.set(stageTitle, { opacity: 0, y: 60, scale: 0.9 });
      gsap.set(stageSub, { opacity: 0, y: 30 });
      gsap.set(spotlight, { opacity: 0, scale: 0.5 });
      gsap.set(boards, { 
        opacity: 0, 
        y: -400,  // boards start above viewport (will be pulled down)
        rotation: 0,
        scale: 0.9,
      });

      // ═══════════════════════════════════════
      // ACT 1 — CURTAIN UP: Title + String drops in
      // ═══════════════════════════════════════

      // Spotlight turns on
      master.to(spotlight, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out",
      });

      // Title slides up
      master.to(stageTitle, {
        opacity: 1, y: 0, scale: 1,
        duration: 1.2,
        ease: "power3.out",
      }, "<0.2");

      master.to(stageSub, {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "<0.4");

      // Hold title
      master.to({}, { duration: 0.6 });

      // Title exits up
      master.to(stageTitle, {
        opacity: 0, y: -80,
        duration: 0.8, ease: "power2.in",
      });
      master.to(stageSub, {
        opacity: 0, y: -40,
        duration: 0.6, ease: "power2.in",
      }, "<0.1");

      // ═══════════════════════════════════════
      // ACT 2 — THE STRING APPEARS
      // String drops from above with a bouncy swing
      // ═══════════════════════════════════════

      // String drops in
      master.to(stringSvg, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "bounce.out",
      });

      // String does a playful swing (Pixar-style anticipation)
      master.to(stringSvg, {
        rotation: 8,
        transformOrigin: "top center",
        duration: 0.4,
        ease: "power2.out",
      });
      master.to(stringSvg, {
        rotation: -5,
        duration: 0.3,
        ease: "power2.out",
      });
      master.to(stringSvg, {
        rotation: 2,
        duration: 0.2,
        ease: "power1.out",
      });
      master.to(stringSvg, {
        rotation: 0,
        duration: 0.2,
        ease: "power1.inOut",
      });

      // ═══════════════════════════════════════
      // ACT 3 — BOARD BY BOARD
      // String pulls each board down into view,
      // holds it, then yanks it up/away
      // ═══════════════════════════════════════

      boards.forEach((board, i) => {
        const svc = services[i];
        const inner = board.querySelector('.board-inner') as HTMLElement;
        const boardTitle = board.querySelector('.board-title') as HTMLElement;
        const boardDesc = board.querySelector('.board-desc') as HTMLElement;
        const boardTag = board.querySelector('.board-tag') as HTMLElement;
        const boardLine = board.querySelector('.board-line') as HTMLElement;
        const isEven = i % 2 === 0;

        // Stagger inner text elements
        if (boardTitle) gsap.set(boardTitle, { opacity: 0, y: 25 });
        if (boardDesc) gsap.set(boardDesc, { opacity: 0, y: 15 });
        if (boardTag) gsap.set(boardTag, { opacity: 0, scale: 0.8 });
        if (boardLine) gsap.set(boardLine, { scaleX: 0 });

        // ——— STRING YANKS: Anticipation tug ———
        // String stretches up slightly (wind-up)
        master.to(stringSvg, {
          y: -30,
          duration: 0.25,
          ease: "power2.in",
        });

        // String PULLS DOWN — brings board with it
        master.to(stringSvg, {
          y: 20,
          duration: 0.4,
          ease: "power3.out",
        });

        // Board swings in from above with rotation
        master.to(board, {
          opacity: 1,
          y: 0,
          rotation: isEven ? 3 : -3,
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.6)",
        }, "<0.1");

        // Update spotlight color
        if (spotlight) {
          master.to(spotlight, {
            background: `radial-gradient(ellipse at 50% 20%, ${svc.accent}15 0%, transparent 60%)`,
            duration: 0.5,
          }, "<");
        }

        // String settles
        master.to(stringSvg, {
          y: 0,
          duration: 0.3,
          ease: "power1.inOut",
        });

        // Board settles to straight
        master.to(board, {
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.4)",
        }, "<");

        // ——— CONTENT REVEAL: Text appears on the board ———
        if (boardTag) master.to(boardTag, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, "<0.1");
        if (boardTitle) master.to(boardTitle, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "<0.1");
        if (boardDesc) master.to(boardDesc, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "<0.15");
        if (boardLine) master.to(boardLine, { scaleX: 1, duration: 0.6, ease: "power4.out" }, "<0.1");

        // ——— HOLD: Let the viewer read ———
        master.to({}, { duration: 0.6 });

        // ——— BOARD EXIT: String yanks it away ———
        if (i < totalBoards - 1) {
          // Content fades first
          if (boardTitle) master.to(boardTitle, { opacity: 0, y: -15, duration: 0.2, ease: "power2.in" });
          if (boardDesc) master.to(boardDesc, { opacity: 0, duration: 0.15, ease: "power1.in" }, "<");
          if (boardLine) master.to(boardLine, { scaleX: 0, transformOrigin: 'right center', duration: 0.2, ease: "power2.in" }, "<");

          // String tugs up (anticipation)
          master.to(stringSvg, {
            y: -15,
            duration: 0.15,
            ease: "power2.in",
          });

          // String YANKS the board up and to the side
          const exitDir = isEven ? 1 : -1;
          master.to(board, {
            y: -500,
            x: exitDir * 150,
            rotation: exitDir * 15,
            opacity: 0,
            scale: 0.8,
            duration: 0.7,
            ease: "power3.in",
          });

          // String does a little recoil bounce after yanking
          master.to(stringSvg, {
            y: 25,
            duration: 0.2,
            ease: "power2.out",
          });
          master.to(stringSvg, {
            y: -8,
            duration: 0.15,
            ease: "power1.out",
          });
          master.to(stringSvg, {
            y: 0,
            duration: 0.2,
            ease: "elastic.out(1, 0.5)",
          });
        }
      });

      // ═══════════════════════════════════════
      // ACT 4 — CURTAIN CALL
      // String coils back up, last board lingers
      // ═══════════════════════════════════════

      master.to({}, { duration: 0.3 });

      // String slowly retracts
      master.to(stringSvg, {
        y: -600,
        opacity: 0,
        duration: 1.2,
        ease: "power2.in",
      });

      // Last board drifts away gently
      master.to(boards[totalBoards - 1], {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: "power2.in",
      }, "<0.3");

      // Spotlight fades
      master.to(spotlight, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "power2.in",
      }, "<0.2");

    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef}>
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #050508 0%, #0a0a10 50%, #050508 100%)' }}
      >
        {/* ——— Stage spotlight ——— */}
        <div
          className="spotlight absolute inset-0 z-[5] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.06) 0%, transparent 60%)',
          }}
        />

        {/* ——— Vignette ——— */}
        <div className="absolute inset-0 z-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)' }}
        />

        {/* ——— Film grain ——— */}
        <div className="absolute inset-0 z-[25] pointer-events-none opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }}
        />

        {/* ——— THE STRING (SVG) ——— */}
        <svg
          ref={stringRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          width="60"
          height="400"
          viewBox="0 0 60 400"
          style={{ transformOrigin: 'top center' }}
        >
          {/* Main string/rope */}
          <path
            className="string-line"
            d="M 30 0 Q 32 80 28 160 Q 34 240 30 320"
            fill="none"
            stroke="url(#string-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Subtle second strand for rope texture */}
          <path
            d="M 30 0 Q 27 80 33 160 Q 28 240 30 320"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Hook at the bottom */}
          <g className="string-hook" transform="translate(30, 320)">
            <circle r="6" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
            <circle r="2" fill="rgba(255,255,255,0.3)" />
          </g>
          {/* Knot at the top */}
          <g transform="translate(30, 0)">
            <ellipse rx="5" ry="3" fill="rgba(255,255,255,0.15)" />
          </g>
          {/* Gradient definition */}
          <defs>
            <linearGradient id="string-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
            </linearGradient>
          </defs>
        </svg>

        {/* ——— Stage title ——— */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <h2
            className="stage-title text-5xl md:text-8xl lg:text-9xl font-light tracking-[0.15em] text-white font-display text-center leading-none"
            style={{ textShadow: '0 0 80px rgba(255,255,255,0.08)' }}
          >
            OUR SERVICES
          </h2>
          <p className="stage-sub mt-5 text-sm md:text-base tracking-[0.35em] uppercase text-white/25 font-light">
            Pull the thread. See the work.
          </p>
        </div>

        {/* ——— Service boards (stacked, pulled in/out by string) ——— */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-2xl mx-auto px-6 md:px-12" style={{ perspective: '1000px' }}>
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className="service-board absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="board-inner w-full relative"
                >
                  {/* String attachment point — small ring at top center */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-3 h-3 rounded-full border-2 border-white/20" />
                    <div className="w-px h-6 bg-white/10 mx-auto" />
                  </div>

                  {/* The board itself */}
                  <div
                    className="relative p-8 md:p-12 rounded-xl overflow-hidden"
                    style={{
                      background: `linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`,
                      border: `1px solid rgba(255,255,255,0.06)`,
                      boxShadow: `
                        0 0 0 1px rgba(255,255,255,0.02),
                        0 30px 80px -20px rgba(0,0,0,0.7),
                        0 0 120px -40px ${svc.accent}15,
                        inset 0 1px 0 rgba(255,255,255,0.04)
                      `,
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Accent edge glow at top */}
                    <div className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${svc.accent}50, transparent)` }}
                    />

                    {/* Tag number */}
                    <div className="board-tag flex items-center gap-3 mb-8">
                      <span
                        className="text-[11px] tracking-[0.5em] uppercase font-bold px-3 py-1.5 rounded-full"
                        style={{
                          color: svc.accent,
                          border: `1px solid ${svc.accent}30`,
                          background: `${svc.accent}08`,
                        }}
                      >
                        SERVICE {svc.tag}
                      </span>
                      <div className="flex-1 h-px bg-white/[0.04]" />
                    </div>

                    {/* Title */}
                    <h3 className="board-title text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.1]">
                      {svc.title}
                    </h3>

                    {/* Description */}
                    <p className="board-desc mt-5 text-base md:text-lg text-white/40 leading-relaxed max-w-lg">
                      {svc.desc}
                    </p>

                    {/* Accent bar at bottom */}
                    <div
                      className="board-line mt-8 h-[2px] w-full rounded-full"
                      style={{
                        transformOrigin: 'left center',
                        background: `linear-gradient(90deg, ${svc.accent}, ${svc.accent}40, transparent)`,
                      }}
                    />

                    {/* Large faded number background */}
                    <div
                      className="absolute -right-4 -bottom-6 text-[10rem] md:text-[14rem] font-display font-bold leading-none select-none pointer-events-none"
                      style={{ color: `${svc.accent}06` }}
                    >
                      {svc.tag}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
