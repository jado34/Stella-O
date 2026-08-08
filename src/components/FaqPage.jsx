import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const FAQ_CATEGORIES = [
  {
    category: 'Delivery Across Germany',
    icon: Truck,
    questions: [
      {
        q: 'Which cities in Germany do you deliver to?',
        a: 'We deliver to all cities across Germany via DHL Express, including Berlin, Hamburg, Munich, Frankfurt, Cologne, Stuttgart, Düsseldorf, Dortmund, Bremen, Leipzig, and everywhere in between. Simply enter your German postal code at checkout to confirm delivery availability.',
      },
      {
        q: 'How long does delivery take within Germany?',
        a: 'Standard delivery via DHL takes 2–4 business days. Orders placed before 12:00 noon (CET) on weekdays are typically dispatched the same day.',
      },
    ],
  },
  {
    category: 'Pantry Freshness & Sourcing',
    icon: ShieldCheck,
    questions: [
      {
        q: 'Are the products really hand-selected?',
        a: 'Yes. AfriFood Basket has spent over twenty years building relationships with local farmers in Ogun, Ekiti, Kano, and Benue. We inspect the quality of every single batch of honey beans, Ofada rice, yam tubers, and stockfish before they are vacuum-sealed and shipped to Germany.',
      },
      {
        q: 'How are products packaged for Germany?',
        a: 'All dry goods are vacuum-sealed and packaged in EU-compliant food-grade materials. Each product is clearly labelled with origin, shelf life, ingredients, and allergen information in accordance with EU food labelling regulations (EU No. 1169/2011).',
      },
    ],
  },
  {
    category: 'Payments & Ordering',
    icon: RefreshCw,
    questions: [
      {
        q: 'Which payment methods do you accept?',
        a: 'We accept PayPal, SEPA bank transfer, and all major credit/debit cards (Visa, Mastercard). For Nigerian customers or NGN-based orders, we also support direct bank transfer with WhatsApp confirmation.',
      },
      {
        q: 'What is your returns and refund policy?',
        a: 'Under EU consumer law, you have the right to return most items within 14 days of receipt. Perishable food items may be excluded from this right. If you receive a damaged or incorrect item, please contact us within 48 hours and we will arrange a full replacement or refund at no cost to you.',
      },
      {
        q: 'Do you offer bulk supply for events or restaurants?',
        a: 'Yes. We frequently supply African restaurants, churches, event caterers, and community organizations across Germany with bulk quantities. Please submit a Corporate Quote request through our site and our team will respond within 24 hours.',
      },
    ],
  },
];

export default function FaqPage() {
  const { setActiveView } = useShop();
  const [openIdx, setOpenIdx] = useState('0-0');

  const toggleAcc = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenIdx(prev => prev === key ? null : key);
  };

  return (
    <div className="faq-page section">
      <div className="container">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 48 }}>
          <p className="faq-eyebrow">AFRIFOOD BASKET · HELPDESK</p>
          <div className="divider divider-center" />
          <h1 className="faq-title serif">Frequently Asked Questions</h1>
          <p className="faq-intro">
            Everything you need to know about DHL delivery across Germany, EU food compliance, payment options, and bulk ordering.
          </p>
        </div>

        {/* Categories */}
        <div className="faq-categories-grid">
          {FAQ_CATEGORIES.map((cat, catIdx) => (
            <div key={catIdx} className="faq-cat-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <cat.icon size={20} style={{ color: 'var(--gold)' }} />
                <h2 className="serif" style={{ fontSize: 24, color: 'var(--charcoal-text)' }}>{cat.category}</h2>
              </div>

              <div className="faq-questions-list">
                {cat.questions.map((item, qIdx) => {
                  const key = `${catIdx}-${qIdx}`;
                  const isOpen = openIdx === key;
                  return (
                    <div key={qIdx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button className="faq-question-btn" onClick={() => toggleAcc(catIdx, qIdx)}>
                        <span>{item.q}</span>
                        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.3s', color: 'var(--gold)' }} />
                      </button>
                      {isOpen && (
                        <div className="faq-answer-body anim-slide-down">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center" style={{ marginTop: 60 }}>
          <button className="btn-primary" onClick={() => setActiveView('shop')}>
            ORDER STAPLES NOW
          </button>
        </div>
      </div>

      <style>{`
        .faq-page { background: var(--cream-bg); color: var(--charcoal-text); }
        .faq-eyebrow { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; font-weight: 700; }
        .faq-title { font-size: clamp(38px, 5vw, 64px); font-weight: 400; color: var(--charcoal-text); line-height: 1.1; margin-bottom: 16px; }
        .faq-intro { font-size: 16px; color: var(--text-muted); line-height: 1.7; max-width: 600px; margin: 0 auto 40px; }

        .faq-categories-grid { display: flex; flex-direction: column; gap: 40px; max-width: 800px; margin: 0 auto; }
        .faq-cat-box { background: #FFFFFF; border: 1px solid var(--border); border-radius: 4px; padding: 32px; box-shadow: var(--shadow-card); }
        
        .faq-questions-list { display: flex; flex-direction: column; gap: 12px; }
        .faq-item { border: 1px solid var(--border); border-radius: 4px; overflow: hidden; background: var(--cream-bg); }
        .faq-question-btn {
          width: 100%; display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px; text-align: left; background: none; border: none; cursor: pointer;
          font-size: 14px; font-weight: 600; color: var(--charcoal-text); transition: var(--transition);
        }
        .faq-question-btn:hover { background: rgba(38, 29, 21, 0.02); }
        .faq-answer-body { padding: 0 20px 16px; font-size: 13px; color: var(--text-muted); line-height: 1.6; }
      `}</style>
    </div>
  );
}
