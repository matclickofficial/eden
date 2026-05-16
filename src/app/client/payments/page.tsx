"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Download, 
  ExternalLink, 
  Shield, 
  Upload, 
  Plus, 
  Loader2,
  AlertCircle,
  ChevronRight,
  Wallet
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ClientPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const [uploadForm, setUploadForm] = useState({
    method_id: "",
    amount: "",
    receipt_url: "",
    stage: "registration"
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [paymentsRes, methodsRes] = await Promise.all([
      supabase.from("payments").select("*").eq("client_id", user.id).order("paid_at", { ascending: false }),
      supabase.from("payment_methods").select("*").eq("is_active", true)
    ]);

    setPayments(paymentsRes.data || []);
    setMethods(methodsRes.data || []);
    setLoading(false);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadForm(prev => ({ ...prev, receipt_url: filePath }));
      toast.success("Receipt uploaded to server");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitReceipt = async () => {
    if (!uploadForm.method_id || !uploadForm.amount || !uploadForm.receipt_url) return;
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("payments")
        .insert({
          client_id: user?.id,
          payment_method_id: uploadForm.method_id,
          amount: parseFloat(uploadForm.amount),
          receipt_url: uploadForm.receipt_url,
          payment_stage: uploadForm.stage,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success("Payment submitted for verification!");
      setIsUploadOpen(false);
      setUploadForm({ method_id: "", amount: "", receipt_url: "", stage: "registration" });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Submission failed");
    } finally {
      setUploading(false);
    }
  };

  const totalPaid = payments.filter(p => p.status === 'confirmed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 font-heading tracking-tight">Financial Overview</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">View payment options and submit your receipts for verification.</p>
        </div>
        <Button 
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black h-14 px-8 shadow-xl shadow-blue-500/20 gap-2"
        >
          {isUploadOpen ? "Cancel Upload" : <><Upload className="w-4 h-4" /> SUBMIT RECEIPT</>}
        </Button>
      </div>

      <AnimatePresence>
        {isUploadOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[32px] border-2 border-blue-100 p-8 shadow-2xl shadow-blue-500/5 grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                     <Plus className="w-5 h-5" />
                   </div>
                   Submit New Receipt
                 </h3>
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Payment Method Used</label>
                     <Select value={uploadForm.method_id} onValueChange={v => setUploadForm(p => ({...p, method_id: v}))}>
                       <SelectTrigger className="h-12 rounded-xl border-slate-200">
                         <SelectValue placeholder="Select Bank/Provider" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-none bg-slate-950 text-white">
                         {methods.map(m => (
                           <SelectItem key={m.id} value={m.id} className="font-bold">{m.provider_name}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount Paid</label>
                        <Input 
                          type="number"
                          placeholder="0.00"
                          value={uploadForm.amount}
                          onChange={e => setUploadForm(p => ({...p, amount: e.target.value}))}
                          className="h-12 rounded-xl border-slate-200 font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Payment Stage</label>
                        <Select value={uploadForm.stage} onValueChange={v => setUploadForm(p => ({...p, stage: v}))}>
                          <SelectTrigger className="h-12 rounded-xl border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none bg-slate-950 text-white">
                            <SelectItem value="registration" className="font-bold uppercase text-[10px]">Registration</SelectItem>
                            <SelectItem value="processing" className="font-bold uppercase text-[10px]">Processing</SelectItem>
                            <SelectItem value="visa_ticket" className="font-bold uppercase text-[10px]">Visa & Ticket</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Upload Receipt Screenshot</label>
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="outline" 
                          className="flex-1 h-12 rounded-xl border-slate-200 border-dashed hover:border-blue-500 hover:bg-blue-50/50 transition-all gap-2 relative overflow-hidden"
                        >
                          <Upload className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-slate-600">{uploadForm.receipt_url ? "File Ready" : "Click to Upload Screenshot"}</span>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept="image/*" />
                        </Button>
                        {uploadForm.receipt_url && (
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                   </div>
                 </div>
                 <Button 
                  onClick={handleSubmitReceipt}
                  disabled={uploading || !uploadForm.method_id || !uploadForm.amount || !uploadForm.receipt_url}
                  className="w-full h-14 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20"
                 >
                   {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "SUBMIT FOR VERIFICATION"}
                 </Button>
               </div>

               <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 flex flex-col justify-center text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-[22px] flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">Secure Verification</h4>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Your payment screenshot will be verified by our accounts department within 24-48 hours. Once confirmed, your application status will be updated automatically.</p>
                  <div className="flex items-center justify-center gap-2 py-3 px-4 bg-white rounded-2xl border border-slate-200 w-fit mx-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SSL Encrypted Transaction</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-slate-900 font-heading">Active Payment Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methods.map((method) => (
              <motion.div 
                key={method.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                    {method.image_url ? (
                      <Image 
                        src={supabase.storage.from('documents').getPublicUrl(method.image_url).data.publicUrl} 
                        alt={method.provider_name} 
                        width={56} 
                        height={56} 
                        className="object-cover"
                      />
                    ) : <Wallet className="w-6 h-6 text-slate-300" />}
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[8px] font-black uppercase">Verified</Badge>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-1">{method.provider_name}</h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Number / IBAN</p>
                  <p className="font-black text-slate-900 font-mono tracking-tight">{method.account_number}</p>
                </div>
                {method.instructions && (
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">{method.instructions}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 font-heading">Your Stats</h3>
          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Total Confirmed Paid</p>
            <h3 className="text-4xl font-black mb-10">PKR {totalPaid.toLocaleString()}</h3>
            
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold">Confirmed</span>
                  </div>
                  <span className="text-sm font-black">{payments.filter(p => p.status === 'confirmed').length}</span>
               </div>
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-xs font-bold">Pending</span>
                  </div>
                  <span className="text-sm font-black">{payments.filter(p => p.status === 'pending').length}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
          <p className="text-xl font-black text-slate-900 font-heading">Payment History</p>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Data</span>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {payments.length === 0 ? (
            <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No transactions recorded</div>
          ) : payments.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between px-10 py-8 hover:bg-slate-50/50 transition-colors group"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-[20px] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                  p.status === "confirmed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                )}>
                  {p.status === "confirmed" ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg leading-none mb-1 capitalize">{p.payment_stage.replace('_', ' ')} Fee</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(p.paid_at).toLocaleDateString()} · {p.id.slice(0,8)}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className={cn("font-black text-xl leading-none mb-1", p.status === "confirmed" ? "text-slate-900" : "text-amber-600")}>
                    PKR {p.amount.toLocaleString()}
                  </p>
                  <Badge className={cn(
                    "rounded-full text-[8px] font-black uppercase tracking-widest px-3 py-1 border-none shadow-sm",
                    p.status === "confirmed" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  )}>
                    {p.status}
                  </Badge>
                </div>
                {p.receipt_url && (
                  <a 
                    href={supabase.storage.from('documents').getPublicUrl(p.receipt_url).data.publicUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
