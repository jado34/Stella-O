import React, { useState } from 'react';
import { X, ShoppingBag, Leaf, Thermometer, MapPin, ChevronRight, ShieldCheck, ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { products } from '../data/products';

const STORAGE_LABELS = {
  ambient: '🌿 Ambient — Store in a cool, dry place away from direct sunlight',
  chilled: '❄️ Chilled — Keep refrigerated at 2°C to 8°C',
  frozen: '🧊 Frozen — Store frozen at -18°C',
};

export default function ProductDetailModal() {
  const {
    selectedProduct: product, setSelectedProduct, addToCart,
    convertPrice, selectedZone,
  } = useShop();

  const [variantIdx, setVariantIdx] = useState(0);
  const [addedAnim, setAddedAnim] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showNutrition, setShowNutrition] = useState(false);

  if (!product) return null;

  const variant = product.variants[variantIdx] || product.variants[0] || { price: 0, stock: 0 };
  const pairsProducts = products.filter(p => product.pairsWell && product.pairsWell.includes(p.id)).slice(0, 3);
  const isSoldOut = variant.stock === 0;

  const handleAdd = () => {
    if (isSoldOut) return;
    addToCart(product, variant, quantity);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1600);
  };

  const images = [product.image, product.image, product.image];

  return (
    <>
      <div className="overlay" onClick={() => setSelectedProduct(null)} style={{ zIndex: 300 }} />
      <div className="pdp-modal anim-scale-in" style={{ zIndex: 301 }}>
        <button className="pdp-close" onClick={() => setSelectedProduct(null)} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="pdp-inner">
          {/* Left: Images */}
          <div className="pdp-images">
            <div className="pdp-main-img">
              <img src={images[imgIdx]} alt={product.name} />
              {product.badge && (
                <span className="badge badge-gold" style={{ position: 'absolute', top: 16, left: 16 }}>
                  {product.badge}
                </span>
              )}
            </div>
            <div className="pdp-thumbs">
              {images.map((img, i) => (
                <button key={i} className={`pdp-thumb ${imgIdx === i ? 'active' : ''}`} onClick={() => setImgIdx(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="pdp-info">
            <p className="pdp-category">{product.category.toUpperCase()}</p>
            <h2 className="pdp-title serif">{product.name}</h2>
            <p className="pdp-origin"><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{product.origin}</p>

            <p className="pdp-desc">{product.description}</p>

            {/* Freshness & Sourcing Panel */}
            <div className="pdp-meta">
              <div className="pdp-meta-item">
                <Thermometer size={14} style={{ color: 'var(--gold)' }} />
                <span>{STORAGE_LABELS[product.storage]}</span>
              </div>
              {product.freshnessNote && (
                <div className="pdp-freshness-box">
                  <strong>💡 Stella's Handling Note: </strong>
                  <span>{product.freshnessNote}</span>
                </div>
              )}
              <div className="pdp-meta-item">
                <ShieldCheck size={14} style={{ color: 'var(--gold)' }} />
                <span>Delivery: Available for {selectedZone ? selectedZone.name : 'Lagos & Abuja'}</span>
              </div>
            </div>

            {/* Allergen & Dietary Tags */}
            {product.tags?.length > 0 && (
              <div className="pdp-tags">
                <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, alignSelf: 'center' }}>TAGS:</span>
                {product.tags.map(t => (
                  <span key={t} className="pdp-tag">
                    <Leaf size={10} /> {t}
                  </span>
                ))}
              </div>
            )}

            {/* Expandable Nutritional Facts */}
            {product.nutritionalInfo && (
              <div className="pdp-nutrition-accordion">
                <button className="nutrition-toggle" onClick={() => setShowNutrition(p => !p)}>
                  <span>Nutritional Facts & Energy Breakdown</span>
                  <ChevronDown size={14} style={{ transform: showNutrition ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                </button>
                {showNutrition && (
                  <div className="nutrition-body anim-slide-down">
                    <div className="nutrition-row"><span>Calories</span><strong>{product.nutritionalInfo.calories}</strong></div>
                    <div className="nutrition-row"><span>Protein</span><strong>{product.nutritionalInfo.protein}</strong></div>
                    <div className="nutrition-row"><span>Carbohydrates</span><strong>{product.nutritionalInfo.carbs}</strong></div>
                    {product.nutritionalInfo.fat && <div className="nutrition-row"><span>Fat</span><strong>{product.nutritionalInfo.fat}</strong></div>}
                  </div>
                )}
              </div>
            )}

            {/* Variant Selector */}
            <div className="pdp-section-label">Select Pack Size / Quantity</div>
            <div className="pdp-variants">
              {product.variants.map((v, i) => (
                <button
                  key={v.sku}
                  className={`pdp-variant ${i === variantIdx ? 'active' : ''}`}
                  onClick={() => setVariantIdx(i)}
                >
                  <span className="pdp-var-label">{v.label}</span>
                  <span className="pdp-var-price serif">{convertPrice(v.price)}</span>
                  {v.stock <= 20 && v.stock > 0 && (
                    <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>LOW STOCK</span>
                  )}
                  {v.stock === 0 && (
                    <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>SOLD OUT</span>
                  )}
                </button>
              ))}
            </div>

            {/* Volume Bulk Tiers */}
            {product.volumeTiers && (
              <div className="volume-tiers-box">
                <p style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, marginBottom: 4, letterSpacing: '0.1em' }}>BULK DISCOUNTS AVAILABLE</p>
                {product.volumeTiers.map((tier, idx) => (
                  <p key={idx} style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    • Order {tier.minQty}+ units to save {tier.discountPercent}% automatically at checkout.
                  </p>
                ))}
              </div>
            )}

            {/* Quantity Stepper & Add to Cart */}
            <div className="pdp-cta-row">
              <div className="qty-stepper">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>TOTAL PRICE</p>
                <p className="pdp-price serif">{convertPrice(variant.price * quantity)}</p>
              </div>
              <button
                className={`btn-primary pdp-add-btn ${addedAnim ? 'added' : ''} ${isSoldOut ? 'disabled' : ''}`}
                onClick={handleAdd}
                disabled={isSoldOut}
              >
                {isSoldOut ? (
                  <span>Sold Out</span>
                ) : addedAnim ? (
                  <><span>✓</span> Added to Cart</>
                ) : (
                  <><ShoppingBag size={14} /> Add to Cart</>
                )}
              </button>
            </div>

            {/* Pairs Well With Upsell */}
            {pairsProducts.length > 0 && (
              <div className="pdp-pairs">
                <p className="pdp-section-label">Pairs Well With</p>
                <div className="pdp-pairs-list">
                  {pairsProducts.map(p => (
                    <button
                      key={p.id}
                      className="pdp-pair-item"
                      onClick={() => { setSelectedProduct(p); setVariantIdx(0); setImgIdx(0); }}
                    >
                      <img src={p.image} alt={p.name} />
                      <div className="pdp-pair-info">
                        <p className="pdp-pair-name">{p.name}</p>
                        <p className="pdp-pair-price serif">{convertPrice(p.variants[0].price)}</p>
                      </div>
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .pdp-modal {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: min(960px, 95vw); max-height: 90vh; background: #FFFFFF;
          border: 1px solid var(--border); border-radius: 8px; overflow-y: auto;
          box-shadow: var(--shadow-modal); color: var(--charcoal-text);
        }
        .pdp-close {
          position: absolute; top: 16px; right: 16px; z-index: 10;
          width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
          background: var(--card-bg); border: none; border-radius: 50%; color: var(--charcoal-text);
          cursor: pointer; transition: var(--transition);
        }
        .pdp-close:hover { background: #E2DBD0; }

        .pdp-inner { display: grid; grid-template-columns: 1fr 1.1fr; gap: 0; }
        @media (max-width: 768px) { .pdp-inner { grid-template-columns: 1fr; } }

        .pdp-images { padding: 28px 20px 28px 28px; background: var(--cream-bg); }
        .pdp-main-img { position: relative; height: 340px; border-radius: 6px; overflow: hidden; margin-bottom: 12px; background: var(--card-bg); }
        .pdp-main-img img { width: 100%; height: 100%; object-fit: cover; }
        .pdp-thumbs { display: flex; gap: 8px; }
        .pdp-thumb {
          width: 64px; height: 64px; border-radius: 6px; overflow: hidden; background: none;
          border: 2px solid transparent; cursor: pointer; transition: var(--transition);
        }
        .pdp-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .pdp-thumb.active { border-color: var(--gold); }

        .pdp-info { padding: 28px 28px 28px 20px; overflow-y: auto; }
        .pdp-category { font-size: 9px; letter-spacing: 0.18em; color: var(--gold); font-weight: 700; margin-bottom: 6px; }
        .pdp-title { font-size: clamp(24px, 2.8vw, 34px); font-weight: 400; color: var(--charcoal-text); margin-bottom: 4px; line-height: 1.15; }
        .pdp-origin { font-size: 11px; color: var(--text-muted); margin-bottom: 16px; }
        .pdp-desc { font-size: 13px; line-height: 1.7; color: var(--text-muted); margin-bottom: 16px; }

        .pdp-meta { border-radius: 6px; padding: 14px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; border: 1px solid var(--border); background: var(--cream-bg); }
        .pdp-meta-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--charcoal-text); }
        .pdp-freshness-box {
          border-left: 3px solid var(--gold);
          background: rgba(214,90,49,0.06);
          padding: 8px 10px;
          font-size: 11px;
          color: var(--charcoal-text);
          line-height: 1.4;
          border-radius: 2px;
        }

        .pdp-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
        .pdp-tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border: 1px solid var(--border); border-radius: 12px; font-size: 10px; color: var(--text-muted); }

        .pdp-nutrition-accordion { border: 1px solid var(--border); border-radius: 6px; margin-bottom: 16px; overflow: hidden; }
        .nutrition-toggle {
          width: 100%; display: flex; justify-content: space-between; align-items: center;
          padding: 10px 14px; background: var(--cream-bg); border: none; cursor: pointer;
          font-size: 11px; font-weight: 600; color: var(--gold);
        }
        .nutrition-body { padding: 10px 14px; background: #FFFFFF; display: flex; flex-direction: column; gap: 6px; }
        .nutrition-row { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); }

        .pdp-section-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; }
        .pdp-variants { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .pdp-variant {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 10px 14px; border: 1px solid var(--border); border-radius: 4px; background: none; cursor: pointer; transition: var(--transition);
        }
        .pdp-variant:hover { border-color: var(--gold); background: rgba(171,140,82,0.05); }
        .pdp-variant.active { border-color: var(--gold); background: rgba(171,140,82,0.12); }
        .pdp-var-label { font-size: 12px; font-weight: 600; color: var(--charcoal-text); }
        .pdp-var-price { font-size: 14px; font-weight: 600; color: var(--gold); }

        .volume-tiers-box { background: rgba(171,140,82,0.08); border: 1px solid rgba(171,140,82,0.25); border-radius: 6px; padding: 10px 12px; margin-bottom: 16px; }

        .pdp-cta-row { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
        .qty-stepper { display: flex; align-items: center; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; background: var(--cream-bg); }
        .qty-stepper button { width: 30px; height: 36px; background: none; border: none; color: var(--charcoal-text); font-size: 16px; cursor: pointer; }
        .qty-stepper span { padding: 0 10px; font-size: 13px; font-weight: 600; color: var(--charcoal-text); }

        .pdp-price { font-size: 24px; font-weight: 600; color: var(--gold); line-height: 1; }
        .pdp-add-btn.added { background: #10b981 !important; color: #fff !important; }
        .pdp-add-btn.disabled { background: var(--card-bg) !important; color: var(--text-muted) !important; cursor: not-allowed; }

        .pdp-pairs { border-top: 1px solid var(--border); padding-top: 16px; }
        .pdp-pairs-list { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .pdp-pair-item {
          display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 6px;
          border: 1px solid var(--border); background: var(--cream-bg); cursor: pointer; transition: var(--transition); width: 100%; text-align: left;
        }
        .pdp-pair-item:hover { border-color: var(--gold); }
        .pdp-pair-item img { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; }
        .pdp-pair-info { flex: 1; }
        .pdp-pair-name { font-size: 12px; font-weight: 600; color: var(--charcoal-text); }
        .pdp-pair-price { font-size: 12px; color: var(--gold); }
      `}</style>
    </>
  );
}
