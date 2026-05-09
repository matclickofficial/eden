"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Download, Trash2, CheckCircle2, Clock, AlertCircle, Plus, Eye } from "lucide-react";

const REQUIRED_DOCS = [
  { name: "Passport Copy",           status: "approved",  uploaded: "Apr 3, 2026", size: "2.4 MB", expires: "Oct 12, 2026", health: "warning" },
  { name: "Employment Letter",        status: "approved",  uploaded: "Apr 3, 2026", size: "1.1 MB", expires: null,           health: "healthy" },
  { name: "Bank Statement (3 months)",status: "pending",   uploaded: "Apr 5, 2026", size: "3.7 MB", expires: "May 30, 2026", health: "healthy" },
  { name: "Educational Certificates", status: "required",  uploaded: null,          size: null,     expires: null,           health: "healthy" },
  { name: "IELTS / Language Test",    status: "required",  uploaded: null,          size: null,     expires: "Jun 20, 2027", health: "healthy" },
  { name: "Police Clearance",         status: "required",  uploaded: null,          size: null,     expires: "Aug 15, 2026", health: "warning" },
];

const STATUS_MAP: Record<string, { label: string; icon: any; className: string }> = {
  approved: { label: "Approved",  icon: CheckCircle2, className: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  pending:  { label: "Reviewing", icon: Clock,        className: "text-amber-600 bg-amber-50 border-amber-200" },
  required: { label: "Required",  icon: AlertCircle,  className: "text-red-600 bg-red-50 border-red-200" },
};

export default function ClientDocumentsPage() {
  const [docs, setDocs] = useState(REQUIRED_DOCS);

  const handleUpload = (name: string) => {
    setDocs(prev => prev.map(d => d.name === name ? { ...d, status: "pending", uploaded: "Today", size: "—" } : d));
  };

  const approved = docs.filter(d => d.status === "approved").length;
  const total = docs.length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Documents</h2>
          <p className="text-slate-400 text-sm mt-1">Upload and manage all your immigration documents here.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-slate-900">{approved}<span className="text-slate-300">/{total}</span></p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Documents Approved</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-700">Submission Progress</p>
          <p className="text-sm font-black text-[#D11218]">{Math.round((approved / total) * 100)}%</p>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(approved / total) * 100}%` }}
            className="h-full bg-gradient-to-r from-[#D11218] to-red-400 rounded-full"
          />
        </div>
        <p className="text-xs text-slate-400 mt-3">
          {total - approved} document{total - approved !== 1 ? "s" : ""} still required. Please upload them to proceed.
        </p>
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {docs.map((doc, i) => {
          const st = STATUS_MAP[doc.status];
          const Icon = st.icon;
          return (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${st.className}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-slate-900">{doc.name}</p>
                    {doc.health === "warning" && (
                      <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertCircle className="w-2.5 h-2.5" /> Expiry Risk
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {doc.uploaded ? (
                      <p className="text-[11px] text-slate-400">Uploaded {doc.uploaded} · {doc.size}</p>
                    ) : (
                      <p className="text-[11px] text-slate-400">Not yet uploaded</p>
                    )}
                    {doc.expires && (
                      <p className={`text-[11px] font-bold ${doc.health === 'warning' ? 'text-amber-600' : 'text-slate-400'}`}>
                        Expires: {doc.expires}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${st.className}`}>
                    {st.label}
                  </span>
                  {doc.uploaded && (
                    <>
                      <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-[#D11218] transition-colors" title="Preview">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-[#D11218] transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {doc.status === "required" && (
                    <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D11218] text-white text-xs font-black cursor-pointer hover:bg-red-700 transition-colors">
                      <Upload className="w-3 h-3" /> Upload
                      <input type="file" className="hidden" onChange={() => handleUpload(doc.name)} accept=".pdf,.jpg,.jpeg,.png" />
                    </label>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-4">
        <FileText className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-blue-900 text-sm">Document Guidelines</p>
          <p className="text-sm text-blue-700 mt-1 leading-relaxed">
            All documents must be clear, high-resolution scans (minimum 300 DPI). Accepted formats: PDF, JPG, PNG. Max size 5MB per file.
            Documents in languages other than English must include a certified translation.
          </p>
        </div>
      </div>
    </div>
  );
}
