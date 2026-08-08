import React from 'react';
import { useShop } from '../context/ShopContext';

export default function PrivacyPage() {
  const { setActiveView } = useShop();

  return (
    <div className="policy-page section anim-slide-up">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>PRIVACY POLICY · DATA PROTECTION</p>
          <h1 className="serif" style={{ fontSize: 44, color: 'var(--charcoal-text)', marginTop: 8 }}>Privacy Policy</h1>
          <div className="divider" />
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Last updated: August 1, 2026 · AfriFood Basket</p>
        </div>

        {/* Content */}
        <div className="policy-content glass" style={{ padding: '40px 32px', borderRadius: 8 }}>
          <section className="policy-section">
            <h2 className="serif">1. Data Controller</h2>
            <p>
              AfriFood Basket ("the Company", "we", "us") is a Nigerian-registered business currently operating in Germany. We are committed to protecting your personal data and handling it in accordance with the General Data Protection Regulation (GDPR), which applies to our operations as we serve customers residing in the European Union.
            </p>
            <p>
              Email: <strong>privacy@afrifoodbasket.de</strong>
            </p>
          </section>

          <section className="policy-section">
            <h2 className="serif">2. Information We Collect</h2>
            <p>We collect the following categories of personal data:</p>
            <ul>
              <li><strong>Identity Data:</strong> Full name, email address, phone number provided during registration or checkout.</li>
              <li><strong>Contact & Delivery Data:</strong> Shipping address, German postal code, and delivery zone selections.</li>
              <li><strong>Transaction Data:</strong> Order references, product selections, and payment method used. We do not store credit card numbers; payments are processed via third-party PCI-compliant processors.</li>
              <li><strong>Communication Data:</strong> Messages sent via WhatsApp, email, or our contact form.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="serif">3. Lawful Basis for Processing</h2>
            <p>We process your personal data under the following lawful bases (Article 6 GDPR):</p>
            <ul>
              <li><strong>Performance of a Contract:</strong> To process and deliver your orders.</li>
              <li><strong>Legitimate Interests:</strong> To improve our services, prevent fraud, and send service notifications.</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable Nigerian business law, EU food labelling regulations, and data protection obligations under GDPR.</li>
              <li><strong>Consent:</strong> For marketing communications (newsletter). You may withdraw consent at any time.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="serif">4. Data Sharing & Third Parties</h2>
            <p>
              We do not sell your personal data. We share data only with trusted processors including: DHL (delivery), PayPal / Stripe (payment processing), and our cloud infrastructure provider. All processors are bound by GDPR-compliant data processing agreements.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="serif">5. Your Rights Under GDPR</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Right of Access:</strong> Request a copy of the data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data.</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten").</li>
              <li><strong>Right to Restriction:</strong> Request we limit processing of your data.</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format.</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests.</li>
            </ul>
            <p>To exercise any of these rights, contact: <strong>privacy@afrifoodbasket.de</strong></p>
          </section>

          <section className="policy-section">
            <h2 className="serif">6. Data Retention</h2>
            <p>
              We retain personal data for as long as necessary to fulfil the purposes described in this policy, and in accordance with applicable legal and business record-keeping requirements (typically up to 7 years for transaction records).
            </p>
          </section>

          <section className="policy-section">
            <h2 className="serif">7. Right to Lodge a Complaint</h2>
            <p>
              If you are based in the EU and believe we have not handled your data correctly, you have the right to lodge a complaint with the relevant data protection supervisory authority in your country of residence. For Germany, this is the relevant state data protection authority (<em>Landesdatenschutzbehörde</em>).
            </p>
          </section>

          <section className="policy-section">
            <h2 className="serif">8. Contact</h2>
            <p>
              For any data protection enquiries, please contact us at <strong>privacy@afrifoodbasket.de</strong> or via WhatsApp at <strong>+49 157 3123 4567</strong>.
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
