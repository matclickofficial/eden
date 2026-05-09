"use client";

import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Clock, Download, ExternalLink, Shield } from "lucide-react";

const TRANSACTIONS = [
  { id: "PAY-001", desc: "Initial Consultation Fee",     amount: 200,  date: "Mar 22, 2026", status: "paid",    method: "Credit Card" },
  { id: "PAY-002", desc: "Work Permit Processing Fee",   amount: 750,  date: "Apr 3, 2026",  status: "paid",    method: "Bank Transfer" },
  { id: "PAY-003", desc: "LMIA Application Fee",         amount: 1000, date: "Apr 20, 2026", status: "paid",    method: "Credit Card" },
  { id: "PAY-004", desc: "Biometrics Fee (IRCC)",        amount: 85,   date: "Due May 30",   status: "pending", method: "—" },
];

const UPCOMING = [
  { desc: "IRCC Work Permit Fee",  amount: 155, due: "Jun 1, 2026" },
  { desc: "Settlement Services",   amount: 300, due: "Jun 15, 2026" },
];

export default function ClientPaymentsPage() {
  const totalPaid = TRANSACTIONS.filter(t => t.status === "paid").reduce((s, t) => s + t.amount, 0);
  const totalDue  = UPCOMING.reduce((s, u) => s + u.amount, 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Payments</h2>
        <p className="text-slate-400 text-sm mt-1">View your payment history and make secure payments online.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Paid",       value: `$${totalPaid.toLocaleString()}`, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
          { label: "Amount Due",       value: `$${totalDue.toLocaleString()}`,  icon: Clock,        color: "bg-amber-50 text-amber-600" },
          { label: "Next Payment",     value: "Jun 1, 2026",                    icon: CreditCard,   color: "bg-blue-50 text-blue-600" },
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-4`}>
              <c.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">{c.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Payments */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
        <p className="text-sm font-black text-amber-900 uppercase tracking-widest">Upcoming Payments</p>
        <div className="space-y-3">
          {UPCOMING.map((u, i) => (
            <div key={i} className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-amber-100 shadow-sm">
              <div>
                <p className="font-bold text-sm text-slate-800">{u.desc}</p>
                <p className="text-xs text-slate-400 mt-0.5">Due: {u.due}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-black text-slate-900">${u.amount}</p>
                <a
                  href="https://wa.me/12897840100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#D11218] text-white text-xs font-black hover:bg-red-700 transition-colors shadow-md"
                >
                  Pay Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="font-black text-slate-900">Payment History</p>
        </div>
        <div className="divide-y divide-slate-100">
          {TRANSACTIONS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  t.status === "paid" ? "bg-emerald-100" : "bg-amber-100"
                }`}>
                  {t.status === "paid"
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    : <Clock className="w-4 h-4 text-amber-600" />
                  }
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">{t.desc}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.id} · {t.date} · {t.method}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className={`font-black text-sm ${t.status === "paid" ? "text-slate-900" : "text-amber-600"}`}>
                  ${t.amount}
                </p>
                <span className={`hidden sm:inline px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  t.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {t.status === "paid" ? "Paid" : "Pending"}
                </span>
                {t.status === "paid" && (
                  <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-[#D11218] transition-colors" title="Download Receipt">
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Secure badge */}
      <div className="flex items-center justify-center gap-3 py-4 text-slate-400">
        <Shield className="w-4 h-4" />
        <p className="text-xs font-bold">All payments processed via 256-bit SSL encryption</p>
      </div>
    </div>
  );
}
