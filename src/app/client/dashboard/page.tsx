"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  FileText, CreditCard, Clock, CheckCircle2, ArrowRight, Bell,
  TrendingUp, AlertCircle, ChevronRight, Globe, Briefcase, Users, Fingerprint, Scan, Video, Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const STAT_CARDS = [
  { label: "Active Applications", value: "2", icon: FileText, color: "bg-blue-50 text-blue-600", trend: "+1 this month" },
  { label: "Payments Made", value: "3", icon: CreditCard, color: "bg-emerald-50 text-emerald-600", trend: "Last: May 1" },
  { label: "Pending Actions", value: "1", icon: AlertCircle, color: "bg-amber-50 text-amber-600", trend: "Requires upload" },
  { label: "Days Active", value: "47", icon: Clock, color: "bg-purple-50 text-purple-600", trend: "Since Mar 22" },
];

const TIMELINE = [
  { step: "Profile Verified", date: "Mar 22, 2026", done: true },
  { step: "Application Submitted", date: "Apr 3, 2026", done: true },
  { step: "Initial Review In Progress", date: "Ongoing", done: false, active: true },
  { step: "Final Visa Decision", date: "Est. Jun 2026", done: false },
];

const QUICK_LINKS = [
  { label: "Submit Application", href: "/client/apply", icon: FileText, desc: "Start or continue your application" },
  { label: "Check Status", href: "/client/status", icon: Globe, desc: "Track real-time application status" },
  { label: "Upload Documents", href: "/client/documents", icon: Briefcase, desc: "Submit required paperwork" },
  { label: "Make Payment", href: "/client/payments", icon: CreditCard, desc: "Pay fees securely online" },
];

const NOTICES = [
  { type: "action", text: "Please upload your updated bank statement for application processing.", time: "2 days ago" },
  { type: "info", text: "Your visa application is under review by the immigration authority.", time: "5 days ago" },
  { type: "success", text: "Payment of $350 received and confirmed.", time: "1 week ago" },
];

import { mockDb } from "@/lib/mock-db";

