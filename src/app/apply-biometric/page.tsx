"use client";

import { PublicNavbar } from "@/components/shared/public-navbar";
import { PublicFooter } from "@/components/shared/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Calendar, MapPin, ClipboardList, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ApplyBiometricPage() {
  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20 mb-24">
            <div className="flex-1 space-y-8">
              <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black">Requirements</Badge>
              <h1 className="text-4xl md:text-6xl font-heading font-black text-secondary tracking-tighter leading-tight">Biometric Collection <br /> Made Simple.</h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Most Canadian visa applicants are required to provide fingerprints and a photo. We guide you through the appointment booking and preparation process.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="h-14 px-8 rounded-xl bg-primary hover:bg-red-700 font-bold">Book Appointment</Button>
                <Button variant="outline" className="h-14 px-8 rounded-xl border-slate-200 text-secondary font-bold">Download Checklist</Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[64px] blur-3xl -rotate-6" />
              <div className="relative bg-white border border-slate-100 p-10 rounded-[64px] shadow-2xl">
                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-8">
                  <Fingerprint className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">1</div>
                    <span className="font-bold text-secondary">Receive BIL (Biometric Instruction Letter)</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">2</div>
                    <span className="font-bold text-secondary">Find nearest VAC (Visa Application Centre)</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-secondary text-[10px] font-bold">3</div>
                    <span className="font-bold text-slate-400">Attend your appointment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
            {[
              { icon: Calendar, title: "Booking", desc: "We help you secure the earliest possible appointment slot at your nearest VFS Global centre." },
              { icon: ClipboardList, title: "Documentation", desc: "Bring your BIL, passport, and appointment confirmation. Our checklist ensures you're ready." },
              { icon: ShieldCheck, title: "Secure Processing", desc: "Your biometrics are handled securely and transmitted directly to IRCC systems." }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-[48px] border border-slate-100 hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-black text-secondary mb-4">{item.title}</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <section className="bg-secondary rounded-[64px] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tighter leading-tight">Need help finding a center?</h2>
                <p className="text-slate-400 font-medium leading-relaxed">
                  There are over 160 Visa Application Centres worldwide. We can help you locate the one that's most convenient for you and handle the scheduling.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-white font-bold">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Global Coverage (160+ Locations)</span>
                  </div>
                  <div className="flex items-center space-x-4 text-white font-bold">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    <span>24/7 Support for Booking Issues</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[48px] p-10 space-y-8">
                <h3 className="text-2xl font-bold text-white">Find Your Nearest VAC</h3>
                <div className="space-y-4">
                  <select className="w-full h-14 bg-white/5 border border-white/20 rounded-xl px-6 text-white font-medium focus:ring-1 focus:ring-primary outline-none appearance-none">
                    <option className="bg-secondary">Select Country</option>
                    <option className="bg-secondary">Pakistan</option>
                    <option className="bg-secondary">India</option>
                    <option className="bg-secondary">United Kingdom</option>
                  </select>
                  <Button className="w-full h-14 rounded-xl bg-primary hover:bg-red-700 font-bold">Search Locations</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
