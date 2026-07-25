import React from 'react';
import { useShop } from '../context/ShopContext';

export default function PrivacyPage() {
  const { setActiveView } = useShop();

  return (
    <div className="policy-page section anim-slide-up">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>LEGAL PROTOCOLS</p>
          <h1 className="serif" style={{ fontSize: 44, color: 'var(--charcoal-text)', marginTop: 8 }}>Privacy Policy</h1>
          <div className="divider" />
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Last updated: July 25, 2026</p>
        </div>

        {/* Content */}
        <div className="policy-content glass" style={{ padding: '40px 32px', borderRadius: 8 }}>
          <section className="policy-section">
            <h2 className="serif">1. Information We Collect</h2>
            <p>
              We collect information to provide better services to all our users. This includes:
            </p>
            <ul>
              <li><strong>Account Credentials:</strong> Full Name, Email address, WhatsApp-ready phone number, and physical address provided during Google registration or verification checkout.</li>
              <li><strong>Purchase Transactions:</strong> Order references, details of items purchased, shipping zone selections, and delivery slots. We do not store financial card details, as card payments are processed via third-party processors.</li>
              <li><strong>Verification Records:</strong> Payment receipts or screenshots sent to our WhatsApp helpline to reconcile bank transfers or PayPal transfers manually.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="serif">2. How We Use Information</h2>
            <p>
              We use the collected information for purposes including:
            </p>
            <ul>
              <li>Processing and delivering your orders to domestic addresses or international diaspora dispatch points.</li>
              <li>Sending order status notifications and updates via email, SMS, and WhatsApp.</li>
              <li>Verifying payments, preventing transaction fraud, and protecting our store against user violations.</li>
              <li>Improving our foodstuffs selection and customer service.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="serif">3. Data Security & Storage</h2>
            <p>
              AfriFood Basket takes commercial data protection seriously. We utilize industry-standard encryption protocols and secure database setups to protect your personal details. Access to your transaction data is restricted solely to verified kitchen dispatch managers.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="serif">4. Data Sharing & Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal details with third-party advertising services. Personal data is only shared with dispatch riders, delivery zones coordinators, or legal advisors in direct connection to executing your orders or preventing fraudulent transactions.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="serif">5. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact our privacy desk via our WhatsApp Helpline or at <strong>concierge@afrifoodbasket.com</strong>.
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