export default function ClientDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch Profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      // Fetch Real Applications from DB
      const { data: appsData } = await supabase
        .from("applications")
        .select(`
          *,
          jobs (title, country),
          application_timeline (*)
        `)
        .eq("client_id", user.id)
        .order('created_at', { ascending: false });

      setApps(appsData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const mainApp = apps[0] || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Biometric Alert - Only shows when stage requires it */}
      {mainApp && (mainApp.current_stage === "BIOMETRICS" || mainApp.current_stage === "documents_verified") && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Fingerprint className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6" style={{ alignItems: 'center' }}>
            <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-lg">
                <Scan className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Biometric Verification Required</h3>
                <p className="text-white/80 text-sm mt-1 max-w-md">Your application has reached the security phase. Please complete your digital fingerprint scan to avoid processing delays.</p>
              </div>
            </div>
            <Link 
              href={`/client/biometrics?id=${mainApp.id}`} 
              className="px-8 py-4 rounded-2xl bg-white text-blue-600 font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl whitespace-nowrap"
            >
              Scan Now
            </Link>
          </div>
        </motion.div>
      )}

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden p-8 md:p-10"
        style={{ background: "linear-gradient(135deg, #0A1128 0%, #1a2744 60%, #0A1128 100%)" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D11218]/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -ml-24 -mb-24" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Welcome back</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Hello, {firstName} 👋</h2>
            <p className="text-white/60 font-medium max-w-lg">
              {mainApp ? (
                <>Your <span className="text-blue-400 font-bold">{mainApp.jobs?.title || 'Immigration'}</span> journey is progressing. Current stage: <span className="text-blue-400 font-bold uppercase">{mainApp.current_stage.replace(/_/g, ' ')}</span>.</>
              ) : (
                <>Ready to start your immigration journey? Choose a service and submit your first application today.</>
              )}
            </p>
          </div>
          {!mainApp && (
            <Link href="/client/apply">
              <button className="shrink-0 flex items-center gap-2 bg-[#D11218] hover:bg-red-700 text-white font-black px-7 py-4 rounded-2xl shadow-xl shadow-red-900/30 transition-all hover:scale-105">
                Start Application <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4"><FileText className="w-5 h-5" /></div>
          <p className="text-3xl font-black text-slate-900 mb-1">{apps.length}</p>
          <p className="text-sm font-semibold text-slate-500">Active Cases</p>
        </motion.div>
        {/* Add more stats mapping from real data here */}
      </div>

      {/* Action Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Virtual Interview Prep Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-[24px] bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <Video className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-4 flex-1">
              <h3 className="text-2xl font-black tracking-tight leading-tight">Virtual Interview Room</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Practice your visa interview with our AI officer and get real-time feedback on your performance.
              </p>
              <Link 
                href="/client/interview" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg"
              >
                Start Simulation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Family Management Card */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-500/20 transition-all">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-[24px] bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <div className="space-y-4 flex-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Family Umbrella</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Track status and manage documents for your spouse and children from a single secure dashboard.
              </p>
              <Link 
                href="/client/family" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A1128] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#1a2744] transition-all shadow-lg"
              >
                Manage Dependents <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Timeline */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 text-xl">Application Pulse</h3>
            <Link href="/client/status" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest">
              Full Status <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-8">
            {(mainApp?.timeline || TIMELINE).map((step: any, i: number) => (
              <div key={i} className="flex items-start gap-6">
                <div className={`mt-1 w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  step.done ? "bg-emerald-500 shadow-lg shadow-emerald-100" : step.active ? "bg-blue-600 animate-pulse shadow-lg shadow-blue-100" : "bg-slate-100"
                }`}>
                  {step.done
                    ? <CheckCircle2 className="w-5 h-5 text-white" />
                    : <Clock className="w-5 h-5 text-white" />
                  }
                </div>
                <div className="flex-1 flex items-start justify-between gap-4 pt-1">
                  <div>
                    <p className={`font-black text-base ${step.done || step.active ? "text-slate-900" : "text-slate-400"}`}>
                      {step.step || step.label}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{step.date}</p>
                  </div>
                  {step.active && (
                    <Badge className="bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1">Active</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Document Health + Notices */}
        <div className="space-y-8">
          {/* Document Health Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="font-black text-slate-900 text-lg tracking-tight">Document Health</h3>
               <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div className="space-y-4">
               <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-xs font-black text-amber-900 uppercase tracking-widest">Passport Expiry Risk</p>
                   <p className="text-[11px] text-amber-800 font-medium mt-1 leading-relaxed">Your passport expires in 5 months. Please initiate renewal soon.</p>
                 </div>
               </div>
               <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-xs font-black text-emerald-900 uppercase tracking-widest">Health Checked</p>
                   <p className="text-[11px] text-emerald-800 font-medium mt-1 leading-relaxed">6 documents are verified and within validity periods.</p>
                 </div>
               </div>
            </div>
            <Link href="/client/documents" className="block w-full py-4 text-center bg-slate-50 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0A1128] hover:text-white transition-all">
              Manage Documents
            </Link>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-900 text-lg tracking-tight">Notices</h3>
              <Bell className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {NOTICES.map((n, i) => (
                <div key={i} className={`p-4 rounded-2xl border text-sm ${
                  n.type === "action" ? "bg-amber-50 border-amber-200" :
                  n.type === "success" ? "bg-emerald-50 border-emerald-200" :
                  "bg-blue-50 border-blue-200"
                }`}>
                  <p className={`font-bold leading-snug text-xs ${
                    n.type === "action" ? "text-amber-800" :
                    n.type === "success" ? "text-emerald-800" :
                    "text-blue-800"
                  }`}>{n.text}</p>
                  <p className="text-[10px] mt-2 opacity-60 font-bold uppercase tracking-widest">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="font-black text-slate-900 text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.map((link, i) => (
            <Link key={i} href={link.href}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-[#D11218]/30 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D11218]/10 flex items-center justify-center mb-4 group-hover:bg-[#D11218] transition-colors">
                  <link.icon className="w-5 h-5 text-[#D11218] group-hover:text-white transition-colors" />
                </div>
                <p className="font-bold text-slate-900 text-sm mb-1">{link.label}</p>
                <p className="text-xs text-slate-400">{link.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
