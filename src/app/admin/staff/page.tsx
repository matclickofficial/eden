"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MoreVertical,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  ShieldAlert,
  Fingerprint,
  Activity,
  Zap,
  Lock,
  ChevronRight,
  Filter,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        applications:applications_assigned_staff_id_fkey(count)
      `)
      .in("role", ["admin", "staff"])
      .order("full_name", { ascending: true });

    if (error) {
      toast.error("Failed to load staff list");
    } else {
      setStaff(data || []);
    }
    setLoading(false);
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      toast.success(`Role updated to ${newRole}`);
      fetchStaff();
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    }
  };

  const filteredStaff = staff.filter(s => 
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-950 font-heading tracking-tight mb-2">Staff Management</h2>
          <p className="text-slate-500 font-medium text-lg leading-snug">Manage administrative staff and system permissions.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-[24px] border border-slate-200 shadow-sm w-full sm:w-80 group focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search for staff members..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-bold p-0 h-8 text-sm"
            />
          </div>
          <Button className="rounded-[20px] bg-slate-950 text-white font-black h-14 px-8 shadow-2xl shadow-slate-200 hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-95">
            <UserPlus className="w-4 h-4 mr-3" /> Add Staff Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredStaff.map((member, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              key={member.id}
            >
              <Card className="border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] rounded-[48px] overflow-hidden group hover:shadow-[0_32px_64px_-16px_rgba(37,99,235,0.08)] transition-all duration-700 p-2 border border-slate-50/50">
                <CardHeader className="pb-8 relative pt-12 px-10 text-center">
                  <div className="absolute top-8 right-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[14px] bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all" />
                      }>
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 rounded-[32px] p-4 border-none bg-slate-950 text-white shadow-[0_48px_96px_-24px_rgba(0,0,0,0.5)]">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pb-4 flex items-center">
                          <Lock className="w-3 h-3 mr-2" /> Access Level
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-[18px] py-3 px-4 font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer" onClick={() => handleUpdateRole(member.id, 'admin')} disabled={member.role === 'admin'}>
                          <ShieldCheck className="w-4 h-4 mr-3 text-blue-400" /> Administrator
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-[18px] py-3 px-4 font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer" onClick={() => handleUpdateRole(member.id, 'staff')} disabled={member.role === 'staff'}>
                          <UserCheck className="w-4 h-4 mr-3 text-indigo-400" /> Staff Member
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5 my-3" />
                        <DropdownMenuItem className="rounded-[18px] py-3 px-4 font-black text-xs uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 focus:text-rose-400 cursor-pointer">
                          <ShieldAlert className="w-4 h-4 mr-3" /> Remove Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-28 h-28 rounded-[40px] flex items-center justify-center text-white font-black text-4xl shadow-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border-4 border-white relative",
                      member.role === 'admin' ? "bg-slate-950" : "bg-blue-600"
                    )}>
                      {member.full_name?.slice(0, 2).toUpperCase()}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                        <Fingerprint className={cn("w-5 h-5", member.role === 'admin' ? "text-slate-950" : "text-blue-600")} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-black text-2xl text-slate-950 tracking-tight mb-2">{member.full_name}</h3>
                      <div className="flex justify-center">
                        <Badge className={cn(
                          "rounded-full px-5 py-1.5 font-black text-[9px] tracking-[0.2em] uppercase border-none shadow-sm",
                          member.role === 'admin' ? "bg-slate-950 text-white" : "bg-blue-500/10 text-blue-700"
                        )}>
                          {member.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5 mr-2" /> : <Users className="w-3.5 h-3.5 mr-2" />}
                          {member.role === 'admin' ? "Level: Administrator" : "Level: Staff"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 px-10">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-5 bg-slate-50/80 rounded-[28px] border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:border-white"
                  >
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                        <p className="text-xs font-bold text-slate-700 truncate max-w-[140px] leading-none">{member.email || "Not Provided"}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </motion.div>
  
                  <div className="grid grid-cols-2 gap-5">
                    <div className="text-center p-6 rounded-[32px] bg-slate-50 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all duration-500">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-2 leading-none">Assigned Cases</p>
                      <p className="text-3xl font-black text-slate-950 leading-none">{member.applications?.[0]?.count || 0}</p>
                    </div>
                    <div className="text-center p-6 rounded-[32px] bg-slate-50 border border-slate-100 group-hover:border-emerald-100 group-hover:bg-emerald-50/30 transition-all duration-500">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-2 leading-none">Status</p>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200"></div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Now</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2 pb-10 px-10">
                  <Button className="w-full font-black text-[10px] uppercase tracking-[0.25em] rounded-[22px] h-14 bg-slate-50 text-slate-950 border border-slate-100 shadow-sm hover:shadow-2xl hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-500 group/btn">
                    View Profile <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredStaff.length === 0 && !loading && (
        <div className="text-center py-32 bg-white rounded-[56px] border border-dashed border-slate-200">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Users className="w-10 h-10 text-slate-200" />
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-2">No Staff Found</h3>
           <p className="text-slate-500 font-medium text-lg">No staff members match your search.</p>
           <Button variant="ghost" className="mt-8 font-black text-blue-600 hover:bg-blue-50 rounded-full" onClick={() => setSearch("")}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}
