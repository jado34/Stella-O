import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const HERO_SLIDES = [
  {
    bg: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&q=85',
    tag: 'AFRIFOOD BASKET',
    titleLine1: 'Extending Our Hand',
    titleLine2: 'Across Distance.',
    sub: 'AfriFood Basket bridges authentic food sourcing with modern kitchens in Lagos, Abuja, and the diaspora.',
    cta: 'SHOP OUR FOOD STALL',
    category: 'all',
  },
  {
    bg: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&q=85',
    tag: 'HAND-SELECTED INGREDIENTS',
    titleLine1: 'Sourced Personally,',
    titleLine2: 'Trusted Globally.',
    sub: 'Every tuber of yam, bundle of Ugu, cut of stockfish, and bag of honey beans is personally inspected by the AfriFood Basket team.',
    cta: 'BROWSE PRODUCTS',
    category: 'all',
  },
  {
    bg: 'https://images.unsplash.com/photo-1543323717-89c8218ebbdb?w=1600&q=85',
    tag: 'DIASPORA SHIPPING',
    titleLine1: 'Taste Of Home,',
    titleLine2: 'Vacuum Sealed.',
    sub: 'Clean, secure packaging and customs-cleared shipping to the UK, US, and Canada.',
    cta: 'DIASPORA BULK ORDER',
    category: 'all',
  },
];

