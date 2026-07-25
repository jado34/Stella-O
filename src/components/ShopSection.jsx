import React, { useState, useMemo } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { categories } from '../data/products';
import ProductCard from './ProductCard';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured Selection' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Harvest' },
];

const STORAGE_FILTERS = [
  { value: 'ambient', label: 'Ambient Storage' },
  { value: 'chilled', label: 'Chilled Storage' },
  { value: 'frozen', label: 'Frozen Storage' },
];

const TAG_FILTERS = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'halal', label: 'Halal Certified' },
  { value: 'organic', label: 'Organic' },
  { value: 'keto', label: 'Keto Friendly' },
];

export default function ShopSection() {
  const {
    productsList, activeCategory, setActiveCategory, searchQuery,
    sortBy, setSortBy, convertPrice, activeView, setActiveView,
  } = useShop();

  const isHome = activeView === 'home';

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // Draft filters state (active inside panel before confirm)
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [draftFilters, setDraftFilters] = useState({
    storage: [],
    tags: [],
    maxPrice: 70000,
    inStockOnly: false,
  });

  // Applied filters state (used to compute the filtered products list)
  const [appliedCategories, setAppliedCategories] = useState(['all']);
  const [appliedFilters, setAppliedFilters] = useState({
    storage: [],
    tags: [],
    maxPrice: 70000,
    inStockOnly: false,
  });

  // Sync when activeCategory context changes externally (e.g. from Hero or Navbar links)
  React.useEffect(() => {
    if (activeCategory) {
      setAppliedCategories([activeCategory]);
      setSelectedCategories([activeCategory]);
    }
  }, [activeCategory]);

  const toggleCategoryDraft = (catId) => {
    if (catId === 'all') {
      setSelectedCategories(['all']);
      return;
    }
    let next = selectedCategories.filter(c => c !== 'all');
    if (next.includes(catId)) {
      next = next.filter(c => c !== catId);
    } else {
      next.push(catId);
    }
    if (next.length === 0) {
      next = ['all'];
    }
    setSelectedCategories(next);
  };

  const toggleStorageDraft = (val) => {
    setDraftFilters(prev => ({
      ...prev,
      storage: prev.storage.includes(val)
        ? prev.storage.filter(v => v !== val)
        : [...prev.storage, val],
    }));
  };

  const toggleTagDraft = (val) => {
    setDraftFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(val)
        ? prev.tags.filter(v => v !== val)
        : [...prev.tags, val],
    }));
  };

  const handleConfirmFilters = () => {
    setAppliedCategories([...selectedCategories]);
    setAppliedFilters({ ...draftFilters });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const defaultCat = ['all'];
    const defaultFlt = { storage: [], tags: [], maxPrice: 70000, inStockOnly: false };
    setSelectedCategories(defaultCat);
    setDraftFilters(defaultFlt);
    setAppliedCategories(defaultCat);
    setAppliedFilters(defaultFlt);
    setActiveCategory('all');
  };

  const hasAppliedFilters =
    !appliedCategories.includes('all') ||
    appliedFilters.storage.length > 0 ||
    appliedFilters.tags.length > 0 ||
    appliedFilters.inStockOnly ||
    appliedFilters.maxPrice < 70000;

  const countDraftSelected =
    (selectedCategories.includes('all') ? 0 : selectedCategories.length) +
    draftFilters.storage.length +
    draftFilters.tags.length +
    (draftFilters.inStockOnly ? 1 : 0) +
    (draftFilters.maxPrice < 70000 ? 1 : 0);

  const filtered = useMemo(() => {
    let list = [...productsList];

    // 1. Category / search filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q)
      );
    } else if (!appliedCategories.includes('all')) {
      list = list.filter(p => appliedCategories.includes(p.category));
    }

    if (appliedFilters.storage.length > 0) {
      list = list.filter(p => appliedFilters.storage.includes(p.storage));
    }

    if (appliedFilters.tags.length > 0) {
      list = list.filter(p => appliedFilters.tags.every(t => p.tags.includes(t)));
    }

    if (appliedFilters.inStockOnly) {
      list = list.filter(p => p.variants.some(v => v.stock > 0));
    }

    list = list.filter(p => p.variants[0].price <= appliedFilters.maxPrice);

    if (sortBy === 'price-low') list.sort((a, b) => a.variants[0].price - b.variants[0].price);
    if (sortBy === 'price-high') list.sort((a, b) => b.variants[0].price - a.variants[0].price);
    if (sortBy === 'newest') list.sort((a, b) => b.id - a.id);

    return list;
  }, [productsList, appliedCategories, searchQuery, appliedFilters, sortBy]);

  const homeFeaturedProducts = useMemo(() => {
    const featuredList = [];
    const sampleCategories = [
      'flours', 'rice', 'beans', 'oils', 'spices',
      'soup', 'fish', 'meat', 'breakfast', 'snacks',
      'fresh', 'beverages'
    ];

    sampleCategories.forEach(cat => {
      const match = productsList.find(p => p.category === cat && p.badge);
      if (match && !featuredList.some(item => item.id === match.id)) {
        featuredList.push(match);
      } else {
        const fallback = productsList.find(p => p.category === cat);
        if (fallback && !featuredList.some(item => item.id === fallback.id)) {
          featuredList.push(fallback);
        }
      }
    });

    return featuredList;
  }, [productsList]);

  const displayedProducts = isHome ? homeFeaturedProducts : filtered;

  return (
    <section className="shop-section" id="shop-section">
      {/* Category Heading Banner */}
      <div className="container shop-heading-container" style={{ textAlign: isHome ? 'center' : 'left' }}>
        {isHome && (
          <p style={{ fontSize: 10, letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
            CURATED HARVEST
          </p>
        )}
        <h1 className="shop-title-large serif" style={{ fontSize: isHome ? 'clamp(28px, 4vw, 42px)' : undefined }}>
          {isHome ? "AFRIFOOD FEATURED SELECTION" : 'PRODUCTS'}
        </h1>
      </div>

      {/* Sub-Header Filter Bar (Only rendered in full shop view) */}
      {!isHome && (
        <div className="zttw-subbar">
          <div className="container zttw-subbar-inner">
            {/* Left: Filter Toggle */}
            <button
              className={`zttw-bar-btn zttw-bar-btn-filter ${showFilters ? 'active' : ''}`}
              onClick={() => {
                if (!showFilters) {
                  setSelectedCategories([...appliedCategories]);
                  setDraftFilters({ ...appliedFilters });
                }
                setShowFilters(p => !p);
              }}
            >
              <SlidersHorizontal size={13} />
              <span>FILTERS</span>
              {hasAppliedFilters && <span className="filter-dot">•</span>}
            </button>

            {/* Right: Sort Dropdown */}
            <div className="shop-sort-wrap">
              <button className="zttw-bar-btn zttw-bar-btn-sort" onClick={() => setShowSort(p => !p)}>
                <span>SORT BY</span>
                <ChevronDown size={12} />
              </button>
              {showSort && (
                <div className="shop-sort-drop anim-scale-in">
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      className={`nav-dropdown-item ${sortBy === o.value ? 'active' : ''}`}
                      onClick={() => { setSortBy(o.value); setShowSort(false); }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        {/* Expandable Filter Panel */}
        {!isHome && showFilters && (
          <div className="shop-filter-panel anim-slide-up">
            {/* Product Category Multi-Select */}
            <div className="filter-group" style={{ width: '100%', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 8 }}>
              <p className="filter-group-label">PRODUCT CATEGORY (MULTI-SELECT)</p>
              <div className="filter-chips">
                {categories.map(c => {
                  const isSelected = selectedCategories.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      className={`filter-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleCategoryDraft(c.id)}
                    >
                      {isSelected && c.id !== 'all' ? '✓ ' : ''}{c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Storage Condition Multi-Select */}
            <div className="filter-group">
              <p className="filter-group-label">STORAGE CONDITION</p>
              <div className="filter-chips">
                {STORAGE_FILTERS.map(f => {
                  const isSelected = draftFilters.storage.includes(f.value);
                  return (
                    <button
                      key={f.value}
                      className={`filter-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleStorageDraft(f.value)}
                    >
                      {isSelected ? '✓ ' : ''}{f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dietary Tags Multi-Select */}
            <div className="filter-group">
              <p className="filter-group-label">DIETARY TAGS</p>
              <div className="filter-chips">
                {TAG_FILTERS.map(f => {
                  const isSelected = draftFilters.tags.includes(f.value);
                  return (
                    <button
                      key={f.value}
                      className={`filter-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleTagDraft(f.value)}
                    >
                      {isSelected ? '✓ ' : ''}{f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="filter-group">
              <p className="filter-group-label">MAX PRICE (NGN)</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="range"
                  min="2000"
                  max="70000"
                  step="1000"
                  value={draftFilters.maxPrice}
                  onChange={(e) => setDraftFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  style={{ accentColor: 'var(--gold)' }}
                />
                <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>
                  Under {convertPrice(draftFilters.maxPrice)}
                </span>
              </div>
            </div>

            {/* Stock Status Checkbox */}
            <div className="filter-group">
              <p className="filter-group-label">STOCK STATUS</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--charcoal-text)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={draftFilters.inStockOnly}
                  onChange={(e) => setDraftFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                  style={{ accentColor: 'var(--gold)' }}
                />
                In-Stock Only
              </label>
            </div>

            {/* Action Bar with Confirm & Clear Buttons */}
            <div className="filter-actions-bar" style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 18,
              marginTop: 12,
              borderTop: '1px solid var(--border)'
            }}>
              <button
                className="btn-ghost"
                onClick={handleClearFilters}
                style={{ fontSize: 11, letterSpacing: '0.12em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <X size={12} /> CLEAR ALL FILTERS
              </button>

              <button
                className="btn-primary"
                onClick={handleConfirmFilters}
                style={{ padding: '12px 32px', fontSize: 11, letterSpacing: '0.14em', fontWeight: 700 }}
              >
                ✓ CONFIRM FILTERS {countDraftSelected > 0 ? `(${countDraftSelected})` : ''}
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <>
            <div className="product-grid">
              {displayedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>

            {/* Home Page Explore All Products Button */}
            {isHome && (
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setActiveView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ padding: '16px 40px', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700 }}
                >
                  EXPLORE ALL PRODUCTS ({productsList.length}) →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="shop-empty">
            <p className="serif" style={{ fontSize: 26, color: 'var(--charcoal-text)' }}>No products match your criteria</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
              Try adjusting your price range or filter selections.
            </p>
            <button className="btn-outline" style={{ marginTop: 20, fontSize: 11 }} onClick={handleClearFilters}>
              RESET FILTERS
            </button>
          </div>
        )}
      </div>

      <style>{`
        .shop-section { background: var(--cream-bg); color: var(--charcoal-text); }
        
        .shop-heading-container { padding-top: 60px; padding-bottom: 30px; }
        .shop-title-large {
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--charcoal-text);
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
        }

        .zttw-subbar {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: var(--cream-bg);
          position: sticky; top: 72px; z-index: 100;
          width: 100%;
          transition: top 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        body.navbar-hidden .zttw-subbar {
          top: 0;
        }
        .zttw-subbar-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 54px;
        }
        .zttw-bar-btn {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer;
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          color: var(--charcoal-text); transition: var(--transition);
          height: 100%;
        }
        .zttw-bar-btn-filter {
          border-right: 1px solid var(--border);
          padding: 0 24px 0 0;
        }
        .zttw-bar-btn-sort {
          border-left: 1px solid var(--border);
          padding: 0 0 0 24px;
        }
        .zttw-bar-btn:hover, .zttw-bar-btn.active { color: var(--gold); }
        .filter-dot { color: var(--gold); font-size: 16px; margin-left: 2px; }

        .shop-sort-wrap { position: relative; height: 100%; display: flex; align-items: center; }
        .shop-sort-drop {
          position: absolute; top: 100%; right: 0;
          background: #FFFFFF; border: 1px solid var(--border);
          border-radius: 0 0 4px 4px; overflow: hidden; min-width: 180px;
          box-shadow: var(--shadow-modal); z-index: 150;
        }

        .shop-cats-scroll {
          display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 24px;
          scrollbar-width: none;
        }
        .shop-cats-scroll::-webkit-scrollbar { display: none; }
        .shop-cat-pill {
          flex-shrink: 0; padding: 6px 16px; border-radius: 20px; border: 1px solid var(--border);
          font-size: 11px; font-weight: 600; color: var(--charcoal-text); background: #FFFFFF; cursor: pointer;
          transition: var(--transition); white-space: nowrap;
        }
        .shop-cat-pill:hover { border-color: var(--gold); color: var(--gold); }
        .shop-cat-pill.active { background: var(--charcoal-text); border-color: var(--charcoal-text); color: #FFFFFF; font-weight: 700; }

        .shop-filter-panel {
          display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap;
          padding: 24px 28px; border-radius: var(--radius-md); margin-bottom: 32px;
          border: 1px solid var(--border); background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px); box-shadow: var(--shadow-card);
        }
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-group-label { font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); }
        .filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .filter-chip {
          padding: 6px 14px; border: 1px solid var(--border); border-radius: 20px;
          font-size: 11px; font-weight: 500; color: var(--charcoal-text); background: var(--cream-bg); cursor: pointer;
          transition: var(--transition);
        }
        .filter-chip:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-1px); }
        .filter-chip.active { background: var(--charcoal-text); border-color: var(--charcoal-text); color: #FFFFFF; font-weight: 600; box-shadow: 0 4px 12px rgba(30, 23, 18, 0.15); }

        .product-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 28px;
        }
        .shop-empty { text-align: center; padding: 60px 20px; }
        @media (max-width: 600px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}
