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
const QUICK_LINKS = [
  { label: "Submit Application", href: "/client/apply", icon: FileText, desc: "Start or continue your application" },
  { label: "Check Status", href: "/client/status", icon: Globe, desc: "Track real-time application status" },
  { label: "Upload Documents", href: "/client/documents", icon: Briefcase, desc: "Submit required paperwork" },
  { label: "Make Payment", href: "/client/payments", icon: CreditCard, desc: "Pay fees securely online" },
];

export default function ClientDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let channel: any;

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Initial Fetch
      const fetchCurrent = async () => {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(profileData);

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

      await fetchCurrent();

      // Realtime Sync Subscription
      channel = supabase
        .channel(`user-sync-${user.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'applications', filter: `client_id=eq.${user.id}` },
          () => fetchCurrent()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'application_timeline' },
          () => fetchCurrent()
        )
        .subscribe();
    };

    fetchData();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real-time Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between p-8 pb-0">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Application Pulse</CardTitle>
              <Link href="/client/status" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest">
                Full Status <ChevronRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {mainApp && mainApp.application_timeline?.length > 0 ? (
                  mainApp.application_timeline.map((step: any, i: number) => (
                    <div key={i} className="flex items-start gap-6 relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${
                        step.status === 'completed' ? "bg-emerald-500" : 
                        step.status === 'active' ? "bg-blue-600" : "bg-slate-100"
                      }`}>
                        {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Clock className={`w-4 h-4 ${step.status === 'active' ? "text-white" : "text-slate-400"}`} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-bold text-sm uppercase tracking-tight ${step.status === 'completed' || step.status === 'active' ? "text-slate-900" : "text-slate-400"}`}>
                            {step.stage.replace(/_/g, ' ')}
                          </p>
                          {step.status === 'active' && (
                            <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">
                          {new Date(step.date_reached).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <Layers className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Waiting for initial processing...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Health & Notices */}
        <div className="lg:col-span-4 space-y-6">
          {/* Health Card */}
          <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Security Health</CardTitle>
              <Heart className="w-4 h-4 text-rose-500" />
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-emerald-900 uppercase tracking-tight">System Status: Optimal</p>
                  <p className="text-[10px] text-emerald-700 font-medium mt-0.5">All global verification endpoints are active.</p>
                </div>
              </div>
              <Link href="/client/documents" className="block text-center py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                Manage Documents
              </Link>
            </CardContent>
          </Card>

          {/* Notices */}
          <Card className="rounded-[32px] border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Notices</CardTitle>
              <Bell className="w-4 h-4 text-slate-300" />
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
               {/* This section is now purely data-driven. Empty state shown by default. */}
               <div className="py-6 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No urgent notices</p>
               </div>
            </CardContent>
          </Card>
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
