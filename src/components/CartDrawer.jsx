import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Gift, AlertCircle, Truck, ChevronDown, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { deliveryZones } from '../data/products';

const MIN_ORDER_THRESHOLD = 15000;

export default function CartDrawer() {
  const {
    cartItems, cartSubtotal, deliveryFee, cartTotal, cartCount,
    isCartOpen, setIsCartOpen, removeFromCart, updateQuantity,
    convertPrice, setIsCheckoutOpen,
    selectedZone, setSelectedZone, isGifting, setIsGifting, giftingNote, setGiftingNote,
  } = useShop();

  if (!isCartOpen) return null;

  const minOrderProgress = Math.min(100, Math.round((cartSubtotal / MIN_ORDER_THRESHOLD) * 100));
  const minOrderRemaining = Math.max(0, MIN_ORDER_THRESHOLD - cartSubtotal);

  return (
    <>
      <div className="overlay" onClick={() => setIsCartOpen(false)} style={{ zIndex: 300 }} />
      <div className="cart-drawer anim-slide-right" style={{ zIndex: 301 }}>
        {/* Header */}
        <div className="cart-header">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} style={{ color: 'var(--gold)' }} />
            <h3 className="serif" style={{ fontSize: 22, color: 'var(--charcoal-text)' }}>Your Basket</h3>
            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
          </div>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close bag">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="cart-scroll-content">
          {/* Perishable warning & minimum order threshold bar */}
          {cartItems.length > 0 && (
            <div className="cart-notices">
              {minOrderRemaining > 0 ? (
                <div className="threshold-bar-box">
                  <div className="flex justify-between items-center text-xs mb-1" style={{ fontSize: 11 }}>
                    <span>Spend <strong>{convertPrice(minOrderRemaining)}</strong> more for free dispatch bonus</span>
                    <span className="serif" style={{ color: 'var(--gold)', fontWeight: 700 }}>{minOrderProgress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${minOrderProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="threshold-achieved">
                  ✓ Free Dispatch Bonus Unlocked!
                </div>
              )}
              <div className="perishable-alert">
                <AlertCircle size={12} style={{ color: 'var(--gold)' }} />
                <span>Vacuum-sealed, temperature-monitored packaging included.</span>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <ShoppingBag size={48} style={{ color: 'var(--border)', marginBottom: 12 }} />
                <p className="serif" style={{ fontSize: 20, color: 'var(--charcoal-text)' }}>Your basket is empty</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, marginBottom: 20 }}>
                  Explore our curated harvests of authentic Nigerian foodstuffs.
                </p>
                <button className="btn-primary" onClick={() => setIsCartOpen(false)}>
                  START SHOPPING
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.key} className="cart-item">
                  <div className="cart-item-img">
                    <img src={item.product.image} alt={item.product.name} />
                  </div>
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.product.name}</h4>
                    <p className="cart-item-variant">{item.variant.label} • {item.product.storage}</p>

                    <div className="cart-item-footer">
                      <div className="qty-control">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="cart-item-price serif">{convertPrice(item.variant.price * item.quantity)}</p>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.key)} aria-label="Remove item">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary Sections inside Scroll Area */}
          {cartItems.length > 0 && (
            <div className="cart-summary-options">
              {/* Delivery Zone Estimator - Luxury Card */}
              <div className="zone-estimator-card">
                <div className="zone-card-header">
                  <div className="zone-title-group">
                    <Truck size={14} className="zone-icon" />
                    <span className="zone-title">SHIPPING DESTINATION</span>
                  </div>
                  <span className={`zone-type-badge ${selectedZone.type === 'international' ? 'diaspora' : 'local'}`}>
                    {selectedZone.type === 'international' ? '✈ Diaspora Express' : 'Local Dispatch'}
                  </span>
                </div>

                <div className="zone-select-wrapper">
                  <select
                    value={selectedZone.id}
                    onChange={(e) => setSelectedZone(deliveryZones.find(z => z.id === e.target.value))}
                    className="zone-select-luxury"
                  >
                    {deliveryZones.map(z => (
                      <option key={z.id} value={z.id}>
                        {z.name} (+{convertPrice(z.baseFee)})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="zone-select-chevron" />
                </div>

                <div className="zone-meta-row">
                  <span className="zone-eta-text">⏱ {selectedZone.eta}</span>
                  <span className="zone-currency-note">Settlement in NGN</span>
                </div>
              </div>

              {/* Gifting Box - Luxury Card */}
              <div className={`gifting-card-box ${isGifting ? 'active' : ''}`}>
                <div
                  className="gifting-header-row"
                  onClick={() => setIsGifting(!isGifting)}
                >
                  <div className="gifting-title-group">
                    <div className={`gift-checkbox ${isGifting ? 'checked' : ''}`}>
                      {isGifting ? '✓' : ''}
                    </div>
                    <Gift size={16} className="gift-icon" />
                    <div>
                      <span className="gifting-title">THIS ORDER IS A GIFT</span>
                      <p className="gifting-subtitle">Ribbon wrapping & gift note included</p>
                    </div>
                  </div>
                </div>

                {isGifting && (
                  <div className="gifting-body anim-slide-up" onClick={(e) => e.stopPropagation()}>
                    <label className="gift-note-label">
                      <Sparkles size={11} style={{ color: 'var(--gold)' }} />
                      PERSONALIZED GIFT MESSAGE
                    </label>
                    <textarea
                      className="gift-textarea-luxury"
                      placeholder="Write your note here (e.g. 'Happy Birthday Mom! Enjoy authentic Nigerian harvests...')"
                      value={giftingNote}
                      onChange={(e) => setGiftingNote(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Calculations Breakdown */}
              <div className="cart-summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="serif">{convertPrice(cartSubtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee ({selectedZone.name})</span>
                  <span className="serif">+{convertPrice(deliveryFee)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span className="cart-total-price serif">{convertPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer: Just the checkout action, always visible */}
        {cartItems.length > 0 && (
          <div className="cart-sticky-footer">
            <button
              className="btn-primary w-full"
              style={{ justifyContent: 'center', width: '100%' }}
              onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
            >
              PROCEED TO CHECKOUT <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .cart-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(450px, 100vw); background: #FFFFFF;
          border-left: 1px solid var(--border); z-index: 301;
          display: flex; flex-direction: column; box-shadow: var(--shadow-modal); color: var(--charcoal-text);
        }
        .cart-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; border-bottom: 1px solid var(--border); flex-shrink: 0; background: var(--cream-bg);
        }
        .cart-count-badge {
          width: 20px; height: 20px; background: var(--gold); color: #FFFFFF;
          border-radius: 50%; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center;
        }
        .cart-close-btn {
          width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
          border-radius: 50%; color: var(--text-muted); background: none; border: none; cursor: pointer; transition: var(--transition);
        }
        .cart-close-btn:hover { background: rgba(0,0,0,0.05); color: var(--charcoal-text); }

        .cart-scroll-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .cart-notices { padding: 12px 24px; border-bottom: 1px solid var(--border); background: var(--cream-bg); }
        .threshold-bar-box { margin-bottom: 8px; }
        .progress-track { height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--gold); transition: width 0.4s ease; }
        .threshold-achieved { font-size: 11px; color: var(--gold); font-weight: 700; margin-bottom: 6px; }
        .perishable-alert { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); }

        .cart-items { padding: 16px 24px; }
        .cart-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 40px 20px; }
        
        .cart-item { display: flex; gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--border); position: relative; }
        .cart-item-img { width: 72px; height: 72px; border-radius: 6px; overflow: hidden; flex-shrink: 0; background: var(--card-bg); }
        .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .cart-item-info { flex: 1; }
        .cart-item-name { font-size: 13px; font-weight: 600; color: var(--charcoal-text); margin-bottom: 2px; }
        .cart-item-variant { font-size: 11px; color: var(--text-muted); margin-bottom: 8px; }
        .cart-item-footer { display: flex; align-items: center; justify-content: space-between; }
        
        .qty-control {
          display: flex; align-items: center; gap: 8px; background: var(--cream-bg);
          border: 1px solid var(--border); border-radius: 4px; padding: 2px 8px;
        }
        .qty-control button { color: var(--charcoal-text); background: none; border: none; cursor: pointer; transition: var(--transition); display: flex; }
        .qty-control button:hover { color: var(--gold); }
        .qty-control button:disabled { opacity: 0.3; cursor: not-allowed; }
        .qty-control span { font-size: 12px; font-weight: 600; color: var(--charcoal-text); min-width: 16px; text-align: center; }
        .cart-item-price { font-size: 15px; font-weight: 600; color: var(--gold); }
        
        .cart-item-remove { position: absolute; top: 16px; right: 0; color: var(--text-muted); background: none; border: none; cursor: pointer; transition: var(--transition); }
        .cart-item-remove:hover { color: #ef4444; }

        .cart-summary-options {
          padding: 18px 24px 24px;
          border-top: 1px solid var(--border);
          background: var(--cream-bg);
        }

        .cart-sticky-footer {
          padding: 16px 24px 24px;
          border-top: 1px solid var(--border);
          background: #FFFFFF;
          flex-shrink: 0;
        }

        /* ─── LUXURY SHIPPING DESTINATION CARD ─── */
        .zone-estimator-card {
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          margin-bottom: 14px;
          box-shadow: 0 2px 10px rgba(38, 29, 21, 0.03);
          transition: var(--transition);
        }
        .zone-estimator-card:hover {
          border-color: var(--border-active);
        }
        .zone-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .zone-title-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .zone-icon {
          color: var(--gold);
        }
        .zone-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--charcoal-text);
          text-transform: uppercase;
        }
        .zone-type-badge {
          font-size: 9px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .zone-type-badge.diaspora {
          background: rgba(214, 90, 49, 0.1);
          color: var(--gold);
        }
        .zone-type-badge.local {
          background: rgba(46, 125, 50, 0.1);
          color: var(--green-fresh);
        }
        .zone-select-wrapper {
          position: relative;
          width: 100%;
        }
        .zone-select-luxury {
          width: 100%;
          appearance: none;
          background: var(--cream-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 9px 30px 9px 12px;
          font-size: 12px;
          font-weight: 500;
          color: var(--charcoal-text);
          cursor: pointer;
          outline: none;
          transition: var(--transition);
        }
        .zone-select-luxury:focus {
          border-color: var(--gold);
          background: #FFFFFF;
        }
        .zone-select-chevron {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .zone-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 10px;
          color: var(--text-muted);
        }

        /* ─── LUXURY GIFTING CARD ─── */
        .gifting-card-box {
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          margin-bottom: 16px;
          transition: var(--transition);
          cursor: pointer;
        }
        .gifting-card-box.active {
          border-color: var(--gold);
          background: rgba(254, 250, 246, 0.95);
          box-shadow: 0 4px 16px rgba(214, 90, 49, 0.08);
        }
        .gifting-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          user-select: none;
        }
        .gifting-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gift-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: #FFFFFF;
          background: #FFFFFF;
          transition: var(--transition);
        }
        .gift-checkbox.checked {
          background: var(--gold);
          border-color: var(--gold);
        }
        .gift-icon {
          color: var(--gold);
        }
        .gifting-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--charcoal-text);
          text-transform: uppercase;
          display: block;
        }
        .gifting-subtitle {
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 1px;
        }
        .gifting-body {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed var(--border);
        }
        .gift-note-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .gift-textarea-luxury {
          width: 100%;
          height: 64px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--charcoal-text);
          padding: 10px;
          font-size: 11px;
          line-height: 1.4;
          outline: none;
          resize: none;
          transition: var(--transition);
        }
        .gift-textarea-luxury:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(214, 90, 49, 0.1);
        }

        .cart-summary-breakdown { display: flex; flex-direction: column; gap: 6px; border-top: 1px solid var(--border); padding-top: 12px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }
        .summary-row.discount { color: var(--gold); }
        .summary-row.total { font-size: 15px; color: var(--charcoal-text); font-weight: 700; border-top: 1px solid var(--border); padding-top: 8px; margin-top: 4px; }
        .cart-total-price { font-size: 20px; color: var(--gold); }
      `}</style>
    </>
  );
}
