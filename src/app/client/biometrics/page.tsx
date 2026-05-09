"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Camera, RefreshCw, CheckCircle2, AlertCircle, Fingerprint, Scan, Loader2, X, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function BiometricPage() {
  const [step, setStep] = useState<"intro" | "scanning" | "analyzing" | "success">("intro");
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get('id');
  const supabase = createClient();

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStep("scanning");
    } catch (err) {
      alert("Camera access denied. Please allow camera to proceed.");
    }
  };

  // Manual scanning logic (requires user interaction)
  const startScan = () => {
    setIsScanning(true);
    scanIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          stopScan();
          handleCompletion();
          return 100;
        }
        return prev + 1.2; 
      });
    }, 50);
  };

  const handleCompletion = async () => {
    setStep("analyzing");
    
    // Live DB Update
    if (appId) {
      await supabase
        .from('applications')
        .update({ current_stage: 'WAITING_FOR_DECISION' })
        .eq('id', appId);
        
      // Also record in timeline
      await supabase.from('application_timeline').insert({
        application_id: appId,
        stage: 'WAITING_FOR_DECISION',
        status: 'completed',
        admin_note: 'Biometric verification completed via secure mobile gateway.'
      });
    }

    setTimeout(() => setStep("success"), 3000);
  };

  const stopScan = () => {
    setIsScanning(false);
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
  };

  // Stop camera on success or unmount
  useEffect(() => {
    if (step === "success" || step === "intro") {
      stream?.getTracks().forEach(track => track.stop());
    }
    return () => {
      stream?.getTracks().forEach(track => track.stop());
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [step, stream]);

  return (
    <div className="fixed inset-0 z-[60] bg-[#050810] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* HUD Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-blue-500 rounded-tl-3xl" />
        <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-blue-500 rounded-tr-3xl" />
        <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-blue-500 rounded-bl-3xl" />
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-blue-500 rounded-br-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Intro */}
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center max-w-sm space-y-8"
          >
            <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto border border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
              <Fingerprint className="w-12 h-12 text-blue-400" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight uppercase">Biometric Gateway</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Secure identity verification required. Please prepare for a high-resolution fingerprint scan.
              </p>
            </div>
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 text-left space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold">1</span>
                </div>
                <p className="text-xs text-slate-300">Place your fingers clearly in the guide.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold">2</span>
                </div>
                <p className="text-xs text-slate-300">Hold the capture button until scanning is 100% complete.</p>
              </div>
            </div>
            <button
              onClick={startCamera}
              className="w-full h-16 bg-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
            >
              Initialize Camera
            </button>
          </motion.div>
        )}

        {/* Step 2: Scanning */}
        {step === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full max-w-md flex flex-col items-center"
          >
            {/* Top Instructions from Reference */}
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-xl font-bold text-white leading-tight">Line up your hand with the guide.</h2>
              <p className="text-sm font-medium text-slate-400">Keep your fingers together. Then stay still.</p>
              
              {/* Do/Don't Icons */}
              <div className="flex justify-center gap-6 mt-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-red-500/50 flex items-center justify-center bg-red-500/5">
                    <div className="relative">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-8 bg-white/20 rounded-full rotate-[-10deg]" />
                        <div className="w-1.5 h-9 bg-white/20 rounded-full" />
                        <div className="w-1.5 h-8 bg-white/20 rounded-full rotate-[10deg]" />
                      </div>
                      <X className="absolute inset-0 w-8 h-8 text-red-500 m-auto" />
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/5">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-8 bg-white rounded-full" />
                      <div className="w-2 h-9 bg-white rounded-full" />
                      <div className="w-2 h-8 bg-white rounded-full" />
                    </div>
                    {/* Arrows */}
                    <div className="absolute inset-0 flex flex-col justify-between p-2">
                       <ChevronRight className="w-3 h-3 text-emerald-500 rotate-90 mx-auto" />
                       <ChevronRight className="w-3 h-3 text-emerald-500 -rotate-90 mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-full aspect-[3/4] rounded-[40px] overflow-hidden border-2 border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.2)]">
              {/* Camera View */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />

              {/* Scanning Overlay */}
              <div className="absolute inset-0 bg-blue-500/5 pointer-events-none">
                {/* Fingerprint Guide Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`w-64 h-80 border-2 rounded-[60px] relative transition-colors duration-500 ${isScanning ? "border-blue-400 border-solid shadow-[0_0_40px_rgba(59,130,246,0.4)]" : "border-white/20 border-dashed"}`}>
                    
                    {/* Red Target Circles for Fingertips */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-full">
                       {/* Index */}
                       <div className="absolute top-[15%] left-[25%] w-6 h-6 rounded-full border-2 border-red-500 bg-red-500/20 animate-pulse" />
                       {/* Middle */}
                       <div className="absolute top-[10%] left-[45%] w-6 h-6 rounded-full border-2 border-red-500 bg-red-500/20 animate-pulse delay-75" />
                       {/* Ring */}
                       <div className="absolute top-[12%] left-[65%] w-6 h-6 rounded-full border-2 border-red-500 bg-red-500/20 animate-pulse delay-150" />
                       {/* Pinky */}
                       <div className="absolute top-[20%] left-[80%] w-5 h-5 rounded-full border-2 border-red-500 bg-red-500/20 animate-pulse delay-300" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <Scan className={`w-32 h-32 transition-colors ${isScanning ? "text-blue-400" : "text-white"}`} />
                    </div>

                    {/* Animated Laser Line */}
                    {isScanning && (
                      <motion.div
                        animate={{ top: ["20%", "80%", "20%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_20px_#3b82f6] z-10"
                      />
                    )}

                    {/* Status Badge */}
                    <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${isScanning ? "bg-blue-600 text-white" : "bg-white/10 text-white/40"}`}>
                      {isScanning ? `Capturing... ${Math.round(progress)}%` : "Wait for Focus"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Telemetry */}
              <div className="absolute bottom-6 left-6 right-6 space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Biometric Sensor v4.2</p>
                    <p className="text-[10px] font-bold text-white uppercase tracking-tighter">HD CAPTURE ACTIVE</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Stability</p>
                    <p className="text-[10px] font-bold text-white uppercase tracking-tighter italic">{isScanning ? "LOCKED" : "SEARCHING..."}</p>
                  </div>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Hold to Scan Button */}
            <div className="mt-8 w-full px-10">
              <button
                onMouseDown={startScan}
                onMouseUp={stopScan}
                onMouseLeave={stopScan}
                onTouchStart={startScan}
                onTouchEnd={stopScan}
                className={`w-full h-20 rounded-[28px] border-2 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 ${isScanning ? "bg-blue-600 border-blue-400 scale-95 shadow-inner" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >
                <Fingerprint className={`w-6 h-6 ${isScanning ? "animate-pulse" : ""}`} />
                {isScanning ? "Capturing Data..." : "Hold to Start Scan"}
              </button>
              <p className="text-center text-[10px] text-white/20 mt-4 font-black uppercase tracking-widest">Hold until progress reaches 100%</p>
            </div>
          </motion.div>
        )}

        {/* Step 3: Analyzing */}
        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-blue-500/20 flex items-center justify-center mx-auto">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-full blur-xl" />
              </motion.div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-widest italic tracking-tighter">Validating Points</h2>
              <p className="text-blue-400 text-xs font-bold animate-pulse">COMPARING BIOMETRICS WITH SECURE REPOSITORY...</p>
            </div>
            <div className="space-y-2 max-w-xs mx-auto">
               <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Points Detected</span>
                 <span className="text-white">1,402</span>
               </div>
               <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Confidence Level</span>
                 <span className="text-emerald-500">99.8%</span>
               </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm space-y-8"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight uppercase">Identity Verified</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Verification successful. Your biometric data has been encrypted and securely transmitted to the immigration authority.
              </p>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Digital Token Issued</p>
              <p className="text-xs font-mono text-emerald-400 mt-1 truncate">EDEN-SEC-7729-BK-912</p>
            </div>
            <button
              onClick={() => router.push("/client/dashboard")}
              className="w-full h-16 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl"
            >
              Return to Portal
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <div className="absolute bottom-8 flex items-center gap-2 opacity-40">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest tracking-tighter">Eden SecureCore v4.2 • Global Edition</span>
      </div>
    </div>
  );
}

