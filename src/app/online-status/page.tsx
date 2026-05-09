"use client";

import Link from "next/link";
import { useState } from "react";
import { PublicNavbar } from "@/components/shared/public-navbar";
import { PublicFooter } from "@/components/shared/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, CheckCircle2, Clock, AlertCircle, FileText, ShieldCheck, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OnlineStatusPage() {
  const [trackingId, setTrackingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<null | string>(null);
  const categories = [
    "Offer Letter Status",
    "LMIA Approval Status",
    "Work Permit Status",
    "Visa Status",
    "Ticket Status",
    "Fees Status",
    "HICC Card Status"
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handleLookup = () => {
    if (!trackingId) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStatus('pending');
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black">Tracking Portal</Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-secondary tracking-tighter">Check Your Application Status</h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              Select the category and enter your passport number to check your real-time application status.
            </p>
          </div>

          <div className="bg-slate-50 rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-xl shadow-secondary/5">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Select Category</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border",
                        selectedCategory === cat 
                          ? "bg-primary text-white border-primary shadow-lg shadow-red-500/20" 
                          : "bg-white text-slate-500 border-slate-200 hover:border-primary/30"
                      )}
                    >
                      {cat.replace(" Status", "")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Passport Number"
                    className="w-full h-16 bg-white border-2 border-slate-200 rounded-2xl pl-14 pr-6 text-secondary font-bold focus:border-primary focus:ring-0 transition-all outline-none"
                  />
                </div>
                <Button 
                  onClick={handleLookup}
                  disabled={isLoading || !trackingId}
                  className="h-16 px-12 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-bold text-lg transition-all"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Check Status"}
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {status && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50">
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{selectedCategory}</p>
                      <h4 className="text-xl font-black text-secondary">Passport: {trackingId}</h4>
                    </div>
                    <Badge className="bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                      Processing
                    </Badge>
                  </div>

                  <div className="space-y-8">
                    {[
                      { step: "Application Logged", date: "Oct 12, 2023", completed: true },
                      { step: "Verification Initiated", date: "Oct 15, 2023", completed: true },
                      { step: "Under Review", date: "Pending", completed: false, current: true },
                      { step: "Final Decision", date: "-", completed: false }
                    ].map((step, i) => (
                      <div key={i} className="flex items-start space-x-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.completed ? 'bg-emerald-500' : step.current ? 'bg-primary animate-pulse' : 'bg-slate-200'}`}>
                          {step.completed ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <h5 className={`font-bold ${step.completed || step.current ? 'text-secondary' : 'text-slate-400'}`}>{step.step}</h5>
                            <p className="text-xs text-slate-400">{step.date}</p>
                          </div>
                          {step.current && <span className="text-[10px] font-black text-primary uppercase tracking-widest">Active Step</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-4">
                    <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      Your <strong>{selectedCategory}</strong> is currently under active review. The estimated update window is 7-10 business days. Our team will contact you via WhatsApp for any further documentation.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[40px] bg-secondary text-white space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-all" />
              <h3 className="text-2xl font-black tracking-tight relative z-10">Sign in to your account</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed relative z-10">
                Sign in to your Eden Portal to view detailed application notes, upload documents, and communicate directly with your consultant.
              </p>
              <div className="pt-4 relative z-10">
                <Link href="/login">
                  <Button className="w-full h-14 rounded-2xl bg-white text-secondary hover:bg-slate-100 font-black text-xs uppercase tracking-widest">
                    Login to Portal
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-10 rounded-[40px] bg-slate-50 border border-slate-200 space-y-6 group">
              <h3 className="text-2xl font-black text-secondary tracking-tight">Need to make a payment?</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Fees for processing, biometrics, or consultations can be paid securely through your client dashboard.
              </p>
              <div className="pt-4">
                <Link href="/payments">
                  <Button className="w-full h-14 rounded-2xl bg-primary text-white hover:bg-red-700 font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/10">
                    Make a Payment
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "Official Documentation", desc: "Access the latest forms and requirements directly from our resource center." },
              { icon: ShieldCheck, title: "Verified Consulting", desc: "Our RCIC consultants ensure your data is handled with maximum security." },
              { icon: Globe, title: "Global Reach", desc: "Tracking available for all international visa and work permit applications." }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-secondary">{item.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
