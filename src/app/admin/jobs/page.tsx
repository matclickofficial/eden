"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin, 
  DollarSign, 
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Building2,
  Clock,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    category: "",
    job_type: "full-time",
    salary_min: "",
    salary_max: "",
    currency: "PKR",
    lmia_status: "approved",
    is_active: true,
    requirements: ""
  });

  const supabase = createClient();

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Cloud registry sync failed");
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  }

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        salary_min: formData.salary_min ? Number(formData.salary_min) : null,
        salary_max: formData.salary_max ? Number(formData.salary_max) : null,
        requirements: formData.requirements.split("\n").filter(r => r.trim() !== "")
      };

      let error;
      if (editingJob) {
        ({ error } = await supabase.from("jobs").update(payload).eq("id", editingJob.id));
      } else {
        ({ error } = await supabase.from("jobs").insert(payload));
      }

      if (error) throw error;

      toast.success(editingJob ? "Job updated successfully" : "Job posted successfully");
      setIsFormOpen(false);
      setEditingJob(null);
      resetForm();
      fetchJobs();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      country: "",
      category: "",
      job_type: "full-time",
      salary_min: "",
      salary_max: "",
      currency: "PKR",
      lmia_status: "approved",
      is_active: true,
      requirements: ""
    });
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setFormData({
      ...job,
      salary_min: job.salary_min?.toString() || "",
      salary_max: job.salary_max?.toString() || "",
       requirements: (job.requirements || []).join("\n")
    });
    setIsFormOpen(true);
  };

  const toggleJobStatus = async (job: any) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ is_active: !job.is_active })
        .eq("id", job.id);
      
      if (error) throw error;
      toast.success(`Job ${!job.is_active ? 'published' : 'unpublished'}`);
      fetchJobs();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.country.toLowerCase().includes(search.toLowerCase())
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
          <h2 className="text-4xl font-black text-slate-950 font-heading tracking-tight mb-2">Job Openings</h2>
          <p className="text-slate-500 font-medium text-lg leading-snug">Manage and create international job listings for potential candidates.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-[24px] border border-slate-200 shadow-sm w-full sm:w-80 group focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search job titles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-bold p-0 h-8 text-sm"
            />
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger render={
              <Button onClick={() => { resetForm(); setEditingJob(null); }} className="rounded-[20px] bg-slate-950 text-white font-black h-14 px-8 shadow-2xl shadow-slate-200 hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-95" />
            }>
              <Plus className="w-4 h-4 mr-3" /> Post New Job
            </DialogTrigger>
            <DialogContent className="max-w-3xl rounded-[48px] border-none bg-white p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSaveJob}>
                <DialogHeader className="mb-10 text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-blue-200 border-4 border-white">
                     <Briefcase className="w-10 h-10" />
                  </div>
                  <DialogTitle className="text-3xl font-black tracking-tight text-slate-950 px-10">
                    {editingJob ? "Edit Job Listing" : "Create New Job Opening"}
                  </DialogTitle>
                  <DialogDescription className="text-lg font-medium text-slate-500 mt-2 px-10">
                    Provide the details for the new job listing.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Job Title</Label>
                    <Input required className="h-14 rounded-[20px] border-slate-100 bg-slate-50 font-bold text-slate-900 px-6 focus:ring-4 focus:ring-blue-500/5 transition-all" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Maintenance Engineer" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Country</Label>
                    <Input required className="h-14 rounded-[20px] border-slate-100 bg-slate-50 font-bold text-slate-900 px-6 focus:ring-4 focus:ring-blue-500/5 transition-all" value={formData.country || ""} onChange={e => setFormData({...formData, country: e.target.value})} placeholder="Canada" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Category</Label>
                    <Input className="h-14 rounded-[20px] border-slate-100 bg-slate-50 font-bold text-slate-900 px-6 focus:ring-4 focus:ring-blue-500/5 transition-all" value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Construction" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Status</Label>
                    <Select value={formData.lmia_status || "approved"} onValueChange={v => setFormData({...formData, lmia_status: v as string})}>
                      <SelectTrigger className="h-14 rounded-[20px] border-slate-100 bg-slate-50 font-bold text-slate-900 px-6 focus:ring-4 focus:ring-blue-500/5 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-[24px] border-none bg-slate-950 text-white shadow-2xl">
                        <SelectItem value="approved" className="rounded-xl py-3 cursor-pointer">Approved</SelectItem>
                        <SelectItem value="pending" className="rounded-xl py-3 cursor-pointer">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Job Type</Label>
                    <Select value={formData.job_type || "full-time"} onValueChange={v => setFormData({...formData, job_type: v as string})}>
                      <SelectTrigger className="h-14 rounded-[20px] border-slate-100 bg-slate-50 font-bold text-slate-900 px-6 focus:ring-4 focus:ring-blue-500/5 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-[24px] border-none bg-slate-950 text-white shadow-2xl">
                        <SelectItem value="full-time" className="rounded-xl py-3 cursor-pointer">Full-time</SelectItem>
                        <SelectItem value="contract" className="rounded-xl py-3 cursor-pointer">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Monthly Salary</Label>
                    <div className="relative">
                      <Input type="number" className="h-14 rounded-[20px] border-slate-100 bg-slate-50 font-bold text-slate-900 pl-16 pr-6 focus:ring-4 focus:ring-blue-500/5 transition-all" value={formData.salary_max || ""} onChange={e => setFormData({...formData, salary_max: e.target.value})} placeholder="450000" />
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-blue-600 text-xs">{(formData.currency || 'PKR').toUpperCase()}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 px-4 space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Job Requirements (One per line)</Label>
                  <textarea 
                    className="w-full rounded-[24px] border-slate-100 bg-slate-50 p-6 min-h-[140px] text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                    value={formData.requirements}
                    onChange={e => setFormData({...formData, requirements: e.target.value})}
                    placeholder="2+ years experience in relevant field&#10;Good communication skills&#10;Relevant certification"
                  />
                </div>

                <DialogFooter className="mt-12 gap-4 px-4 h-16">
                  <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="rounded-[22px] font-black text-slate-400 hover:bg-slate-50 flex-1 h-full uppercase tracking-widest text-[11px]">Cancel</Button>
                  <Button type="submit" disabled={saving} className="rounded-[22px] font-black bg-blue-600 text-white flex-1 h-full shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest text-[11px] group">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />}
                    {editingJob ? "Save Changes" : "Post Job"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredJobs.map((job, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              key={job.id}
            >
              <Card className={cn(
                "border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] rounded-[48px] overflow-hidden group hover:shadow-[0_48px_80px_-24px_rgba(37,99,235,0.08)] transition-all duration-700 p-2 border border-slate-50/50",
                !job.is_active && "opacity-60 grayscale-[0.5]"
              )}>
                <CardHeader className="pb-6 pt-10 px-10">
                  <div className="flex items-center justify-between mb-6">
                    <Badge className="font-black text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-600 border-none">
                      {job.category || 'General'}
                    </Badge>
                    <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      <div className={cn("w-2 h-2 rounded-full", job.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-300")}></div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{job.is_active ? "Live" : "Inactive"}</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors duration-500">{job.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-2 font-bold text-slate-400 mt-2 text-sm uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>{job.country}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 px-10">
                  <div className="flex items-center justify-between p-5 bg-slate-50/80 rounded-[28px] border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Monthly Salary</p>
                        <p className="text-base font-black text-slate-900 leading-none">
                          {job.salary_max ? `${job.currency} ${job.salary_max.toLocaleString()}` : 'Not Specified'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                      {job.job_type.replace('-', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">Management</p>
                       <Zap className="w-3 h-3 text-blue-400" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" className="flex-1 font-black text-[10px] h-14 rounded-[22px] border-slate-100 bg-white shadow-sm hover:shadow-2xl hover:bg-slate-50 transition-all uppercase tracking-widest" onClick={() => handleEdit(job)}>
                        <Edit3 className="w-4 h-4 mr-2" /> Edit Job
                      </Button>
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "flex-1 font-black text-[10px] h-14 rounded-[22px] transition-all uppercase tracking-widest border border-transparent",
                          job.is_active ? "text-slate-400 hover:text-slate-600 hover:bg-slate-50" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-100"
                        )}
                        onClick={() => toggleJobStatus(job)}
                      >
                        {job.is_active ? <><XCircle className="w-4 h-4 mr-2" /> Unpublish</> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Publish</>}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2 pb-10 px-10">
                  <Button className="w-full font-black text-[10px] uppercase tracking-[0.25em] rounded-[22px] h-14 bg-slate-50 text-slate-950 border border-slate-100 shadow-sm hover:shadow-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 group/btn">
                    View Details <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredJobs.length === 0 && !loading && (
        <div className="text-center py-32 bg-white rounded-[56px] border border-dashed border-slate-200">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Briefcase className="w-10 h-10 text-slate-200" />
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-2">No Jobs Found</h3>
           <p className="text-slate-500 font-medium text-lg">No job listings match your current search.</p>
           <Button variant="ghost" className="mt-8 font-black text-blue-600 hover:bg-blue-50 rounded-full" onClick={() => setSearch("")}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}
