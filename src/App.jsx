import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import Hero from './components/Hero';
import BrandStatement from './components/BrandStatement';
import ShopSection from './components/ShopSection';
import StoryPage from './components/StoryPage';
import GalleryPage from './components/GalleryPage';
import ContactPage from './components/ContactPage';
import FaqPage from './components/FaqPage';

import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmation from './components/OrderConfirmation';
import AccountDrawer from './components/AccountDrawer';
import CorporateQuoteModal from './components/CorporateQuoteModal';
import Footer from './components/Footer';

function MainContent() {
  const { activeView, toastMessage, selectedProduct } = useShop();

  return (
    <div className="app">
      <AnnouncementBar />
      <Navbar />

      <main>
        {activeView === 'home' && (
          <>
            <Hero />
            <BrandStatement />
            <ShopSection />
          </>
        )}
        {activeView === 'shop' && <ShopSection />}
        {activeView === 'story' && <StoryPage />}
        {activeView === 'gallery' && <GalleryPage />}
        {activeView === 'contact' && <ContactPage />}
        {activeView === 'faq' && <FaqPage />}
      </main>

      <Footer />

      {/* Global Overlays & Modals */}
      <ProductDetailModal key={selectedProduct?.id || 'none'} />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmation />
      <AccountDrawer />
      <CorporateQuoteModal />

      {/* Toast Banner */}
      {toastMessage && (
        <div className="toast-container">
          <span style={{ color: 'var(--gold)' }}>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
