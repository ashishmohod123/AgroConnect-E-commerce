import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import DemoUserBanner from './components/DemoUserBanner';
import MandiTicker from './components/MandiTicker';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import KisanAIChatbot from './components/KisanAIChatbot';
import AdminDashboard from './components/AdminDashboard';

import MarketplacePage from './pages/MarketplacePage';
import ProduceDetailPage from './pages/ProduceDetailPage';
import FarmerDashboardPage from './pages/FarmerDashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MandiAnalyticsPage from './pages/MandiAnalyticsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AuthModal from './pages/AuthModal';

function AppContent() {
  const [activePage, setActivePage] = useState('marketplace');
  const [selectedLot, setSelectedLot] = useState(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectLot = (lot) => {
    setSelectedLot(lot);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (order) => {
    setLastCompletedOrder(order);
    setActivePage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Top Demo Banner with Admin Ashish */}
      <DemoUserBanner />

      {/* Live APMC Market Rate Ticker */}
      <MandiTicker />

      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content */}
      <main className="flex-1">
        {activePage === 'marketplace' && (
          <MarketplacePage
            onSelectLot={handleSelectLot}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activePage === 'detail' && selectedLot && (
          <ProduceDetailPage
            lot={selectedLot}
            onBack={() => setActivePage('marketplace')}
          />
        )}

        {activePage === 'farmer-dashboard' && (
          <FarmerDashboardPage
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage
            onOrderCompleted={handleOrderCompleted}
            onBackToMarketplace={() => setActivePage('marketplace')}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activePage === 'order-success' && (
          <OrderSuccessPage
            order={lastCompletedOrder}
            onContinueShopping={() => setActivePage('marketplace')}
            onViewAllOrders={() => setActivePage('my-orders')}
          />
        )}

        {activePage === 'mandi' && (
          <MandiAnalyticsPage
            onSelectCommodity={(commName) => {
              setSearchQuery(commName);
              setActivePage('marketplace');
            }}
          />
        )}

        {activePage === 'my-orders' && (
          <MyOrdersPage
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSelectOrder={(ord) => {
              setLastCompletedOrder(ord);
              setActivePage('order-success');
            }}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => {
          setActivePage('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Floating Kisan AI Assistant Chatbot */}
      <KisanAIChatbot />

      {/* Footer */}
      <Footer onOpenAuthModal={() => setIsAuthModalOpen(true)} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
