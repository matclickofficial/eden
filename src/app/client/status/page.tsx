"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle, Search, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const CATEGORIES = [
  "Offer Letter",
  "LMIA Approval",
  "Work Permit",
  "Study Visa",
  "Visitor Visa",
  "Permanent Residency",
  "Biometrics",
  "Fees",
];

const MOCK_APPLICATIONS = [
  {
    id: "EDEN-482910",
    service: "Work Permit",
    submitted: "Apr 3, 2026",
    status: "in_progress",
    stage: "Under Review",
    timeline: [
      { step: "Application Received",     date: "Apr 3, 2026",  done: true },
      { step: "Document Verification",    date: "Apr 10, 2026", done: true },
      { step: "LMIA Submission",          date: "Apr 20, 2026", done: true },
      { step: "IRCC Review",              date: "Ongoing",      done: false, active: true },
      { step: "Permit Issued",            date: "Est. Jun 2026",done: false },
    ],
    note: "Your application is currently with IRCC. Processing times are typically 6-8 weeks. No action required from your side at this time.",
  },
  {
    id: "EDEN-391047",
    service: "Offer Letter",
    submitted: "Mar 15, 2026",
    status: "completed",
    stage: "Issued",
    timeline: [
      { step: "Request Submitted",    date: "Mar 15, 2026", done: true },
      { step: "Employer Contacted",   date: "Mar 17, 2026", done: true },
      { step: "Letter Drafted",       date: "Mar 22, 2026", done: true },
      { step: "Offer Letter Issued",  date: "Mar 25, 2026", done: true },
    ],
    note: "Your offer letter has been issued and delivered to your registered email. Please save this document safely.",
  },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  in_progress: { label: "In Progress",  className: "bg-amber-100 text-amber-700" },
  completed:   { label: "Completed",    className: "bg-emerald-100 text-emerald-700" },
  pending:     { label: "Pending",      className: "bg-blue-100 text-blue-700" },
  rejected:    { label: "Rejected",     className: "bg-red-100 text-red-700" },
};

export default function ClientStatusPage() {
  const [apps, setApps] = useState(MOCK_APPLICATIONS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    const isDemo = typeof document !== 'undefined' && document.cookie.includes('demo-session=true');
    if (isDemo) {
      const load = async () => {
        const { mockDb } = await import("@/lib/mock-db");
        const demoApps = mockDb.getApplications();
        setApps(demoApps);
        if (demoApps.length > 0) setExpanded(demoApps[0].id);
      };
      load();

      // Listen for updates from other tabs (Admin panel)
      const handleStorage = () => load();
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, []);

  const filtered = apps.filter(app =>
    app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900">Application Status</h2>
        <p className="text-slate-400 text-sm mt-1">Track the real-time progress of all your active applications.</p>
      </div>

      {/* Search + Category filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by reference ID or service type…"
            className="w-full h-14 pl-14 pr-6 rounded-xl border-2 border-slate-200 focus:border-[#D11218] outline-none font-medium text-slate-800 text-sm transition-all"
          />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Filter by Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? "bg-[#D11218] text-white border-[#D11218] shadow-md"
                    : "bg-white text-slate-500 border-slate-200 hover:border-[#D11218]/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-500">No applications found</p>
            <p className="text-sm text-slate-400">Try a different search term or reference ID.</p>
          </div>
        ) : (
          filtered.map(app => {
            const badge = STATUS_BADGE[app.status];
            const isOpen = expanded === app.id;

            return (
              <motion.div
                key={app.id}
                layout
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Summary row */}
                <button
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors text-left"
                  onClick={() => setExpanded(isOpen ? null : app.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      app.status === "completed" ? "bg-emerald-100" :
                      app.status === "in_progress" ? "bg-amber-100" :
                      "bg-slate-100"
                    }`}>
                      {app.status === "completed"
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        : <Clock className="w-5 h-5 text-amber-600" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-black text-slate-900 text-sm">{app.id}</p>
                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{app.service} · Submitted {app.submitted}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 hidden sm:block">{app.stage}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {/* Expanded timeline */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 border-t border-slate-100">
                        <div className="pt-6 space-y-5">
                          {app.timeline.map((t, i) => (
                            <div key={i} className="flex items-start gap-4">
                              <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                t.done ? "bg-emerald-500" :
                                (t as any).active ? "bg-[#D11218] animate-pulse" :
                                "bg-slate-200"
                              }`}>
                                {t.done
                                  ? <CheckCircle2 className="w-4 h-4 text-white" />
                                  : <Clock className="w-4 h-4 text-white" />
                                }
                              </div>
                              <div className="flex-1 flex items-start justify-between">
                                <div>
                                  <p className={`font-bold text-sm ${t.done || (t as any).active ? "text-slate-900" : "text-slate-400"}`}>
                                    {t.step}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-0.5">{t.date}</p>
                                </div>
                                {(t as any).active && (
                                  <span className="text-[10px] font-black text-[#D11218] uppercase tracking-widest">Active</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-[#D11218] shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-600 font-medium">{app.note}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Help CTA */}
      <div className="bg-[#0A1128] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-white font-black text-lg">Need to speak to a consultant?</p>
          <p className="text-white/50 text-sm mt-1">Our team is available via WhatsApp Mon–Sat, 9am–7pm EST.</p>
        </div>
        <a
          href="https://wa.me/12897840100"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-8 py-4 rounded-2xl bg-[#25D366] text-white font-black text-sm hover:bg-green-600 transition-all shadow-lg"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
