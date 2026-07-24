import React, { useState, useEffect } from 'react';
import { X, User, Package, RotateCcw, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function AccountDrawer() {
  const {
    isAccountOpen, setIsAccountOpen, convertPrice, addToCart,
    ordersList, showToast, productsList, currentUser, setCurrentUser, users, setUsers
  } = useShop();

  const [tab, setTab] = useState('orders'); // 'orders', 'profile'
  const [substitutionPref, setSubstitutionPref] = useState('contact');

  // Auth flow states
  const [authStep, setAuthStep] = useState('signin'); // 'signin', 'entercode', 'createaccount'
  const [emailInput, setEmailInput] = useState('');
  const [emailConsent, setEmailConsent] = useState(true);
  const [sentCode, setSentCode] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);

  // New user details
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');

  // Handle auto-focus and input shifts in digit boxes
  const handleDigitChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return; // digit only
    const newDigits = [...codeDigits];
    newDigits[idx] = val.slice(-1);
    setCodeDigits(newDigits);

    // Shift focus to next
    if (val && idx < 5) {
      document.getElementById(`digit-${idx + 1}`)?.focus();
    }
  };

  const handleDigitKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (!codeDigits[idx] && idx > 0) {
        const newDigits = [...codeDigits];
        newDigits[idx - 1] = '';
        setCodeDigits(newDigits);
        document.getElementById(`digit-${idx - 1}`)?.focus();
      }
    }
  };

  // Check code digits completion
  useEffect(() => {
    const codeStr = codeDigits.join('');
    if (codeStr.length === 6) {
      if (codeStr === sentCode) {
        const existing = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
        if (existing) {
          setCurrentUser(existing);
          showToast(`Welcome back, ${existing.name}!`);
          setIsAccountOpen(false); // Auto close on login success
        } else {
          // Go to registration
          setAuthStep('createaccount');
          showToast("Email verified. Please complete your profile details!");
        }
      } else {
        showToast("Invalid verification code. Please try again.");
        setCodeDigits(['', '', '', '', '', '']);
        document.getElementById('digit-0')?.focus();
      }
    }
  }, [codeDigits, sentCode, users, emailInput, setCurrentUser, showToast, setIsAccountOpen]);

  // Demo Login with Shop button
  const handleContinueWithShop = () => {
    const demoCode = '123456';
    setEmailInput('a.ogunlesi@example.ng');
    setSentCode(demoCode);
    setAuthStep('entercode');
    setCodeDigits(['', '', '', '', '', '']);
    showToast(`Shop Demo: Enter verification code: ${demoCode}`);
    setTimeout(() => {
      document.getElementById('digit-0')?.focus();
    }, 100);
  };

  // Submit email for authentication
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(mockCode);
    setAuthStep('entercode');
    setCodeDigits(['', '', '', '', '', '']);
    showToast(`Verification code sent! Code: ${mockCode}`);
    setTimeout(() => {
      document.getElementById('digit-0')?.focus();
    }, 100);
  };

  // Resend authentication code
  const handleResendCode = () => {
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(mockCode);
    setCodeDigits(['', '', '', '', '', '']);
    showToast(`New verification code sent! Code: ${mockCode}`);
    document.getElementById('digit-0')?.focus();
  };

  // Submit register details
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regAddress.trim()) {
      showToast("Please fill in all profile fields.");
      return;
    }

    const newUser = {
      email: emailInput,
      name: regName,
      phone: regPhone,
      address: regAddress
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Welcome to Stella O, ${regName}!`);
    setIsAccountOpen(false); // Close account drawer
  };

  // Logout current user
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthStep('signin');
    setEmailInput('');
    setRegName('');
    setRegPhone('');
    setRegAddress('');
    showToast("Logged out successfully.");
  };

  if (!isAccountOpen) return null;

  // Filter orders by current user
  const userOrders = currentUser 
    ? ordersList.filter(o => o.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  const handleReorderOrder = (order) => {
    order.items.forEach(item => addToCart(item.product, item.variant, item.quantity));
    setIsAccountOpen(false);
    showToast(`Items from Order ${order.id} added to bag!`);
  };

  return (
    <>
      <div className="overlay" onClick={() => setIsAccountOpen(false)} style={{ zIndex: 300 }} />
      <div className="account-drawer anim-slide-right" style={{ zIndex: 301 }}>
        
        {/* CLOSE BUTTON (Accessible in all steps) */}
        <button 
          className="cart-close-btn" 
          onClick={() => setIsAccountOpen(false)} 
          aria-label="Close" 
          style={{ position: 'absolute', top: 20, right: 20, zIndex: 350 }}
        >
          <X size={18} />
        </button>

        {/* LOGGED OUT VIEW (AUTH FLOW) */}
        {!currentUser ? (
          <div className="auth-drawer-content">
            
            {/* Centered Brand Logo */}
            <div className="auth-brand-logo text-center">
              <span className="serif" style={{ fontSize: 24, letterSpacing: '0.12em', color: 'var(--charcoal-text)', fontWeight: 600 }}>STELLA O</span>
              <span style={{ display: 'block', fontSize: 8, letterSpacing: '0.35em', color: 'var(--gold)', fontWeight: 700, marginTop: 3 }}>AFRO SHOP</span>
            </div>

            {/* STEP 1: SIGN IN / INPUT EMAIL */}
            {authStep === 'signin' && (
              <div className="auth-container anim-slide-up">
                <div className="auth-header text-center">
                  <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, color: 'var(--charcoal-text)', marginBottom: 6 }}>Sign in</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sign in or create an account</p>
                </div>

                <button className="btn-shop-purple" onClick={handleContinueWithShop}>
                  Continue with Shop
                </button>

                <div className="auth-divider">
                  <span className="auth-divider-line"></span>
                  <span className="auth-divider-text">or</span>
                  <span className="auth-divider-line"></span>
                </div>

                <form onSubmit={handleEmailSubmit} className="auth-form">
                  <div className="auth-input-wrapper">
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      className="auth-input-field"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <button type="submit" className="auth-arrow-btn" aria-label="Send verification code">
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <label className="auth-consent-label">
                    <input
                      type="checkbox"
                      checked={emailConsent}
                      onChange={(e) => setEmailConsent(e.target.checked)}
                      className="auth-checkbox"
                    />
                    <span>Email me with news and offers</span>
                  </label>
                </form>

                <p className="auth-terms text-center">
                  By continuing, you agree to our <a href="#" onClick={(e) => e.preventDefault()}>Terms of service</a>
                </p>
              </div>
            )}

            {/* STEP 2: ENTER CODE */}
            {authStep === 'entercode' && (
              <div className="auth-container anim-slide-up">
                <div className="auth-header text-center">
                  <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, color: 'var(--charcoal-text)', marginBottom: 6 }}>Enter code</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Sent to {emailInput} <button className="auth-change-btn" onClick={() => setAuthStep('signin')}>Change</button>
                  </p>
                </div>

                <div className="code-digits-container">
                  {codeDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`digit-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(e.target.value, idx)}
                      onKeyDown={(e) => handleDigitKeyDown(e, idx)}
                      className="digit-input"
                      pattern="\d*"
                      inputMode="numeric"
                      autoComplete="off"
                    />
                  ))}
                </div>

                <div className="text-center" style={{ marginTop: 20 }}>
                  <button className="auth-resend-btn" onClick={handleResendCode}>
                    Resend code
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CREATE ACCOUNT FORM */}
            {authStep === 'createaccount' && (
              <div className="auth-container anim-slide-up" style={{ paddingBottom: 24 }}>
                <div className="auth-header text-center">
                  <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, color: 'var(--charcoal-text)', marginBottom: 6 }}>Create Account</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Set up your details to complete registration for <strong>{emailInput}</strong></p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="auth-register-form">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>FULL NAME</label>
                      <input
                        required
                        className="input-field"
                        placeholder="e.g. Adebayo Ogunlesi"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        style={{ height: 42 }}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>PHONE NUMBER</label>
                      <input
                        required
                        className="input-field"
                        placeholder="e.g. +234 803 123 4567"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        style={{ height: 42 }}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>DELIVERY ADDRESS</label>
                      <textarea
                        required
                        className="input-field"
                        rows={3}
                        placeholder="e.g. Plot 14 Admiralty Way, Lekki Phase 1, Lagos"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        style={{ resize: 'none', padding: '10px 14px' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full" style={{ marginTop: 24, padding: '14px', justifyContent: 'center' }}>
                    COMPLETE REGISTRATION
                  </button>
                </form>
              </div>
            )}

            {/* Bottom Privacy Policy */}
            <div className="auth-footer text-center">
              <a href="#" className="auth-footer-link" onClick={(e) => e.preventDefault()}>Privacy policy</a>
            </div>

          </div>
        ) : (
          /* LOGGED IN ACCOUNT DASHBOARD */
          <>
            {/* Header */}
            <div className="cart-header" style={{ paddingRight: 45 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="account-avatar serif">{currentUser.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal-text)' }}>{currentUser.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentUser.email}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="account-tabs">
              {[
                { id: 'orders', label: 'ORDERS HISTORY', icon: Package },
                { id: 'profile', label: 'PROFILE & PREFERENCES', icon: User },
              ].map(t => (
                <button
                  key={t.id}
                  className={`account-tab ${tab === t.id ? 'active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <t.icon size={13} /> {t.label}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 24px' }}>
              {/* Orders History Tab */}
              {tab === 'orders' && (
                <div>
                  {/* Quick Restock Staples Section */}
                  <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 4, padding: 14, marginBottom: 20 }}>
                    <p style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                      RESTOCK CORE PANTRY BASKET
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                      Frequently bought together. Tap to add Stella's core staples instantly:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { id: 1, name: 'Ijebu Garri (White)', sku: 'FLR-GARW-1KG', label: '1kg' },
                        { id: 8, name: 'Pure Virgin Palm Oil', sku: 'OIL-PLM-1L', label: '1L' },
                        { id: 7, name: 'Honey Beans (Oloyin)', sku: 'BEN-OLO-1KG', label: '1kg' },
                        { id: 13, name: 'Norwegian Stockfish', sku: 'FSH-STK-3PC', label: '3 Cuts' },
                      ].map(staple => {
                        const fullProd = productsList.find(p => p.id === staple.id);
                        const variant = fullProd?.variants.find(v => v.sku === staple.sku);
                        return (
                          <div key={staple.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, paddingBottom: 6, borderBottom: '1px solid #FAF5EE' }}>
                            <div>
                              <strong style={{ color: 'var(--charcoal-text)' }}>{staple.name}</strong>
                              <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>({staple.label})</span>
                            </div>
                            <button
                              className="btn-primary"
                              style={{ padding: '4px 10px', fontSize: 10, letterSpacing: '0.05em' }}
                              onClick={() => {
                                if (fullProd && variant) addToCart(fullProd, variant, 1);
                              }}
                            >
                              + ADD
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <h4 className="serif" style={{ fontSize: 18, color: 'var(--charcoal-text)', marginBottom: 12 }}>Past Orders</h4>
                  {userOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 0', border: '1px dashed var(--border)', borderRadius: 4, background: '#FFFFFF' }}>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    userOrders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-card-header">
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal-text)' }}>{order.id}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.placedAt}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className="order-status-tag">{order.status}</span>
                            <p className="serif" style={{ fontSize: 15, color: 'var(--gold)', fontWeight: 600, marginTop: 2 }}>
                              {convertPrice(order.total)}
                            </p>
                          </div>
                        </div>
                        <div className="order-items-preview">
                          {order.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                              <img src={item.product.image} alt="" style={{ width: 38, height: 38, borderRadius: 4, objectFit: 'cover' }} />
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 12, color: 'var(--charcoal-text)', fontWeight: 500 }}>{item.product.name}</p>
                                <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.variant.label} × {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="btn-outline w-full" style={{ marginTop: 10, fontSize: 10, padding: '7px' }} onClick={() => handleReorderOrder(order)}>
                          <RotateCcw size={12} /> 1-TAP REORDER ALL ITEMS
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Profile & Substitution Preferences */}
              {tab === 'profile' && (
                <div className="anim-slide-up">
                  <div style={{ borderRadius: 6, padding: 16, marginBottom: 16, border: '1px solid var(--border)', background: 'var(--cream-bg)' }}>
                    <p style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.1em' }}>Saved Customer Details</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                      <div><span style={{ color: 'var(--text-muted)' }}>Name:</span> <strong style={{ color: 'var(--charcoal-text)' }}>{currentUser.name}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> <strong style={{ color: 'var(--charcoal-text)' }}>{currentUser.email}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Phone:</span> <strong style={{ color: 'var(--charcoal-text)' }}>{currentUser.phone}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Primary Address:</span> <strong style={{ color: 'var(--charcoal-text)' }}>{currentUser.address}</strong></div>
                    </div>
                  </div>

                  <div style={{ borderRadius: 6, padding: 16, border: '1px solid var(--border)', background: 'var(--cream-bg)', marginBottom: 20 }}>
                    <p style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.1em' }}>Out-of-Stock Substitution Preference</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, color: 'var(--charcoal-text)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input type="radio" name="subPref" checked={substitutionPref === 'contact'} onChange={() => setSubstitutionPref('contact')} style={{ accentColor: 'var(--gold)' }} />
                        Call / WhatsApp me before substituting
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input type="radio" name="subPref" checked={substitutionPref === 'similar'} onChange={() => setSubstitutionPref('similar')} style={{ accentColor: 'var(--gold)' }} />
                        Automatically substitute with closest premium brand
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input type="radio" name="subPref" checked={substitutionPref === 'refund'} onChange={() => setSubstitutionPref('refund')} style={{ accentColor: 'var(--gold)' }} />
                        Refund unavailable item instantly
                      </label>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <button 
                    className="btn-outline w-full" 
                    onClick={handleLogout} 
                    style={{ 
                      borderColor: 'var(--red-alert)', 
                      color: 'var(--red-alert)', 
                      fontSize: 11, 
                      padding: '12px', 
                      justifyContent: 'center',
                      background: 'rgba(211, 47, 47, 0.04)'
                    }}
                  >
                    SIGN OUT OF MY ACCOUNT
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        .account-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(440px, 100vw); background: #FFFFFF;
          border-left: 1px solid var(--border); z-index: 301;
          display: flex; flex-direction: column; box-shadow: var(--shadow-modal); color: var(--charcoal-text);
        }
        
        /* ─── AUTH SCREEN STYLES (ZTTW/Shopify layout match) ─── */
        .auth-drawer-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 48px 32px 32px;
          overflow-y: auto;
        }
        .auth-brand-logo {
          margin-bottom: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .auth-container {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .auth-header {
          margin-bottom: 24px;
        }
        .btn-shop-purple {
          background: #5C3FFC;
          color: #FFFFFF;
          border-radius: 28px;
          padding: 14px 24px;
          font-size: 13px;
          font-weight: 600;
          width: 100%;
          text-align: center;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-bottom: 20px;
          display: block;
        }
        .btn-shop-purple:hover {
          background: #4B32D6;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 10px 0 24px;
          width: 100%;
        }
        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: #E5E7EB;
        }
        .auth-divider-text {
          padding: 0 16px;
          color: var(--text-muted);
          font-size: 13px;
        }
        .auth-form {
          width: 100%;
        }
        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          background: #FFFFFF;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 16px;
          width: 100%;
        }
        .auth-input-wrapper:focus-within {
          border-color: #5C3FFC;
          box-shadow: 0 0 0 3px rgba(92, 63, 252, 0.15);
        }
        .auth-input-field {
          width: 100%;
          padding: 14px 44px 14px 14px;
          font-size: 14px;
          border: none;
          outline: none;
          background: transparent;
          color: var(--charcoal-text);
        }
        .auth-arrow-btn {
          position: absolute;
          right: 8px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #5C3FFC;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .auth-arrow-btn:hover {
          background: #4B32D6;
        }
        .auth-consent-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: var(--text-muted);
          cursor: pointer;
          margin-bottom: 24px;
          user-select: none;
        }
        .auth-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #5C3FFC;
          cursor: pointer;
        }
        .auth-terms {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-top: auto;
          padding-top: 24px;
        }
        .auth-terms a {
          color: #5C3FFC;
          text-decoration: underline;
        }
        .auth-footer {
          margin-top: auto;
          padding-top: 40px;
          padding-bottom: 12px;
        }
        .auth-footer-link {
          font-size: 12px;
          color: #5C3FFC;
          text-decoration: underline;
        }
        .auth-change-btn {
          color: #5C3FFC;
          background: none;
          border: none;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          font-size: 13px;
          padding: 0 4px;
        }
        .auth-resend-btn {
          color: #5C3FFC;
          background: none;
          border: none;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          text-decoration: underline;
        }

        /* 6-digit Code Inputs */
        .code-digits-container {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin: 28px 0;
        }
        .digit-input {
          width: 44px;
          height: 54px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 22px;
          font-weight: 600;
          text-align: center;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #FFFFFF;
          color: var(--charcoal-text);
        }
        .digit-input:focus {
          border-color: #5C3FFC;
          box-shadow: 0 0 0 3px rgba(92, 63, 252, 0.15);
        }

        /* ─── LOGGED IN PROFILE DRAWER ─── */
        .account-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #FFFFFF; flex-shrink: 0;
        }
        .account-tabs { display: flex; border-bottom: 1px solid var(--border); padding: 0 16px; flex-shrink: 0; background: var(--cream-bg); }
        .account-tab {
          display: flex; align-items: center; gap: 4px; padding: 12px 10px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--text-muted); background: none; border: none;
          border-bottom: 2px solid transparent; margin-bottom: -1px; cursor: pointer; white-space: nowrap; transition: var(--transition);
        }
        .account-tab:hover { color: var(--charcoal-text); }
        .account-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

        .order-card { border-radius: 6px; padding: 14px; margin-bottom: 12px; border: 1px solid var(--border); background: var(--cream-bg); }
        .order-card-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .order-status-tag { font-size: 9px; font-weight: 700; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; }
        .order-items-preview { border-top: 1px solid var(--border); padding-top: 8px; }
      `}</style>
    </>
  );
}
