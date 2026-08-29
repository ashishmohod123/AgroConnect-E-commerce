import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Crown, 
  IndianRupee, 
  Scale, 
  TrendingUp, 
  Users, 
  Download, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [mandiRates, setMandiRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRateId, setEditingRateId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [newTrend, setNewTrend] = useState('UP');
  const [successMsg, setSuccessMsg] = useState('');

  const loadAdminData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [m, rates] = await Promise.all([
        api.getAdminMetrics(),
        api.getMandiRates()
      ]);
      setMetrics(m);
      setMandiRates(rates);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  const handleSaveMandiRate = async (rateId) => {
    try {
      await api.updateAdminMandiRate(rateId, parseFloat(newPrice), newTrend);
      setSuccessMsg(`Mandi rate updated live to Rs ${newPrice}/kg!`);
      setEditingRateId(null);
      setTimeout(() => setSuccessMsg(''), 3000);
      loadAdminData();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <Crown className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Admin Access Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Please log in as <strong>Admin Ashish (Nagpur)</strong> using the top role switcher to access platform controls.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-md">
            <Crown className="w-8 h-8 text-amber-200 fill-amber-200" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-md text-amber-100">
              Super Admin Control Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-0.5">
              Welcome, Ashish Mohod
            </h1>
            <p className="text-xs text-amber-100">
              AgroConnect Central Administration • Nagpur & Vidarbha APMC Corridor
            </p>
          </div>
        </div>

        {/* 1-Click Export CSV */}
        <a
          href={api.getAdminExportCsvUrl()}
          download="AgroConnect_Vidarbha_Trade_Records.csv"
          className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export All Trade Records (CSV)</span>
        </a>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Platform Financial KPIs */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Platform Gross Merchandise Value</span>
              <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{metrics.total_gmv_inr.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Total Trade Turnover</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">APMC Mandi Regulatory Cess (1.5%)</span>
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">₹{metrics.total_mandi_cess_collected_inr.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Remitted to Kalamna APMC</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Volume Traded</span>
              <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.total_volume_kg.toLocaleString('en-IN')} kg</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Agricultural Produce</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Active Community</span>
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.total_farmers} Farmers • {metrics.total_retailers} Retailers</p>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">{metrics.active_lots} Active Batches</p>
          </div>
        </div>
      )}

      {/* Live Mandi Rate Modifier Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Live Mandi Benchmark Rate Controller (Ticker Broadcast)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Admin Ashish can update prevailing modal rates to reflect actual Kalamna & Wardha yard prices in real-time.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">APMC Yard</th>
                <th className="py-3 px-4">Current Modal Price (₹/kg)</th>
                <th className="py-3 px-4">Trend</th>
                <th className="py-3 px-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mandiRates.map((r) => {
                const isEditing = editingRateId === r.id;
                return (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {r.commodity_name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {r.mandi_name}
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-700 dark:text-emerald-400">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.5"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-24 bg-white dark:bg-slate-800 border border-emerald-500 rounded-lg px-2 py-1 text-xs font-bold"
                        />
                      ) : (
                        `₹${r.modal_price_per_kg}/kg (₹${r.modal_price_quintal}/q)`
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <select
                          value={newTrend}
                          onChange={(e) => setNewTrend(e.target.value)}
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold"
                        >
                          <option value="UP">UP</option>
                          <option value="DOWN">DOWN</option>
                          <option value="STABLE">STABLE</option>
                        </select>
                      ) : (
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          r.trend === 'UP' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          r.trend === 'DOWN' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {r.trend}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveMandiRate(r.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 ml-auto"
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingRateId(r.id);
                            setNewPrice(r.modal_price_per_kg);
                            setNewTrend(r.trend);
                          }}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit Rate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
