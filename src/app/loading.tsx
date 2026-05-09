"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-[32px] bg-white shadow-2xl flex items-center justify-center border border-slate-100">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-50"></div>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 font-poppins">Loading Portal</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">"Preparing your global journey..."</p>
        </div>
      </div>
    </div>
  );
}
