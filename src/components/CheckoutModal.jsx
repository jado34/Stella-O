import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, CreditCard, Smartphone, Building2, ChevronRight, Gift, ChevronDown, ShoppingBag, Wallet, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { deliveryZones } from '../data/products';
import WhatsAppIcon from './WhatsAppIcon';

const STEPS = ['Zone & Delivery Slot', 'Recipient & Address', 'Payment Gateway', 'Review & Confirm'];

export default function CheckoutModal() {
  const {
    isCheckoutOpen, setIsCheckoutOpen,
    cartItems, cartSubtotal, deliveryFee, cartTotal, convertPrice,
    deliverySlots, selectedSlot, setSelectedSlot,
    selectedZone, setSelectedZone,
    isGifting, giftingNote,
    placeOrder,
    currentUser, setIsAccountOpen, showToast,
    WHATSAPP_BUSINESS_NUMBER, PAYPAL_ME_LINK, PAYPAL_EMAIL
  } = useShop();

  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [payMethod, setPayMethod] = useState('paypal_whatsapp');
  const [useGuest, setUseGuest] = useState(true);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Sync contact state and guest mode with currentUser
  useEffect(() => {
    if (currentUser) {
      setContact({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        address: currentUser.address,
      });
      setUseGuest(false);
    } else {
      setContact({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
      setUseGuest(true);
    }
  }, [currentUser]);

  if (!isCheckoutOpen) return null;

  const canNext = () => {
    if (step === 0) return selectedZone && selectedSlot;
    if (step === 1) return contact.name && contact.email && contact.phone && contact.address;
    if (step === 2) return true;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      placeOrder(contact, payMethod);
    }
  };

  // Group slots by date
  const slotsByDate = deliverySlots.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});

  return (
    <>
      <div className="overlay" onClick={() => setIsCheckoutOpen(false)} style={{ zIndex: 300 }} />
      <div className="checkout-modal anim-scale-in" style={{ zIndex: 301 }}>
        {/* Header */}
        <div className="checkout-header">
          <div>
            <h3 className="serif" style={{ fontSize: 24, color: 'var(--charcoal-text)' }}>Checkout</h3>
            <p style={{ fontSize: 11, color: 'var(--gold)', marginTop: 2, fontWeight: 700, letterSpacing: '0.1em' }}>
              STEP {step + 1} OF {STEPS.length}: {STEPS[step].toUpperCase()}
            </p>
          </div>
          <button className="cart-close-btn" onClick={() => setIsCheckoutOpen(false)} aria-label="Close checkout">
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="checkout-progress">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`checkout-step ${i <= step ? 'done' : ''} ${i === step ? 'current' : ''}`}
                onClick={() => i < step && setStep(i)}
              >
                <div className="checkout-step-dot">{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`checkout-step-line ${i < step ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-body">
          <div className="checkout-main">
            {/* Mobile Order Summary (Visible only on mobile) */}
            <div className="mobile-summary-toggle-wrapper">
              <button
                type="button"
                className="mobile-summary-toggle-btn"
                onClick={() => setShowMobileSummary(!showMobileSummary)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShoppingBag size={14} style={{ color: 'var(--gold)' }} />
                  <span>{showMobileSummary ? 'Hide Order Summary' : 'Show Order Summary'}</span>
                  <ChevronDown size={12} style={{ transform: showMobileSummary ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }} />
                </div>
                <span className="serif" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 700 }}>{convertPrice(cartTotal)}</span>
              </button>
              {showMobileSummary && (
                <div className="mobile-summary-content anim-slide-up">
                  {cartItems.map(item => (
                    <div key={item.key} className="mobile-summary-item">
                      <img src={item.product.image} alt="" />
                      <div className="item-details">
                        <p className="item-name">{item.product.name}</p>
                        <p className="item-qty">{item.variant.label} × {item.quantity}</p>
                      </div>
                      <p className="item-price serif">{convertPrice(item.variant.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="mobile-summary-totals">
                    <div className="row"><span>Subtotal</span><span>{convertPrice(cartSubtotal)}</span></div>
                    <div className="row"><span>Delivery ({selectedZone?.name || 'Not Selected'})</span><span>+{convertPrice(deliveryFee)}</span></div>
                    <div className="row total">
                      <span>Total</span>
                      <span className="serif">{convertPrice(cartTotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 0: Zone & Delivery Slot Picker */}
            {step === 0 && (
              <div className="anim-slide-up">
                <h4 className="checkout-section-title serif">1. Select Delivery Zone</h4>
                <div className="zone-grid">
                  {deliveryZones.map(z => (
                    <button
                      key={z.id}
                      className={`zone-card ${selectedZone?.id === z.id ? 'active' : ''}`}
                      onClick={() => setSelectedZone(z)}
                    >
                      <MapPin size={16} style={{ color: selectedZone?.id === z.id ? 'var(--gold)' : 'var(--text-muted)' }} />
                      <div style={{ textTransform: 'none' }}>
                        <p className="zone-name">{z.name}</p>
                        <p className="zone-fee">+{convertPrice(z.baseFee)} Base Delivery Fee</p>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedZone && (
                  <>
                    <h4 className="checkout-section-title serif" style={{ marginTop: 24 }}>2. Select Date & Time Window</h4>
                    <div className="slots-wrap">
                      {Object.entries(slotsByDate).map(([date, slots]) => (
                        <div key={date} className="slot-day">
                          <p className="slot-date">{date}</p>
                          <div className="slot-times">
                            {slots.map(slot => (
                              <button
                                key={slot.id}
                                className={`slot-btn ${selectedSlot?.id === slot.id ? 'active' : ''} ${slot.available === 0 ? 'full' : ''}`}
                                disabled={slot.available === 0}
                                onClick={() => setSelectedSlot(slot)}
                              >
                                <Clock size={12} />
                                <span>{slot.time}</span>
                                <span className="slot-avail">{slot.available > 0 ? `${slot.available} left` : 'Full'}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 1: Recipient Details & Address */}
            {step === 1 && (
              <div className="anim-slide-up">
                <div style={{ display: 'flex', justifyValue: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 className="checkout-section-title serif" style={{ marginBottom: 0 }}>Delivery Address & Contact</h4>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className={`guest-opt-btn ${useGuest ? 'active' : ''}`}
                      onClick={() => setUseGuest(true)}
                    >
                      Guest Checkout
                    </button>
                    <button
                      type="button"
                      className={`guest-opt-btn ${!useGuest ? 'active' : ''}`}
                      onClick={() => {
                        if (!currentUser) {
                          setIsAccountOpen(true);
                          setIsCheckoutOpen(false);
                          showToast("Please sign in or create an account to proceed as a member.");
                        } else {
                          setUseGuest(false);
                        }
                      }}
                    >
                      Member Login
                    </button>
                  </div>
                </div>

                {isGifting && (
                  <div className="gifting-alert-box" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'rgba(254, 250, 246, 0.95)',
                    border: '1px solid var(--gold)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    marginBottom: 18
                  }}>
                    <Gift size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: 'var(--charcoal-text)', display: 'block', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        GIFTING ORDER ACTIVE (COMPLIMENTARY RIBBON PACKING)
                      </strong>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Note: "{giftingNote || 'Warmest wishes!'}"
                      </span>
                    </div>
                  </div>
                )}

                <div className="form-grid">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Adebayo Ogunlesi"
                      value={contact.name}
                      onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number (WhatsApp Ready)</label>
                    <input
                      className="input-field"
                      placeholder="+234 803 123 4567"
                      value={contact.phone}
                      onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Email Address (Order tracking link sent here)</label>
                    <input
                      className="input-field"
                      type="email"
                      placeholder="a.ogunlesi@example.ng"
                      value={contact.email}
                      onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Delivery Street Address & Landmarks</label>
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="e.g. Plot 14 Admiralty Way, Opposite Zenith Bank, Lekki Phase 1"
                      value={contact.address}
                      onChange={e => setContact(p => ({ ...p, address: e.target.value }))}
                      style={{ resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Gateway */}
            {step === 2 && (
              <div className="anim-slide-up">
                <h4 className="checkout-section-title serif">Select Payment Method</h4>
                <div className="pay-methods">
                  {[
                    { id: 'paypal_whatsapp', icon: Wallet, label: 'PayPal & WhatsApp Checkout', sub: `Send PayPal payment to ${PAYPAL_EMAIL}, then confirm and send order details on WhatsApp` },
                    { id: 'bank', icon: Building2, label: 'Direct Bank Transfer via WhatsApp', sub: 'Send order details to us on WhatsApp to pay via bank transfer (recommended for trust)' },
                  ].map(m => (
                    <button
                      key={m.id}
                      className={`pay-method ${payMethod === m.id ? 'active' : ''}`}
                      onClick={() => setPayMethod(m.id)}
                    >
                      <m.icon size={18} style={{ color: payMethod === m.id ? 'var(--gold)' : 'var(--text-muted)' }} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal-text)' }}>{m.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {payMethod === 'paypal_whatsapp' && (
                  <div className="paypal-details" style={{ marginTop: 16, padding: 16, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--cream-bg)' }}>
                    <p style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.1em' }}>PAYPAL PAYMENT INSTRUCTIONS</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                      Send payment manually to client's PayPal, then send us your receipt on WhatsApp:
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                      <div className="paypal-instruction-item" style={{ background: '#FFFFFF', padding: 12, borderRadius: 6, border: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>OPTION 1: PAYPAL.ME LINK</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                          <a href={PAYPAL_ME_LINK} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {PAYPAL_ME_LINK} <ExternalLink size={12} style={{ flexShrink: 0 }} />
                          </a>
                          <button 
                            type="button" 
                            className="guest-opt-btn" 
                            style={{ fontSize: 10, padding: '4px 8px', flexShrink: 0 }}
                            onClick={() => {
                              navigator.clipboard.writeText(PAYPAL_ME_LINK);
                              showToast('PayPal link copied!');
                            }}
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>

                      <div className="paypal-instruction-item" style={{ background: '#FFFFFF', padding: 12, borderRadius: 6, border: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>OPTION 2: PAYPAL EMAIL</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                          <strong style={{ color: 'var(--charcoal-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{PAYPAL_EMAIL}</strong>
                          <button 
                            type="button" 
                            className="guest-opt-btn" 
                            style={{ fontSize: 10, padding: '4px 8px', flexShrink: 0 }}
                            onClick={() => {
                              navigator.clipboard.writeText(PAYPAL_EMAIL);
                              showToast('PayPal email copied!');
                            }}
                          >
                            Copy Email
                          </button>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Total Amount Payable:</span>
                        <span style={{ fontSize: 20, color: 'var(--gold)', fontWeight: 700 }} className="serif">{convertPrice(cartTotal)}</span>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                          ℹ️ Send the payment above to our PayPal, then click **Next** to review, and finally click **Send Order via WhatsApp** to share the receipt and place the order.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {payMethod === 'bank' && (
                  <div className="bank-details" style={{ marginTop: 16, padding: 16, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--cream-bg)' }}>
                    <p style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.1em' }}>DIRECT BANK TRANSFER (AFRIFOOD BASKET)</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Bank Name:</span><strong style={{ color: 'var(--charcoal-text)' }}>Guaranty Trust Bank (GTBank)</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Account Name:</span><strong style={{ color: 'var(--charcoal-text)' }}>AfriFood Basket</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Account Number:</span><strong style={{ color: 'var(--gold)' }}>012-3456-789</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 4 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Please send receipt to WhatsApp:</span>
                        <strong style={{ color: 'var(--green-fresh)' }}>{WHATSAPP_BUSINESS_NUMBER}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <div className="anim-slide-up">
                <h4 className="checkout-section-title serif">Review Your Order</h4>
                <div className="review-items">
                  {cartItems.map(item => (
                    <div key={item.key} className="review-item">
                      <img src={item.product.image} alt={item.product.name} style={{ width: 44, height: 44, borderRadius: 4, objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal-text)' }}>{item.product.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.variant.label} × {item.quantity}</p>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gold)' }} className="serif">
                        {convertPrice(item.variant.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="review-summary" style={{ marginTop: 14, padding: 14, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--cream-bg)' }}>
                  <div className="review-row"><span>Subtotal</span><span className="serif">{convertPrice(cartSubtotal)}</span></div>
                  <div className="review-row"><span>Delivery Fee ({selectedZone?.name})</span><span className="serif">+{convertPrice(deliveryFee)}</span></div>
                  <div className="review-total-row">
                    <span>Total Amount Payable</span>
                    <span className="serif" style={{ fontSize: 22, color: 'var(--gold)' }}>{convertPrice(cartTotal)}</span>
                  </div>
                </div>

                <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--charcoal-text)', marginBottom: 2 }}>
                    <MapPin size={13} style={{ color: 'var(--gold)' }} />
                    <span>Delivering to <strong>{contact.name}</strong> ({contact.phone})</span>
                  </div>
                  <p style={{ marginLeft: 19 }}>{contact.address}</p>
                  <p style={{ marginLeft: 19, color: 'var(--gold)', marginTop: 2 }}>📅 Window: {selectedSlot?.date} ({selectedSlot?.time})</p>
                </div>

                {payMethod === 'paypal_whatsapp' && (
                  <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, color: 'var(--text-muted)', background: 'var(--cream-bg)' }}>
                    <p style={{ color: 'var(--charcoal-text)', fontWeight: 600, marginBottom: 4 }}>💳 PayPal Payment Instructions</p>
                    <p style={{ lineHeight: 1.4 }}>
                      Please ensure you have sent the payment to <a href={PAYPAL_ME_LINK} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline', fontWeight: 600 }}>{PAYPAL_ME_LINK}</a> (or PayPal email: <strong>{PAYPAL_EMAIL}</strong>). Clicking the button below will open WhatsApp so you can send your order reference and attach your receipt screenshot.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="checkout-sidebar">
            <div style={{ borderRadius: 6, padding: 14, border: '1px solid var(--border)', background: 'var(--cream-bg)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Summary</p>
              {cartItems.map(item => (
                <div key={item.key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <img src={item.product.image} alt="" style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--charcoal-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.variant.label} × {item.quantity}</p>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }} className="serif">
                    {convertPrice(item.variant.price * item.quantity)}
                  </p>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyValue: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}><span>Subtotal</span><span style={{ color: 'var(--charcoal-text)' }}>{convertPrice(cartSubtotal)}</span></div>
                <div style={{ display: 'flex', justifyValue: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}><span>Delivery</span><span style={{ color: 'var(--charcoal-text)' }}>{convertPrice(deliveryFee)}</span></div>
                <div style={{ display: 'flex', justifyValue: 'space-between', fontSize: 16, color: 'var(--gold)', fontWeight: 700, borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 4 }} className="serif">
                  <span>Total</span>
                  <span>{convertPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="checkout-footer">
          <button className="btn-ghost" onClick={() => step > 0 ? setStep(s => s - 1) : setIsCheckoutOpen(false)}>
            ← {step > 0 ? 'PREVIOUS' : 'CANCEL'}
          </button>
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={!canNext()}
            style={{ 
              opacity: canNext() ? 1 : 0.5,
              background: (step === STEPS.length - 1 && (payMethod === 'bank' || payMethod === 'paypal_whatsapp')) ? '#25D366' : '',
              borderColor: (step === STEPS.length - 1 && (payMethod === 'bank' || payMethod === 'paypal_whatsapp')) ? '#25D366' : '',
              boxShadow: (step === STEPS.length - 1 && (payMethod === 'bank' || payMethod === 'paypal_whatsapp')) ? '0 4px 14px rgba(37, 211, 102, 0.35)' : '',
              gap: 8
            }}
          >
            {step === STEPS.length - 1 && (payMethod === 'bank' || payMethod === 'paypal_whatsapp') && (
              <WhatsAppIcon size={16} color="#FFFFFF" fill="#25D366" />
            )}
            {step === STEPS.length - 1 
              ? ((payMethod === 'bank' || payMethod === 'paypal_whatsapp') ? 'SEND ORDER TO WHATSAPP' : 'PLACE ORDER') 
              : `NEXT: ${STEPS[step + 1].toUpperCase()}`}
            {!(step === STEPS.length - 1 && (payMethod === 'bank' || payMethod === 'paypal_whatsapp')) && (
              <ChevronRight size={15} />
            )}
          </button>
        </div>
      </div>

      <style>{`
        .checkout-modal {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: min(920px, 96vw); max-height: 92vh; background: #FFFFFF;
          border: 1px solid var(--border); border-radius: 8px; display: flex; flex-direction: column;
          box-shadow: var(--shadow-modal); overflow: hidden; color: var(--charcoal-text);
        }
        .checkout-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; flex-shrink: 0; background: var(--cream-bg); }
        .checkout-progress { display: flex; align-items: center; padding: 16px 24px 0; gap: 0; flex-shrink: 0; background: var(--cream-bg); border-bottom: 1px solid var(--border); }
        
        .checkout-step { display: flex; align-items: center; gap: 6px; cursor: pointer; opacity: 0.4; transition: var(--transition); }
        .checkout-step.done, .checkout-step.current { opacity: 1; }
        .checkout-step-dot {
          width: 22px; height: 22px; border-radius: 50%; border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--text-muted);
        }
        .checkout-step.done .checkout-step-dot { border-color: var(--gold); background: var(--gold); color: #FFFFFF; }
        .checkout-step.current .checkout-step-dot { border-color: var(--gold); color: var(--gold); }
        .checkout-step span { font-size: 10px; font-weight: 600; color: var(--text-muted); white-space: nowrap; }
        .checkout-step.current span, .checkout-step.done span { color: var(--charcoal-text); }
        .checkout-step-line { flex: 1; height: 1px; background: var(--border); margin: 0 8px; min-width: 14px; }
        .checkout-step-line.done { background: var(--gold); }

        .checkout-body { display: grid; grid-template-columns: 1fr 260px; gap: 20px; flex: 1; overflow: hidden; padding: 20px 24px; }
        @media (max-width: 720px) { .checkout-body { grid-template-columns: 1fr; } .checkout-sidebar { display: none; } }
        
        .checkout-main { overflow-y: auto; }
        .checkout-section-title { font-size: 18px; font-weight: 400; color: var(--charcoal-text); margin-bottom: 14px; }
        .checkout-sidebar { overflow-y: auto; }
        .checkout-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; border-top: 1px solid var(--border); flex-shrink: 0; background: var(--cream-bg); }

        .zone-grid { display: flex; flex-direction: column; gap: 8px; }
        .zone-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 6px; border: 1px solid var(--border); cursor: pointer; text-align: left; background: var(--cream-bg); transition: var(--transition); }
        .zone-card:hover, .zone-card.active { border-color: var(--gold); background: rgba(171,140,82,0.1); }
        .zone-name { font-size: 12px; font-weight: 600; color: var(--charcoal-text); }
        .zone-fee { font-size: 11px; color: var(--text-muted); }

        .slots-wrap { max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
        .slot-date { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
        .slot-times { display: flex; gap: 6px; flex-wrap: wrap; }
        .slot-btn { display: flex; align-items: center; gap: 4px; padding: 5px 10px; border: 1px solid var(--border); border-radius: 4px; font-size: 10px; color: var(--text-muted); background: var(--cream-bg); cursor: pointer; transition: var(--transition); }
        .slot-btn:hover:not(.full), .slot-btn.active { border-color: var(--gold); color: var(--gold); background: rgba(171,140,82,0.15); }
        .slot-btn.full { opacity: 0.35; cursor: not-allowed; }
        .slot-avail { font-size: 9px; color: var(--gold); margin-left: 2px; }

        .guest-opt-btn { background: none; border: 1px solid var(--border); border-radius: 4px; padding: 4px 10px; font-size: 10px; color: var(--text-muted); cursor: pointer; }
        .guest-opt-btn.active { border-color: var(--gold); color: var(--gold); background: rgba(171,140,82,0.1); }

        .gifting-alert-box { display: flex; align-items: center; gap: 10px; background: rgba(171,140,82,0.1); border: 1px solid var(--gold); padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 500px) { .form-grid { grid-template-columns: 1fr; } }
        .form-label { font-size: 10px; font-weight: 700; color: var(--text-muted); margin-bottom: 4px; display: block; letter-spacing: 0.05em; }
        .input-field { width: 100%; background: var(--cream-bg); border: 1px solid var(--border); border-radius: 4px; padding: 8px 12px; color: var(--charcoal-text); font-size: 12px; outline: none; }
        .input-field:focus { border-color: var(--gold); }

        .pay-methods { display: flex; flex-direction: column; gap: 8px; }
        .pay-method { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 6px; border: 1px solid var(--border); background: var(--cream-bg); cursor: pointer; text-align: left; transition: var(--transition); }
        .pay-method:hover, .pay-method.active { border-color: var(--gold); background: rgba(171,140,82,0.1); }

        .review-items { display: flex; flex-direction: column; gap: 8px; }
        .review-item { display: flex; align-items: center; gap: 12px; }
        .review-row { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .review-row.discount { color: var(--gold); }
        .review-total-row { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid var(--border); padding-top: 8px; margin-top: 4px; font-size: 13px; color: var(--charcoal-text); }

        .mobile-summary-toggle-wrapper {
          display: none;
          background: var(--cream-bg);
          border: 1px solid var(--border);
          border-radius: 6px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .mobile-summary-toggle-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 600;
          color: var(--charcoal-text);
          background: #FFFFFF;
          border-bottom: 1px solid var(--border);
        }
        .mobile-summary-content {
          padding: 14px 16px;
          background: var(--cream-bg);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mobile-summary-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mobile-summary-item img {
          width: 36px;
          height: 36px;
          border-radius: 4px;
          object-fit: cover;
        }
        .mobile-summary-item .item-details {
          flex: 1;
          min-width: 0;
        }
        .mobile-summary-item .item-name {
          font-size: 11px;
          font-weight: 600;
          color: var(--charcoal-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .mobile-summary-item .item-qty {
          font-size: 10px;
          color: var(--text-muted);
        }
        .mobile-summary-item .item-price {
          font-size: 11px;
          color: var(--gold);
          font-weight: 600;
        }
        .mobile-summary-totals {
          border-top: 1px solid var(--border);
          padding-top: 10px;
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mobile-summary-totals .row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-muted);
        }
        .mobile-summary-totals .row.total {
          border-top: 1px solid var(--border);
          padding-top: 8px;
          margin-top: 4px;
          font-size: 14px;
          color: var(--gold);
          font-weight: 700;
        }

        @media (max-width: 720px) {
          .mobile-summary-toggle-wrapper {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
