"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Upload, User, Briefcase, FileText, Send, Smartphone, Camera } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const STEPS = [
  { id: 1, label: "Personal Info",   icon: User },
  { id: 2, label: "Work Info",       icon: Briefcase },
  { id: 3, label: "Uploads",         icon: FileText },
  { id: 4, label: "Submit",          icon: Send },
];

export default function ClientApplyPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const supabase = createClient();

  const [form, setForm] = useState({
    fullName: "", 
    surname: "",
    email: "", 
    phone: "", 
    whatsapp: "",
    jobId: "",
    passport: null as File | null,
    cv: null as File | null,
    photo: null as File | null,
  });

  const [refId, setRefId] = useState("");

  useEffect(() => {
    // Generate stable ref ID only on client
    setRefId(`EDEN-${Math.floor(100000 + Math.random() * 900000)}`);
    
    // Fetch Labor Jobs
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("category", "Labor")
        .eq("is_active", true);
      setJobs(data || []);
    };
    fetchJobs();
  }, [supabase]);

  const update = (field: string, val: string) => setForm(p => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Application submitted! Our representative will reply and contact you back in professional way.");
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Application Submitted!</h2>
          <p className="text-slate-500 font-medium">
            Your application has been received. Our consultant will review your information and reach out within <strong>24 hours</strong>.
          </p>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Application Reference</p>
            <p className="text-2xl font-black text-slate-900">{refId}</p>
            <p className="text-xs text-slate-400 mt-1">Please save this reference number for your records.</p>
          </div>
          <a href="/client/status">
            <button className="w-full h-14 rounded-2xl bg-[#0A1128] text-white font-black flex items-center justify-center gap-2 hover:bg-[#1a2744] transition-colors">
              Check My Status <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                    done ? "bg-emerald-500 text-white" :
                    active ? "bg-[#D11218] text-white shadow-lg shadow-red-300" :
                    "bg-slate-100 text-slate-400"
                  }`}>
                    {done ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-wider hidden sm:block ${active ? "text-[#D11218]" : done ? "text-emerald-600" : "text-slate-400"}`}>
                    {s.label}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-5 transition-colors ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-heading tracking-tight">Personal Information</h3>
                <p className="text-slate-400 text-sm mt-1">Please provide your legal contact details as they appear on your documents.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Full Name",    field: "fullName", type: "text",  placeholder: "John" },
                  { label: "Surname",      field: "surname",  type: "text",  placeholder: "Doe" },
                  { label: "Email Address", field: "email",    type: "email", placeholder: "john.doe@example.com" },
                  { label: "Phone Number",  field: "phone",    type: "tel",   placeholder: "+1 (555) 000-0000" },
                  { label: "WhatsApp Number", field: "whatsapp", type: "tel",   placeholder: "+1 (555) 000-0000" },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{label}</label>
                    <input
                      type={type}
                      value={(form as any)[field]}
                      onChange={e => update(field, e.target.value)}
                      placeholder={placeholder}
                      className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-[#D11218]/5 focus:border-[#D11218] outline-none font-bold text-slate-900 transition-all shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-heading tracking-tight">Work Information</h3>
                <p className="text-slate-400 text-sm mt-1">Select from our available labor job opportunities.</p>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Available Labor Jobs</label>
                <div className="grid grid-cols-1 gap-4">
                  {jobs.length > 0 ? jobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => update("jobId", job.id)}
                      className={`text-left p-6 rounded-3xl border-2 transition-all duration-300 flex items-center justify-between group ${
                        form.jobId === job.id
                          ? "border-[#D11218] bg-[#D11218]/5 shadow-xl shadow-[#D11218]/5"
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                    >
                      <div>
                        <p className={`font-black text-lg ${form.jobId === job.id ? "text-[#D11218]" : "text-slate-900"}`}>{job.title}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{job.country} · {job.job_type}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${form.jobId === job.id ? "bg-[#D11218] text-white" : "bg-slate-50 text-slate-300 group-hover:bg-slate-100"}`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                    </button>
                  )) : (
                    <div className="p-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <p className="font-bold text-slate-400">No Labor jobs currently available.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-heading tracking-tight">Upload Documents</h3>
                <p className="text-slate-400 text-sm mt-1">Please upload clear copies of the required documents.</p>
              </div>

              {/* Passport with Mobile Scan */}
              <div className="p-8 rounded-[32px] border border-slate-100 bg-slate-50/50 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#D11218]">
                       <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Upload Passport</p>
                      <p className="text-xs text-slate-400 font-medium italic">High resolution scan required</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      id="mobile-scan"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setForm(p => ({ ...p, passport: file }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('mobile-scan')?.click()}
                      className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                    >
                      <Camera className="w-3 h-3" /> Scan with Mobile
                    </button>
                    <label className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                      <Upload className="w-3 h-3" /> Browse
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setForm(p => ({ ...p, passport: e.target.files?.[0] || null }))} />
                    </label>
                  </div>
                </div>
                {form.passport && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-700">{form.passport.name} attached</span>
                  </div>
                )}
              </div>

              {/* CV & Photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Upload CV", field: "cv", icon: FileText },
                  { label: "Upload Photo", field: "photo", icon: User },
                ].map((doc) => (
                  <div key={doc.field} className="p-6 rounded-[28px] border border-slate-100 bg-white hover:border-[#D11218]/30 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#D11218] transition-colors">
                        <doc.icon className="w-5 h-5" />
                      </div>
                      <label className="p-2 rounded-xl bg-slate-50 hover:bg-[#D11218] hover:text-white text-slate-400 cursor-pointer transition-all">
                        <Upload className="w-4 h-4" />
                        <input type="file" className="hidden" onChange={(e) => setForm(p => ({ ...p, [doc.field]: e.target.files?.[0] || null }))} />
                      </label>
                    </div>
                    <p className="font-black text-slate-900">{doc.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {(form as any)[doc.field] ? (form as any)[doc.field].name : "PDF or JPG required"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center pb-6">
                <div className="w-20 h-20 bg-[#D11218]/5 rounded-[32px] flex items-center justify-center text-[#D11218] mx-auto mb-6">
                   <Send className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 font-heading tracking-tight">Review & Submit</h3>
                <p className="text-slate-400 text-sm mt-1">Please confirm your details are correct before sending.</p>
              </div>
              
              <div className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100 space-y-4">
                {[
                  { label: "Full Name",      value: `${form.fullName} ${form.surname}` },
                  { label: "Email",          value: form.email || "—" },
                  { label: "Phone",          value: form.phone || "—" },
                  { label: "WhatsApp",       value: form.whatsapp || "—" },
                  { label: "Target Job",      value: jobs.find(j => j.id === form.jobId)?.title || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
                    <span className="text-sm font-black text-slate-900">{value}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-sm text-amber-800 font-bold leading-relaxed">
                  By submitting, you authorize Eden to process your immigration profile. Our representative will reply and contact you back in professional way.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:border-slate-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0A1128] text-white font-black hover:bg-[#1a2744] transition-all shadow-lg"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#D11218] text-white font-black hover:bg-red-700 transition-all shadow-xl shadow-red-300 disabled:opacity-60"
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Application</>}
          </button>
        )}
      </div>
    </div>
  );
}
