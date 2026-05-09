"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { Bell, Search, User, Menu, Cpu, ShieldCheck, Globe, Wifi, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Admin Header */}
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-20 flex items-center justify-between px-10 bg-white/80 backdrop-blur-3xl border-b border-slate-100 shrink-0 z-50 sticky top-0"
        >
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="icon" className="lg:hidden rounded-2xl hover:bg-slate-100">
              <Menu className="w-5 h-5 text-slate-600" />
            </Button>
            
            <div className="hidden md:flex items-center space-x-4 bg-slate-50/50 px-5 py-2.5 rounded-[18px] border border-slate-100 focus-within:ring-4 focus-within:ring-primary/5 transition-all group w-[400px]">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Universal Search..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none font-bold text-slate-600 placeholder:text-slate-400"
              />
              <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                <Command className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden xl:flex items-center space-x-8 mr-6">
              <div className="flex items-center space-x-2.5">
                 <div className="relative">
                    <Wifi className="w-4 h-4 text-emerald-500" />
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-emerald-500 rounded-full"
                    />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Signal: Optimal</span>
              </div>
              <div className="flex items-center space-x-2.5">
                 <Globe className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Region: North America</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-[18px] text-slate-500 relative hover:bg-slate-50 hover:text-primary transition-all border border-transparent hover:border-slate-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-4 ring-white shadow-lg"></span>
              </Button>
              
              <div className="flex items-center space-x-4 pl-6 border-l border-slate-100 ml-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-tight">Administrator</p>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5 flex items-center justify-end">
                    <ShieldCheck className="w-3 h-3 mr-1.5" /> COMMANDER
                  </p>
                </div>
                <div className="w-12 h-12 rounded-[20px] bg-secondary flex items-center justify-center border border-slate-800 shadow-2xl group cursor-pointer hover:scale-105 transition-all duration-500 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent" />
                   <User className="w-6 h-6 text-white relative z-10" />
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Admin Content Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar bg-slate-50/30 relative">
          <div className="max-w-[1700px] mx-auto pb-20">
            {children}
          </div>
          
          {/* Subtle Background Elements */}
          <div className="fixed top-[20%] right-[-10%] w-[500px] h-[500px] bg-red-100/20 rounded-full blur-[120px] -z-10" />
          <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-slate-100/20 rounded-full blur-[100px] -z-10" />
        </main>
      </div>
    </div>
  );
}
