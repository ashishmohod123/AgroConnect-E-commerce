import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

export default function MandiTicker() {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    async function loadRates() {
      try {
        const data = await api.getMandiRates();
        setRates(data);
      } catch (err) {
        console.error('Failed to load mandi rates:', err);
      }
    }
    loadRates();
  }, []);

  if (!rates || rates.length === 0) return null;

  // Duplicate list to make infinite marquee seamless
  const tickerItems = [...rates, ...rates];

  return (
    <div className="bg-emerald-900 text-emerald-100 py-1.5 px-4 overflow-hidden border-b border-emerald-800 text-xs flex items-center">
      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-300 pr-4 shrink-0 border-r border-emerald-700/60 z-10 bg-emerald-900">
        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>Live APMC Mandi Rates:</span>
      </div>

      <div className="overflow-hidden relative w-full">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 pl-4">
          {tickerItems.map((rate, idx) => (
            <div key={idx} className="inline-flex items-center gap-2">
              <span className="font-medium text-slate-200">{rate.commodity_name}</span>
              <span className="text-emerald-400 font-semibold">₹{rate.modal_price_per_kg}/kg</span>
              <span className="text-[10px] text-emerald-200/70">({rate.mandi_name.split(',')[0]})</span>
              
              {rate.trend === 'UP' && (
                <span className="inline-flex items-center text-emerald-300 font-bold">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +2.4%
                </span>
              )}
              {rate.trend === 'DOWN' && (
                <span className="inline-flex items-center text-rose-300 font-bold">
                  <TrendingDown className="w-3 h-3 mr-0.5" /> -1.8%
                </span>
              )}
              {rate.trend === 'STABLE' && (
                <span className="inline-flex items-center text-slate-300">
                  <Minus className="w-3 h-3 mr-0.5" /> 0%
                </span>
              )}
              <span className="text-emerald-700">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
