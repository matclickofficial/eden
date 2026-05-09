"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, Paperclip, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const THREADS = [
  {
    id: 1, name: "Eden Consulting Team", role: "Your Case Manager",
    lastMsg: "We've received your bank statement and it's under review.",
    time: "2h ago", unread: 1,
    messages: [
      { from: "them", text: "Welcome to Eden! We've assigned a consultant to your case.",              time: "Mar 22" },
      { from: "me",   text: "Thank you! When should I expect an update?",                             time: "Mar 22" },
      { from: "them", text: "You should receive a status update within 5–7 business days.",           time: "Mar 23" },
      { from: "me",   text: "Great, I've uploaded my bank statement as well.",                        time: "Apr 5" },
      { from: "them", text: "We've received your bank statement and it's under review.",              time: "2h ago" },
    ],
  },
  {
    id: 2, name: "Payments Support", role: "Billing Department",
    lastMsg: "Your receipt for PAY-003 has been sent to your email.",
    time: "Yesterday", unread: 0,
    messages: [
      { from: "them", text: "Your LMIA fee payment of $1,000 has been received. Thank you!",         time: "Apr 20" },
      { from: "me",   text: "Please send me a receipt for my records.",                               time: "Apr 20" },
      { from: "them", text: "Your receipt for PAY-003 has been sent to your email.",                  time: "Yesterday" },
    ],
  },
];

export default function ClientMessagesPage() {
  const [active, setActive] = useState(THREADS[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: 500 }}>
        <div className="flex h-full">
          {/* Thread list */}
          <div className="w-80 shrink-0 border-r border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <p className="font-black text-slate-900 mb-3">Messages</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search…"
                  className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D11218]/30"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {THREADS.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => setActive(thread)}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50",
                    active.id === thread.id && "bg-[#D11218]/5 border-l-4 border-l-[#D11218]"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0A1128] flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {thread.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-bold text-sm text-slate-900 truncate">{thread.name}</p>
                      <p className="text-[10px] text-slate-400 shrink-0 ml-2">{thread.time}</p>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{thread.lastMsg}</p>
                  </div>
                  {thread.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#D11218] text-white text-[10px] font-black flex items-center justify-center">
                      {thread.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0A1128] flex items-center justify-center font-bold text-white">
                {active.name[0]}
              </div>
              <div>
                <p className="font-black text-sm text-slate-900">{active.name}</p>
                <p className="text-xs text-slate-400">{active.role} · Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {active.messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                >
                  {msg.from === "them" && (
                    <div className="w-8 h-8 rounded-full bg-[#0A1128] flex items-center justify-center font-bold text-white text-xs shrink-0 mr-3 mt-auto">
                      E
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-sm xl:max-w-md`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                      msg.from === "me"
                        ? "bg-[#D11218] text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-800 rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-[10px] text-slate-400 mt-1 ${msg.from === "me" ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 flex items-center gap-3">
              <button className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-[#D11218] transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && setMessage("")}
                placeholder="Type a message…"
                className="flex-1 h-12 px-5 rounded-2xl bg-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D11218]/30"
              />
              <button
                onClick={() => setMessage("")}
                className="p-3 rounded-2xl bg-[#D11218] text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
