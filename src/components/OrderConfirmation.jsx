import React from 'react';
import { CheckCircle, Package, Truck, Clock, X, Printer, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import WhatsAppIcon from './WhatsAppIcon';

export default function OrderConfirmation() {
  const { orderConfirmed, setOrderConfirmed, convertPrice, setActiveView, addToCart, WHATSAPP_BUSINESS_NUMBER, PAYPAL_ME_LINK, PAYPAL_EMAIL } = useShop();

  if (!orderConfirmed) return null;

  const getWhatsAppLink = () => {
    if (!orderConfirmed) return '';
    const lineBreak = '---------------------------------------';
    let itemsList = '';
    orderConfirmed.items.forEach(item => {
      const priceStr = `${convertPrice(item.variant.price * item.quantity)}`;
      itemsList += `- ${item.product.name} (${item.variant.label}) x ${item.quantity} (${priceStr})\n`;
    });

    let message = '';
    if (orderConfirmed.paymentGateway === 'paypal_whatsapp') {
      message = `🇳🇬 *AFRIFOOD BASKET - NEW ORDER (PAYPAL)*\n` +
        `${lineBreak}\n` +
        `*Order Reference:* ${orderConfirmed.id}\n` +
        `*Customer Name:* ${orderConfirmed.customerName}\n` +
        `*Phone:* ${orderConfirmed.phone}\n` +
        `*Email:* ${orderConfirmed.email}\n\n` +
        `*Delivery Address:*\n` +
        `${orderConfirmed.address}\n\n` +
        `*Shipping Zone:* ${orderConfirmed.zone?.name || 'Lagos Island'}\n` +
        `*Delivery Slot:* ${orderConfirmed.slot?.date} (${orderConfirmed.slot?.time})\n\n` +
        `*Items Ordered:*\n` +
        `${itemsList}\n` +
        `${lineBreak}\n` +
        `*Order Calculations:*\n` +
        `- Subtotal: ${convertPrice(orderConfirmed.subtotal || (orderConfirmed.total - orderConfirmed.deliveryFee))}\n` +
        `- Delivery Fee: ${convertPrice(orderConfirmed.deliveryFee)}\n` +
        `- *Total Amount Payable:* ${convertPrice(orderConfirmed.total)}\n\n` +
        `${lineBreak}\n` +
        `*PayPal Payment Details:*\n` +
        `Paid via PayPal to ${PAYPAL_ME_LINK}\n` +
        `[📎 ATTACH YOUR PAYMENT SCREENSHOT HERE]\n\n` +
        `Thank you!`;
    } else {
      message = `🇳🇬 *AFRIFOOD BASKET - NEW ORDER*\n` +
        `${lineBreak}\n` +
        `*Order Reference:* ${orderConfirmed.id}\n` +
        `*Customer Name:* ${orderConfirmed.customerName}\n` +
        `*Phone:* ${orderConfirmed.phone}\n` +
        `*Email:* ${orderConfirmed.email}\n\n` +
        `*Delivery Address:*\n` +
        `${orderConfirmed.address}\n\n` +
        `*Shipping Zone:* ${orderConfirmed.zone?.name || 'Lagos Island'}\n` +
        `*Delivery Slot:* ${orderConfirmed.slot?.date} (${orderConfirmed.slot?.time})\n\n` +
        `*Items Ordered:*\n` +
        `${itemsList}\n`;

      if (orderConfirmed.isGift) {
        message += `*Gifting Order:* Yes (Complimentary Ribbon Packing)\n` +
          `*Gift Note:* "${orderConfirmed.giftNote || 'With warmth'}"\n\n`;
      }

      message += `${lineBreak}\n` +
        `*Order Calculations:*\n` +
        `- Subtotal: ${convertPrice(orderConfirmed.subtotal || (orderConfirmed.total - orderConfirmed.deliveryFee))}\n` +
        `- Delivery Fee: ${convertPrice(orderConfirmed.deliveryFee)}\n` +
        `- *Total Amount Payable:* ${convertPrice(orderConfirmed.total)}\n\n` +
        `${lineBreak}\n` +
        `Please send the bank account details so I can make the direct transfer. Thank you!`;
    }

    const cleanPhone = WHATSAPP_BUSINESS_NUMBER.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReorder = () => {
    orderConfirmed.items.forEach(item => {
      addToCart(item.product, item.variant, item.quantity);
    });
    setOrderConfirmed(null);
    setActiveView('shop');
  };

  return (
    <>
      <div className="overlay" style={{ zIndex: 400 }} onClick={() => setOrderConfirmed(null)} />
      <div className="oc-modal anim-scale-in" style={{ zIndex: 401 }}>
        <button
          className="cart-close-btn"
          style={{ position: 'absolute', top: 16, right: 16 }}
          onClick={() => setOrderConfirmed(null)}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Checkmark Animation */}
        <div className="oc-check">
          <div className="oc-check-ring" />
          <CheckCircle size={44} style={{ color: 'var(--gold)', position: 'relative', zIndex: 1 }} />
        </div>

        <h2 className="serif oc-title">Order Confirmed!</h2>
        <p className="oc-sub">Thank you for ordering with AfriFood Basket.</p>
        <p className="oc-id">Order Reference: <strong style={{ color: 'var(--gold)' }}>{orderConfirmed.id}</strong></p>

        {/* Live Tracking Timeline */}
        <div className="oc-timeline">
          {[
            { icon: CheckCircle, label: 'Order Placed', sub: orderConfirmed.placedAt, done: true },
            { icon: Package, label: 'Shop Packing', sub: 'AfriFood Basket is packing your box', done: true },
            { icon: Truck, label: 'Delivery Dispatch', sub: orderConfirmed.slot?.time || 'Scheduled Slot', done: false },
            { icon: Clock, label: 'Delivered', sub: 'Handed to recipient', done: false },
          ].map((step, i) => (
            <div key={i} className="oc-step">
              <div className={`oc-step-icon ${step.done ? 'done' : ''}`}>
                <step.icon size={16} />
              </div>
              {i < 3 && <div className={`oc-step-line ${step.done ? 'done' : ''}`} />}
              <div className="oc-step-info">
                <p className="oc-step-label">{step.label}</p>
                <p className="oc-step-sub">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Receipt Box */}
        <div className="oc-summary glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Recipient</span>
            <span style={{ fontSize: 12, color: 'var(--charcoal-text)', fontWeight: 600 }}>{orderConfirmed.customerName}</span>
          </div>

          <div className="oc-summary-row">
            <span>Delivery Zone</span>
            <span>{orderConfirmed.zone?.name || 'Lagos Island & VI'}</span>
          </div>

          <div className="oc-summary-row">
            <span>Scheduled Window</span>
            <span>{orderConfirmed.slot?.date} ({orderConfirmed.slot?.time})</span>
          </div>

          {orderConfirmed.isGift && (
            <div className="oc-summary-row" style={{ color: 'var(--gold)' }}>
              <span>Gift Note</span>
              <span>"{orderConfirmed.giftNote || 'With warmth'}"</span>
            </div>
          )}

          <div className="oc-summary-row total">
            <span>Total Settlement</span>
            <span className="serif" style={{ color: 'var(--gold)', fontSize: 22 }}>{convertPrice(orderConfirmed.total)}</span>
          </div>
        </div>

        <p className="oc-note">
          Instant updates sent via SMS & WhatsApp. Need immediate help? Contact Stella's dispatch desk at <strong style={{ color: 'var(--gold)' }}>{WHATSAPP_BUSINESS_NUMBER}</strong>
        </p>

        {/* Action Buttons */}
        <div className="oc-actions">
          {(orderConfirmed.paymentGateway === 'bank' || orderConfirmed.paymentGateway === 'paypal_whatsapp') && (
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textDecoration: 'none',
                background: '#25D366',
                borderColor: '#25D366',
                width: '100%',
                marginBottom: 12,
                fontSize: 12,
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                animation: 'pulseGreen 2s infinite'
              }}
            >
              <WhatsAppIcon size={16} color="#FFFFFF" fill="#25D366" /> SEND ORDER TO WHATSAPP NOW
            </a>
          )}
          <button className="btn-primary" onClick={handleReorder}>
            <RefreshCw size={14} /> Reorder Same Items
          </button>
          <button className="btn-outline" onClick={handlePrint}>
            <Printer size={14} /> Print Receipt
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_BUSINESS_NUMBER.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
          >
            <WhatsAppIcon size={14} color="#25D366" fill="#FFFFFF" /> WhatsApp Support
          </a>
        </div>
      </div>

      <style>{`
        .oc-modal {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: min(540px, 94vw); max-height: 90vh; overflow-y: auto;
          background: #FFFFFF; border: 1px solid var(--border);
          border-radius: 6px; padding: 36px 28px 28px; box-shadow: var(--shadow-modal);
          text-align: center; color: var(--charcoal-text);
        }
        .oc-check { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; margin-bottom: 16px; }
        .oc-check-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--gold); animation: ringPulse 2s ease infinite; }
        @keyframes ringPulse { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.35); opacity: 0; } }

        .oc-title { font-size: 30px; font-weight: 400; color: var(--charcoal-text); margin-bottom: 4px; }
        .oc-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 6px; }
        .oc-id { font-size: 12px; color: var(--text-muted); margin-bottom: 24px; }

        .oc-timeline { display: flex; justify-content: center; gap: 0; margin-bottom: 24px; position: relative; }
        .oc-step { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; position: relative; }
        .oc-step-icon {
          width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; color: var(--text-muted);
          background: #FFFFFF; z-index: 1; transition: var(--transition);
        }
        .oc-step-icon.done { border-color: var(--gold); color: var(--gold); background: rgba(214,90,49,0.12); }
        .oc-step-line { position: absolute; top: 17px; left: 50%; right: -50%; height: 2px; background: var(--border); z-index: 0; }
        .oc-step-line.done { background: var(--gold); }
        .oc-step-info { text-align: center; }
        .oc-step-label { font-size: 10px; font-weight: 700; color: var(--charcoal-text); }
        .oc-step-sub { font-size: 9px; color: var(--text-muted); }

        .oc-summary { border-radius: 4px; padding: 16px; margin-bottom: 16px; text-align: left; border: 1px solid var(--border); background: var(--cream-bg); }
        .oc-summary-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); margin-bottom: 8px; }
        .oc-summary-row span:last-child { color: var(--charcoal-text); font-weight: 500; }
        .oc-summary-row.total { border-top: 1px solid var(--border); padding-top: 10px; margin-top: 6px; }

        .oc-note { font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-bottom: 20px; }

        .oc-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

        @keyframes pulseGreen {
          0% { transform: scale(1); box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35); }
          50% { transform: scale(1.02); box-shadow: 0 4px 20px rgba(37, 211, 102, 0.50); }
          100% { transform: scale(1); box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35); }
        }
      `}</style>
    </>
  );
}
