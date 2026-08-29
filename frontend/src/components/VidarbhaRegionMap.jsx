import React, { useState } from 'react';
import { 
  MapPin, 
  Truck, 
  Sun, 
  Wind, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation
} from 'lucide-react';

const VIDARBHA_REGIONS = [
  {
    id: 'katol',
    name: 'Katol & Narkhed Belt',
    district: 'Nagpur Rural',
    tag: 'Citrus & Orange Capital',
    signature: 'GI-Tagged Nagpur Santra, Sweet Mosambi, Kagzi Lime',
    distanceKm: 58,
    transitTime: '1.2 hrs FTL',
    weather: '31°C Sunny',
    activeLotsCount: 4,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30'
  },
  {
    id: 'wardha',
    name: 'Wardha & Seloo Cluster',
    district: 'Wardha District',
    tag: 'Organic Spices & Pulses',
    signature: 'Salem 5.8% Curcumin Turmeric, Bold Groundnuts',
    distanceKm: 76,
    transitTime: '1.8 hrs FTL',
    weather: '32°C Clear',
    activeLotsCount: 3,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30'
  },
  {
    id: 'saoner',
    name: 'Saoner & Kalmeshwar',
    district: 'Nagpur District',
    tag: 'Oilseeds & Desi Dal Hub',
    signature: 'JS-335 Yellow Soybeans, Unpolished Fatka Tur Dal',
    distanceKm: 36,
    transitTime: '45 mins FTL',
    weather: '30°C Mild Breeze',
    activeLotsCount: 3,
    color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30'
  },
  {
    id: 'bhiwapur',
    name: 'Bhiwapur & Umred Yard',
    district: 'Nagpur Rural',
    tag: 'Pungent Chilli & Wheat',
    signature: 'Bhiwapur Teja Red Chilli, Sharbati Golden Wheat',
    distanceKm: 65,
    transitTime: '1.4 hrs FTL',
    weather: '33°C Dry Heat',
    activeLotsCount: 2,
    color: 'from-rose-500/20 to-red-500/10 border-rose-500/30'
  },
  {
    id: 'ramtek',
    name: 'Ramtek & Nagbhid Belt',
    district: 'Nagpur / Eastern Vidarbha',
    tag: 'Desi Garlic & Aromatic Rice',
    signature: 'Ramtek High-Allicin Garlic, Chinnor Aromatic Rice',
    distanceKm: 48,
    transitTime: '1.1 hrs FTL',
    weather: '29°C Forest Breeze',
    activeLotsCount: 2,
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30'
  },
  {
    id: 'hinganghat',
    name: 'Hinganghat Cotton Yard',
    district: 'Wardha',
    tag: 'White Gold Cotton Hub',
    signature: 'BT-2 Long-Staple Raw Cotton (29mm+)',
    distanceKm: 110,
    transitTime: '2.2 hrs FTL',
    weather: '33°C Sunny',
    activeLotsCount: 1,
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30'
  }
];

export default function VidarbhaRegionMap({ onFilterRegion }) {
  const [selectedRegion, setSelectedRegion] = useState(VIDARBHA_REGIONS[0]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Interactive Vidarbha Regional Sourcing Map
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct procurement corridors connecting rural Vidarbha tehsils with Nagpur APMC Wholesale Market
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full w-fit">
          <MapPin className="w-3.5 h-3.5" /> Nagpur Zero Mile Central Hub
        </span>
      </div>

      {/* Grid of Regions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VIDARBHA_REGIONS.map((r) => {
          const isSelected = selectedRegion.id === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedRegion(r)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer bg-gradient-to-br ${r.color} ${
                isSelected 
                  ? 'ring-2 ring-emerald-500 shadow-lg scale-[1.02]' 
                  : 'hover:scale-[1.01] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                    {r.district}
                  </span>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {r.name}
                  </h4>
                </div>
                <span className="text-[10px] font-bold bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-full text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                  {r.weather}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-3 line-clamp-2">
                🌾 {r.signature}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="flex items-center gap-1 font-semibold">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {r.transitTime} to Nagpur
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {r.activeLotsCount} Batches Ready
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Region Detailed Dispatch Box */}
      <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Selected Procurement Node:</span>
            <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-black">{selectedRegion.name}</strong>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Distance to Kalamna APMC / Nagpur Terminal: <strong>{selectedRegion.distanceKm} km</strong> • Direct Farm Truck transit: <strong>{selectedRegion.transitTime}</strong>
          </p>
        </div>

        <button
          onClick={() => onFilterRegion(selectedRegion.name.split(' ')[0])}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
        >
          <span>View {selectedRegion.name.split(' ')[0]} Harvest Lots</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
