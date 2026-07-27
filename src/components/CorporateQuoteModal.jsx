import React, { useState } from 'react';
import { X, Send, CheckCircle, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CorporateQuoteModal() {
  const { isCorporateOpen, setIsCorporateOpen, addCorporateQuote, convertPrice } = useShop();
  const [submittedQuote, setSubmittedQuote] = useState(null);

  const [form, setForm] = useState({
    company: 'St. Jude’s Catholic Church',
    contactPerson: 'Adebayo Ogunlesi',
    email: 'a.ogunlesi@example.ng',
    phone: '+234 803 123 4567',
    eventDate: '2026-08-20',
    estQuantity: 15,
    notes: 'Need 15 bags of 20kg Honey Beans and 10 large tubers of Yam for our upcoming charity food bank drive.',
  });

  if (!isCorporateOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addCorporateQuote(form);
    setSubmittedQuote(form);
  };

  const estTotalNGN = form.estQuantity * 30000 * 0.9; // 10% wholesale discount applied

  return (
    <>
      <div className="overlay" onClick={() => setIsCorporateOpen(false)} style={{ zIndex: 300 }} />
      <div className="corp-modal anim-scale-in" style={{ zIndex: 301 }}>
        <button
          className="cart-close-btn"
          style={{ position: 'absolute', top: 16, right: 16 }}
          onClick={() => setIsCorporateOpen(false)}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {!submittedQuote ? (
          <>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, marginBottom: 4 }}>
              Bulk Food Supply & Caterers
            </p>
            <h2 className="serif" style={{ fontSize: 26, color: 'var(--charcoal-text)', marginBottom: 6, lineHeight: 1.15 }}>
              Wholesale & Bulk Ordering<br />for Events, Churches & Kitchens
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
              AfriFood Basket regularly supplies event planners, catering kitchens, and religious organizations. Request a bulk quote for bags of Rice, Beans, or Yams below.
            </p>

            {/* Wholesale Info Box */}
            <div className="wholesale-info-box">
              <Package size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontSize: 12, color: 'var(--charcoal-text)' }}>Bulk Dispatch Available</strong>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Special logistics pricing for drop-off directly at your event venue or church kitchen.</span>
              </div>
            </div>

            <form className="corp-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div>
                  <label className="form-label">Organization Name</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Grace Kitchen Services"
                    required
                    value={form.company}
                    onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Contact Person</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Adebayo Ogunlesi"
                    required
                    value={form.contactPerson}
                    onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="caterer@example.ng"
                    required
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Phone (WhatsApp Ready)</label>
                  <input
                    className="input-field"
                    placeholder="+234 803 123 4567"
                    required
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Est. Bags Needed</label>
                  <input
                    className="input-field"
                    type="number"
                    min="1"
                    required
                    value={form.estQuantity}
                    onChange={e => setForm(p => ({ ...p, estQuantity: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="form-label">Expected Delivery Date</label>
                  <input
                    className="input-field"
                    type="date"
                    required
                    value={form.eventDate}
                    onChange={e => setForm(p => ({ ...p, eventDate: e.target.value }))}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Wholesale List Items & Packing Instructions</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="e.g. 15 bags of 20kg Honey Beans, 5 drums of Palm Oil. Deliver to St. Jude’s Parish Hall."
                    value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>

              {/* Estimate Total */}
              <div className="quote-preview-calc">
                <span>Estimated Wholesale Total:</span>
                <span className="serif" style={{ fontSize: 18, color: 'var(--gold)', fontWeight: 700 }}>
                  {convertPrice(estTotalNGN)}
                </span>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 12, justifyContent: 'center', width: '100%' }}>
                <Send size={15} /> SUBMIT BULK INQUIRY
              </button>
            </form>
          </>
        ) : (
          <div className="text-center anim-scale-in" style={{ padding: '16px 0' }}>
            <CheckCircle size={50} style={{ color: 'var(--gold)', margin: '0 auto 16px' }} />
            <h2 className="serif" style={{ fontSize: 26, color: 'var(--charcoal-text)', marginBottom: 8 }}>Inquiry Sent!</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
              Thank you, <strong style={{ color: 'var(--charcoal-text)' }}>{submittedQuote.contactPerson}</strong>. Our manager will review this wholesale request and call/message you directly on WhatsApp at <strong style={{ color: 'var(--gold)' }}>{submittedQuote.phone}</strong> with final delivery options.
            </p>

            <div className="invoice-preview-card" style={{ padding: 16, borderRadius: 4, border: '1px solid var(--border)', background: 'var(--cream-bg)', margin: '0 auto 20px', maxWidth: 440, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>WHOLESALE BULK REQUEST</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>REF: WT-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--charcoal-text)' }}>
                <div>Client: <strong>{submittedQuote.company}</strong></div>
                <div>Quantity: <strong>{submittedQuote.estQuantity} Bags</strong></div>
                <div>Target Date: <strong>{submittedQuote.eventDate}</strong></div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 6, display: 'flex', justifyContent: 'space-between', color: 'var(--gold)', fontWeight: 700 }}>
                  <span>Est Total (NGN)</span>
                  <span className="serif">{convertPrice(estTotalNGN)}</span>
                </div>
              </div>
            </div>

            <button
              className="btn-outline"
              onClick={() => { setIsCorporateOpen(false); setSubmittedQuote(null); }}
            >
              Return to Shop
            </button>
          </div>
        )}
      </div>

      <style>{`
        .corp-modal {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: min(640px, 95vw); max-height: 92vh; overflow-y: auto;
          background: #FFFFFF; border: 1px solid var(--border);
          border-radius: 4px; padding: 32px 28px; box-shadow: var(--shadow-modal);
        }
        .wholesale-info-box {
          display: flex; gap: 12px; padding: 12px; border-radius: 4px; border: 1px solid var(--border); margin-bottom: 20px; background: var(--cream-bg);
        }
        .corp-form { display: flex; flex-direction: column; gap: 12px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 500px) { .form-grid { grid-template-columns: 1fr; } }
        .quote-preview-calc { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-radius: 4px; border: 1px solid var(--border); font-size: 13px; color: var(--charcoal-text); background: var(--cream-bg); }
      `}</style>
    </>
  );
}
