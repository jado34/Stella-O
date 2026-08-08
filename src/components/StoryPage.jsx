import React from 'react';
import { useShop } from '../context/ShopContext';

const STORY_SECTIONS = [
  {
    title: 'From Lagos to Germany',
    body: "For years, Stella's small brick-and-mortar shop was the heartbeat of the neighborhood. Customers knew that if they needed dry, sharp Ijebu Garri before the weekend, or special 'under-the-counter' Ogiri wrapped in leaves, Stella would have it set aside. Her business grew through word-of-mouth because she treated every customer like family. AfriFood Basket is simply an extension of her hand across distance, built for Nigerians and West Africans who have moved to Germany but still crave the authentic taste of home.",
  },
  {
    title: 'Honest, Non-Supermarket Sourcing',
    body: "We do not buy from mass industrial packaging plants. Stella continues to maintain personal relationships with local farmers in Ogun, Ekiti, Kano, and Benue. The honey beans are hand-selected, Ofada rice is double-sieved to be completely stone-free, and palm oil is cold-pressed from Edo State mills. It is clean food, handled with the same care Stella has shown for over twenty years — now vacuum-sealed and shipped directly to Germany.",
  },
];

export default function StoryPage() {
  const { setActiveView } = useShop();

  return (
    <div className="story-page section">
      <div className="container">
        {/* Header */}
        <div className="story-header text-center">
          <p className="story-eyebrow">AFRIFOOD BASKET · GERMANY</p>
          <div className="divider divider-center" />
          <h1 className="story-title serif">
            From Our Stall<br />
            <em>to Your Table in Germany.</em>
          </h1>
          <p className="story-intro">
            A real Nigerian food shop run by AfriFood Basket, extending a hand to the African diaspora community across Germany — Berlin, Hamburg, Munich, Frankfurt and beyond.
          </p>
        </div>

        {/* Story Banner Image */}
        <div className="story-hero-banner">
          <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&q=85" alt="Agricultural fields" />
          <div className="story-banner-overlay">
            <blockquote className="serif">
              "My customers in Germany want real stockfish, rich palm oil, and high-draw ogbono — exactly the same quality they remember from back home. We pack every box as if we were cooking it ourselves."
              <cite style={{ display: 'block', fontSize: 14, marginTop: 12, color: 'var(--gold-light)', fontStyle: 'normal', fontWeight: 700 }}>— STELLA, FOUNDER · AFRIFOOD BASKET GERMANY</cite>
            </blockquote>
          </div>
        </div>

        {/* Story details */}
        <div className="story-details-grid" style={{ marginTop: 60, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {STORY_SECTIONS.map((sec, i) => (
            <div key={i} className="story-block" style={{ padding: 24, background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 4 }}>
              <h3 className="serif" style={{ fontSize: 24, color: 'var(--charcoal-text)', marginBottom: 12 }}>{sec.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{sec.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center" style={{ marginTop: 60 }}>
          <button className="btn-primary" onClick={() => setActiveView('shop')}>
            ORDER NOW
          </button>
        </div>
      </div>

      <style>{`
        .story-page { background: var(--cream-bg); color: var(--charcoal-text); }
        .story-eyebrow { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; font-weight: 700; }
        .story-title { font-size: clamp(38px, 5vw, 64px); font-weight: 400; color: var(--charcoal-text); line-height: 1.1; margin-bottom: 16px; }
        .story-title em { color: var(--gold); font-style: italic; }
        .story-intro { font-size: 16px; color: var(--text-muted); line-height: 1.7; max-width: 600px; margin: 0 auto 40px; }

        .story-hero-banner { position: relative; height: 420px; border-radius: 4px; overflow: hidden; margin-bottom: 40px; box-shadow: var(--shadow-card); }
        .story-hero-banner img { width: 100%; height: 100%; object-fit: cover; }
        .story-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(22,16,12,0.9), rgba(22,16,12,0.4)); display: flex; align-items: flex-end; padding: 40px; }
        .story-banner-overlay blockquote { font-size: clamp(20px, 3vw, 26px); font-style: italic; color: #FFFFFF; max-width: 800px; line-height: 1.4; }
      `}</style>
    </div>
  );
}
