import React, { useState, useEffect } from 'react';

const MESSAGES = [
  'FREE DELIVERY ON ORDERS ABOVE ₦25,000 · LAGOS ISLAND & MAINLAND',
  'HERITAGE HARVEST — OFADA RICE, POUNDED YAM FLOUR, SUYA SPICE YAJI NOW IN STOCK',
  'UK DIASPORA EXPRESS SHIPPING · ORDER BY WEDNESDAY FOR SATURDAY ARRIVAL',
  'ARTISAN FOOD SOURCED DIRECTLY FROM COOPERATIVES ACROSS OGUN, EKITI & KANO',
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
