import React from 'react';
import { useShop } from '../context/ShopContext';

export default function TermsPage() {
  const { setActiveView } = useShop();

  return (
    <div className="policy-page section anim-slide-up">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>STORE RULES & VIOLATIONS</p>
          <h1 className="serif" style={{ fontSize: 44, color: 'var(--charcoal-text)', marginTop: 8 }}>Terms of Service</h1>
          <div className="divider" />
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Last updated: July 25, 2026</p>
        </div>

        {/* Content */}
        <div className="policy-content glass" style={{ padding: '40px 32px', borderRadius: 8 }}>
          <section className="policy-section" style={{ borderLeft: '4px solid #ef4444', paddingLeft: 16, background: 'rgba(239, 68, 68, 0.03)', paddingTop: 10, paddingBottom: 10, borderRadius: '0 4px 4px 0' }}>
            <h2 className="serif" style={{ color: '#ef4444' }}>⚠️ IMPORTANT: Fraud and Abuse Policy</h2>
            <p>
              To protect the trust of our customers and ensure high-quality logistics for diaspora shipments, AfriFood Basket enforces a zero-tolerance policy against transaction violations:
            </p>
            <ul>
              <li><strong>Fake Receipts:</strong> Submitting fake, altered, or duplicate bank transfer screenshots or PayPal receipts via our WhatsApp verification desk is strictly prohibited and constitutes transaction fraud.</li>
              <li><strong>Reconciliation Holds:</strong> We manually verify every bank transfer and PayPal transaction ledger. Orders will not be dispatched from our Lagos stall or packed in the kitchen until the funds have cleared and been verified in our accounts.</li>
              <li><strong>Legal Prosecution:</strong> Fake transfer receipts will be reported immediately to financial payment partners, local security agencies, and standard identity bureaus. We reserve the right to immediately terminate the offending user account and refuse future services.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="serif">1. Ordering & Delivery Slots</h2>
            <p>
              All orders are subject to product availability and delivery zone scheduling:
            </p>
            <ul>
              <li><strong>Zone Eligibility:</strong> Customers must select the correct delivery zone during checkout. Incorrect zones will lead to adjustments in the final invoice.</li>
              <li><strong>Time Windows:</strong> Scheduled delivery slots are estimated timeframes. We guarantee the freshness of ambient, chilled, and frozen foodstuffs, but factors like traffic or dispatch delays may affect delivery times.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="serif">2. Freshness & Sourcing Standards</h2>
            <p>
              AfriFood Basket's products are sourced directly from domestic suppliers and farms. Unripe foodstuffs and perishable items are vacuum-sealed and temperature-monitored. By placing an order, you agree to inspect items upon receipt. Concerns must be reported immediately to our WhatsApp support line within 2 hours of delivery.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="serif">3. Cancellations & Refund Guidelines</h2>
            <p>
              Given the perishable nature of fresh harvests and swallow flours, orders cannot be cancelled once they enter the kitchen packing phase. Verified refunds will only be credited via original payment channels or store vouchers.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="serif">4. User Account Violations</h2>
            <p>
              Users are prohibited from sharing accounts, inputting false contact credentials, or utilizing automated scripts to monitor stock levels. Violating these rules will result in immediate suspension of account privileges.
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
          <button className="btn-primary" onClick={() => setActiveView('shop')}>
            RETURN TO SHOP
          </button>
        </div>
      </div>

      <style>{`
        .policy-page {
          background: var(--cream-bg);
          min-height: 80vh;
        }
        .policy-content {
          background: #FFFFFF;
          border: 1px solid var(--border);
          line-height: 1.6;
        }
        .policy-section {
          margin-bottom: 28px;
        }
        .policy-section h2 {
          font-size: 20px;
          color: var(--charcoal-text);
          margin-bottom: 12px;
        }
        .policy-section p {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        .policy-section ul {
          margin-left: 20px;
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--text-muted);
        }
        .policy-section li {
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}
