import React from 'react';
import { Sprout, ShieldCheck, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function Footer({ onOpenAuthModal }) {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-white">AgroConnect</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering farmers across Nagpur, Katol, Saoner, Wardha & Vidarbha with direct B2B agricultural market access to urban supermarket chains and food processors.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" /> Central Administration: Nagpur, Maharashtra
            </div>
          </div>

          {/* Key Commodities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Vidarbha Commodities</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-emerald-400 transition-colors">GI-Tagged Nagpur Mandarin Oranges (Santra)</li>
              <li className="hover:text-emerald-400 transition-colors">Vidarbha Organic Yellow Soybeans (JS-335)</li>
              <li className="hover:text-emerald-400 transition-colors">Wardha High-Curcumin Turmeric (Haldi)</li>
              <li className="hover:text-emerald-400 transition-colors">Bhiwapur Sun-Dried Hot Red Chilli</li>
              <li className="hover:text-emerald-400 transition-colors">Vidarbha Desi Fatka Tur Dal</li>
              <li className="hover:text-emerald-400 transition-colors">Ramtek Pungent Garlic (Lasan)</li>
            </ul>
          </div>

          {/* APMC Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">APMC & Quality Assurance</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Kalamna APMC Benchmark Rates
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Electronic Tax Invoicing
              </li>
              <li>1.5% Regulatory Cess Transparency</li>
              <li>Direct Farmer Escrow Settlement</li>
              <li>Batch Digital Weighbridge Verification</li>
            </ul>
          </div>

          {/* Regional Hub */}
          <div className="bg-slate-800/80 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-700/60 text-xs space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" /> Central India Logistics Corridor
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Operating out of Zero Mile, Nagpur with multimodal logistics dispatch connectivity across Maharashtra, Madhya Pradesh, and Telengana borders.
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold pt-1 border-t border-slate-700/60">
              Admin Contact: ashish@agroconnect.in • Nagpur, MH
            </div>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AgroConnect Technologies Ltd. All rights reserved. Registered under Maharashtra APMC Regulations.</p>
          <p className="text-slate-400 font-medium">
            Nagpur • Katol • Saoner • Wardha • Ramtek • Hinganghat
          </p>
        </div>
      </div>
    </footer>
  );
}
