import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const FAQ_CATEGORIES = [
  {
    category: 'Delivery Zones & Times',
    icon: Truck,
    questions: [
      {
        q: 'What regions do you deliver to in Nigeria?',
        a: 'We currently deliver doorstep packages across Lagos Island (Lekki, VI, Ikoyi, Chevron), Lagos Mainland (Ikeja, Surulere, Yaba, Gbagada), and Abuja FCT (Maitama, Wuse, Garki, Jabi). We validate your zone early in the checkout process.',
      },
      {
        q: 'How does international shipping work for diaspora customers?',
        a: 'We ship vacuum-sealed, customs-compliant dry food packages to the US, UK, and Canada. Standard shipping takes 5-7 working days to the UK, and 7-10 working days to the US and Canada. Shipping rates are calculated separately from local Nigerian deliveries.',
      },
      {
        q: 'What are the delivery slots for Lagos and Abuja?',
        a: 'Our delivery drivers run three daily dispatch windows: Morning Run (8am - 11am), Afternoon Dispatch (11am - 2pm), and Evening Deliveries (2pm - 5pm). You can schedule your slot up to 7 days in advance.',
      },
    ],
  },
  {
    category: 'Pantry Freshness & Sourcing',
    icon: ShieldCheck,
    questions: [
      {
        q: 'Are the products really hand-selected?',
        a: 'Yes. AfriFood Basket has spent over twenty years building relationships with local farmers in Ogun, Ekiti, Kano, and Benue. We inspect the quality of every single batch of honey beans, Ofada rice, yam tubers, and stockfish before they are packaged.',
      },
      {
        q: 'How are perishable and frozen items packed?',
        a: 'Fresh produce like yams and plantains are packed in dry, airy boxes. Perishable or frozen goods (like frozen chicken, tilapia, and fresh cow skin/ponmo) are packed inside insulated bags filled with ice packs to guarantee they arrive cold.',
      },
    ],
  },
  {
    category: 'Payments & Ordering Options',
    icon: RefreshCw,
    questions: [
      {
        q: 'Which payment options do you support?',
        a: 'For Nigerian customers, we default to Paystack and Flutterwave, supporting local credit/debit cards, direct bank transfer, and USSD. Diaspora customers can pay with international cards (Visa/Mastercard) and will see estimated currency rates based on our base NGN settlement.',
      },
      {
        q: 'Do you offer bulk supply for events, churches, or caterers?',
        a: 'Yes. We frequently supply large events, churches, and caterers by the bag rather than the cup. You can submit a wholesale inquiry through the Bulk Supply form on our site, and AfriFood Basket’s team will coordinate directly on WhatsApp.',
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
          <p className="faq-eyebrow">AFRIFOOD BASKET HELPDESK</p>
          <div className="divider divider-center" />
          <h1 className="faq-title serif">Frequently Asked Questions</h1>
          <p className="faq-intro">
            Everything you need to know about our scheduled local deliveries, diaspora express shipping, and wholesale ordering.
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
