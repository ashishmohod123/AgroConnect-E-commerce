import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Tractor, 
  Plus, 
  Package, 
  TrendingUp, 
  Scale, 
  IndianRupee, 
  Truck, 
  Trash2, 
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function FarmerDashboardPage({ onOpenAuthModal }) {
  const { user, isFarmer } = useAuth();
  const [summary, setSummary] = useState(null);
  const [myLots, setMyLots] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form State for New Batch
  const [formData, setFormData] = useState({
    commodity_name: 'Nagpur Mandarin Oranges (Santra)',
    variety: 'GI-Tagged Export Grade',
    quality_grade: 'Grade A (Export / Premium)',
    total_quantity_kg: 2500,
    min_order_quantity_kg: 50,
    price_per_kg: 45,
    harvest_date: new Date().toISOString().split('T')[0],
    farm_location: user?.location_city ? `${user.location_city} Orchards` : 'Katol, Nagpur Rural',
    description: 'Freshly harvested, hand-picked tree ripened produce with zero chemical polish.',
    image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
  });

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [sumData, lotsData, ordersData] = await Promise.all([
        api.getFarmerSummary(),
        api.getMyFarmerLots(),
        api.getFarmerOrders(),
      ]);
      setSummary(sumData);
      setMyLots(lotsData);
      setIncomingOrders(ordersData);
    } catch (err) {
      console.error('Failed to load farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleCreateLot = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await api.createProduceLot({
        ...formData,
        harvest_date: new Date(formData.harvest_date).toISOString(),
        total_quantity_kg: parseFloat(formData.total_quantity_kg),
        min_order_quantity_kg: parseFloat(formData.min_order_quantity_kg),
        price_per_kg: parseFloat(formData.price_per_kg),
      });
      setFormSuccess('New produce lot listed successfully on the marketplace!');
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess('');
        loadDashboardData();
      }, 1200);
    } catch (err) {
      setFormError(err.message || 'Failed to list batch.');
    }
  };

  const handleDeleteLot = async (lotId) => {
    if (!window.confirm('Are you sure you want to deactivate this produce batch?')) return;
    try {
      await api.deleteProduceLot(lotId);
      loadDashboardData();
    } catch (err) {
      alert(`Deactivation failed: ${err.message}`);
    }
  };

  if (!user || !isFarmer) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
          <Tractor className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Farmer & FPO Portal</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in as a verified farmer or switch your role using the demo switcher above to access batch listings, sales analytics, and order dispatches.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
        >
          Sign In as Farmer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">{user.business_or_farm_name || 'Farmer Portal'}</h1>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                APMC Registered
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Farmer: <strong>{user.full_name}</strong> • 📍 {user.location_city}, Maharashtra
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          List New Harvest Batch
        </button>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Active Lots</span>
              <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.active_listings_count}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Available on Marketplace</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Available Inventory</span>
              <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.available_stock_kg.toLocaleString('en-IN')} kg</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Ready for Dispatch</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Produce Sold</span>
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.total_kg_sold.toLocaleString('en-IN')} kg</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Through AgroConnect</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Realized Revenue</span>
              <IndianRupee className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-800 dark:text-emerald-400">₹{summary.total_earnings_inr.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Direct Bank Settlement</p>
          </div>
        </div>
      )}

      {/* Main Tables Grid: Active Lots + Incoming Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: My Active Lots */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              My Listed Produce Batches ({myLots.length})
            </h3>
          </div>

          {myLots.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 dark:text-slate-400">
              You have no active batches listed. Click "List New Harvest Batch" above to start selling!
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
              {myLots.map((lot) => (
                <div key={lot.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={lot.image_url || 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=200&q=80'}
                      alt={lot.commodity_name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{lot.commodity_name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lot.variety} • <span className="text-emerald-700 dark:text-emerald-400 font-semibold">₹{lot.price_per_kg}/kg</span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Stock: <strong>{lot.available_quantity_kg} kg</strong> / {lot.total_quantity_kg} kg • MOQ: {lot.min_order_quantity_kg} kg
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lot.is_active ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {lot.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleDeleteLot(lot.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Deactivate Batch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Incoming Retailer Orders */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Incoming Wholesale Dispatches ({incomingOrders.length})
            </h3>
          </div>

          {incomingOrders.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 dark:text-slate-400">
              No retail wholesale orders received yet. Once buyers order your produce lots, they will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {incomingOrders.map((ord) => (
                <div key={ord.order_item_id} className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">{ord.order_number}</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ord.commodity_name}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Buyer: <strong>{ord.buyer_name}</strong> ({ord.buyer_business})
                      </p>
                    </div>
                    <span className="text-xs font-black text-emerald-800 dark:text-emerald-400">
                      ₹{ord.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                    <span>Qty: <strong>{ord.quantity_kg} kg</strong> @ ₹{ord.price_per_kg}/kg</span>
                    <span>To: <strong>{ord.destination_city}</strong></span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-md">
                      Status: {ord.order_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal: List New Produce Batch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">List Harvest Produce Batch</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Publish fresh agricultural lots for wholesale buyers</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateLot} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Commodity Name</label>
                  <input
                    type="text"
                    required
                    value={formData.commodity_name}
                    onChange={(e) => setFormData({ ...formData, commodity_name: e.target.value })}
                    placeholder="e.g. Nagpur Mandarin Oranges"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Variety / Strain</label>
                  <input
                    type="text"
                    required
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    placeholder="e.g. GI-Tagged Santra"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Batch (kg)</label>
                  <input
                    type="number"
                    required
                    min="50"
                    value={formData.total_quantity_kg}
                    onChange={(e) => setFormData({ ...formData, total_quantity_kg: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Min. Order (MOQ kg)</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={formData.min_order_quantity_kg}
                    onChange={(e) => setFormData({ ...formData, min_order_quantity_kg: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Rate (₹ per kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.5"
                    value={formData.price_per_kg}
                    onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Quality Grade</label>
                  <select
                    value={formData.quality_grade}
                    onChange={(e) => setFormData({ ...formData, quality_grade: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Grade A (Export / Premium)">Grade A (Export / Premium)</option>
                    <option value="100% Certified Organic">100% Certified Organic</option>
                    <option value="Grade B (Commercial Wholesale)">Grade B (Commercial Wholesale)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Harvest Date</label>
                  <input
                    type="date"
                    required
                    value={formData.harvest_date}
                    onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Farm / Orchard Location</label>
                <input
                  type="text"
                  required
                  value={formData.farm_location}
                  onChange={(e) => setFormData({ ...formData, farm_location: e.target.value })}
                  placeholder="e.g. Katol Orchards, Nagpur Rural"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lot Photo URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all active:scale-98"
                >
                  Publish Batch Listing
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
