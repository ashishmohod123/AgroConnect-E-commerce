import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('agroconnect_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('agroconnect_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (lot, quantityKg) => {
    const qty = parseFloat(quantityKg);
    const moq = lot.min_order_quantity_kg;
    const finalQty = Math.max(qty, moq);

    setCartItems(prev => {
      const existing = prev.find(item => item.lot.id === lot.id);
      if (existing) {
        return prev.map(item =>
          item.lot.id === lot.id
            ? { ...item, quantityKg: Math.min(item.quantityKg + qty, lot.available_quantity_kg) }
            : item
        );
      }
      return [...prev, { lot, quantityKg: finalQty }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (lotId, newQty) => {
    const qty = parseFloat(newQty);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(lotId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.lot.id === lotId) {
          const clamped = Math.min(qty, item.lot.available_quantity_kg);
          return { ...item, quantityKg: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (lotId) => {
    setCartItems(prev => prev.filter(item => item.lot.id !== lotId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Financial Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.quantityKg * item.lot.price_per_kg), 0);
  const totalWeightKg = cartItems.reduce((acc, item) => acc + item.quantityKg, 0);
  const mandiCess = Math.round(subtotal * 0.015 * 100) / 100; // 1.5% APMC Cess
  const logisticsCost = Math.round(totalWeightKg * 1.5 * 100) / 100; // ₹1.5 per kg freight
  const grandTotal = Math.round((subtotal + mandiCess + logisticsCost) * 100) / 100;
  const itemCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        totalWeightKg,
        mandiCess,
        logisticsCost,
        grandTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
