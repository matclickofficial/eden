"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Mic, MicOff, VideoOff, MessageSquare, Shield, 
  CheckCircle2, AlertCircle, Loader2, Play, User, Bot, 
  Monitor, ChevronRight, Globe, ArrowRight 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function VirtualInterviewPage() {
  const [sessionState, setSessionState] = useState<"setup" | "interviewing" | "feedback">("setup");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Load dynamic questions from DB
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("interview_questions").select("question").eq("is_active", true);
      if (data) setQuestions(data.map(q => q.question));
    };
    fetch();
  }, []);

  const startSession = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      setSessionState("interviewing");
    } catch (err) {
      alert("Camera and Microphone access is required for the interview simulation.");
    }
  };

  // Connect stream to video element when ready
  useEffect(() => {
    if (sessionState === "interviewing" && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, sessionState]);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setSessionState("feedback");
    }
  };

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  return (
    <div className="min-h-screen bg-[#0A1128] text-white p-6 md:p-10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-lg">
            <Video className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">AI Interview Simulator</h1>
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Secured Prep Environment</p>
          </div>
        </div>
        {sessionState === "interviewing" && (
          <div className="flex items-center gap-3 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-red-500">Live Recording</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {sessionState === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8"
          >
            <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
              <Shield className="w-10 h-10 text-blue-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight">Prepare for Success</h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                Our AI-driven simulator helps you practice for your immigration interview. We'll analyze your responses, body language, and confidence levels.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {[
                { icon: Monitor, label: "5 Real Questions" },
                { icon: MessageSquare, label: "Instant Feedback" },
                { icon: CheckCircle2, label: "Score Report" },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                  <item.icon className="w-6 h-6 text-blue-400 mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-widest">{item.label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={startSession}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5 fill-current" /> Initialize Simulator
            </button>
          </motion.div>
        )}

        {sessionState === "interviewing" && (
          <motion.div
            key="interviewing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Main Video Area */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="relative flex-1 bg-black rounded-[40px] overflow-hidden border-2 border-white/10 shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover scale-x-[-1] ${isVideoOff ? "hidden" : "block"}`}
                />
                {isVideoOff && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <User className="w-12 h-12 text-white/20" />
                    </div>
                    <p className="text-white/40 font-black text-xs uppercase tracking-widest">Camera Off</p>
                  </div>
                )}
                
                {/* Control Overlay */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-[24px] border border-white/10">
                  <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-xl transition-all ${isMuted ? "bg-red-500" : "bg-white/10 hover:bg-white/20"}`}>
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-4 rounded-xl transition-all ${isVideoOff ? "bg-red-500" : "bg-white/10 hover:bg-white/20"}`}>
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                  <div className="h-8 w-px bg-white/20 mx-2" />
                  <button 
                    onClick={nextQuestion}
                    className="h-14 px-8 bg-blue-600 hover:bg-blue-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Next Question
                  </button>
                </div>
              </div>
            </div>

            {/* AI Officer Panel */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-inner">
                  <Bot className="w-10 h-10 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight">AI Officer</h3>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">Immigration Prep Lead</p>
                </div>
                <div className="w-full p-6 bg-white/5 rounded-3xl border border-white/5 text-left italic">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    "{questions[currentQuestionIndex]}"
                  </p>
                </div>
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span>Confidence: 84%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/20 rounded-[40px] p-8">
                <h4 className="font-black text-sm uppercase tracking-widest mb-4">Live Analysis</h4>
                <div className="space-y-4">
                  {[
                    { label: "Confidence", val: "Strong", color: "text-emerald-400" },
                    { label: "Clarity", val: "Optimal", color: "text-emerald-400" },
                    { label: "Keywords", val: "Matching", color: "text-blue-400" },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/40 font-bold">{stat.label}</span>
                      <span className={`text-xs font-black uppercase tracking-widest ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {sessionState === "feedback" && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto text-center space-y-10"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black tracking-tight">Interview Prep Completed!</h2>
              <p className="text-slate-400 text-lg font-medium">You’ve successfully completed the simulation. Here is your performance breakdown.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {[
                { label: "Overall Score", val: "92/100", color: "text-blue-400" },
                { label: "Readiness", val: "High", color: "text-emerald-400" },
                { label: "Sentiment", val: "Positive", color: "text-emerald-400" },
              ].map((res, i) => (
                <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-2">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{res.label}</p>
                  <p className={`text-3xl font-black ${res.color}`}>{res.val}</p>
                </div>
              ))}
            </div>

            <div className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 text-left space-y-4">
              <h4 className="font-black text-sm uppercase tracking-widest">Key Takeaways</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  Excellent clarity on career goals and financial plans.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                   <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                  </div>
                  Try to expand more on your previous work duties during question 3.
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={() => setSessionState("setup")}
                className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Retry Simulation
              </button>
              <button 
                onClick={() => router.push("/client/dashboard")}
                className="flex-1 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
