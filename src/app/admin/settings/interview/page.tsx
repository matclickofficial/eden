"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, MessageSquare, Plus, Trash2, Save, RefreshCw, 
  ChevronLeft, AlertCircle, CheckCircle2, Globe 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function AdminInterviewSettings() {
  const [questions, setQuestions] = useState<{id?: string, question: string}[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data } = await supabase.from("interview_questions").select("*").order('created_at', { ascending: true });
    if (data) setQuestions(data);
  };

  const handleAdd = () => {
    setQuestions([...questions, { question: "New Question?" }]);
  };

  const handleRemove = async (index: number) => {
    const target = questions[index];
    if (target.id) {
      await supabase.from("interview_questions").delete().eq("id", target.id);
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, val: string) => {
    const next = [...questions];
    next[index].question = val;
    setQuestions(next);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Perform bulk upsert
    const { error } = await supabase.from("interview_questions").upsert(
      questions.map(q => ({
        ...(q.id ? { id: q.id } : {}),
        question: q.question
      }))
    );

    setIsSaving(false);
    if (!error) {
      setMessage({ type: "success", text: "Question bank updated in cloud successfully!" });
      fetchQuestions(); // Refresh IDs
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: "Sync failed. Please check permissions." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-2 cursor-pointer hover:text-slate-600" onClick={() => router.back()}>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
          </div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">AI Interview Config</h2>
          <p className="text-slate-500 font-medium">Manage the question bank for the Virtual Interview Simulator.</p>
        </div>
        <div className="flex gap-3">
           <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="rounded-xl border-slate-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-[#0A1128] text-white font-black px-8"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border flex items-center gap-3 ${
            message.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-bold">{message.text}</p>
        </motion.div>
      )}

      {/* Question Bank Container */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">Active Questions</h3>
          </div>
          <Button 
            onClick={handleAdd}
            className="rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border-none font-bold text-xs"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <motion.div 
              key={i}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[10px] font-black text-slate-400">
                {i + 1}
              </div>
              <input 
                type="text" 
                value={q.question}
                onChange={(e) => handleUpdate(i, e.target.value)}
                className="flex-1 h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none text-sm font-medium text-slate-700 transition-all"
                placeholder="Enter global immigration question..."
              />
              <button 
                onClick={() => handleRemove(i)}
                className="p-3 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
              <p className="text-slate-400 font-medium">No questions in the bank. Add one to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Help Card */}
      <div className="p-8 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-5">
        <Globe className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
        <div className="space-y-2">
          <h4 className="font-black text-blue-950">Global Best Practice</h4>
          <p className="text-sm text-blue-800 leading-relaxed font-medium">
            Keep questions generic and high-level to support global immigration scenarios. Avoid naming specific countries like Canada or Australia unless you want to localize the entire portal experience for a single market.
          </p>
        </div>
      </div>
    </div>
  );
}
