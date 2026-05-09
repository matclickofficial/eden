"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Briefcase, 
  Files, 
  CreditCard, 
  MessageSquare, 
  UserPlus, 
  PieChart, 
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  LayoutDashboard,
  ClipboardList,
  Command,
  Activity,
  Layers,
  ArrowRight,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Client Registry", href: "/admin/clients", icon: Users },
  { label: "Application Pipeline", href: "/admin/applications", icon: ClipboardList },
  { label: "Job Openings", href: "/admin/jobs", icon: Layers },
  { label: "Document Verification", href: "/admin/documents", icon: Files },
  { label: "Payment Records", href: "/admin/payments", icon: CreditCard },
  { label: "Staff Management", href: "/admin/staff", icon: UserPlus },
  { label: "Client Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Interview Config", href: "/admin/settings/interview", icon: Settings },
  { label: "System Reports", href: "/admin/reports", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full bg-[#0A1128] text-slate-400 w-72 lg:w-80 border-r border-white/[0.03] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(209,18,24,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-600/[0.02] to-transparent pointer-events-none" />
      
      {/* Brand Section */}
      <div className="pt-12 pb-10 px-10 relative z-10">
        <Link href="/admin/dashboard" className="flex items-center space-x-4 group">
          <div className="w-12 h-12 bg-slate-950 rounded-[18px] flex items-center justify-center border border-white/10 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 to-transparent opacity-50" />
             <Globe className="text-white w-6 h-6 relative z-10" />
          </div>
          <div className="overflow-hidden">
            <span className="font-heading font-black text-2xl text-white block tracking-tighter leading-none mb-1">EDEN</span>
            <div className="flex items-center space-x-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/20" />
               <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black">Admin Panel</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar relative z-10 py-6">
        <div className="px-4 mb-6">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.35em]">Main Menu</p>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-5 py-4 rounded-[22px] transition-all duration-500 relative",
                isActive 
                  ? "bg-white/5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/[0.05]" 
                  : "hover:bg-white/[0.02] hover:text-slate-200"
              )}
            >
              <div className="flex items-center">
                <item.icon className={cn(
                  "w-5 h-5 mr-4 transition-all duration-700", 
                  isActive ? "text-primary scale-110 rotate-3" : "text-slate-600 group-hover:text-slate-400 group-hover:scale-110"
                )} />
                <span className={cn(
                  "font-bold text-[13px] tracking-tight transition-all duration-500",
                  isActive ? "text-white" : "text-slate-500"
                )}>{item.label}</span>
              </div>
              
              <AnimatePresence>
                {isActive ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_15px_rgba(209,18,24,0.8)]" 
                  />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                )}
              </AnimatePresence>
              
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-[2px_0_15px_rgba(209,18,24,0.5)]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile Section */}
      <div className="p-8 mt-auto relative z-10 border-t border-white/[0.03]">
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[32px] p-6 border border-white/[0.03] mb-8 group/card hover:bg-white/[0.04] transition-all duration-500 cursor-default">
          <div className="flex items-center space-x-4 mb-1">
            <div className="w-11 h-11 rounded-[16px] bg-slate-900 border border-white/5 flex items-center justify-center text-white font-black text-xs shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent" />
               <Activity className="w-5 h-5 relative z-10 text-primary group-hover/card:animate-pulse" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-black text-white truncate font-heading leading-tight tracking-tight">System Status</p>
              <p className="text-[9px] text-slate-500 truncate font-black uppercase tracking-widest mt-1">Administrator</p>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "88%" }}
               transition={{ duration: 2, ease: "easeOut" }}
               className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(209,18,24,0.5)]"
             />
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-[20px] px-6 h-14 transition-all group border border-transparent hover:border-rose-500/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
          <span className="font-black text-[11px] uppercase tracking-[0.2em]">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
