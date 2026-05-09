"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ArrowUpRight,
  Globe,
  Briefcase,
  User,
  Activity,
  Layers,
  ShieldCheck
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

const STAGES = [
  'CONSULTATION',
  'DOCUMENT_COLLECTION',
  'LEGAL_REVIEW',
  'SUBMISSION',
  'BIOMETRICS',
  'WAITING_FOR_DECISION',
  'FINAL_RESULT'
];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const isDemo = typeof document !== 'undefined' && document.cookie.includes('demo-session=true');
    let demoList: any[] = [];
    
    if (isDemo) {
      const { mockDb } = await import("@/lib/mock-db");
      const demoApps = mockDb.getApplications();
      demoList = demoApps.map((a: any) => ({
        id: a.id,
        created_at: new Date().toISOString(),
        current_stage: a.current_stage.toUpperCase().replace(/ /g, '_'),
        profiles: { full_name: "Demo Client", email: "demo@eden.com" },
        jobs: { title: a.service, country: "Canada" }
      }));
    }

    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          profiles:user_id (full_name, email, phone),
          jobs (title, country)
        `)
        .order("created_at", { ascending: false });

      if (error && !isDemo) {
        toast.error("Failed to fetch applications");
      } else {
        setApplications([...demoList, ...(data || [])]);
      }
    } catch (e) {
      if (isDemo) setApplications(demoList);
    } finally {
      setLoading(false);
    }
  }

  const filteredApps = applications.filter(app => 
    app.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    app.jobs?.title?.toLowerCase().includes(search.toLowerCase()) ||
    app.id.includes(search)
  );

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'CONSULTATION': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'DOCUMENT_COLLECTION': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
      case 'LEGAL_REVIEW': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'SUBMISSION': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'FINAL_RESULT': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
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
          <h2 className="text-4xl font-black text-slate-950 font-heading tracking-tight mb-2">Operation Pulse</h2>
          <p className="text-slate-500 font-medium text-lg">Real-time oversight of all global application lifecycles.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-[24px] border border-slate-200 shadow-sm w-full sm:w-96 group focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Locate by case ID, client, or job..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-bold p-0 h-8 text-sm"
            />
          </div>
          <Button className="rounded-[20px] bg-slate-950 text-white font-black h-14 px-8 shadow-2xl shadow-slate-200 hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-95">
            <Filter className="w-4 h-4 mr-2" /> Parameters
          </Button>
        </div>
      </div>

      <Card className="border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[48px] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-6 px-10 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Case Identity</th>
                  <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Client Info</th>
                  <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Lifecycle Stage</th>
                  <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Timeline</th>
                  <th className="py-6 px-10 text-right text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {filteredApps.map((app, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.03 }}
                      key={app.id} 
                      className="hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer"
                      onClick={() => window.location.href = `/admin/${app.id}`}
                    >
                      <td className="py-8 px-10">
                        <div className="flex items-center space-x-5">
                          <div className="w-14 h-14 rounded-[22px] bg-slate-950 flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-black text-slate-950 text-base tracking-tight mb-0.5">{app.jobs?.title || "Custom Case"}</p>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center">
                              <Globe className="w-3 h-3 mr-1.5" /> {app.jobs?.country || "Global"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">{app.profiles?.full_name}</span>
                          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">{app.profiles?.email}</span>
                        </div>
                      </td>
                      <td className="py-8 px-8">
                        <Badge className={cn("rounded-full border px-4 py-1.5 text-[9px] uppercase tracking-[0.15em] font-black", getStageColor(app.current_stage))}>
                          <Activity className="w-3 h-3 mr-1.5" />
                          {app.current_stage.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-8 px-8">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Created</span>
                          <span className="text-[11px] text-slate-400 font-bold flex items-center">
                            <Clock className="w-3 h-3 mr-1.5 text-blue-500" />
                            {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="py-8 px-10 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-12 w-12 rounded-[18px] bg-white border border-slate-200 shadow-sm hover:bg-slate-950 hover:text-white transition-all duration-500 shadow-slate-200/50"
                          onClick={(e) => { e.stopPropagation(); window.location.href = `/admin/${app.id}` }}
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {filteredApps.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-[48px] border border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Layers className="w-10 h-10 text-slate-200" />
           </div>
           <h3 className="text-xl font-black text-slate-900 mb-2">No Records Found</h3>
           <p className="text-slate-500 font-medium">Refine your parameters or check individual client profiles.</p>
        </div>
      )}
    </div>
  );
}
