import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Package, 
  Download, 
  Clock
} from 'lucide-react';

export default function MyOrdersPage({ onOpenAuthModal }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Order History & Invoices</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in to view your past bulk produce consignments and download tax invoices.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">My Consignments & Invoices</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Account: <strong>{user.full_name}</strong> ({user.business_or_farm_name})
          </p>
        </div>
        <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse h-28"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">No Consignment Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Explore fresh Vidarbha harvest lots on the marketplace to book your first wholesale shipment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const dateStr = new Date(ord.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            const invoiceUrl = api.getInvoiceDownloadUrl(ord.id);

            return (
              <div key={ord.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all space-y-4">
                
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      {ord.order_number}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                      Status: {ord.status}
                    </span>
                    <span className="text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                      {ord.payment_status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {ord.items?.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{item.produce_lot?.commodity_name || 'Agro Item'}</span>
                        <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                          {item.quantity_kg} kg @ ₹{item.price_per_kg}/kg
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ₹{item.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Total Paid (incl. APMC Cess & Freight): </span>
                    <strong className="text-sm text-emerald-800 dark:text-emerald-400 font-black">₹{ord.grand_total.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`Invoice_${ord.order_number}.pdf`}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Tax Invoice (PDF)
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
