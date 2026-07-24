import React from 'react';

const PILLARS = [
  {
    number: '01',
    title: 'Farm Sourcing',
    body: 'Every crop is cultivated by direct agricultural partner cooperatives across Ogun, Ekiti, Kano, and Benue.',
    image: '/nigerian_farm_sourcing.png',
  },
  {
    number: '02',
    title: 'Traditional Processing',
    body: 'From sun-dried Ijebu Garri to hand-smoked catfish, our suppliers honor traditional methods handed down through generations.',
    image: '/traditional_garri_processing.png',
  },
  {
    number: '03',
    title: 'Quality Assured',
    body: 'Products are clean-picked, batch-tested, and transparently labeled with origin, shelf life, and allergen details.',
    image: '/food_quality_assurance.png',
  },
  {
    number: '04',
    title: 'Scheduled Windows',
    body: 'Zone-validated delivery dates and 3-hour time slots across Lagos, Abuja, Port Harcourt, and Diaspora Express.',
    image: '/scheduled_grocery_delivery.png',
  },
];

const MARQUEE_ITEMS = [
  'NIGERIAN FARM COOPERATIVES',
  'DIRECT TO TABLE',
  'SAME DAY LAGOS',
  'HERITAGE GRAINS',
  'COLD-CHAIN QUALITY',
  'UK DIASPORA EXPRESS',
  'ARTISAN SPICES',
  'OFADA RICE',
  'POUNDED YAM FLOUR',
  'HALAL CERTIFIED',
];

export default function BrandStatement() {

  return (
    <section className="brand-section section" id="brand-section">
      {/* ── Marquee Identity Strip ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-dot" aria-hidden="true">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Headline */}
        <div className="brand-headline text-center">
          <p className="brand-eyebrow">OUR SOURCING PHILOSOPHY</p>
          <div className="divider divider-center" />
          <h2 className="brand-title serif">
            Uncompromised Food Culture,<br />
            <em>Curated for Modern Kitchens.</em>
          </h2>
          <p className="brand-intro">
            Stella O bridges authentic Nigerian farming cooperatives with discerning households. We make food ordering feel unhurried, trustworthy, and beautifully presented.
          </p>
        </div>

        {/* Editorial image grid */}
        <div className="brand-grid">
          {PILLARS.map((p, i) => (
            <div key={i} className="brand-card">
              <div className="brand-card-img">
                <img src={p.image} alt={p.title} loading="lazy" />
                <span className="brand-num serif">{p.number}</span>
              </div>
              <div className="brand-card-body">
                <h3 className="brand-card-title serif">{p.title}</h3>
                <p className="brand-card-text">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mid-page statement banner */}
        <div className="brand-banner">
          <div className="brand-quote-box text-center">
            <blockquote className="brand-quote serif">
              "I spent decades building my shop on trust and friendship. This website isn't about replacing my physical counter — it's about extending my hand to wherever you are, packing every bag of garri and bottle of palm oil with the very same care."
              <cite style={{ display: 'block', fontSize: 13, color: 'var(--gold)', fontStyle: 'normal', fontWeight: 700, marginTop: 12 }}>— STELLA, OWNER</cite>
            </blockquote>
          </div>
        </div>
      </div>

      <style>{`
        .brand-section { background: var(--cream-bg); border-bottom: 1px solid var(--border); color: var(--charcoal-text); }

        /* ── Marquee Strip ── */
        .marquee-strip {
          background: #1C1712;
          padding: 14px 0;
          overflow: hidden;
          border-bottom: 1px solid rgba(171,140,82,0.2);
          margin-bottom: 0;
        }
        .marquee-track {
          display: flex;
          gap: 0;
          width: max-content;
          animation: marqueeScroll 28s linear infinite;
        }
        .marquee-strip:hover .marquee-track { animation-play-state: paused; }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-item {
          font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--gold-light, #C4A56B);
          white-space: nowrap; padding: 0 20px;
        }
        .marquee-dot {
          margin-left: 20px; color: rgba(171,140,82,0.4);
        }

        /* ── Brand Section ── */
        .brand-eyebrow {
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 12px; font-weight: 700;
        }
        .brand-title {
          font-size: clamp(34px, 4.5vw, 56px);
          font-weight: 400; color: var(--charcoal-text);
          line-height: 1.15; margin-bottom: 18px;
        }
        .brand-title em { color: var(--gold); font-style: italic; }
        .brand-intro {
          font-size: 15px; font-weight: 300;
          color: var(--text-muted); line-height: 1.7;
          max-width: 540px; margin: 0 auto 50px;
        }

        .brand-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px; margin-bottom: 70px;
        }
        .brand-card {
          border-radius: 4px; overflow: hidden; border: 1px solid var(--border);
          transition: var(--transition); background: var(--card-bg);
        }
        .brand-card:hover { transform: translateY(-5px); border-color: var(--gold); box-shadow: 0 12px 36px rgba(0,0,0,0.1); }
        .brand-card-img { position: relative; aspect-ratio: 4/3; overflow: hidden; }
        .brand-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .brand-card:hover .brand-card-img img { transform: scale(1.07); }
        .brand-num {
          position: absolute; bottom: 10px; right: 14px;
          font-size: 28px; color: var(--gold); font-weight: 300; opacity: 0.8;
        }
        .brand-card-body { padding: 20px; background: #FFFFFF; }
        .brand-card-title { font-size: 20px; margin-bottom: 8px; color: var(--charcoal-text); }
        .brand-card-text { font-size: 13px; line-height: 1.6; color: var(--text-muted); }

        .brand-banner {
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          padding: 60px 20px; background: #EFECE6;
        }
        .brand-quote-box { max-width: 760px; margin: 0 auto; }
        .brand-quote {
          font-size: clamp(18px, 2.5vw, 28px);
          font-weight: 300; font-style: italic; color: var(--charcoal-text);
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
