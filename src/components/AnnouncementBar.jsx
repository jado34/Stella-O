import React, { useState, useEffect } from 'react';

const MESSAGES = [
  'FREE SHIPPING ON ORDERS ABOVE €75 · NATIONWIDE DELIVERY ACROSS GERMANY VIA DHL EXPRESS',
  'FRESH STOCK ARRIVED · EGUSI, OGBONO, STOCKFISH, PALM OIL & SUYA SPICE NOW AVAILABLE',
  'DELIVERING TO BERLIN · HAMBURG · MUNICH · COLOGNE · FRANKFURT · DÜSSELDORF & MORE',
  'AUTHENTIC WEST AFRICAN FOOD, SOURCED DIRECTLY FROM FARMS · VACUUM-SEALED FOR FRESHNESS',
];

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % MESSAGES.length);
        setFading(false);
      }, 400);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="announcement-bar">
      <p className={`announcement-text ${fading ? 'fading' : ''}`}>
        {MESSAGES[idx]}
      </p>

      <style>{`
        .announcement-bar {
          width: 100%;
          height: 36px;
          background: #1C1712;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          z-index: 200;
        }
        .announcement-text {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: var(--gold-light, #C4A56B);
          text-align: center;
          padding: 0 20px;
          transition: opacity 0.4s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90vw;
        }
        .announcement-text.fading { opacity: 0; }
      `}</style>
    </div>
  );
}
