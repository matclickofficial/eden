"use client";

import { PublicNavbar } from "@/components/shared/public-navbar";
import { PublicFooter } from "@/components/shared/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { UserPlus, ShieldCheck, Globe, CheckCircle2, ArrowRight } from "lucide-react";

export default function ApplyNowPage() {
  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="flex-1 space-y-10">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black">Begin Your Journey</Badge>
                <h1 className="text-5xl md:text-7xl font-heading font-black text-secondary tracking-tighter leading-tight">
                  Join the <br /> <span className="text-primary">Eden Family</span> Today.
                </h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  Start your application process with Canada's most trusted immigration experts. We provide end-to-end support for your Canadian dream.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Personalized Strategy", desc: "Every case is unique. We build a custom plan for your success." },
                  { title: "Direct WhatsApp Communication", desc: "Get real-time updates and support from your dedicated consultant." },
                  { title: "Secure Data Handling", desc: "Your personal information is protected with enterprise-grade security." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 bg-slate-50 rounded-[48px] border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Global Success Rate</p>
                  <p className="text-4xl font-black text-secondary">98.5%</p>
                </div>
                <div className="h-12 w-px bg-slate-200 mx-10" />
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Clients</p>
                  <p className="text-4xl font-black text-secondary">12k+</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-secondary rounded-[48px] p-10 md:p-14 text-white shadow-2xl shadow-secondary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                
                <h2 className="text-3xl font-black mb-10 tracking-tight relative z-10">Create Your Profile</h2>
                
                <form className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">First Name</label>
                      <input type="text" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white focus:border-primary outline-none transition-all" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Last Name</label>
                      <input type="text" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white focus:border-primary outline-none transition-all" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Email Address</label>
                    <input type="email" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white focus:border-primary outline-none transition-all" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Desired Service</label>
                    <select className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white focus:border-primary outline-none transition-all appearance-none">
                      <option className="bg-secondary text-white">Work Permit</option>
                      <option className="bg-secondary text-white">Permanent Residency</option>
                      <option className="bg-secondary text-white">Study Visa</option>
                      <option className="bg-secondary text-white">Family Sponsorship</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Password</label>
                    <input type="password" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white focus:border-primary outline-none transition-all" placeholder="••••••••" />
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-red-700 text-white font-black text-lg transition-all shadow-xl shadow-red-500/20">
                      Create Account <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                  
                  <p className="text-center text-xs text-slate-500 font-medium pt-4">
                    Already have an account? <a href="/login" className="text-primary font-black hover:underline">Sign In</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
