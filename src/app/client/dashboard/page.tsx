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



    <div className="space-y-10 max-w-[1400px] mx-auto">
      {/* 1. Symmetrical Top Bar: Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Apply Now",     href: "/client/apply",      icon: FileText,   color: "bg-blue-600",    text: "text-white" },
          { label: "My Status",     href: "/client/status",     icon: Globe,      color: "bg-slate-900",   text: "text-white" },
          { label: "Documents",     href: "/client/documents",  icon: Layers,     color: "bg-white",       text: "text-slate-900" },
          { label: "Payments",      href: "/client/payments",   icon: CreditCard, color: "bg-white",       text: "text-slate-900" },
        ].map((item, i) => (
          <Link key={i} href={item.href}>
            <motion.div
              whileHover={{ y: -5 }}
              className={cn(
                "p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center gap-4 transition-all hover:shadow-xl",
                item.color, item.text
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", 
                item.color === "bg-white" ? "bg-slate-50" : "bg-white/10")}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* 2. Main Symmetrical Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: Application Pulse (Symmetrical 8-cols) */}
        <div className="lg:col-span-8">
          <Card className="rounded-[40px] border-none shadow-sm bg-white overflow-hidden min-h-[500px] flex flex-col">
            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">Application Pulse</CardTitle>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Live Case Tracking</p>
              </div>
              <Link href="/client/status" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <ChevronRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-10 flex-1 flex flex-col justify-center">
              <div className="space-y-10 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
                {mainApp && mainApp.application_timeline?.length > 0 ? (
                  mainApp.application_timeline.map((step: any, i: number) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="flex items-start gap-8 relative z-10"
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-4 border-white shadow-md ${
                        step.status === 'completed' ? "bg-emerald-500" : 
                        step.status === 'active' ? "bg-blue-600 shadow-lg shadow-blue-200" : "bg-slate-100"
                      }`}>
                        {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Clock className={`w-4 h-4 ${step.status === 'active' ? "text-white" : "text-slate-400"}`} />}
                      </div>
                      <div className="flex-1 border-b border-slate-50 pb-6">
                        <div className="flex items-center justify-between">
                          <p className={`font-black text-sm uppercase tracking-tight ${step.status === 'completed' || step.status === 'active' ? "text-slate-900" : "text-slate-400"}`}>
                            {step.stage.replace(/_/g, ' ')}
                          </p>
                          <span className="text-[10px] font-black text-slate-400">{new Date(step.date_reached).toLocaleDateString()}</span>
                        </div>
                        {step.status === 'active' && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ongoing Processing</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
                      <Layers className="w-10 h-10 text-slate-300" />
                    </div>
                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">No Active Records</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Start an application to see your pulse</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Symmetrical Sidebar (4-cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Security Health */}
          <Card className="rounded-[40px] border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">Security Health</CardTitle>
              <Heart className="w-4 h-4 text-rose-500" />
            </CardHeader>
            <CardContent className="px-8 pb-10 space-y-6">
              <div className="p-6 bg-slate-950 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <ShieldCheck className="w-12 h-12" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Global Core v4.2</p>
                <p className="text-sm font-black uppercase tracking-tight mt-1">Status: Operational</p>
                <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-full bg-blue-500" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encryption</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">AES-256</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CDN Link</span>
                  <span className="text-[10px] font-black text-blue-600 uppercase">Verified</span>
                </div>
              </div>

              <Link href="/client/documents" className="block text-center py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Audit Documents
              </Link>
            </CardContent>
          </Card>

          {/* Symmetrical Notices */}
          <Card className="rounded-[40px] border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">Notices</CardTitle>
              <Bell className="w-4 h-4 text-slate-300" />
            </CardHeader>
            <CardContent className="px-8 pb-10 flex flex-col justify-center items-center min-h-[160px] text-center">
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                 <Bot className="w-6 h-6 text-slate-200" />
               </div>
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Inbox is Clean</p>
               <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">We'll notify you of any updates</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

      </div>
    </div>
  );
}
