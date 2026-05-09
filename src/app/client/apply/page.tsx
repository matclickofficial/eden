"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Upload, User, Briefcase, FileText, Send } from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  { id: 1, label: "Personal Info",   icon: User },
  { id: 2, label: "Service Type",    icon: Briefcase },
  { id: 3, label: "Documents",       icon: FileText },
  { id: 4, label: "Submit",          icon: Send },
];

const SERVICES = [
  { value: "work_permit",       label: "Work Permit",          desc: "Open or employer-specific work permits" },
  { value: "permanent_res",     label: "Permanent Residency",  desc: "Express Entry, PNP, or family sponsorship" },
  { value: "study_visa",        label: "Study Visa",           desc: "Student permits for Canadian institutions" },
  { value: "visitor_visa",      label: "Visitor / Tourist",    desc: "Temporary visitor visa or eTA" },
  { value: "family_sponsor",    label: "Family Sponsorship",   desc: "Bring your spouse, children, or parents" },
  { value: "business_immig",    label: "Business Immigration", desc: "Investor, entrepreneur, or self-employed" },
];

export default function ClientApplyPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", passportNumber: "", dateOfBirth: "",
    nationality: "", address: "",
    serviceType: "",
    preferredDate: "", additionalNotes: "",
  });

  const [refId, setRefId] = useState("");

  useEffect(() => {
    // Generate stable ref ID only on client
    setRefId(`EDEN-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  const update = (field: string, val: string) => setForm(p => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Application submitted! Our team will contact you within 24 hours.");
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
                <h3 className="text-2xl font-black text-slate-900">Personal Information</h3>
                <p className="text-slate-400 text-sm mt-1">Tell us about yourself so we can personalize your application.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Full Legal Name", field: "fullName",       type: "text",  placeholder: "As on passport" },
                  { label: "Email Address",   field: "email",          type: "email", placeholder: "your@email.com" },
                  { label: "Phone Number",    field: "phone",          type: "tel",   placeholder: "+1 (555) 000-0000" },
                  { label: "Passport Number", field: "passportNumber", type: "text",  placeholder: "AB1234567" },
                  { label: "Date of Birth",   field: "dateOfBirth",    type: "date",  placeholder: "" },
                  { label: "Nationality",     field: "nationality",    type: "text",  placeholder: "e.g. Pakistani" },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                    <input
                      type={type}
                      value={(form as any)[field]}
                      onChange={e => update(field, e.target.value)}
                      placeholder={placeholder}
                      className="w-full h-13 px-5 py-3 rounded-xl border-2 border-slate-200 focus:border-[#D11218] outline-none font-medium text-slate-800 text-sm transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Address</label>
                <textarea
                  value={form.address}
                  onChange={e => update("address", e.target.value)}
                  placeholder="Street, City, Country"
                  rows={2}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 focus:border-[#D11218] outline-none font-medium text-slate-800 text-sm transition-all resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Select Service Type</h3>
                <p className="text-slate-400 text-sm mt-1">Choose the immigration service you are applying for.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => update("serviceType", s.value)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${
                      form.serviceType === s.value
                        ? "border-[#D11218] bg-[#D11218]/5 shadow-md"
                        : "border-slate-200 hover:border-[#D11218]/40"
                    }`}
                  >
                    <p className={`font-black text-sm mb-1 ${form.serviceType === s.value ? "text-[#D11218]" : "text-slate-800"}`}>
                      {s.label}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{s.desc}</p>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preferred Consultation Date</label>
                <input
                  type="date"
                  value={form.preferredDate}
                  onChange={e => update("preferredDate", e.target.value)}
                  className="w-full h-13 px-5 py-3 rounded-xl border-2 border-slate-200 focus:border-[#D11218] outline-none font-medium text-slate-800 text-sm transition-all"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Upload Documents</h3>
                <p className="text-slate-400 text-sm mt-1">Attach the required documents for your application type.</p>
              </div>
              {["Passport Copy (all pages)", "Educational Certificates", "Employment Letter / Offer Letter", "Bank Statement (3 months)"].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#D11218]/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#D11218]/10 flex items-center justify-center transition-colors">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-[#D11218] transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-700">{doc}</p>
                      <p className="text-xs text-slate-400">PDF, JPG, PNG — Max 5MB</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#D11218] hover:text-white text-slate-600 text-xs font-bold cursor-pointer transition-all">
                    <Upload className="w-3 h-3" />
                    Upload
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                </div>
              ))}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Notes</label>
                <textarea
                  value={form.additionalNotes}
                  onChange={e => update("additionalNotes", e.target.value)}
                  placeholder="Any special circumstances or information you'd like us to know..."
                  rows={4}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 focus:border-[#D11218] outline-none font-medium text-slate-800 text-sm transition-all resize-none"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Review & Submit</h3>
                <p className="text-slate-400 text-sm mt-1">Please review your application details before submitting.</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Full Name",      value: form.fullName || "—" },
                  { label: "Email",          value: form.email || "—" },
                  { label: "Phone",          value: form.phone || "—" },
                  { label: "Passport",       value: form.passportNumber || "—" },
                  { label: "Nationality",    value: form.nationality || "—" },
                  { label: "Service Type",   value: SERVICES.find(s => s.value === form.serviceType)?.label || "—" },
                  { label: "Consult Date",   value: form.preferredDate || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
                    <span className="text-sm font-bold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 font-medium">
                  By submitting, you confirm all information is accurate and consent to Eden processing your application in accordance with our privacy policy.
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
