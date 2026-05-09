"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Globe, Lock, Save, Loader2, CheckCircle2, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ClientProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    nationality: "",
    passport_number: "",
    address: "",
  });

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(prev => ({
          ...prev,
          email: user.email ?? "",
          full_name: data?.full_name ?? "",
          phone: data?.phone ?? "",
          nationality: data?.nationality ?? "",
          passport_number: data?.passport_number ?? "",
          address: data?.address ?? "",
        }));
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("profiles").update({
        full_name: profile.full_name,
        phone: profile.phone,
        nationality: profile.nationality,
        passport_number: profile.passport_number,
        address: profile.address,
      }).eq("id", user.id);

      if (error) {
        toast.error("Failed to save profile.");
      } else {
        toast.success("Profile updated successfully!");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    }
    setLoading(false);
  };

  const update = (field: string, val: string) => setProfile(p => ({ ...p, [field]: val }));
  const initials = profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "CL";

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900">My Profile</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your personal details and account settings.</p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex items-center gap-6">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-[#D11218] flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-red-200">
            {initials}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0A1128] border-2 border-white flex items-center justify-center shadow-md hover:bg-[#1a2744] transition-colors">
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div>
          <p className="font-black text-xl text-slate-900">{profile.full_name || "Your Name"}</p>
          <p className="text-sm text-slate-400 mt-0.5">{profile.email}</p>
          <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-[#D11218]/10 text-[#D11218] text-[10px] font-black uppercase tracking-widest">
            Active Client
          </span>
        </div>
      </div>

      {/* Personal Info form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
        <p className="font-black text-slate-900 text-lg pb-4 border-b border-slate-100">Personal Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Full Legal Name",  field: "full_name",       icon: User,  type: "text" },
            { label: "Email Address",    field: "email",            icon: Mail,  type: "email", disabled: true },
            { label: "Phone Number",     field: "phone",            icon: Phone, type: "tel" },
            { label: "Nationality",      field: "nationality",      icon: Globe, type: "text" },
            { label: "Passport Number",  field: "passport_number",  icon: Lock,  type: "text" },
          ].map(({ label, field, icon: Icon, type, disabled }) => (
            <div key={field} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
              <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={type}
                  value={(profile as any)[field]}
                  onChange={e => !disabled && update(field, e.target.value)}
                  disabled={disabled}
                  className={`w-full h-13 pl-11 pr-5 py-3 rounded-xl border-2 font-medium text-sm transition-all outline-none ${
                    disabled
                      ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                      : "border-slate-200 bg-white text-slate-800 focus:border-[#D11218]"
                  }`}
                />
              </div>
              {disabled && <p className="text-[10px] text-slate-400">Contact support to update your email address.</p>}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Address</label>
          <textarea
            value={profile.address}
            onChange={e => update("address", e.target.value)}
            rows={3}
            placeholder="Street, City, Province, Country"
            className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 focus:border-[#D11218] outline-none font-medium text-slate-800 text-sm transition-all resize-none"
          />
        </div>
        <div className="pt-2 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#D11218] text-white font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-60"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-emerald-600 font-bold text-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Saved!
            </motion.div>
          )}
        </div>
      </div>

      {/* Security section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">
        <p className="font-black text-slate-900 text-lg pb-4 border-b border-slate-100">Security</p>
        <div className="flex items-center justify-between py-4 border-b border-slate-100">
          <div>
            <p className="font-bold text-sm text-slate-800">Password</p>
            <p className="text-xs text-slate-400 mt-0.5">Last changed: Never</p>
          </div>
          <a
            href="/forgot-password"
            className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 text-xs font-black hover:border-[#D11218] hover:text-[#D11218] transition-all"
          >
            Change Password
          </a>
        </div>
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="font-bold text-sm text-slate-800">Two-Factor Authentication</p>
            <p className="text-xs text-slate-400 mt-0.5">Add an extra layer of security to your account</p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-black hover:bg-slate-200 transition-all">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );
}
