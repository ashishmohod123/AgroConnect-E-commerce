import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, 
  ShoppingCart, 
  BarChart3, 
  Tractor, 
  Package, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  Search,
  Sun,
  Moon,
  Crown,
  Globe
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenAuthModal, searchQuery, setSearchQuery }) {
  const { user, isFarmer, isRetailer, isAdmin, logout } = useAuth();
  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo */}
          <div 
            onClick={() => setActivePage('marketplace')} 
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                AgroConnect
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 -mt-1">
                Nagpur & Vidarbha B2B
              </span>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <button
              onClick={() => setActivePage('marketplace')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                activePage === 'marketplace' 
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold' 
                  : 'hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('marketplace')}
            </button>

            <button
              onClick={() => setActivePage('mandi')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                activePage === 'mandi' 
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold' 
                  : 'hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t('mandiAnalytics')}
            </button>

            {isFarmer && (
              <button
                onClick={() => setActivePage('farmer-dashboard')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activePage === 'farmer-dashboard' 
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold' 
                    : 'hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Tractor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {t('farmerPortal')}
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActivePage('admin')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors font-bold ${
                  activePage === 'admin' 
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300' 
                    : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-500" />
                Admin Ashish
              </button>
            )}

            {user && (
              <button
                onClick={() => setActivePage('my-orders')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activePage === 'my-orders' 
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold' 
                    : 'hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {t('myOrders')}
              </button>
            )}
          </div>

          {/* Right Action Icons: Language, Theme Toggle, Cart & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg transition-all ${lang === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('mr')}
                className={`px-2 py-1 rounded-lg transition-all ${lang === 'mr' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded-lg transition-all ${lang === 'hi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                हिन्दी
              </button>
            </div>

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-180 duration-200" />
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-xs"
              title="View Consignment Cart"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              {itemCount > 0 && (
                <>
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-100">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {itemCount}
                  </span>
                </>
              )}
            </button>

            {/* User Account / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-full transition-all text-xs font-semibold ${
                    isAdmin 
                      ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs ${
                    isAdmin ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}>
                    {isAdmin ? <Crown className="w-3.5 h-3.5" /> : user.full_name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="block leading-tight font-extrabold">{user.full_name.split(' ')[0]}</span>
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-none">{user.role}</span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800 dark:text-slate-200">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        {isAdmin && <Crown className="w-3.5 h-3.5 text-amber-500 inline" />}
                        {user.full_name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">📍 {user.business_or_farm_name} ({user.location_city})</p>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => { setActivePage('admin'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-amber-700 dark:text-amber-400 font-bold hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        Admin Control Panel
                      </button>
                    )}

                    {isFarmer && (
                      <button
                        onClick={() => { setActivePage('farmer-dashboard'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Tractor className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Farmer Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => { setActivePage('my-orders'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Order History & Invoices
                    </button>

                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <div className="relative w-full mb-3">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-col gap-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <button
                onClick={() => { setActivePage('marketplace'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
              >
                🌾 {t('marketplace')}
              </button>
              <button
                onClick={() => { setActivePage('mandi'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
              >
                📈 {t('mandiAnalytics')}
              </button>
              {isAdmin && (
                <button
                  onClick={() => { setActivePage('admin'); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold"
                >
                  👑 Admin Ashish Control Panel
                </button>
              )}
              {isFarmer && (
                <button
                  onClick={() => { setActivePage('farmer-dashboard'); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  🚜 {t('farmerPortal')}
                </button>
              )}
              {user && (
                <button
                  onClick={() => { setActivePage('my-orders'); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  📦 {t('myOrders')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
