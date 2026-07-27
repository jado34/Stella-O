import React, { useState } from 'react';
import { MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import WhatsAppIcon from './WhatsAppIcon';

export default function ContactPage() {
  const { showToast, setIsCorporateOpen, WHATSAPP_BUSINESS_NUMBER } = useShop();
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', topic: 'General Inquiry', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    showToast('Your message has been sent to AfriFood Basket’s customer desk!');
  };

  return (
    <div className="contact-page section">
      <div className="container">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 48 }}>
          <p className="contact-eyebrow">AFRIFOOD BASKET KITCHENS & DISPATCH</p>
          <div className="divider divider-center" />
          <h1 className="contact-title serif">Get in Touch with AfriFood Basket</h1>
          <p className="contact-intro">
            Have a question about shipping to the diaspora, checkouts, or bulk orders? Our team will respond directly.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Details */}
          <div className="contact-info-card">
            <h2 className="serif" style={{ fontSize: 28, color: 'var(--charcoal-text)', marginBottom: 20 }}>Direct Channels</h2>

            <div className="contact-detail-item">
              <WhatsAppIcon size={20} color="#25D366" fill="#FFFFFF" style={{ flexShrink: 0 }} />
              <div>
                <strong>WhatsApp Concierge Desk</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Instant response for live order updates</p>
                <a href={`https://wa.me/${WHATSAPP_BUSINESS_NUMBER.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 13, marginTop: 4, display: 'inline-block' }}>
                  Chat on WhatsApp ({WHATSAPP_BUSINESS_NUMBER}) →
                </a>
              </div>
            </div>

            <div className="contact-detail-item">
              <MapPin size={20} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <div>
                <strong>Lagos Physical Stall & Dispatch Hub</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Plot 14 Admiralty Way, Lekki Phase 1, Victoria Island, Lagos State</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <Clock size={20} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <div>
                <strong>Stall Hours</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Monday – Saturday: 08:00 – 19:00 (WAT)</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sunday Scheduled Deliveries: 10:00 – 16:00 (WAT)</p>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Planning an event, church feeding, or small caterer run?</p>
              <button className="btn-outline w-full" style={{ fontSize: 11 }} onClick={() => setIsCorporateOpen(true)}>
                REQUEST BULK SUPPLY RATE
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-card">
            <h2 className="serif" style={{ fontSize: 28, color: 'var(--charcoal-text)', marginBottom: 20 }}>Send Us a Message</h2>

            {formSent ? (
              <div className="sent-success-box text-center">
                <CheckCircle size={40} style={{ color: '#2e7d32', margin: '0 auto 12px' }} />
                <h3 className="serif" style={{ fontSize: 24, color: 'var(--charcoal-text)' }}>Message Received</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                  Thank you, <strong>{formData.name}</strong>. Our dispatch manager will respond to {formData.email} within 2 hours.
                </p>
                <button className="btn-outline" style={{ marginTop: 20, fontSize: 11 }} onClick={() => setFormSent(false)}>
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    required
                    className="input-field"
                    placeholder="e.g. Adebayo Ogunlesi"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input
                      required
                      type="email"
                      className="input-field"
                      placeholder="a.ogunlesi@example.ng"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      required
                      className="input-field"
                      placeholder="+234 803 123 4567"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Reason for Inquiry</label>
                  <select
                    className="input-field"
                    value={formData.topic}
                    onChange={e => setFormData(p => ({ ...p, topic: e.target.value }))}
                    style={{ background: 'var(--cream-bg)' }}
                  >
                    <option value="General Inquiry">General Question</option>
                    <option value="Diaspora Delivery">Diaspora Shipping Details</option>
                    <option value="Bulk Order">Bulk Orders & Catering Support</option>
                    <option value="Payment Issue">Payment & Bank Reconciliation</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Message Details</label>
                  <textarea
                    required
                    className="input-field"
                    rows={4}
                    placeholder="Write your request here..."
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                  <Send size={15} /> SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-page { background: var(--cream-bg); color: var(--charcoal-text); }
        .contact-eyebrow { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; font-weight: 700; }
        .contact-title { font-size: clamp(38px, 5vw, 64px); font-weight: 400; color: var(--charcoal-text); line-height: 1.1; margin-bottom: 16px; }
        .contact-intro { font-size: 16px; color: var(--text-muted); line-height: 1.7; max-width: 600px; margin: 0 auto 40px; }

        .contact-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 40px; margin-top: 20px; }
        @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr; } }

        .contact-info-card, .contact-form-card { background: #FFFFFF; border: 1px solid var(--border); border-radius: 4px; padding: 36px; box-shadow: var(--shadow-card); }
        
        .contact-detail-item { display: flex; gap: 16px; margin-bottom: 24px; align-items: flex-start; }
        .contact-detail-item strong { display: block; font-size: 14px; color: var(--charcoal-text); margin-bottom: 2px; }

        .form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); margin-bottom: 6px; }
        .input-field { width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: 4px; font-size: 13px; color: var(--charcoal-text); background: var(--cream-bg); outline: none; transition: var(--transition); }
        .input-field:focus { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(214,90,49,0.1); }
      `}</style>
    </div>
  );
}
