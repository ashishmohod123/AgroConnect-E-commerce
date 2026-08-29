import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Scale, 
  Plus, 
  Minus, 
  ShoppingCart,
  Award,
  Sparkles
} from 'lucide-react';

export default function ProduceCard({ lot, onSelectLot }) {
  const { addToCart } = useCart();
  const [selectedQty, setSelectedQty] = useState(lot.min_order_quantity_kg);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleIncrement = () => {
    setSelectedQty(prev => Math.min(prev + 25, lot.available_quantity_kg));
  };

  const handleDecrement = () => {
    setSelectedQty(prev => Math.max(prev - 25, lot.min_order_quantity_kg));
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(lot, selectedQty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const isOrganic = lot.quality_grade?.toLowerCase().includes('organic');
  const isGradeA = lot.quality_grade?.toLowerCase().includes('grade a');

  const harvestDateStr = new Date(lot.harvest_date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });

  return (
    <div 
      onClick={() => onSelectLot(lot)}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Banner & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={lot.image_url || 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80'}
          alt={lot.commodity_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quality Grade Tag */}
        <div className="absolute top-2.5 left-2.5">
          {isOrganic ? (
            <span className="inline-flex items-center gap-1 bg-emerald-600/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" /> Certified Organic
            </span>
          ) : isGradeA ? (
            <span className="inline-flex items-center gap-1 bg-amber-600/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <Award className="w-3 h-3" /> Grade-A Export
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-slate-800/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Commercial Wholesale
            </span>
          )}
        </div>

        {/* Freshness / Harvest Tag */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Calendar className="w-3 h-3 text-emerald-400" />
          Harvested: {harvestDateStr}
        </div>

        {/* Verified Badge */}
        <div className="absolute top-2.5 right-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-emerald-800 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified FPO
        </div>
      </div>

      {/* Lot Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Farm Location */}
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            {lot.farm_location}
          </p>

          {/* Commodity Name & Variety */}
          <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {lot.commodity_name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mb-2">
            {lot.variety}
          </p>

          {/* Stock & MOQ Info */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl text-xs border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-medium">Available Batch</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Scale className="w-3 h-3 text-slate-500" />
                {lot.available_quantity_kg.toLocaleString('en-IN')} kg
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-medium">Min Order (MOQ)</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {lot.min_order_quantity_kg} kg
              </span>
            </div>
          </div>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline justify-between mb-2.5">
            <div>
              <span className="text-2xl font-black text-emerald-800 dark:text-emerald-400">
                ₹{lot.price_per_kg}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium"> / kg</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Est. Batch Cost</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                ₹{(selectedQty * lot.price_per_kg).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Quantity Selector & Add Button */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 overflow-hidden">
              <button
                onClick={handleIncrement}
                disabled={selectedQty >= lot.available_quantity_kg}
                className="px-2 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors order-last"
                title="Increase Qty"
              >
                <Plus className="w-3 h-3" />
              </button>
              <span className="px-2 py-1 min-w-[50px] text-center font-bold text-emerald-800 dark:text-emerald-300">
                {selectedQty} kg
              </span>
              <button
                onClick={handleDecrement}
                disabled={selectedQty <= lot.min_order_quantity_kg}
                className="px-2 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed order-first"
                title="Decrease Qty"
              >
                <Minus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                addedAnimation 
                  ? 'bg-emerald-800 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {addedAnimation ? 'Added!' : 'Add Batch'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
