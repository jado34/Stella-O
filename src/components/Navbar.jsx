import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Globe, X, ChevronDown, Menu } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import WhatsAppIcon from './WhatsAppIcon';
import { categories } from '../data/products';

const CURRENCIES = ['NGN', 'USD', 'GBP', 'EUR'];

export default function Navbar() {
  const {
    cartCount, setIsCartOpen, setIsAccountOpen,
    currency, setCurrency, setActiveCategory,
    activeCategory, searchQuery, setSearchQuery,
    activeView, setActiveView,
  } = useShop();

  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const onScroll = () => {
      const scrollY = window.pageYOffset;
      setScrolled(scrollY > 30);
      
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (scrollY > 120 && direction === 'down') {
        document.body.classList.add('navbar-hidden');
      } else if (direction === 'up' || scrollY <= 120) {
        document.body.classList.remove('navbar-hidden');
      }
      lastScrollY = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.classList.remove('navbar-hidden');
    };
  }, []);

  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    setActiveView('shop');
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleViewSelect = (viewName) => {
    setActiveView(viewName);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container nav-inner">
          {/* Left: View Links matching zttw benchmark layout */}
          <div className="nav-left">
            <button
              className={`nav-link ${activeView === 'shop' ? 'active' : ''}`}
              onClick={() => handleViewSelect('shop')}
            >
              SHOP
            </button>
            <button
              className={`nav-link ${activeView === 'story' ? 'active' : ''}`}
              onClick={() => handleViewSelect('story')}
            >
              OUR STORY
            </button>
            <button
              className={`nav-link ${activeView === 'faq' ? 'active' : ''}`}
              onClick={() => handleViewSelect('faq')}
            >
              FAQ
            </button>
          </div>

          {/* Center: Brand Logomark */}
          <button className="nav-logo" onClick={() => handleViewSelect('home')}>
            <span className="nav-logo-title serif">STELLA O</span>
            <span className="nav-logo-sub">AFRO SHOP</span>
          </button>

          {/* Right: Actions */}
          <div className="nav-right">
            {/* Currency */}
            <div className="nav-currency-wrap">
              <button className="nav-icon-btn nav-currency-btn" onClick={() => setShowCurrency(p => !p)}>
                <Globe size={14} /> <span>{currency}</span> <ChevronDown size={10} />
              </button>
              {showCurrency && (
                <div className="nav-dropdown anim-scale-in">
                  {CURRENCIES.map(c => (
                    <button
                      key={c}
                      className={`nav-dropdown-item ${currency === c ? 'active' : ''}`}
                      onClick={() => { setCurrency(c); setShowCurrency(false); }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            {showSearch ? (
              <div className="nav-search-box anim-slide-right">
                <Search size={14} style={{ color: 'var(--gold)' }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    if (activeView !== 'shop') setActiveView('shop');
                  }}
                  placeholder="Search food items..."
                  onBlur={() => { if (!searchQuery) setShowSearch(false); }}
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setShowSearch(false); }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ) : (
              <button className="nav-icon-btn" onClick={() => setShowSearch(true)} title="Search">
                <Search size={16} />
              </button>
            )}

            {/* Account */}
            <button className="nav-icon-btn" onClick={() => setIsAccountOpen(true)} title="Account">
              <User size={16} />
            </button>

            {/* Cart Trigger */}
            <button className="nav-cart-btn" onClick={() => setIsCartOpen(true)} title="Bag">
              <ShoppingBag size={16} />
              <span className="cart-text">BAG ({cartCount})</span>
            </button>

            {/* Mobile Toggle */}
            <button className="nav-mobile-toggle" onClick={() => setMobileOpen(p => !p)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Floating Bottom-Right WhatsApp Concierge Widget (matching zttw screenshot) */}
      <a
        href="https://wa.me/234800746759"
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp-widget"
        title="Chat With Us"
      >
        <span className="whatsapp-widget-text">Chat With Us</span>
        <div className="whatsapp-icon-circle">
          <WhatsAppIcon size={18} color="#25D366" fill="#FFFFFF" />
          <span className="whatsapp-online-dot" />
        </div>
      </a>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <>
          <div className="overlay" onClick={() => setMobileOpen(false)} style={{ zIndex: 290 }} />
          <div className="mobile-menu anim-slide-right">
            <div className="mobile-menu-header">
              <div>
                <span className="nav-logo-title serif" style={{ fontSize: 24, color: 'var(--charcoal-text)' }}>STELLA O</span>
                <span className="nav-logo-sub">AFRO SHOP</span>
              </div>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>

            <div className="mobile-search">
              <Search size={14} style={{ color: 'var(--gold)' }} />
              <input
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'shop') setActiveView('shop');
                }}
                placeholder="Search food..."
              />
            </div>

            <div className="mobile-views-list">
              <button className={`mobile-view-link ${activeView === 'home' ? 'active' : ''}`} onClick={() => handleViewSelect('home')}>HOME</button>
              <button className={`mobile-view-link ${activeView === 'shop' ? 'active' : ''}`} onClick={() => handleViewSelect('shop')}>SHOP PRODUCTS</button>
              <button className={`mobile-view-link ${activeView === 'story' ? 'active' : ''}`} onClick={() => handleViewSelect('story')}>OUR STORY</button>
              <button className={`mobile-view-link ${activeView === 'faq' ? 'active' : ''}`} onClick={() => handleViewSelect('faq')}>FAQ</button>
              <button className={`mobile-view-link ${activeView === 'contact' ? 'active' : ''}`} onClick={() => handleViewSelect('contact')}>CONTACT</button>
            </div>

            <div className="mobile-cats">
              <p className="mobile-section-title">CATEGORIES</p>
              {categories.map(c => (
                <button
                  key={c.id}
                  className={`mobile-cat-link ${activeCategory === c.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mobile-currency-section">
              <p className="mobile-section-title">CURRENCY</p>
              <div className="mobile-currency">
                {CURRENCIES.map(c => (
                  <button
                    key={c}
                    className={`currency-chip ${currency === c ? 'active' : ''}`}
                    onClick={() => { setCurrency(c); setMobileOpen(false); }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .navbar {
          position: sticky; top: 0; left: 0; right: 0; z-index: 200;
          background: #FFFFFF;
          border-bottom: 1px solid var(--border);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background-color 0.3s ease;
        }
        body.navbar-hidden .navbar {
          transform: translateY(-100%);
        }
        .navbar-scrolled {
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          background: #FFFFFF;
        }
        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 72px;
        }

        .nav-left { display: flex; gap: 24px; align-items: center; }
        @media (max-width: 960px) { .nav-left { display: none; } }
        
        .nav-link {
          background: none; border: none; cursor: pointer;
          font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
          color: var(--charcoal-text); transition: var(--transition);
        }
        .nav-link:hover, .nav-link.active { color: var(--gold); }

        .nav-logo {
          background: none; border: none; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; line-height: 1;
        }
        .nav-logo-title {
          font-size: 26px; font-weight: 400; color: var(--charcoal-text); letter-spacing: 0.12em;
        }
        .nav-logo-sub {
          font-size: 8px; letter-spacing: 0.35em; color: var(--gold); font-weight: 700; margin-top: 2px;
        }

        .nav-right { display: flex; align-items: center; gap: 14px; }

        .nav-icon-btn {
          background: none; border: none; cursor: pointer;
          color: var(--charcoal-text); transition: var(--transition);
          display: flex; align-items: center; justify-content: center;
          padding: 6px; border-radius: 4px;
        }
        .nav-icon-btn:hover { color: var(--gold); }

        .nav-currency-wrap { position: relative; }
        .nav-currency-btn {
          display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
        }
        .nav-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: #FFFFFF; border: 1px solid var(--border);
          border-radius: 4px; overflow: hidden; box-shadow: var(--shadow-modal);
          min-width: 100px; z-index: 300;
        }
        .nav-dropdown-item {
          display: block; width: 100%; padding: 8px 14px; text-align: left;
          background: none; border: none; cursor: pointer;
          font-size: 11px; font-weight: 600; color: var(--charcoal-text); transition: var(--transition);
        }
        .nav-dropdown-item:hover, .nav-dropdown-item.active { background: rgba(171,140,82,0.15); color: var(--gold); }

        .nav-cart-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          color: var(--charcoal-text); transition: var(--transition);
        }
        .nav-cart-btn:hover { color: var(--gold); }
        .cart-text { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; }

        .nav-portal-btn {
          background: none; border: 1px solid var(--border); border-radius: 4px;
          padding: 5px 8px; color: var(--charcoal-text); cursor: pointer; transition: var(--transition);
        }
        .nav-portal-btn:hover, .nav-portal-btn.active { color: var(--gold); border-color: var(--gold); }

        .nav-search-box {
          display: flex; align-items: center; gap: 6px;
          background: var(--cream-bg); border: 1px solid var(--border);
          border-radius: 4px; padding: 4px 10px;
        }
        .nav-search-box input {
          background: none; border: none; outline: none; color: var(--charcoal-text); font-size: 12px; width: 150px;
        }

        .nav-mobile-toggle {
          display: none; background: none; border: none; cursor: pointer; color: var(--charcoal-text);
        }
        @media (max-width: 960px) { .nav-mobile-toggle { display: flex; } }

        /* Floating WhatsApp Concierge Widget matching zttw screenshot */
        .floating-whatsapp-widget {
          position: fixed; bottom: 24px; right: 24px; z-index: 250;
          display: flex; align-items: center; gap: 10px;
          background: #FFFFFF; border: 1px solid var(--border);
          border-radius: 30px; padding: 6px 6px 6px 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          transition: var(--transition); text-decoration: none;
        }
        .floating-whatsapp-widget:hover {
          transform: translateY(-2px); box-shadow: 0 14px 35px rgba(0,0,0,0.18); border-color: var(--gold);
        }
        .whatsapp-widget-text {
          font-size: 12px; font-weight: 600; color: var(--charcoal-text); white-space: nowrap;
        }
        .whatsapp-icon-circle {
          width: 36px; height: 36px; border-radius: 50%; background: #25D366;
          display: flex; align-items: center; justify-content: center; position: relative;
        }
        .whatsapp-online-dot {
          position: absolute; top: 0; right: 0; width: 10px; height: 10px;
          background: #EF4444; border: 2px solid #FFFFFF; border-radius: 50%;
        }

        .mobile-menu {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(320px, 100vw); background: #FFFFFF;
          border-left: 1px solid var(--border); z-index: 300;
          display: flex; flex-direction: column; padding: 24px;
          overflow-y: auto; gap: 20px; color: var(--charcoal-text);
        }
        .mobile-menu-header { display: flex; justify-content: space-between; align-items: center; }
        .mobile-menu-header button { background: none; border: none; color: var(--text-muted); cursor: pointer; }

        .mobile-search {
          display: flex; align-items: center; gap: 8px;
          background: var(--cream-bg); border: 1px solid var(--border);
          border-radius: 4px; padding: 10px 14px;
        }
        .mobile-search input { background: none; border: none; outline: none; color: var(--charcoal-text); font-size: 13px; flex: 1; }

        .mobile-section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--gold); margin-bottom: 8px; }
        .mobile-views-list { display: flex; flex-direction: column; gap: 4px; }
        .mobile-view-link {
          background: none; border: none; text-align: left; cursor: pointer;
          padding: 8px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; color: var(--charcoal-text);
          border-bottom: 1px solid var(--border); transition: var(--transition);
        }
        .mobile-view-link:hover, .mobile-view-link.active { color: var(--gold); }

        .mobile-cats { display: flex; flex-direction: column; gap: 2px; }
        .mobile-cat-link {
          background: none; border: none; text-align: left; cursor: pointer;
          padding: 6px 0; font-size: 12px; color: var(--text-muted); transition: var(--transition);
        }
        .mobile-cat-link:hover, .mobile-cat-link.active { color: var(--gold); }

        .mobile-currency { display: flex; gap: 8px; flex-wrap: wrap; }
        .currency-chip {
          background: none; padding: 6px 14px; border: 1px solid var(--border);
          border-radius: 20px; font-size: 11px; font-weight: 600;
          color: var(--text-muted); cursor: pointer; transition: var(--transition);
        }
        .currency-chip.active { border-color: var(--gold); color: var(--gold); background: rgba(171,140,82,0.15); }
      `}</style>
    </>
  );
}
