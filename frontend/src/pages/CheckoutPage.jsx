import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Building, 
  ArrowLeft, 
  Lock, 
  AlertCircle,
  QrCode,
  Sparkles
} from 'lucide-react';

export default function CheckoutPage({ onOrderCompleted, onBackToMarketplace, onOpenAuthModal }) {
  const { user } = useAuth();
  const { cartItems, subtotal, totalWeightKg, mandiCess, logisticsCost, grandTotal, clearCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState(
    user?.role === 'RETAILER' ? 'Shop 14-16, Grain Market Complex, Itwari' : 'Wholesale Distribution Center, MIDC Hingna Road'
  );
  const [destinationCity, setDestinationCity] = useState(user?.location_city || 'Nagpur');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 93710 99887');
  const [deliveryMethod, setDeliveryMethod] = useState('DIRECT_FTL');
  const [notes, setNotes] = useState('Direct farm dispatch preferred. Call consignee upon arrival at Kalamna ring road.');

  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Your Consignment is Empty</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Add produce lots from the marketplace before proceeding to checkout.
        </p>
        <button
          onClick={onBackToMarketplace}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const handleInitiatePayment = (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuthModal();
      return;
    }
    setErrorMsg('');
    setShowRazorpayModal(true);
  };

  const handleCompleteSimulatedPayment = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          produce_lot_id: item.lot.id,
          quantity_kg: item.quantityKg,
        })),
        shipping_address: shippingAddress,
        destination_city: destinationCity,
        payment_method: 'Razorpay (UPI / NetBanking)',
        payment_id: `pay_ashish_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        notes: `${deliveryMethod === 'DIRECT_FTL' ? '[Direct FTL Truck] ' : '[APMC Cross-Dock] '}${notes}`,
      };

      const createdOrder = await api.placeOrder(orderPayload);
      clearCart();
      setShowRazorpayModal(false);
      onOrderCompleted(createdOrder);
    } catch (err) {
      setErrorMsg(err.message || 'Payment simulation failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      <button
        onClick={onBackToMarketplace}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </button>

      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">B2B Consignment Checkout</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nagpur & Vidarbha Agricultural Trade Terminal
          </p>
        </div>
        <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> APMC Compliant
        </span>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleInitiatePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Consignee Form */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Consignee (Buyer) Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Buyer Contact</label>
                <input
                  type="text"
                  disabled
                  value={user?.full_name || 'Rajesh Gupta (Demo Retailer)'}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Firm Name</label>
                <input
                  type="text"
                  disabled
                  value={user?.business_or_farm_name || 'Nagpur Central Supermarkets Pvt Ltd'}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Delivery Warehouse / Unloading Yard Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street address, APMC Yard, or Retail Warehouse"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Destination City</label>
                <input
                  type="text"
                  required
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gate / Logistics Contact Phone</label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Transport Mode */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Regional Freight & Dispatch Mode
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div 
                onClick={() => setDeliveryMethod('DIRECT_FTL')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  deliveryMethod === 'DIRECT_FTL'
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                  <span>Direct Farm Truck (FTL)</span>
                  <span className="text-emerald-700 dark:text-emerald-400">₹1.5 / kg</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Direct loading at Katol / Wardha orchard straight to your retail dock. Zero intermediate handling.
                </p>
              </div>

              <div 
                onClick={() => setDeliveryMethod('APMC_HUB')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  deliveryMethod === 'APMC_HUB'
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                  <span>Kalamna APMC Yard Pickup</span>
                  <span className="text-emerald-700 dark:text-emerald-400">Self-Pickup</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Consignment cross-docked at Kalamna Mandi logistics hub. Buyer arranges internal vehicle.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 transition-colors">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Consignment Summary ({cartItems.length} {cartItems.length === 1 ? 'Lot' : 'Lots'})
            </h3>

            {/* Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-slate-800">
              {cartItems.map((item) => (
                <div key={item.lot.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.lot.commodity_name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.quantityKg} kg @ ₹{item.lot.price_per_kg}/kg
                    </p>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    ₹{(item.quantityKg * item.lot.price_per_kg).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Total Consignment Weight:</span>
                <span className="font-bold text-slate-900 dark:text-white">{totalWeightKg.toLocaleString('en-IN')} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Produce Subtotal:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Mandi Regulatory Cess (1.5% APMC):</span>
                <span>₹{mandiCess.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Freight Logistics:</span>
                <span>₹{logisticsCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-slate-900 dark:text-white">
                <span className="font-extrabold text-sm">Payable Grand Total:</span>
                <span className="font-black text-xl text-emerald-800 dark:text-emerald-400">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Razorpay Payment</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>256-Bit Escrow Encrypted Transaction</span>
            </div>

          </div>
        </div>

      </form>

      {/* Razorpay Simulation Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black text-sm">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-sm">Razorpay Secure Checkout</h4>
                  <p className="text-[10px] text-blue-200">AgroConnect B2B Gateway (Test Mode)</p>
                </div>
              </div>
              <span className="bg-blue-400/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-400/30">
                SANDBOX
              </span>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-xs text-slate-900 dark:text-slate-100">
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Amount Payable</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Consignment: {totalWeightKg} kg Vidarbha Produce</p>
              </div>

              {/* UPI QR Simulation */}
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3.5">
                <div className="w-14 h-14 bg-white rounded-xl p-1.5 border border-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs">Instant UPI / NetBanking Simulation</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Click the button below to authorize simulated payment and generate your official PDF Tax Invoice.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCompleteSimulatedPayment}
                  disabled={isProcessing}
                  className="w-full bg-[#0c2340] hover:bg-[#14325c] text-white font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processing Escrow Authorization...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Simulate Successful Payment (₹{grandTotal.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowRazorpayModal(false)}
                  disabled={isProcessing}
                  className="w-full py-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-semibold text-center"
                >
                  Cancel & Return
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
