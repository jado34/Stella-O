import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, convertPrice, setSelectedProduct } = useShop();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [addedAnim, setAddedAnim] = useState(false);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);

  // Staggered IntersectionObserver entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const variant = product.variants[selectedVariantIdx];
  const isLowStock = variant.stock > 0 && variant.stock <= 20;
  const isSoldOut = variant.stock === 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product, variant);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1400);
  };

  const staggerDelay = `${(index % 4) * 90}ms`;

  return (
    <div
      ref={cardRef}
      className={`product-card ${visible ? 'pc-visible' : ''}`}
      style={{ '--stagger': staggerDelay }}
      onClick={() => setSelectedProduct(product)}
    >
      {/* 3:4 portrait image container — luxury editorial standard */}
      <div className="pc-img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" className="pc-img" />

        {/* Rectangle Badge — top left */}
        {product.badge ? (
          <span className="pc-badge custom-badge">
            {product.badge}
          </span>
        ) : (isSoldOut || isLowStock) ? (
          <span className={`pc-badge ${isSoldOut ? 'sold-out' : 'low-stock'}`}>
            {isSoldOut ? 'Sold Out' : 'Low Stock'}
          </span>
        ) : null}

        {/* Hover overlay: quick view */}
        <div className="pc-hover-overlay">
          <button
            className="pc-quick-view"
            onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
          >
            <Eye size={13} /> QUICK VIEW
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="pc-body">
        <span className="pc-category">{product.category.toUpperCase()}</span>
        <h3 className="pc-name serif">{product.name}</h3>
        <p className="pc-origin">{product.origin}</p>

        {/* Variant Swatches */}
        <div className="pc-variants">
          {product.variants.map((v, i) => (
            <button
              key={v.sku}
              className={`pc-variant-btn ${i === selectedVariantIdx ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(i); }}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Footer: Price + Add */}
        <div className="pc-footer">
          <div className="pc-price">
            <span className="pc-price-main serif">{convertPrice(variant.price)}</span>
            <span className="pc-price-sub">/ {variant.label}</span>
          </div>

          <button
            className={`pc-add-btn ${addedAnim ? 'added' : ''} ${isSoldOut ? 'disabled' : ''}`}
            onClick={handleAdd}
            disabled={isSoldOut}
          >
            {isSoldOut ? (
              <span>Sold Out</span>
            ) : addedAnim ? (
              <span className="pc-added-text">✓ Added</span>
            ) : (
              <><ShoppingBag size={13} /> Add</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border);
          cursor: pointer; position: relative;
          background: #FFFFFF; display: flex; flex-direction: column;
          box-shadow: var(--shadow-card);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms),
                      transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms),
                      box-shadow 0.35s ease,
                      border-color 0.35s ease;
        }
        .product-card.pc-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .product-card:hover {
          transform: translateY(-6px);
          border-color: var(--border-active);
          box-shadow: var(--shadow-hover);
        }

        /* 3:4 portrait aspect ratio — luxury editorial standard */
        .pc-img-wrap {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #EFECE6;
        }
        .pc-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1); }
        .product-card:hover .pc-img { transform: scale(1.08); }

        /* Rectangle badge — top left */
        .pc-badge {
          position: absolute; top: 12px; left: 12px; z-index: 2;
          font-size: 10px; font-weight: 700; padding: 5px 12px; border-radius: 2px;
          color: #FFFFFF; letter-spacing: 0.08em; text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .pc-badge.sold-out { background: #1C1712; }
        .pc-badge.low-stock { background: var(--gold); }
        .pc-badge.custom-badge { background: rgba(30, 23, 18, 0.85); backdrop-filter: blur(8px); border: 1px solid rgba(214, 90, 49, 0.4); color: #F5F0E6; }

        /* Hover overlay */
        .pc-hover-overlay {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: rgba(18, 12, 8, 0.28); backdrop-filter: blur(2px); opacity: 0; transition: opacity 0.35s ease; z-index: 3;
        }
        .product-card:hover .pc-hover-overlay { opacity: 1; }
        .pc-quick-view {
          display: flex; align-items: center; gap: 6px; padding: 11px 22px;
          background: #FFFFFF; color: var(--charcoal-text); font-size: 10px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase; border: none; border-radius: 2px; cursor: pointer;
          transition: var(--transition); box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          transform: translateY(8px);
        }
        .product-card:hover .pc-quick-view { transform: translateY(0); }
        .pc-quick-view:hover { background: var(--charcoal-text); color: #FFFFFF; }

        /* Body */
        .pc-body { padding: 18px 20px 20px; display: flex; flex-direction: column; flex: 1; }
        .pc-category { font-size: 9px; letter-spacing: 0.2em; color: var(--gold); font-weight: 700; margin-bottom: 5px; }
        .pc-name { font-size: 18px; font-weight: 400; color: var(--charcoal-text); margin-bottom: 3px; line-height: 1.25; }
        .pc-origin { font-size: 11px; color: var(--text-muted); margin-bottom: 14px; }

        .pc-variants { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
        .pc-variant-btn {
          padding: 4px 10px; font-size: 10px; font-weight: 600; background: none; cursor: pointer;
          border: 1px solid var(--border); border-radius: 2px; color: var(--text-muted); transition: var(--transition);
        }
        .pc-variant-btn:hover { border-color: var(--gold); color: var(--gold); }
        .pc-variant-btn.active { border-color: var(--gold); color: var(--gold); background: rgba(214, 90, 49, 0.08); font-weight: 700; }

        .pc-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border); }
        .pc-price { display: flex; align-items: baseline; gap: 4px; }
        .pc-price-main { font-size: 19px; font-weight: 600; color: var(--charcoal-text); }
        .pc-price-sub { font-size: 11px; color: var(--text-muted); }

        .pc-add-btn {
          display: flex; align-items: center; gap: 6px; padding: 9px 16px;
          background: var(--charcoal-text); color: #FFFFFF; font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; border: none; border-radius: 2px; cursor: pointer;
          transition: var(--transition); min-width: 72px; justify-content: center;
          box-shadow: 0 4px 12px rgba(30, 23, 18, 0.15);
        }
        .pc-add-btn:hover:not(.disabled) { background: var(--gold); box-shadow: 0 6px 18px rgba(214, 90, 49, 0.3); }
        .pc-add-btn.added { background: #10b981; }
        .pc-add-btn.disabled { background: #F0EDE8; color: var(--text-muted); cursor: not-allowed; box-shadow: none; }
      `}</style>
    </div>
  );
}
