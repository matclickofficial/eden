"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Shield, Globe, Clock, ChevronRight, MoreVertical, Heart, User, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_FAMILY = [
  { id: 1, name: "Sarah Khan", relation: "Spouse", status: "In Progress", stage: "LMIA Review", service: "Open Work Permit", progress: 65, avatar: "SK" },
  { id: 2, name: "Zayn Khan", relation: "Child", status: "Submitted", stage: "Pending IRCC", service: "Study Permit", progress: 25, avatar: "ZK" },
];

export default function FamilyManagementPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-950 tracking-tight mb-2">Family Umbrella</h2>
          <p className="text-slate-500 font-medium text-lg">Manage and track your family's global migration journey.</p>
        </div>
        <Button 
          onClick={() => setShowAdd(true)}
          className="rounded-2xl bg-[#0A1128] text-white font-black h-14 px-8 shadow-2xl hover:bg-[#1a2744] transition-all hover:scale-[1.02] active:scale-95"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Add Family Member
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Main List */}
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_FAMILY.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {member.avatar}
                  </div>
                  <Badge className="bg-slate-50 text-slate-500 border-none rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-widest">
                    {member.relation}
                  </Badge>
                </div>
                <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-black text-slate-950 tracking-tight">{member.name}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{member.service}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{member.stage}</span>
                    <span>{member.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${member.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
                <button className="w-full mt-8 py-4 rounded-2xl bg-slate-50 text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0A1128] hover:text-white transition-all">
                  View Full Case
                </button>
              </motion.div>
            ))}
          </div>

          <div className="p-10 bg-white rounded-[40px] border border-dashed border-slate-200 text-center space-y-4">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
               <Heart className="w-8 h-8 text-slate-200" />
             </div>
             <div className="max-w-sm mx-auto">
               <h3 className="text-lg font-black text-slate-900">Ensure Family Unity</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed mt-2">
                 Applications for family members are processed together to ensure you can travel and settle in Canada as a unit.
               </p>
             </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-[#0A1128] rounded-[40px] p-8 text-white space-y-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Shield className="w-32 h-32" />
             </div>
             <div className="relative z-10 space-y-6">
               <h3 className="text-xl font-black font-heading leading-tight">Consolidated Management</h3>
               <p className="text-white/60 text-sm leading-relaxed">
                 Manage documents, payments, and status tracking for all dependents from a single interface.
               </p>
               <div className="space-y-4">
                  {[
                    { label: "Active Dependents", val: "2", icon: Users },
                    { label: "Pending Tasks", val: "1", icon: AlertCircle },
                    { label: "Unified Timeline", val: "Synced", icon: Clock },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-white/50">{item.label}</span>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">{item.val}</span>
                    </div>
                  ))}
               </div>
             </div>
           </div>

           <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-black text-slate-900 text-lg">Identity Security</h3>
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <p className="text-xs text-emerald-800 font-bold leading-snug">All family profiles are verified against your primary account.</p>
              </div>
              <div className="space-y-4">
                 {[
                   { name: "John Khan", role: "Primary", status: "Active" },
                   { name: "Sarah Khan", role: "Spouse", status: "Pending" },
                 ].map((u, i) => (
                   <div key={i} className="flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                         <User className="w-4 h-4 text-slate-400" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-900 leading-none">{u.name}</p>
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{u.role}</p>
                       </div>
                     </div>
                     <Badge className="bg-white text-emerald-600 border border-emerald-100 font-black text-[8px] uppercase tracking-widest">
                       {u.status}
                     </Badge>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
