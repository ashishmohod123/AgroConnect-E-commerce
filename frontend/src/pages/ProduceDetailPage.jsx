import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ShieldCheck, 
  Award, 
  Truck, 
  Sparkles,
  Phone,
  Check
} from 'lucide-react';

export default function ProduceDetailPage({ lot, onBack }) {
  const { addToCart } = useCart();
  const [selectedQty, setSelectedQty] = useState(lot.min_order_quantity_kg);
  const [added, setAdded] = useState(false);

  const handleIncrement = () => {
    setSelectedQty(prev => Math.min(prev + 50, lot.available_quantity_kg));
  };

  const handleDecrement = () => {
    setSelectedQty(prev => Math.max(prev - 50, lot.min_order_quantity_kg));
  };

  const handleAddToCart = () => {
    addToCart(lot, selectedQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOrganic = lot.quality_grade?.toLowerCase().includes('organic');
  const isGradeA = lot.quality_grade?.toLowerCase().includes('grade a');

  const harvestDateStr = new Date(lot.harvest_date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const estimatedTotal = selectedQty * lot.price_per_kg;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image & Origin Details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md h-80 sm:h-96">
            <img
              src={lot.image_url || 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80'}
              alt={lot.commodity_name}
              className="w-full h-full object-cover"
            />

            {/* Quality Tag */}
            <div className="absolute top-4 left-4">
              {isOrganic ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> 100% Certified Organic
                </span>
              ) : isGradeA ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  <Award className="w-3.5 h-3.5" /> Grade-A Export Quality
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Commercial Wholesale Grade
                </span>
              )}
            </div>

            {/* Freshness Tag */}
            <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Harvested: {harvestDateStr}
            </div>
          </div>

          {/* Farm & Origin Profile Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black text-sm">
                  {lot.farmer?.full_name ? lot.farmer.full_name.charAt(0) : 'F'}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{lot.farmer?.full_name || 'Vidarbha Farmer / FPO'}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{lot.farmer?.business_or_farm_name || 'Katol Citrus Producers'}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> APMC Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Origin:</strong> {lot.farm_location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Contact:</strong> {lot.farmer?.phone || '+91 98230 11223'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Produce Specifications & Batch Details</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lot.description || 'Graded according to Maharashtra APMC quality parameters. Free from chemical spray residue within safety withholding periods.'}
            </p>
          </div>
        </div>

        {/* Right Column: Pricing & Quantity Selector */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 transition-colors">
            
            {/* Header info */}
            <div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                Lot #{lot.id} • {lot.variety}
              </span>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                {lot.commodity_name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> {lot.farm_location}</span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">In Stock</span>
              </div>
            </div>

            {/* Wholesale Price Tag */}
            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/60 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-emerald-900 dark:text-emerald-300 font-medium block">Direct Wholesale Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-emerald-900 dark:text-emerald-200">₹{lot.price_per_kg}</span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">/ kg</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Save ~15% vs Mandi
                </span>
              </div>
            </div>

            {/* Lot Specifications Table */}
            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Total Harvest Batch:</span>
                <span className="font-bold">{lot.total_quantity_kg.toLocaleString('en-IN')} kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Available Stock:</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{lot.available_quantity_kg.toLocaleString('en-IN')} kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Minimum Order Quantity (MOQ):</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{lot.min_order_quantity_kg} kg</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Dispatch Hub:</span>
                <span className="font-bold">{lot.farm_location}</span>
              </div>
            </div>

            {/* Quantity Selector Slider & Inputs */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex justify-between items-center">
                <span>Select Order Quantity:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">{selectedQty} kg</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm overflow-hidden shrink-0">
                  <button
                    onClick={handleDecrement}
                    disabled={selectedQty <= lot.min_order_quantity_kg}
                    className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={lot.min_order_quantity_kg}
                    max={lot.available_quantity_kg}
                    value={selectedQty}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || lot.min_order_quantity_kg;
                      setSelectedQty(Math.min(Math.max(val, lot.min_order_quantity_kg), lot.available_quantity_kg));
                    }}
                    className="w-20 text-center font-extrabold text-slate-900 dark:text-white bg-transparent focus:outline-none text-sm"
                  />
                  <button
                    onClick={handleIncrement}
                    disabled={selectedQty >= lot.available_quantity_kg}
                    className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">Estimated Subtotal</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <input
                type="range"
                min={lot.min_order_quantity_kg}
                max={lot.available_quantity_kg}
                step="25"
                value={selectedQty}
                onChange={(e) => setSelectedQty(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 ${
                added 
                  ? 'bg-emerald-800 text-white shadow-emerald-800/30' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> Added to Consignment!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Add {selectedQty} kg to Consignment
                </>
              )}
            </button>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Direct FTL Dispatch
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Weighbridge Certified
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
