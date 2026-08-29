import React from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Phone, 
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function GPSTruckTracker({ order }) {
  if (!order) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors text-slate-900 dark:text-slate-100">
      
      {/* Tracker Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Live GPS Consignment Route Tracker
              </h3>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                LIVE GPS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vehicle: <strong>MH-31-CB-8890</strong> (Ashok Leyland 14-Wheeler FTL) • Driver: Sunil Raut
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
          E-Way Bill: <strong>EWB-783921098</strong>
        </span>
      </div>

      {/* Visual Animated Milestone Steps */}
      <div className="relative pt-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          
          {/* Step 1 */}
          <div className="bg-emerald-50 dark:bg-emerald-950/60 p-4 rounded-2xl border border-emerald-300 dark:border-emerald-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">1</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Farm Loading & Batch Seal</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Katol Orchard Checkpoint</p>
            <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 block font-bold">Slip #WB-9082 Verified</span>
          </div>

          {/* Step 2 */}
          <div className="bg-emerald-50 dark:bg-emerald-950/60 p-4 rounded-2xl border border-emerald-300 dark:border-emerald-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">APMC Kalamna Inspection</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">1.5% Regulatory Cess Paid</p>
            <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 block font-bold">Quality Grade Verified</span>
          </div>

          {/* Step 3 */}
          <div className="bg-amber-50 dark:bg-amber-950/60 p-4 rounded-2xl border-2 border-amber-500 shadow-md space-y-1.5 animate-pulse">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">3</span>
              <Truck className="w-4 h-4 text-amber-600 animate-bounce" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">In Transit (Outer Ring Road)</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Speed: 48 km/h • ETA: 45 Mins</p>
            <span className="text-[9px] font-mono text-amber-700 dark:text-amber-400 block font-bold">En Route to {order.destination_city}</span>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5 opacity-60">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-slate-400 text-white flex items-center justify-center text-xs font-bold">4</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Yard Unloading & Signoff</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{order.shipping_address}</p>
            <span className="text-[9px] font-mono text-slate-500 block font-bold">Escrow Settlement Release</span>
          </div>

        </div>
      </div>

      {/* Driver Card & Digital Gate Pass */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Driver contact */}
        <div className="md:col-span-8 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              SR
            </div>
            <div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">Sunil Raut (Commercial FTL Pilot)</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Nagpur Vidarbha Agro Fleet • 4.9 ★ (180+ Trips)</p>
            </div>
          </div>

          <a
            href="tel:+919822019922"
            className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Driver
          </a>
        </div>

        {/* Digital Gate Pass QR */}
        <div className="md:col-span-4 bg-emerald-50/70 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
          <div className="p-1 bg-white rounded-lg border border-emerald-300">
            <QrCode className="w-8 h-8 text-slate-900" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Digital Gate Pass</span>
            <span className="text-xs font-mono font-black text-slate-900 dark:text-white">#PASS-NAGPUR-990</span>
          </div>
        </div>

      </div>

    </div>
  );
}
