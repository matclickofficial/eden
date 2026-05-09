"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Sparkles, Loader2, ChevronLeft, Globe, FileText, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const SUGGESTED_TOPICS = [
  { id: 1, text: "Visa requirements for Canada", icon: Globe },
  { id: 2, text: "How to track my application", icon: Clock },
  { id: 3, text: "Checklist for work permit", icon: FileText },
];

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I am your Eden AI Assistant. How can I help you with your immigration journey today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "I'm sorry, I don't have that information yet. Please contact your consultant for specific details.";
      
      if (text.toLowerCase().includes("canada")) {
        botResponse = "Canada offers several immigration pathways including Express Entry, Provincial Nominee Programs (PNP), and Work Permits. Based on your profile, I recommend looking into the Express Entry system which evaluates age, education, and work experience.";
      } else if (text.toLowerCase().includes("track")) {
        botResponse = "You can track your application in real-time by visiting the 'My Status' page in your client portal. We update the timeline as soon as IRCC provides a status update.";
      } else if (text.toLowerCase().includes("permit")) {
        botResponse = "For a Canadian Work Permit, you typically need a valid Job Offer, an LMIA (if required), proof of funds, and a valid passport. Would you like me to show you the document checklist?";
      }

      setMessages(prev => [...prev, { role: "bot", content: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-[#0A1128] text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Eden AI Assistant</h1>
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Active • Powered by EdenCore</p>
          </div>
        </div>
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/30"
      >
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-slate-100 text-[#0A1128]"
                }`}>
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 text-[#0A1128] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested Topics */}
      {messages.length < 3 && (
        <div className="px-8 py-4 bg-white border-t border-slate-50 flex gap-3 overflow-x-auto no-scrollbar">
          {SUGGESTED_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => handleSend(topic.text)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all whitespace-nowrap bg-white shadow-sm"
            >
              <topic.icon className="w-3.5 h-3.5" />
              {topic.text}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-slate-100">
        <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-6 py-2 border border-slate-100 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleSend()}
            placeholder="Type your question here..."
            className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-40 disabled:scale-95 shadow-lg shadow-blue-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
          Eden AI can make mistakes. Check important information with your consultant.
        </p>
      </div>
    </div>
  );
}
