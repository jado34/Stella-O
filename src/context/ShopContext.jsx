import React, { createContext, useContext, useState, useCallback } from 'react';
import { exchangeRates, currencySymbols, generateDeliverySlots, products as initialProducts, deliveryZones, initialPromoCodes } from '../data/products';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // Navigation & View Routing
  const [activeView, setActiveView] = useState('home'); // 'home', 'shop', 'story', 'gallery', 'contact', 'faq', 'admin'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtering & Sorting
  const [activeFilters, setActiveFilters] = useState({
    storage: [], // 'ambient', 'chilled', 'frozen'
    tags: [],    // 'vegan', 'gluten-free', 'halal', 'organic', 'keto'
    maxPrice: 70000,
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'newest'

  // Shopping Cart & Overlays
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCorporateOpen, setIsCorporateOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Currency Converter
  const [currency, setCurrency] = useState('NGN'); // 'NGN', 'USD', 'GBP', 'EUR'

  // Delivery Scheduling & Zones
  const [deliverySlots] = useState(generateDeliverySlots());
  const [selectedSlot, setSelectedSlot] = useState(deliverySlots[0]);
  const [selectedZone, setSelectedZone] = useState(deliveryZones[0]);

  // Gifting & Promo Codes
  const [giftingNote, setGiftingNote] = useState('');
  const [isGifting, setIsGifting] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoCodes, setPromoCodes] = useState(initialPromoCodes);

  // Orders Ledger & Back-Office State
  const [ordersList, setOrdersList] = useState([
    {
      id: 'STA-89210',
      customerName: 'Adebayo Ogunlesi',
      email: 'a.ogunlesi@example.ng',
      phone: '+234 803 123 4567',
      address: 'Plot 14 Admiralty Way, Lekki Phase 1',
      items: [
        { product: initialProducts[0], variant: initialProducts[0].variants[0], quantity: 2 },
        { product: initialProducts[3], variant: initialProducts[3].variants[0], quantity: 1 },
      ],
      total: 10100,
      zone: deliveryZones[0],
      slot: deliverySlots[0],
      status: 'Packing in Kitchen',
      placedAt: 'Today, 08:30 AM',
      isGift: false,
    },
    {
      id: 'STA-89195',
      customerName: 'Chiamaka Nnaji',
      email: 'c.nnaji@example.ng',
      phone: '+234 812 987 6543',
      address: '22 Maitama Avenue, Abuja FCT',
      items: [
        { product: initialProducts[1], variant: initialProducts[1].variants[1], quantity: 1 },
        { product: initialProducts[12], variant: initialProducts[12].variants[0], quantity: 1 },
      ],
      total: 44500,
      zone: deliveryZones[2],
      slot: deliverySlots[3],
      status: 'Delivered',
      placedAt: 'Yesterday, 02:15 PM',
      isGift: true,
      giftNote: 'Happy Anniversary Mom!',
    }
  ]);

  const [productsList, setProductsList] = useState(initialProducts);

  // Corporate Quotes Ledger
  const [corporateQuotes, setCorporateQuotes] = useState([
    {
      id: 'QTE-4019',
      company: 'Dangote Industries Ltd',
      contactPerson: 'Folake Alakija',
      email: 'f.alakija@dangote.com',
      phone: '+234 802 555 0192',
      eventDate: '2026-08-15',
      estQuantity: 150,
      notes: 'Custom executive hampers for end-of-quarter board meeting.',
      status: 'Reviewing',
      dateSubmitted: '2026-07-20',
    }
  ]);

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    {
      email: 'a.ogunlesi@example.ng',
      name: 'Adebayo Ogunlesi',
      phone: '+234 803 123 4567',
      address: 'Plot 14 Admiralty Way, Lekki Phase 1',
    }
  ]);

  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Price conversion helper
  const convertPrice = useCallback((priceNGN) => {
    const rate = exchangeRates[currency];
    const converted = priceNGN * rate;
    const symbol = currencySymbols[currency];
    if (currency === 'NGN') {
      return `${symbol}${Math.round(converted).toLocaleString('en-NG')}`;
    }
    return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  // Cart operations
  const addToCart = useCallback((product, variant, qty = 1) => {
    setCartItems(prev => {
      const key = `${product.id}-${variant.sku}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, {
        key,
        product,
        variant,
        quantity: qty,
      }];
    });
    showToast(`Added ${product.name} (${variant.label}) to cart`);
    setIsCartOpen(true);
  }, [showToast]);

  const removeFromCart = useCallback((key) => {
    setCartItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key, delta) => {
    setCartItems(prev =>
      prev.map(i => i.key === key ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
        .filter(i => i.quantity > 0)
    );
  }, []);

  const cartSubtotal = cartItems.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);
  const discountAmount = appliedPromo ? Math.round(cartSubtotal * (appliedPromo.discountPercent / 100)) : 0;
  const deliveryFee = selectedZone ? selectedZone.baseFee : 2500;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Order Placement
  const placeOrder = useCallback((customerDetails = {}, paymentMethod = 'card') => {
    const orderId = `STA-${Date.now().toString(36).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      customerName: customerDetails.name || 'Guest Customer',
      email: customerDetails.email || 'customer@example.ng',
      phone: customerDetails.phone || '+234 800 000 0000',
      address: customerDetails.address || 'Lekki Phase 1, Lagos',
      items: [...cartItems],
      subtotal: cartSubtotal,
      discount: discountAmount,
      deliveryFee,
      total: cartTotal,
      zone: selectedZone,
      slot: selectedSlot,
      isGift: isGifting,
      giftNote: giftingNote,
      status: 'Order Placed & Kitchen Notified',
      paymentGateway: paymentMethod, // 'card', 'bank', or 'ussd'
      placedAt: new Date().toLocaleString('en-NG'),
    };

    setOrdersList(prev => [newOrder, ...prev]);
    setOrderConfirmed(newOrder);

    setCartItems([]);
    setIsCheckoutOpen(false);
    showToast(`Order #${orderId} confirmed!`);

    // Redirection to WhatsApp for bank transfers
    if (paymentMethod === 'bank') {
      const lineBreak = '---------------------------------------';
      let itemsList = '';
      cartItems.forEach(item => {
        const priceStr = `${convertPrice(item.variant.price * item.quantity)}`;
        itemsList += `- ${item.product.name} (${item.variant.label}) x ${item.quantity} (${priceStr})\n`;
      });

      let message = `🇳🇬 *STELLA O AFRO SHOP - NEW ORDER*\n` +
        `${lineBreak}\n` +
        `*Order Reference:* ${orderId}\n` +
        `*Customer Name:* ${newOrder.customerName}\n` +
        `*Phone:* ${newOrder.phone}\n` +
        `*Email:* ${newOrder.email}\n\n` +
        `*Delivery Address:*\n` +
        `${newOrder.address}\n\n` +
        `*Shipping Zone:* ${selectedZone?.name || 'Lagos Island'}\n` +
        `*Delivery Slot:* ${selectedSlot?.date} (${selectedSlot?.time})\n\n` +
        `*Items Ordered:*\n` +
        `${itemsList}\n`;

      if (isGifting) {
        message += `*Gifting Order:* Yes (Complimentary Ribbon Packing)\n` +
          `*Gift Note:* "${giftingNote || 'With warmth'}"\n\n`;
      }

      message += `${lineBreak}\n` +
        `*Order Calculations:*\n` +
        `- Subtotal: ${convertPrice(cartSubtotal)}\n` +
        `- Delivery Fee: ${convertPrice(deliveryFee)}\n` +
        `- *Total Amount Payable:* ${convertPrice(cartTotal)}\n\n` +
        `${lineBreak}\n` +
        `Please send the bank account details so I can make the direct transfer. Thank you!`;

      const whatsAppLink = `https://wa.me/234800746759?text=${encodeURIComponent(message)}`;
      
      // Delay slightly to let states settle before launching window
      setTimeout(() => {
        window.open(whatsAppLink, '_blank');
      }, 300);
    }
  }, [cartItems, cartSubtotal, discountAmount, deliveryFee, cartTotal, selectedZone, selectedSlot, isGifting, giftingNote, convertPrice, showToast]);

  // Admin inventory updates
  const updateProductStock = useCallback((productId, variantSku, newStock) => {
    setProductsList(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedVariants = p.variants.map(v => v.sku === variantSku ? { ...v, stock: Math.max(0, newStock) } : v);
        return { ...p, variants: updatedVariants };
      }
      return p;
    }));
    showToast(`Stock updated for ${variantSku}`);
  }, [showToast]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} status set to "${newStatus}"`);
  }, [showToast]);

  const addCorporateQuote = useCallback((quoteData) => {
    const newQuote = {
      id: `QTE-${Math.floor(1000 + Math.random() * 9000)}`,
      ...quoteData,
      status: 'Reviewing',
      dateSubmitted: new Date().toLocaleDateString('en-NG'),
    };
    setCorporateQuotes(prev => [newQuote, ...prev]);
    setIsCorporateOpen(false);
    showToast(`Quote request #${newQuote.id} submitted! Sales team will email an official invoice preview.`);
  }, [showToast]);

  return (
    <ShopContext.Provider value={{
      currentUser, setCurrentUser,
      users, setUsers,
      activeView, setActiveView,
      activeCategory, setActiveCategory,
      searchQuery, setSearchQuery,
      activeFilters, setActiveFilters,
      sortBy, setSortBy,

      productsList, updateProductStock,
      cartItems, cartCount, cartSubtotal, discountAmount, deliveryFee, cartTotal,
      isCartOpen, setIsCartOpen,
      isCheckoutOpen, setIsCheckoutOpen,
      isAccountOpen, setIsAccountOpen,
      isCorporateOpen, setIsCorporateOpen,

      currency, setCurrency, convertPrice,
      selectedProduct, setSelectedProduct,

      deliverySlots, selectedSlot, setSelectedSlot,
      selectedZone, setSelectedZone,

      giftingNote, setGiftingNote, isGifting, setIsGifting,
      appliedPromo, setAppliedPromo, promoCodes, setPromoCodes,

      ordersList, updateOrderStatus,
      corporateQuotes, addCorporateQuote,

      addToCart, removeFromCart, updateQuantity,
      orderConfirmed, setOrderConfirmed, placeOrder,
      toastMessage, showToast,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
