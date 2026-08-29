import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Package, 
  Truck, 
  Download
} from 'lucide-react';
import { api } from '../services/api';
import GPSTruckTracker from '../components/GPSTruckTracker';

export default function OrderSuccessPage({ order, onContinueShopping, onViewAllOrders }) {
  if (!order) return null;

  const invoiceUrl = api.getInvoiceDownloadUrl(order.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-in fade-in duration-300 text-slate-900 dark:text-slate-100">
      
      {/* Success Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-800/80 shadow-xl text-center space-y-4 transition-colors">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Consignment Successfully Booked
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Order #{order.order_number}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
            Your bulk agricultural produce has been reserved. Direct farm loading from Vidarbha orchards has been notified.
          </p>
        </div>

        {/* Primary CTA: Download PDF Tax Invoice */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href={invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`Invoice_${order.order_number}.pdf`}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-98"
          >
            <Download className="w-4 h-4" />
            Download Official Tax Invoice (PDF)
          </a>

          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-4 py-3 rounded-2xl transition-all"
          >
            Browse More Produce <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live GPS Truck Tracking Route Module */}
      <GPSTruckTracker order={order} />

      {/* Item Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Consignment Details
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {order.items?.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{item.produce_lot?.commodity_name || 'Produce Item'}</span>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                  {item.quantity_kg} kg @ ₹{item.price_per_kg}/kg
                </span>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white">
                ₹{item.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
          ))}

          <div className="pt-3 space-y-1.5 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Produce Subtotal:</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{order.total_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Mandi Regulatory Cess (1.5%):</span>
              <span>₹{order.mandi_cess_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Freight Logistics:</span>
              <span>₹{order.logistics_cost.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-emerald-800 dark:text-emerald-400">
              <span>Grand Total Paid:</span>
              <span>₹{order.grand_total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