export default function Hero() {
  const { setActiveCategory, setActiveView } = useShop();
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const timer = setInterval(() => advance(), 6500);
    return () => clearInterval(timer);
  }, [current]);

  const advance = (next) => {
    const nextIdx = next !== undefined ? next : (current + 1) % HERO_SLIDES.length;
    if (nextIdx === current || transitioning) return;
    setTransitioning(true);
    setPrev(current);
    setCurrent(nextIdx);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 1200);
  };

  const slide = HERO_SLIDES[current];

  const handleCta = () => {
    setActiveCategory(slide.category);
    setActiveView('shop');
    document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      {/* Background layers — clip-path wipe reveal */}
      {HERO_SLIDES.map((s, i) => {
        const isActive = i === current;
        const isPrev = i === prev;
        return (
          <div
            key={i}
            className={`hero-bg ${isActive ? 'hero-bg-active' : ''} ${isPrev ? 'hero-bg-prev' : ''}`}
            style={{ backgroundImage: `url(${s.bg})` }}
          />
        );
      })}

      {/* Overlays */}
      <div className="hero-overlay-bottom" />
      <div className="hero-overlay-left" />

      {/* Content */}
      <div className={`hero-content container ${loaded ? 'anim-slide-up' : ''}`}>
        <p className="hero-tag">{slide.tag}</p>

        {/* Typographic tension: line 1 = serif italic thin, line 2 = bold upright */}
        <h1 className="hero-title">
          <span className="hero-title-line1 serif">{slide.titleLine1}</span>
          <span className="hero-title-line2 serif">{slide.titleLine2}</span>
        </h1>

        <p className="hero-sub">{slide.sub}</p>

        <div className="hero-ctas">
          <button className="btn-primary" onClick={handleCta}>
            {slide.cta}
          </button>
        </div>

        {/* Progress indicators */}
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? 'active' : ''}`}
              onClick={() => advance(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <button
        className="hero-scroll-hint"
        onClick={() => document.getElementById('brand-section')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span>SCROLL</span>
        <ArrowDown size={14} />
      </button>

      <style>{`
        .hero {
          position: relative;
          height: calc(100vh - 36px); min-height: 620px;
          display: flex; align-items: center;
          overflow: hidden; background: #0D0D0D;
        }

        /* --- Clip-path cinematic wipe transition --- */
        .hero-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          will-change: clip-path, transform;
        }
        /* Incoming: wipe in from right */
        .hero-bg-active {
          animation: heroWipeIn 1.25s cubic-bezier(0.76, 0, 0.24, 1) forwards,
                     heroKenBurns 14s ease-in-out infinite alternate;
          z-index: 2;
        }
        /* Outgoing: hold still behind */
        .hero-bg-prev {
          z-index: 1;
          animation: heroKenBurns 14s ease-in-out infinite alternate;
        }

        @keyframes heroWipeIn {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        @keyframes heroKenBurns {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }

        /* On first load just show */
        .hero-bg:not(.hero-bg-active):not(.hero-bg-prev) { z-index: 0; }
        .hero-bg:first-child { clip-path: none; animation: heroKenBurns 14s ease-in-out infinite alternate; z-index: 1; }
        .hero-bg-active:first-child { z-index: 2; animation: heroWipeIn 1.25s cubic-bezier(0.76, 0, 0.24, 1) forwards, heroKenBurns 14s ease-in-out infinite alternate; }

        .hero-overlay-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 80%;
          background: linear-gradient(to top, rgba(10,8,6,1) 0%, rgba(10,8,6,0.7) 45%, transparent 100%);
          z-index: 3;
        }
        .hero-overlay-left {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(10,8,6,0.9) 0%, rgba(10,8,6,0.4) 55%, transparent 100%);
          z-index: 3;
        }

        /* --- Content --- */
        .hero-content { position: relative; z-index: 4; max-width: 760px; }
        .hero-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 0.30em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 22px;
          display: flex; align-items: center; gap: 14px;
        }
        .hero-tag::before {
          content: ''; display: inline-block; width: 28px; height: 1px; background: var(--gold);
        }

        /* Typographic tension: italic thin line 1, bold upright line 2 */
        .hero-title {
          display: flex; flex-direction: column; margin-bottom: 28px;
        }
        .hero-title-line1 {
          font-size: clamp(54px, 7vw, 96px);
          font-style: italic; font-weight: 400;
          line-height: 1.0; color: rgba(245,240,230,0.92);
          letter-spacing: -0.02em;
        }
        .hero-title-line2 {
          font-size: clamp(54px, 7vw, 96px);
          font-style: normal; font-weight: 700;
          line-height: 1.0; color: #FFFFFF;
          letter-spacing: -0.03em;
        }

        .hero-sub {
          font-size: 15px; font-weight: 300;
          color: rgba(245,240,230,0.72); line-height: 1.7;
          margin-bottom: 40px; max-width: 460px;
        }

        .hero-ctas { margin-bottom: 44px; }

        /* Progress bar dots */
        .hero-dots { display: flex; gap: 6px; }
        .hero-dot {
          width: 24px; height: 2px; border-radius: 1px;
          background: rgba(255,255,255,0.2);
          border: none; cursor: pointer; transition: var(--transition);
        }
        .hero-dot.active { background: var(--gold); width: 52px; }

        /* Slide counter bottom right */
        .hero-counter {
          position: absolute; bottom: 44px; right: 44px; z-index: 4;
          display: flex; align-items: center; gap: 10px;
        }
        .hero-counter-current {
          font-size: 32px; font-weight: 700; color: #FFFFFF; font-family: 'Playfair Display', serif;
          line-height: 1;
        }
        .hero-counter-sep {
          width: 28px; height: 1px; background: rgba(255,255,255,0.3); transform: rotate(-65deg);
        }
        .hero-counter-total {
          font-size: 13px; font-weight: 400; color: rgba(255,255,255,0.4); letter-spacing: 0.05em;
        }

        /* Scroll hint */
        .hero-scroll-hint {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          z-index: 4;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          font-size: 9px; letter-spacing: 0.22em; font-weight: 700;
          color: rgba(255,255,255,0.4); background: none; border: none; cursor: pointer;
          transition: var(--transition); animation: float 2.8s ease infinite;
        }
        @keyframes float { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(7px); } }
        .hero-scroll-hint:hover { color: var(--gold); }

        @media (max-width: 768px) {
          .hero-scroll-hint { display: none; }
          .hero-counter { bottom: 28px; right: 20px; }
          .hero-counter-current { font-size: 24px; }
          .hero-title-line1, .hero-title-line2 { font-size: clamp(38px, 10vw, 62px); }
        }
      `}</style>
    </section>
  );
}
