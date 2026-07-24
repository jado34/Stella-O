import React, { useState } from 'react';
import { Shield, Package, ShoppingBag, Plus, Trash2, Edit, AlertTriangle, Search, DollarSign } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function AdminDashboard() {
  const {
    productsList, updateProductStock,
    ordersList, updateOrderStatus,
    corporateQuotes, convertPrice,
    promoCodes, setPromoCodes, showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'orders', 'quotes', 'promos'
  const [stockSearch, setStockSearch] = useState('');
  const [newPromoCode, setNewPromoCode] = useState({ code: '', discountPercent: 10, minSpend: 15000, description: '' });

  // Scorecard KPIs
  const grossRevenue = ordersList.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = ordersList.filter(o => o.status !== 'Delivered').length;
  const lowStockCount = productsList.filter(p => p.variants.some(v => v.stock <= 20)).length;

  const handleAddPromo = (e) => {
    e.preventDefault();
    if (!newPromoCode.code) return;
    setPromoCodes(prev => [...prev, { ...newPromoCode, code: newPromoCode.code.toUpperCase() }]);
    setNewPromoCode({ code: '', discountPercent: 10, minSpend: 15000, description: '' });
    showToast(`Promo code ${newPromoCode.code.toUpperCase()} created!`);
  };

  const handleRemovePromo = (code) => {
    setPromoCodes(prev => prev.filter(p => p.code !== code));
    showToast(`Promo code ${code} removed`);
  };

  return (
    <div className="admin-page section">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={22} style={{ color: 'var(--gold)' }} />
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>INTERNAL PORTAL</p>
              <h2 className="serif" style={{ fontSize: 32, color: 'var(--charcoal-text)' }}>Operations Back-Office</h2>
            </div>
          </div>
        </div>

        {/* Scorecard KPI Cards */}
        <div className="admin-kpis">
          <div className="kpi-card">
            <DollarSign size={20} style={{ color: 'var(--gold)' }} />
            <div>
              <p className="kpi-label">Gross Revenue</p>
              <p className="kpi-value serif">{convertPrice(grossRevenue)}</p>
            </div>
          </div>
          <div className="kpi-card">
            <ShoppingBag size={20} style={{ color: 'var(--gold)' }} />
            <div>
              <p className="kpi-label">Active Orders</p>
              <p className="kpi-value serif">{activeOrdersCount}</p>
            </div>
          </div>
          <div className="kpi-card">
            <AlertTriangle size={20} style={{ color: lowStockCount > 0 ? '#ef4444' : 'var(--gold)' }} />
            <div>
              <p className="kpi-label">Low Stock SKUs</p>
              <p className="kpi-value serif">{lowStockCount}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          {[
            { id: 'inventory', label: 'INVENTORY & EXPIRY', icon: Package },
            { id: 'orders', label: 'ORDERS & DELIVERY', icon: ShoppingBag },
            { id: 'quotes', label: 'CORPORATE QUOTES', icon: Shield },
            { id: 'promos', label: 'PROMO CODES', icon: Plus },
          ].map(t => (
            <button
              key={t.id}
              className={`admin-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="admin-card anim-slide-up">
            <div className="admin-card-header">
              <h3 className="serif" style={{ fontSize: 20 }}>Live Inventory & Freshness Control</h3>
              <div className="admin-search-box">
                <Search size={14} style={{ color: 'var(--gold)' }} />
                <input
                  placeholder="Search SKU or product..."
                  value={stockSearch}
                  onChange={e => setStockSearch(e.target.value)}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Variant SKU</th>
                    <th>Shelf Life Days</th>
                    <th>Price</th>
                    <th>Stock Units</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.filter(p => p.name.toLowerCase().includes(stockSearch.toLowerCase()) || p.category.toLowerCase().includes(stockSearch.toLowerCase())).map(product => (
                    product.variants.map(variant => (
                      <tr key={variant.sku}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={product.image} alt="" style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }} />
                            <strong>{product.name}</strong>
                          </div>
                        </td>
                        <td><span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>{product.category}</span></td>
                        <td><code>{variant.sku}</code> ({variant.label})</td>
                        <td>{product.expiryDaysLeft} Days Remaining</td>
                        <td className="serif">{convertPrice(variant.price)}</td>
                        <td>
                          <span style={{ color: variant.stock <= 20 ? '#ef4444' : 'var(--charcoal-text)', fontWeight: 700 }}>
                            {variant.stock} units {variant.stock <= 20 && '(LOW)'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-outline"
                            style={{ fontSize: 10, padding: '4px 8px' }}
                            onClick={() => {
                              const qty = prompt(`Update stock units for ${variant.sku}:`, variant.stock);
                              if (qty !== null && !isNaN(qty)) updateProductStock(product.id, variant.sku, Number(qty));
                            }}
                          >
                            <Edit size={10} /> EDIT STOCK
                          </button>
                        </td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="admin-card anim-slide-up">
            <div className="admin-card-header">
              <h3 className="serif" style={{ fontSize: 20 }}>Customer Orders & Delivery Slots</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Customer & Address</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Zone & Window</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map(order => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong><br /><span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{order.placedAt}</span></td>
                      <td>
                        <strong>{order.customerName}</strong><br />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.phone}</span><br />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.address}</span>
                      </td>
                      <td>
                        {order.items.map((it, i) => (
                          <div key={i} style={{ fontSize: 11 }}>• {it.product.name} ({it.variant.label}) × {it.quantity}</div>
                        ))}
                      </td>
                      <td className="serif" style={{ color: 'var(--gold)', fontWeight: 700 }}>{convertPrice(order.total)}</td>
                      <td>
                        <strong>{order.zone?.name}</strong><br />
                        <span style={{ fontSize: 11, color: 'var(--gold)' }}>{order.slot?.date} ({order.slot?.time})</span>
                      </td>
                      <td>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'rgba(171,140,82,0.15)', color: 'var(--gold)' }}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{ background: 'var(--cream-bg)', border: '1px solid var(--border)', color: 'var(--charcoal-text)', fontSize: 11, padding: 4, borderRadius: 4 }}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Packing in Kitchen">Packing in Kitchen</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Corporate Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="admin-card anim-slide-up">
            <div className="admin-card-header">
              <h3 className="serif" style={{ fontSize: 20 }}>Corporate Bulk Quote Requests</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Quote Ref</th>
                    <th>Company / Contact</th>
                    <th>Est Qty</th>
                    <th>Event Date</th>
                    <th>Notes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {corporateQuotes.map(q => (
                    <tr key={q.id}>
                      <td><strong>{q.id}</strong><br /><span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{q.dateSubmitted}</span></td>
                      <td>
                        <strong>{q.company}</strong><br />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{q.contactPerson} ({q.phone})</span><br />
                        <span style={{ fontSize: 11, color: 'var(--gold)' }}>{q.email}</span>
                      </td>
                      <td><strong>{q.estQuantity} units</strong></td>
                      <td>{q.eventDate}</td>
                      <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{q.notes}</td>
                      <td>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'rgba(171,140,82,0.15)', color: 'var(--gold)' }}>
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Promo Codes Tab */}
        {activeTab === 'promos' && (
          <div className="admin-card anim-slide-up">
            <div className="admin-card-header">
              <h3 className="serif" style={{ fontSize: 20 }}>Discount Promo Code Engine</h3>
            </div>

            <form className="promo-create-form" onSubmit={handleAddPromo}>
              <input
                className="input-field"
                placeholder="PROMO CODE (e.g. LAGOS20)"
                value={newPromoCode.code}
                onChange={e => setNewPromoCode(p => ({ ...p, code: e.target.value }))}
                required
              />
              <input
                className="input-field"
                type="number"
                placeholder="Discount %"
                value={newPromoCode.discountPercent}
                onChange={e => setNewPromoCode(p => ({ ...p, discountPercent: Number(e.target.value) }))}
                required
              />
              <input
                className="input-field"
                type="number"
                placeholder="Min Spend NGN"
                value={newPromoCode.minSpend}
                onChange={e => setNewPromoCode(p => ({ ...p, minSpend: Number(e.target.value) }))}
                required
              />
              <input
                className="input-field"
                placeholder="Description"
                value={newPromoCode.description}
                onChange={e => setNewPromoCode(p => ({ ...p, description: e.target.value }))}
              />
              <button type="submit" className="btn-primary" style={{ fontSize: 11 }}>CREATE PROMO</button>
            </form>

            <div style={{ marginTop: 24, overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Min Spend</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.map(p => (
                    <tr key={p.code}>
                      <td><code style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 700 }}>{p.code}</code></td>
                      <td><strong>{p.discountPercent}% OFF</strong></td>
                      <td>{convertPrice(p.minSpend)}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.description}</td>
                      <td>
                        <button className="btn-ghost" onClick={() => handleRemovePromo(p.code)} style={{ color: '#ef4444' }}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-page { background: var(--cream-bg); min-height: 80vh; color: var(--charcoal-text); }
        .admin-header { margin-bottom: 24px; }
        
        .admin-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .kpi-card { display: flex; align-items: center; gap: 14px; background: #FFFFFF; border: 1px solid var(--border); border-radius: 6px; padding: 18px 20px; box-shadow: var(--shadow-card); }
        .kpi-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
        .kpi-value { font-size: 24px; font-weight: 600; color: var(--charcoal-text); margin-top: 2px; }

        .admin-tabs { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
        .admin-tab { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border); background: #FFFFFF; font-size: 11px; font-weight: 700; color: var(--text-muted); cursor: pointer; transition: var(--transition); white-space: nowrap; }
        .admin-tab:hover { color: var(--gold); border-color: var(--gold); }
        .admin-tab.active { background: var(--gold); border-color: var(--gold); color: #FFFFFF; }

        .admin-card { background: #FFFFFF; border: 1px solid var(--border); border-radius: 6px; padding: 24px; box-shadow: var(--shadow-card); }
        .admin-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
        
        .admin-search-box { display: flex; align-items: center; gap: 8px; background: var(--cream-bg); border: 1px solid var(--border); border-radius: 4px; padding: 6px 12px; }
        .admin-search-box input { background: none; border: none; outline: none; font-size: 12px; color: var(--charcoal-text); width: 200px; }

        .admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 12px; }
        .admin-table th { padding: 10px 14px; background: var(--cream-bg); color: var(--gold); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--border); }
        .admin-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); color: var(--charcoal-text); vertical-align: middle; }

        .promo-create-form { display: grid; grid-template-columns: 1fr 1fr 1fr 2fr auto; gap: 10px; }
        @media (max-width: 800px) { .promo-create-form { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
