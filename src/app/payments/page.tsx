"use client";

import { PublicNavbar } from "@/components/shared/public-navbar";
import { PublicFooter } from "@/components/shared/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ShieldCheck, Lock, Globe, ArrowRight, Zap, Landmark } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentsPage() {
  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black">Secure Checkout</Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-secondary tracking-tighter">Secure Payment Portal</h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              Pay for your consultation, processing fees, or legal services securely using our encrypted payment gateway.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-50 rounded-[48px] p-8 md:p-12 border border-slate-100 shadow-xl shadow-secondary/5">
                <h3 className="text-2xl font-black text-secondary mb-10 flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-primary" />
                  Payment Details
                </h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Full Name</label>
                      <input type="text" className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl px-6 font-bold text-secondary focus:border-primary outline-none transition-all" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Application ID (Optional)</label>
                      <input type="text" className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl px-6 font-bold text-secondary focus:border-primary outline-none transition-all" placeholder="EDN-123456" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Payment For</label>
                    <select className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl px-6 font-bold text-secondary focus:border-primary outline-none transition-all appearance-none">
                      <option>Consultation Fee</option>
                      <option>Processing Fee</option>
                      <option>Legal Representation</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Amount (CAD)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                      <input type="number" className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-6 font-bold text-secondary focus:border-primary outline-none transition-all" placeholder="0.00" />
                    </div>
                  </div>

                  <Button className="w-full h-16 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black text-lg transition-all shadow-xl shadow-secondary/20">
                    Proceed to Payment <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white border-2 border-slate-100 rounded-[40px] flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary mb-2">Encrypted Data</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Your data is encrypted using 256-bit SSL technology, ensuring the highest level of security.</p>
                  </div>
                </div>
                <div className="p-8 bg-white border-2 border-slate-100 rounded-[40px] flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary mb-2">Trusted Gateway</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">We use industry-standard payment processors like Stripe and PayPal for all transactions.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-10 bg-secondary rounded-[48px] text-white space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16" />
                <h3 className="text-2xl font-black tracking-tight relative z-10">Alternative Payment Methods</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed relative z-10">
                  If you prefer not to pay online, we also accept the following methods:
                </p>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Landmark className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Bank Transfer</h4>
                      <p className="text-[10px] text-slate-500">Global SWIFT/IBAN transfers</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Interac e-Transfer</h4>
                      <p className="text-[10px] text-slate-500">Available for Canadian residents</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Western Union</h4>
                      <p className="text-[10px] text-slate-500">Global cash transfers</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full h-14 rounded-xl border-white/20 text-white hover:bg-white/10 font-bold">
                  Request Bank Details
                </Button>
              </div>

              <div className="p-10 bg-slate-50 rounded-[48px] border border-slate-100 space-y-6">
                <h4 className="text-lg font-black text-secondary tracking-tight leading-none uppercase">Need Assistance?</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  If you encounter any issues during the payment process, please contact our billing department immediately.
                </p>
                <div className="pt-4 space-y-3">
                  <p className="text-xs font-bold text-secondary">billing@edenfoodcanada.com</p>
                  <p className="text-xs font-bold text-secondary">+1 (416) 555-0199</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
