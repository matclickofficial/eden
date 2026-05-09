"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  CreditCard,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  MoreHorizontal,
  Calendar,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        applications (
          id,
          current_stage,
          jobs (title, country)
        ),
        documents (status),
        payments (status)
      `)
      .eq("role", "client")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch clients");
    } else {
      setClients(data || []);
    }
    setLoading(false);
  }

  const filteredClients = clients.filter(c => 
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getDocumentStatus = (docs: any[]) => {
    if (!docs || docs.length === 0) return { label: 'None', color: 'bg-slate-100 text-slate-500' };
    const pending = docs.some(d => d.status === 'pending');
    const rejected = docs.some(d => d.status === 'rejected' || d.status === 'reupload_required');
    if (rejected) return { label: 'Action Required', color: 'bg-rose-500/10 text-rose-600 border-rose-200' };
    if (pending) return { label: 'Review Needed', color: 'bg-amber-500/10 text-amber-600 border-amber-200' };
    return { label: 'Verified', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
  };

  const getPaymentStatus = (payments: any[]) => {
    if (!payments || payments.length === 0) return { label: 'Unpaid', color: 'bg-slate-100 text-slate-500 border-slate-200' };
    const confirmed = payments.some(p => p.status === 'confirmed');
    const pending = payments.some(p => p.status === 'pending');
    if (confirmed) return { label: 'Paid', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
    if (pending) return { label: 'In Review', color: 'bg-blue-500/10 text-blue-600 border-blue-200' };
    return { label: 'Unpaid', color: 'bg-slate-100 text-slate-500 border-slate-200' };
  };

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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-950 font-heading tracking-tight mb-2">Client Ecosystem</h2>
          <p className="text-slate-500 font-medium text-lg">Orchestrate client relations and application lifecycles.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-[24px] border border-slate-200 shadow-sm w-full sm:w-96 group focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search by identity, phone, email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-bold p-0 h-8 text-sm"
            />
          </div>
          <Button className="rounded-[20px] bg-slate-950 text-white font-black h-14 px-8 shadow-2xl shadow-slate-200 hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-95">
            <Filter className="w-4 h-4 mr-2" /> Segregate
          </Button>
        </div>
      </div>

      <Card className="border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[48px] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-6 px-10 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Biological Info</th>
                  <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Current Objective</th>
                  <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Documentation</th>
                  <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Financials</th>
                  <th className="py-6 px-10 text-right text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {filteredClients.map((client, i) => {
                    const activeApp = client.applications?.[0];
                    const docStatus = getDocumentStatus(client.documents);
                    const payStatus = getPaymentStatus(client.payments);

                    return (
                      <motion.tr 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.03 }}
                        key={client.id} 
                        className="hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer"
                        onClick={() => window.location.href = `/admin/clients/${client.id}`}
                      >
                        <td className="py-8 px-10">
                          <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 rounded-[22px] bg-gradient-to-tr from-slate-100 to-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500 shadow-sm">
                              {client.full_name?.slice(0, 1).toUpperCase() || <User className="w-6 h-6" />}
                            </div>
                            <div>
                              <p className="font-black text-slate-950 text-lg tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{client.full_name}</p>
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center text-[11px] text-slate-500 font-bold uppercase tracking-wider"><Phone className="w-3 h-3 mr-1.5 text-blue-500" /> {client.phone}</span>
                                <span className="flex items-center text-[11px] text-slate-400 font-bold uppercase tracking-wider hidden sm:flex"><Mail className="w-3 h-3 mr-1.5" /> {client.email || 'NO DATA'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-8">
                          {activeApp ? (
                            <div className="space-y-2">
                              <p className="font-black text-slate-900 text-sm tracking-tight">{activeApp.jobs?.title}</p>
                              <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                                <Layers className="w-3 h-3 mr-1.5" /> {activeApp.current_stage.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex items-center text-slate-300 font-bold italic text-xs">
                              <MoreHorizontal className="w-4 h-4 mr-2" /> Awaiting Engagement
                            </div>
                          )}
                        </td>
                        <td className="py-8 px-8">
                          <Badge className={cn("rounded-full border px-4 py-1.5 text-[9px] uppercase tracking-[0.15em] font-black", docStatus.color)}>
                            {docStatus.label}
                          </Badge>
                        </td>
                        <td className="py-8 px-8">
                           <Badge className={cn("rounded-full border px-4 py-1.5 text-[9px] uppercase tracking-[0.15em] font-black", payStatus.color)}>
                            {payStatus.label}
                          </Badge>
                        </td>
                        <td className="py-8 px-10 text-right">
                          <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-12 w-12 rounded-[18px] bg-white border border-slate-200 shadow-sm hover:bg-slate-950 hover:text-white transition-all duration-500 shadow-slate-200/50" 
                              onClick={(e) => { e.stopPropagation(); window.location.href = `/admin/clients/${client.id}` }}
                            >
                              <ArrowUpRight className="w-5 h-5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
