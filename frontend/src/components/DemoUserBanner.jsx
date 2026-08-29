import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, Store, Tractor, Crown } from 'lucide-react';

export default function DemoUserBanner() {
  const { user, switchDemoUser } = useAuth();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-950 text-slate-100 text-xs py-2 px-4 border-b border-emerald-800/40 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Portal Role Switcher:
          </span>
          <span className="hidden sm:inline text-slate-300">
            {user ? (
              <>Active User: <strong className="text-white">{user.full_name}</strong> ({user.role} - {user.location_city})</>
            ) : (
              <>Select your active role to test the platform:</>
            )}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          {/* Admin Ashish */}
          <button
            onClick={() => switchDemoUser('ashish@agroconnect.in')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-extrabold ${
              user?.email === 'ashish@agroconnect.in'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 ring-2 ring-amber-300'
                : 'bg-amber-950/70 hover:bg-amber-900 text-amber-200 border border-amber-600/50'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Admin (ASHISH - Nagpur)
          </button>

          {/* Farmer Ramesh */}
          <button
            onClick={() => switchDemoUser('ramesh@katolfarms.com')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-[11px] font-medium ${
              user?.email === 'ramesh@katolfarms.com'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50'
            }`}
          >
            <Tractor className="w-3 h-3" />
            Farmer (Ramesh, Katol)
          </button>

          {/* Retailer Rajesh */}
          <button
            onClick={() => switchDemoUser('rajesh@nagpurmart.com')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-[11px] font-medium ${
              user?.email === 'rajesh@nagpurmart.com'
                ? 'bg-blue-500 text-white font-bold shadow-sm'
                : 'bg-blue-950/60 hover:bg-blue-900 text-blue-200 border border-blue-800/50'
            }`}
          >
            <Store className="w-3 h-3" />
            Retailer (Rajesh, Nagpur)
          </button>
        </div>
      </div>
    </div>
  );
}
