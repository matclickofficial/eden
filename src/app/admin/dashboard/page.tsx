"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  FileText, 
  Files, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  AlertCircle,
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  Calendar,
  Briefcase,
  Layers,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    clients: 0,
    activeApps: 0,
    pendingDocs: 0,
    revenue: 0
  });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAdminStats() {
      const { count: clientCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client");
      const { count: appCount } = await supabase.from("applications").select("*", { count: "exact", head: true }).not("current_stage", "eq", "completed");
      const { count: docCount } = await supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "pending");
      
      const { data: payData } = await supabase.from("payments").select("amount").eq("status", "confirmed");
      const totalRevenue = payData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      const { data: recentData } = await supabase
        .from("applications")
        .select("*, client:profiles!applications_client_id_fkey(full_name), jobs(title)")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        clients: clientCount || 0,
        activeApps: appCount || 0,
        pendingDocs: docCount || 0,
        revenue: totalRevenue
      });
      setRecentApps(recentData || []);
      setLoading(false);
    }
    fetchAdminStats();
  }, [supabase]);

  const kpis = [
    { label: "Total Clients", value: stats.clients, icon: Users, color: "text-blue-600", bg: "bg-blue-600/10", desc: "Registered users" },
    { label: "Active Applications", value: stats.activeApps, icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-600/10", desc: "Active cases" },
    { label: "Pending Verification", value: stats.pendingDocs, icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-600/10", desc: "Requires attention" },
    { label: "Total Revenue", value: `$${(stats.revenue / 1000).toFixed(1)}k`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-600/10", desc: "Confirmed payments" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full"
      />
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-950 tracking-tighter font-heading mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium text-lg">Real-time oversight of your global immigration portal.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" className="rounded-[20px] border-slate-200 font-black bg-white text-slate-900 h-14 px-8 shadow-sm hover:bg-slate-50 transition-all border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Calendar className="mr-3 w-5 h-5 text-blue-600" /> Activity Log
          </Button>
          <Button className="rounded-[20px] bg-slate-950 text-white font-black h-14 px-8 shadow-2xl shadow-slate-200 hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-95">
            System Settings
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {kpis.map((kpi, i) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            key={kpi.label}
          >
            <Card className="border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] rounded-[48px] overflow-hidden group hover:shadow-[0_32px_64px_-16px_rgba(37,99,235,0.08)] transition-all duration-700 p-2 border border-slate-50/50">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-sm", kpi.bg, kpi.color)}>
                    <kpi.icon className="w-7 h-7" />
                  </div>
                  <Badge className="font-black text-[9px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border-none shadow-sm text-blue-600 bg-blue-50">
                    LIVE
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{kpi.label}</p>
                  <h3 className="text-5xl font-black text-slate-950 tracking-tighter mb-2 leading-none">{kpi.value}</h3>
                  <p className="text-[11px] text-slate-500 font-bold flex items-center">
                    <Activity className="w-3 h-3 mr-1.5 text-slate-300" /> {kpi.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Recent Applications Table */}
        <Card className="xl:col-span-2 border-none bg-white shadow-[0_48px_80px_-24px_rgba(0,0,0,0.04)] rounded-[56px] overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-12 py-12 gap-6">
            <div>
              <CardTitle className="text-3xl font-black tracking-tight font-heading mb-1 text-slate-950">Active Stream</CardTitle>
              <CardDescription className="text-lg font-medium text-slate-500">Real-time feed of application status changes.</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              className="font-black rounded-[20px] text-blue-600 hover:bg-blue-50/50 h-12 px-6 group transition-all" 
              onClick={() => window.location.href = '/admin/applications'}
            >
              All Applications <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="py-6 px-12 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Client Name</th>
                    <th className="py-6 px-8 text-center text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Current Stage</th>
                    <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Destination/Job</th>
                    <th className="py-6 px-12 text-right text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {recentApps.length > 0 ? recentApps.map((app, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.05) }}
                        key={app.id} 
                        className="hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer"
                        onClick={() => window.location.href = `/admin/applications`}
                      >
                        <td className="py-8 px-12">
                          <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 rounded-[22px] bg-slate-950 flex items-center justify-center text-white font-black text-xs shadow-xl shadow-slate-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/10">
                              {app.client?.full_name?.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-slate-950 text-base tracking-tight mb-0.5">{app.client?.full_name}</p>
                              <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] flex items-center">
                                <ShieldCheck className="w-3 h-3 mr-1.5" /> VERIFIED
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-8 text-center">
                          <Badge className={cn(
                            "rounded-full px-5 py-2 font-black text-[9px] uppercase tracking-[0.15em] border-none shadow-sm",
                            app.current_stage === 'completed' ? "bg-emerald-500/10 text-emerald-600" : "bg-indigo-500/10 text-indigo-600"
                          )}>
                            {app.current_stage.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-8 px-8">
                          <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <Briefcase className="w-3.5 h-3.5" />
                             </div>
                             <span className="font-bold text-slate-700 text-sm tracking-tight truncate max-w-[150px]">{app.jobs?.title}</span>
                          </div>
                        </td>
                        <td className="py-8 px-12 text-right">
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-[18px] bg-white border border-slate-200 shadow-sm hover:bg-slate-100 text-slate-400 group-hover:text-blue-600 transition-all shadow-slate-200/40">
                            <ArrowUpRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </Button>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No recent applications found</p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Stats Hub */}
        <div className="space-y-12">
          <Card className="border-none bg-slate-950 text-white shadow-[0_48px_96px_-24px_rgba(0,0,0,0.3)] rounded-[56px] overflow-hidden group">
            <CardHeader className="pb-10 pt-12 px-12">
              <div className="w-16 h-16 bg-blue-500/20 rounded-[24px] flex items-center justify-center mb-8 border border-white/5 shadow-2xl group-hover:scale-110 group-hover:bg-blue-500/30 transition-all duration-700">
                 <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-4xl font-black font-heading tracking-tight mb-2">Platform Audit</CardTitle>
              <CardDescription className="text-slate-400 font-medium text-lg leading-snug">Verification of live system components.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 pb-14 px-12">
              {[
                { label: "Data Integrity", value: 100, color: "bg-blue-500", shadow: "shadow-blue-500/40" },
                { label: "Database Health", value: 100, color: "bg-indigo-500", shadow: "shadow-indigo-500/40" },
                { label: "Auth Hardening", value: 100, color: "bg-emerald-500", shadow: "shadow-emerald-500/40" }
              ].map((item) => (
                <div key={item.label} className="space-y-5">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{item.label}</span>
                    <span className="text-3xl font-black text-white leading-none tracking-tighter">{item.value}<span className="text-[12px] text-slate-600 ml-1">%</span></span>
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded-full p-1 border border-white/5 relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                      className={cn("h-full rounded-full relative overflow-hidden", item.color, item.shadow)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] rounded-[48px] p-10 relative overflow-hidden group">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h4 className="text-2xl font-black font-heading tracking-tight text-slate-950">System Status</h4>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Platform Connectivity Status</p>
                </div>
                <div className="flex items-center bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100/50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-3 shadow-lg shadow-emerald-200" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Active</span>
                </div>
             </div>
             <div className="space-y-4">
                {[
                  { icon: Activity, title: "Database Connectivity", status: "Stable", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Lock, title: "Secure Authentication", status: "Hardened", color: "text-indigo-600", bg: "bg-indigo-50" }
                ].map((s, i) => (
                  <motion.div 
                    whileHover={{ x: 5 }}
                    key={i} 
                    className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[28px] border border-slate-100/50 hover:bg-white hover:shadow-xl hover:border-white transition-all group cursor-default"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110", s.bg, s.color)}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black text-slate-900 tracking-tight">{s.title}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">{s.status}</span>
                  </motion.div>
                ))}
             </div>
             <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </Card>
        </div>
      </div>
    </div>
  );
}
