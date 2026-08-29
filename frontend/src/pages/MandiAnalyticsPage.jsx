import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calculator, 
  Sparkles, 
  MapPin
} from 'lucide-react';

export default function MandiAnalyticsPage({ onSelectCommodity }) {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interactive Savings Calculator State
  const [calcCommodity, setCalcCommodity] = useState('Nagpur Orange (Santra)');
  const [calcVolumeKg, setCalcVolumeKg] = useState(2500);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getPriceComparison();
        setComparisons(data);
      } catch (err) {
        console.error('Failed to load mandi comparison:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedItem = comparisons.find(c => c.commodity_name === calcCommodity) || comparisons[0];
  const mandiCost = selectedItem ? selectedItem.mandi_modal_price_kg * calcVolumeKg : 0;
  const farmCost = selectedItem ? selectedItem.farm_direct_avg_price_kg * calcVolumeKg : 0;
  const totalSaved = mandiCost - farmCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl text-white p-6 sm:p-10 shadow-xl border border-emerald-800/50">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
            <BarChart3 className="w-3.5 h-3.5" /> APMC Price Intelligence Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Kalamna & Vidarbha <span className="text-emerald-400">Mandi Rate Benchmarks</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time daily modal rates recorded across APMC yards (Nagpur Kalamna, Katol, Wardha, Ramtek, Amravati). 
            Compare traditional middleman costs against AgroConnect direct-from-farm prices.
          </p>
        </div>
      </div>

      {/* Interactive Savings Calculator */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
        <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Direct Procurement Savings Calculator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Calculate how much your retail chain or supermarket saves by bypassing mandi middleman commissions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Controls */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Agricultural Commodity</label>
              <select
                value={calcCommodity}
                onChange={(e) => setCalcCommodity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {comparisons.map((c) => (
                  <option key={c.commodity_name} value={c.commodity_name}>
                    {c.commodity_name} (Mandi: ₹{c.mandi_modal_price_kg}/kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Monthly Procurement Volume:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{calcVolumeKg.toLocaleString('en-IN')} kg</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={calcVolumeKg}
                onChange={(e) => setCalcVolumeKg(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>500 kg (Mini Truck)</span>
                <span>25,000 kg (Multi-Axle FTL)</span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="md:col-span-6 bg-emerald-50/80 dark:bg-emerald-950/40 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-900 dark:text-emerald-300 font-semibold">Estimated Monthly Savings:</span>
              <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                {selectedItem?.savings_percentage || 15}% Discount
              </span>
            </div>

            <p className="text-3xl sm:text-4xl font-black text-emerald-900 dark:text-emerald-200">
              ₹{Math.max(0, totalSaved).toLocaleString('en-IN')}
            </p>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
              <div className="flex justify-between">
                <span>Traditional APMC Cost:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">₹{mandiCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>AgroConnect Direct Cost:</span>
                <span className="font-extrabold text-emerald-800 dark:text-emerald-400">₹{farmCost.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden space-y-4 p-6 transition-colors">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Vidarbha Commodity Price Comparison Index</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Live comparison updated from Kalamna APMC records</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">APMC Benchmark Market</th>
                <th className="py-3 px-4">Mandi Retail (₹/kg)</th>
                <th className="py-3 px-4">Direct Farm Price (₹/kg)</th>
                <th className="py-3 px-4">Net Savings %</th>
                <th className="py-3 px-4">Mandi Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {row.commodity_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    {row.mandi_name}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    ₹{row.mandi_modal_price_kg}
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-700 dark:text-emerald-400">
                    ₹{row.farm_direct_avg_price_kg}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 font-extrabold px-2 py-0.5 rounded-full text-[11px]">
                      <Sparkles className="w-3 h-3" /> Save {row.savings_percentage}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {row.trend === 'UP' && (
                      <span className="inline-flex items-center text-emerald-700 dark:text-emerald-400 font-bold">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" /> Bullish (Up)
                      </span>
                    )}
                    {row.trend === 'DOWN' && (
                      <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-bold">
                        <TrendingDown className="w-3.5 h-3.5 mr-1" /> Bearish (Down)
                      </span>
                    )}
                    {row.trend === 'STABLE' && (
                      <span className="inline-flex items-center text-slate-500 dark:text-slate-400 font-medium">
                        <Minus className="w-3.5 h-3.5 mr-1" /> Stable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
