import React from 'react';
import { useCart } from '../context/CartContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Info,
  Scale
} from 'lucide-react';

export default function CartDrawer({ onProceedToCheckout }) {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    totalWeightKg, 
    mandiCess, 
    logisticsCost, 
    grandTotal 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)} 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300 text-slate-900 dark:text-slate-100">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base">Consignment Cart</h2>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                {cartItems.length} {cartItems.length === 1 ? 'Lot' : 'Lots'}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">Your Consignment is Empty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-4">
                  Browse fresh harvest lots from Nagpur and Vidarbha farmers to build your wholesale order.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const isBelowMoq = item.quantityKg < item.lot.min_order_quantity_kg;
                return (
                  <div key={item.lot.id} className="pt-3 first:pt-0 flex gap-3 items-start">
                    <img
                      src={item.lot.image_url || 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=400&q=80'}
                      alt={item.lot.commodity_name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.lot.commodity_name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            📍 {item.lot.farm_location}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.lot.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.lot.id, item.quantityKg - 25)}
                            className="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
                            {item.quantityKg} kg
                          </span>
                          <button
                            onClick={() => updateQuantity(item.lot.id, item.quantityKg + 25)}
                            className="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">@ ₹{item.lot.price_per_kg}/kg</span>
                          <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400">
                            ₹{(item.quantityKg * item.lot.price_per_kg).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* MOQ Warning */}
                      {isBelowMoq && (
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 rounded px-1.5 py-0.5 mt-1 font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3" /> MOQ is {item.lot.min_order_quantity_kg} kg
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Calculations */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 space-y-3">
              
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    Total Consignment Weight:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{totalWeightKg.toLocaleString('en-IN')} kg</span>
                </div>

                <div className="flex justify-between">
                  <span>Produce Subtotal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    Mandi Regulatory Cess (1.5%):
                    <Info className="w-3 h-3" />
                  </span>
                  <span>₹{mandiCess.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    Logistics Freight:
                  </span>
                  <span>₹{logisticsCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-slate-900 dark:text-white">
                  <span className="font-extrabold text-sm">Payable Grand Total:</span>
                  <span className="font-black text-lg text-emerald-800 dark:text-emerald-400">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to B2B Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Escrow Protected
                </span>
                <button
                  onClick={clearCart}
                  className="hover:text-rose-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
