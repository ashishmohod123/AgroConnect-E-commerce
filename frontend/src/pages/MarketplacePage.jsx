import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProduceCard from '../components/ProduceCard';
import VidarbhaRegionMap from '../components/VidarbhaRegionMap';
import { useLanguage } from '../context/LanguageContext';
import { 
  Filter, 
  Sparkles, 
  Search, 
  Scale, 
  ShieldCheck, 
  ArrowUpDown,
  MapPin
} from 'lucide-react';

export default function MarketplacePage({ onSelectLot, searchQuery, setSearchQuery }) {
  const { t } = useLanguage();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({ commodities: [], grades: [] });
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [maxMoq, setMaxMoq] = useState(500);
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [cats, platformStats] = await Promise.all([
          api.getCategories(),
          api.getPlatformOverview(),
        ]);
        setCategories(cats);
        setStats(platformStats);
      } catch (err) {
        console.error('Failed to load metadata:', err);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function fetchLots() {
      setLoading(true);
      try {
        const data = await api.getProduceLots({
          search: searchQuery,
          commodity: selectedCommodity,
          grade: selectedGrade,
          max_moq: maxMoq < 500 ? maxMoq : undefined,
          sort_by: sortBy,
        });
        setLots(data);
      } catch (err) {
        console.error('Failed to fetch lots:', err);
      } finally {
        setLoading(false);
      }
    }
    const debounceTimer = setTimeout(() => {
      fetchLots();
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCommodity, selectedGrade, maxMoq, sortBy]);

  const clearFilters = () => {
    setSelectedCommodity('');
    setSelectedGrade('');
    setMaxMoq(500);
    setSortBy('newest');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Central Vidarbha Agricultural Network
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Direct Farm Sourcing from <span className="bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">Nagpur & Vidarbha</span> FPOs
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Eliminate commission agents. Procure GI-Tagged Nagpur Oranges, Wardha Organic Turmeric, Bhiwapur Chillies, JS-335 Soybeans, and Desi pulses directly with electronic weighbridge verification.
          </p>

          {/* Quick Metrics */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-800/60">
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-medium">Registered FPOs</span>
                <span className="text-xl font-black text-white">{stats.total_farmers || 6}+ Groups</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-medium">Available Varieties</span>
                <span className="text-xl font-black text-white">{stats.active_lots || 12} Commodities</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-medium">Total Volume Traded</span>
                <span className="text-xl font-black text-emerald-400">{(stats.total_volume_traded_kg || 15400).toLocaleString('en-IN')} kg</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-medium">APMC Cess Guarantee</span>
                <span className="text-xl font-black text-amber-300">100% Tax Compliant</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Vidarbha Sourcing Map Visualizer */}
      <VidarbhaRegionMap 
        onFilterRegion={(regionName) => {
          setSearchQuery(regionName);
          window.scrollTo({ top: 600, behavior: 'smooth' });
        }}
      />

      {/* Main Grid & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 sticky top-24 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Filter Harvest Lots
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
            >
              Reset All
            </button>
          </div>

          {/* Quality Grade */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Quality Grade</label>
            <div className="space-y-1.5 text-xs">
              {['', 'Grade A (Export / Premium)', '100% Certified Organic', 'Grade B (Commercial Wholesale)'].map((grade) => (
                <button
                  key={grade || 'all'}
                  onClick={() => setSelectedGrade(grade)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all font-medium flex items-center justify-between ${
                    selectedGrade === grade
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{grade === '' ? t('allQualityGrades') : grade}</span>
                  {selectedGrade === grade && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Order Quantity (MOQ) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-slate-400" /> {t('minOrderQty')}:
              </span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                {maxMoq === 500 ? 'Any MOQ' : `≤ ${maxMoq} kg`}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="20"
              value={maxMoq}
              onChange={(e) => setMaxMoq(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
              <span>20 kg (Small Trial)</span>
              <span>500+ kg (Full Truckload)</span>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Sort Lots
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Fresh Harvest (Newest First)</option>
              <option value="price_asc">Price: Low to High (₹/kg)</option>
              <option value="price_desc">Price: High to Low (₹/kg)</option>
              <option value="moq_asc">Lowest MOQ First</option>
            </select>
          </div>

          {/* Trust box */}
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/50 text-xs text-emerald-950 dark:text-emerald-200 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> Vidarbha Quality Guarantee
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-normal">
              Direct verification at Kalamna, Katol, and Wardha checkpoints with digital weight scale slips.
            </p>
          </div>

        </div>

        {/* Produce Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Active Count & Filter Pills */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Showing <strong className="text-slate-900 dark:text-white font-bold">{lots.length}</strong> harvest batches in Vidarbha region
            </div>

            {/* Quick Filter Pills */}
            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setSelectedCommodity('')}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                  selectedCommodity === '' 
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                All Produce
              </button>
              {categories.commodities.slice(0, 4).map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCommodity(c)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors whitespace-nowrap ${
                    selectedCommodity === c 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {c.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
                  <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : lots.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">No Matching Harvest Lots Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try clearing your search or filters to view other Vidarbha produce varieties.
              </p>
              <button
                onClick={clearFilters}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {lots.map((lot) => (
                <ProduceCard
                  key={lot.id}
                  lot={lot}
                  onSelectLot={onSelectLot}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
