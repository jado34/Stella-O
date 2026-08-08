import React, { useState } from 'react';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { categories } from '../data/products';

export default function Footer() {
  const { setActiveCategory, setActiveView, setIsCorporateOpen } = useShop();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNav = (catId) => {
    setActiveCategory(catId);
    setActiveView('shop');
    setTimeout(() => {
      document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter */}
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-inner">
            <div>
              <h3 className="serif" style={{ fontSize: 24, color: 'var(--charcoal-text)', marginBottom: 4 }}>Subscribe to Our Harvest Notes</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Fresh stock arrivals, new products, seasonal specials and exclusive offers for Germany.</p>
            </div>
            {subscribed ? (
              <div className="subscribed-badge">
                ✓ You are subscribed to AfriFood Basket updates.
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="input-field"
                  placeholder="Enter email address"
                  style={{ flex: 1, minWidth: 0, background: '#FFFFFF' }}
                />
                <button type="submit" className="btn-primary" style={{ flexShrink: 0, whiteSpace: 'nowrap', fontSize: 11 }}>
                  SUBSCRIBE <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-logo">
              <span className="nav-logo-title serif" style={{ fontSize: 24, letterSpacing: '0.1em', color: '#F5F0E6' }}>AFRIFOOD</span>
              <span className="nav-logo-sub" style={{ fontSize: 8, letterSpacing: '0.35em', color: 'var(--gold)', fontWeight: 700 }}>BASKET</span>
            </div>
            <p className="footer-brand-desc">
              Authentic Nigerian & West African food delivered across Germany. Pure farm sourcing, quality-assured stock, and DHL Express shipping to every German city.
            </p>
            <p className="footer-brand-motto serif" style={{ color: 'var(--gold)', fontStyle: 'italic', fontSize: 15, marginTop: 12 }}>
              "Authentic Afro food, anywhere in Germany."
            </p>

            {/* Social SVGs */}
            <div className="footer-socials">
              <a href="#" className="footer-social-btn" aria-label="Instagram">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="X / Twitter">
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="Facebook">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.415V8z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <p className="footer-heading">PRODUCTS</p>
            {categories.slice(1, 9).map(c => (
              <button key={c.id} className="footer-link" onClick={() => handleNav(c.id)}>{c.label}</button>
            ))}
          </div>

          {/* Content Pages */}
          <div>
            <p className="footer-heading">EDITORIAL & TRUST</p>
            <button className="footer-link" onClick={() => setActiveView('story')}>Our Sourcing Story</button>
            <button className="footer-link" onClick={() => setActiveView('faq')}>FAQ & Shipping</button>
            <button className="footer-link" onClick={() => setActiveView('contact')}>Contact & Kitchens</button>
            <button className="footer-link" onClick={() => setIsCorporateOpen(true)}>Corporate Quotes</button>
            <button className="footer-link" onClick={() => setActiveView('privacy')}>Privacy Policy</button>
            <button className="footer-link" onClick={() => setActiveView('terms')}>Terms of Service</button>
          </div>

          {/* Contact */}
          <div>
            <p className="footer-heading">HEADQUARTERS</p>
            <div className="footer-contact-items">
              <div className="footer-contact-item">
                <MapPin size={13} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                <span>Kurfürstendamm 50, 10709 Berlin, Germany</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={13} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                <span>+49 30 1234 5678</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={13} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                <span>hello@afrifoodbasket.de</span>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <button
                className="btn-outline"
                style={{ fontSize: 10, padding: '7px 14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                onClick={() => setIsCorporateOpen(true)}
              >
                Request Corporate Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)' }}>
            © {new Date().getFullYear()} AfriFood Basket. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {['PayPal', 'SEPA', 'Visa', 'Mastercard'].map(p => (
              <span key={p} style={{ fontSize: 9, padding: '3px 8px', border: '1px solid rgba(245,240,230,0.12)', borderRadius: 3, color: 'rgba(245,240,230,0.35)', letterSpacing: '0.08em' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: #1C1712;
          border-top: none;
          color: #F5F0E6;
        }

        .footer-newsletter {
          border-bottom: 1px solid rgba(245,240,230,0.08);
          padding: 32px 0;
          background: #241B13;
        }
        .newsletter-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .newsletter-form { display: flex; gap: 10px; flex: 1; max-width: 440px; min-width: 250px; }
        .subscribed-badge { font-size: 12px; color: var(--gold); background: rgba(171,140,82,0.15); padding: 8px 16px; border-radius: 4px; border: 1px solid var(--gold); }

        .footer-main { padding: 48px 0 36px; }
        .footer-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1.1fr; gap: 32px; }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; } }

        .footer-logo { display: flex; flex-direction: column; margin-bottom: 10px; }
        .footer-brand-desc { font-size: 12px; line-height: 1.6; color: rgba(245,240,230,0.55); }
        .footer-socials { display: flex; gap: 8px; margin-top: 16px; }
        .footer-social-btn {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(245,240,230,0.15);
          border-radius: 50%; color: rgba(245,240,230,0.5);
          transition: var(--transition);
        }
        .footer-social-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(171,140,82,0.12); }

        .footer-heading { font-size: 10px; font-weight: 700; letter-spacing: 0.20em; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }
        .footer-link {
          display: block; width: 100%; text-align: left; background: none; border: none; cursor: pointer;
          font-size: 12px; color: rgba(245,240,230,0.55);
          padding: 4px 0; transition: var(--transition);
        }
        .footer-link:hover { color: #F5F0E6; padding-left: 4px; }

        .footer-contact-items { display: flex; flex-direction: column; gap: 10px; }
        .footer-contact-item { display: flex; gap: 8px; align-items: flex-start; font-size: 12px; color: rgba(245,240,230,0.55); line-height: 1.5; }

        .footer-bottom {
          border-top: 1px solid rgba(245,240,230,0.08);
          padding: 18px 0;
          background: #14100C;
        }
        .footer-bottom-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
      `}</style>
    </footer>
  );
}
