"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar,
  User,
  ArrowLeft,
  Edit3,
  Save,
  MessageSquare,
  AlertCircle,
  Loader2,
  ChevronRight,
  Briefcase,
  ShieldCheck,
  Activity,
  UserCheck,
  History,
  FileText,
  DollarSign,
  Globe,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const stages = [
  'application_submitted',
  'documents_required',
  'documents_verified',
  'lmia_process',
  'offer_letter_issued',
  'visa_file_submitted',
  'visa_approved',
  'ticket_booked',
  'deployment_ready',
  'completed'
];

export default function AdminApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStage, setNewStage] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [id, supabase]);

  async function fetchData() {
    const isDemo = typeof document !== 'undefined' && document.cookie.includes('demo-session=true');

    if (isDemo) {
      const { mockDb } = await import("@/lib/mock-db");
      const apps = mockDb.getApplications();
      const current = apps.find((a: any) => a.id === id || (id as string).includes(a.id.split('-')[1]));
      
      if (current) {
        setApplication({
          id: current.id,
          current_stage: current.current_stage,
          created_at: new Date().toISOString(),
          client: { full_name: "Demo Client", role: "Client", phone: "+1 289 784 0100" },
          jobs: { title: current.service, country: "Canada", category: "Immigration", currency: "CAD", salary_max: 5000 }
        });
        setTimeline(current.timeline.map((t: any, i: number) => ({
          id: i,
          stage: t.step,
          date_reached: t.date === 'Ongoing' ? new Date().toISOString() : t.date,
          admin_note: t.active ? current.note : ""
        })).reverse());
        setNewStage(current.current_stage.toLowerCase().replace(/ /g, '_'));
        setLoading(false);
        return;
      }
    }

    try {
      const { data: appData } = await supabase
        .from("applications")
        .select("*, client:profiles!applications_user_id_fkey(*), jobs(*)")
        .eq("id", id)
        .single();
      
      const { data: timelineData } = await supabase
        .from("application_timeline")
        .select("*")
        .eq("application_id", id)
        .order("date_reached", { ascending: false });

      const { data: staffData } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["admin", "staff"]);

      setApplication(appData);
      setTimeline(timelineData || []);
      setStaff(staffData || []);
      setNewStage(appData?.current_stage || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStage = async () => {
    if (!newStage) return;
    setUpdating(true);

    const isDemo = typeof document !== 'undefined' && document.cookie.includes('demo-session=true');
    
    if (isDemo) {
      const { mockDb } = await import("@/lib/mock-db");
      mockDb.updateApplication(id as string, newStage, adminNote);
      toast.success("Demo: Operational status synchronized!");
      setAdminNote("");
      setUpdating(false);
      // Simulate refetch
      const apps = mockDb.getApplications();
      const current = apps.find((a: any) => a.id === id || (id as string).includes(a.id.split('-')[1]));
      if (current) {
        setApplication({
          ...application,
          current_stage: current.current_stage,
          note: current.note
        });
        setTimeline(current.timeline.map((t: any, i: number) => ({
          id: i,
          stage: t.step,
          date_reached: t.date === 'Ongoing' ? new Date().toISOString() : t.date,
          admin_note: t.active ? current.note : ""
        })).reverse());
      }
      return;
    }

    try {
      const { error: appError } = await supabase
        .from("applications")
        .update({ current_stage: newStage })
        .eq("id", id);
      
      if (appError) throw appError;

      const { error: timelineError } = await supabase
        .from("application_timeline")
        .insert({
          application_id: id,
          stage: newStage,
          status: 'completed',
          admin_note: adminNote
        });
      
      if (timelineError) throw timelineError;

      toast.success("Operational status synchronized!");
      setAdminNote("");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Synchronization failure");
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignStaff = async (staffId: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ assigned_staff_id: staffId })
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Elite consultant assigned!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Assignment failure");
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
  if (!application) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Case Not Located</div>;

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/admin/applications'} 
          className="group rounded-2xl h-12 px-6 bg-white shadow-sm border border-slate-100 hover:bg-slate-950 hover:text-white transition-all duration-500"
        >
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> COMMAND CENTER
        </Button>
        <div className="flex items-center space-x-4">
          <div className="px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-3">CASE ID</span>
            <span className="text-sm font-black text-slate-950 font-heading">#{application.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <Badge className="bg-slate-950 text-white rounded-2xl px-6 py-3 font-black text-[11px] uppercase tracking-[0.2em] border-none shadow-2xl shadow-slate-200">
            <Activity className="w-3 h-3 mr-2 text-blue-400" />
            {application.current_stage.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          {/* Commander Interaction Card */}
          <Card className="border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[40px] overflow-hidden p-1">
            <CardHeader className="pt-8 px-8 pb-4">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black font-heading tracking-tight">Status Orchestration</CardTitle>
                  <CardDescription className="text-slate-400 font-medium">Coordinate the next phase of this migration lifecycle.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <Activity className="w-3 h-3 mr-2" /> Target Stage
                  </label>
                  <Select value={newStage} onValueChange={(val) => setNewStage(val || "")}>
                    <SelectTrigger className="rounded-[20px] h-14 border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold">
                      <SelectValue placeholder="Select Objective" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[24px] border-none bg-slate-950 text-white p-2">
                      {stages.map((s) => (
                        <SelectItem key={s} value={s} className="rounded-xl py-3 font-bold hover:bg-white/10 capitalize">
                          {s.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <UserCheck className="w-3 h-3 mr-2" /> Execution Lead
                  </label>
                  <Select 
                    value={application.assigned_staff_id || ""} 
                    onValueChange={handleAssignStaff}
                  >
                    <SelectTrigger className="rounded-[20px] h-14 border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold">
                      <SelectValue placeholder="Unassigned Elite" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[24px] border-none bg-slate-950 text-white p-2">
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="rounded-xl py-3 font-bold hover:bg-white/10">
                          {s.full_name} <span className="text-[10px] opacity-40 ml-2 uppercase font-black tracking-widest">{s.role}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                  <MessageSquare className="w-3 h-3 mr-2" /> Operational Note <span className="ml-auto text-blue-500 lowercase font-medium tracking-normal">(Visible to Client)</span>
                </label>
                <Textarea 
                  placeholder="Draft strategic overview for the client..."
                  className="rounded-[24px] min-h-[140px] border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium p-6 resize-none"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleUpdateStage} 
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[24px] shadow-2xl shadow-blue-500/20 active:scale-[0.98] transition-all"
                disabled={updating || newStage === application.current_stage}
              >
                {updating ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> SYNCHRONIZING...</> : <><Save className="mr-3 w-5 h-5" /> BROADCAST UPDATE</>}
              </Button>
            </CardContent>
          </Card>

          {/* Chronological Archive */}
          <Card className="border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden">
            <CardHeader className="pt-8 px-8 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black font-heading">Event Timeline</CardTitle>
                  <CardDescription className="text-slate-400 font-medium tracking-tight">Audit of all lifecycle transitions.</CardDescription>
                </div>
                <History className="w-6 h-6 text-slate-200" />
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                <div className="space-y-12 relative">
                  {timeline.map((entry, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={entry.id} 
                      className="flex items-start"
                    >
                      <div className="relative z-10 w-12 h-12 rounded-[18px] bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:border-blue-500 transition-colors">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                      </div>
                      <div className="ml-6 flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-black text-slate-950 text-base uppercase tracking-tight capitalize">{entry.stage.replace(/_/g, ' ')}</h5>
                          <div className="flex items-center bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                             <Calendar className="w-3 h-3 mr-2 text-slate-400" />
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                              {new Date(entry.date_reached).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="bg-slate-50/50 p-5 rounded-[24px] border border-slate-100 relative group overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20" />
                          <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                            "{entry.admin_note || "Status synchronized without additional commentary."}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Intelligence Sidepanels */}
        <div className="space-y-10">
          <Card className="border-none bg-slate-950 text-white shadow-2xl rounded-[40px] overflow-hidden p-1">
            <CardHeader className="pt-8 px-8 pb-4">
              <CardTitle className="text-lg font-black font-heading tracking-tight flex items-center">
                <User className="w-5 h-5 mr-3 text-blue-400" /> Client Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-[24px] bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xl shadow-inner">
                  {application.client?.full_name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-white text-lg tracking-tight leading-none mb-1">{application.client?.full_name}</p>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">{application.client?.role}</p>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-white/5">
                {[
                  { label: "Identity", value: application.client?.cnic || 'PENDING', icon: ShieldCheck },
                  { label: "Passport", value: application.client?.passport_number || 'PENDING', icon: Globe },
                  { label: "Contact", value: application.client?.phone, icon: Phone }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center group">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <item.icon className="w-3.5 h-3.5 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-slate-300">{item.value}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="w-full font-black text-[11px] uppercase tracking-[0.2em] h-14 rounded-[20px] bg-white text-slate-950 hover:bg-white/90 shadow-xl transition-all" 
                onClick={() => window.location.href = `/admin/clients/${application.client_id}`}
              >
                Access Deep Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden p-1">
            <CardHeader className="pt-8 px-8 pb-4">
              <CardTitle className="text-lg font-black font-heading tracking-tight flex items-center">
                <Briefcase className="w-5 h-5 mr-3 text-blue-600" /> Target Objective
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 relative group">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-black text-slate-950 text-base leading-tight tracking-tight">{application.jobs?.title}</h4>
                  <Badge className="bg-blue-600 text-white rounded-full border-none text-[9px] font-black tracking-widest px-3 py-1">{application.jobs?.country}</Badge>
                </div>
                <div className="flex items-center space-x-2 mb-6">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{application.jobs?.category || 'General'}</p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Max Remit</p>
                      <p className="font-black text-slate-950 text-sm leading-none">{application.jobs?.currency} {application.jobs?.salary_max?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
