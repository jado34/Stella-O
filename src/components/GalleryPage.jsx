import React from 'react';
import { ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { products } from '../data/products';

const LOOKBOOK_ENTRIES = [
  {
    id: 1,
    title: 'The Sunday Ofada Feast',
    subtitle: 'Unpolished Ofada short-grain rice served on wild leaves with fried plantains and hardwood-smoked catfish.',
    image: 'https://images.unsplash.com/photo-1543323717-89c8218ebbdb?w=1000&q=85',
    featuredProductId: 4,
  },
  {
    id: 2,
    title: 'Traditional Egusi & Pounded Yam',
    subtitle: 'Silky smooth pounded yam swallow paired with triple-sieved Benue egusi and grass-fed goat meat cuts.',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=1000&q=85',
    featuredProductId: 2,
  },
  {
    id: 3,
    title: 'Northern Suya & Yaji Spice Night',
    subtitle: 'Flame-grilled skewers dusted in freshly ground Kano kuli-kuli yaji rub, onions, and sweet chili flakes.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1000&q=85',
    featuredProductId: 8,
  },
  {
    id: 4,
    title: 'The Royal Heritage Hampers',
    subtitle: 'Hand-woven mahogany hampers filled with cold-pressed red palm oil, Ijebu Garri, and dried seafood.',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1000&q=85',
    featuredProductId: 13,
  },
];

export default function GalleryPage() {
  const { setSelectedProduct, convertPrice, setActiveView } = useShop();

  const handleOpenProduct = (productId) => {
    const matched = products.find(p => p.id === productId) || products[0];
    setSelectedProduct(matched);
  };

  return (
    <div className="gallery-page section">
      <div className="container">
        {/* Header */}
        <div className="gallery-header text-center">
          <p className="gallery-eyebrow">EDITORIAL LOOKBOOK</p>
          <div className="divider divider-center" />
          <h1 className="gallery-title serif">
            Visual Harvest & Culinary Inspirations
          </h1>
          <p className="gallery-intro">
            An interactive visual journey celebrating authentic West African culinary traditions, styled for modern households.
          </p>
        </div>

        {/* Lookbook Cards Grid */}
        <div className="lookbook-grid">
          {LOOKBOOK_ENTRIES.map((entry) => {
            const product = products.find(p => p.id === entry.featuredProductId);
            return (
              <div key={entry.id} className="lookbook-card">
                <div className="lookbook-img-wrap">
                  <img src={entry.image} alt={entry.title} loading="lazy" />
                  <div className="lookbook-overlay">
                    <button className="btn-primary" onClick={() => handleOpenProduct(entry.featuredProductId)}>
                      <Eye size={14} /> VIEW INGREDIENTS
                    </button>
                  </div>
                </div>
                <div className="lookbook-body">
                  <h3 className="lookbook-card-title serif">{entry.title}</h3>
                  <p className="lookbook-card-sub">{entry.subtitle}</p>

                  {product && (
                    <div className="lookbook-product-preview" onClick={() => handleOpenProduct(product.id)}>
                      <img src={product.image} alt={product.name} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em' }}>FEATURED IN THIS DISH</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal-text)' }}>{product.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--gold)' }} className="serif">{convertPrice(product.variants[0].price)}</p>
                      </div>
                      <ArrowRight size={14} style={{ color: 'var(--gold)' }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center" style={{ marginTop: 60 }}>
          <button className="btn-outline" onClick={() => setActiveView('shop')}>
            <ShoppingBag size={14} /> BROWSE ALL PRODUCTS
          </button>
        </div>
      </div>

      <style>{`
        .gallery-page { background: var(--cream-bg); color: var(--charcoal-text); }
        .gallery-eyebrow { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; font-weight: 700; }
        .gallery-title { font-size: clamp(34px, 4.5vw, 56px); font-weight: 400; color: var(--charcoal-text); line-height: 1.15; margin-bottom: 16px; }
        .gallery-intro { font-size: 15px; color: var(--text-muted); line-height: 1.7; max-width: 580px; margin: 0 auto 50px; }

        .lookbook-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px; }
        .lookbook-card { border-radius: 8px; overflow: hidden; border: 1px solid var(--border); background: #FFFFFF; transition: var(--transition); box-shadow: var(--shadow-card); }
        .lookbook-card:hover { transform: translateY(-4px); border-color: var(--gold); }
        
        .lookbook-img-wrap { position: relative; height: 320px; overflow: hidden; background: var(--card-bg); }
        .lookbook-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .lookbook-card:hover .lookbook-img-wrap img { transform: scale(1.05); }

        .lookbook-overlay { position: absolute; inset: 0; background: rgba(15,23,42,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; }
        .lookbook-card:hover .lookbook-overlay { opacity: 1; }

        .lookbook-body { padding: 22px; }
        .lookbook-card-title { font-size: 24px; color: var(--charcoal-text); margin-bottom: 6px; }
        .lookbook-card-sub { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 18px; }

        .lookbook-product-preview { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 1px solid var(--border); border-radius: 6px; background: var(--cream-bg); cursor: pointer; transition: var(--transition); }
        .lookbook-product-preview:hover { border-color: var(--gold); }
        .lookbook-product-preview img { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; }
      `}</style>
    </div>
  );
}
