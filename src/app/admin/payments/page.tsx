"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Download,
  Receipt,
  User,
  ExternalLink,
  DollarSign,
  Filter,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Activity,
  History,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPay, setSelectedPay] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [methodForm, setMethodForm] = useState({
    provider_name: "",
    account_number: "",
    instructions: "",
    image_url: ""
  });
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    await Promise.all([fetchPayments(), fetchMethods()]);
    setLoading(false);
  }

  async function fetchMethods() {
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .order("created_at", { ascending: false });
    setMethods(data || []);
  }

  async function fetchPayments() {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        client:client_id (full_name, phone)
      `)
      .order("paid_at", { ascending: false });

    if (error) {
      toast.error("Failed to load payments");
    } else {
      setPayments(data || []);
    }
    setLoading(false);
  }

  const handleSaveMethod = async () => {
    setUpdating(true);
    try {
      if (editingMethod) {
        const { error } = await supabase
          .from("payment_methods")
          .update(methodForm)
          .eq("id", editingMethod.id);
        if (error) throw error;
        toast.success("Payment method updated");
      } else {
        const { error } = await supabase
          .from("payment_methods")
          .insert(methodForm);
        if (error) throw error;
        toast.success("Payment method added");
      }
      setIsMethodDialogOpen(false);
      setEditingMethod(null);
      setMethodForm({ provider_name: "", account_number: "", instructions: "", image_url: "" });
      fetchMethods();
    } catch (error: any) {
      toast.error(error.message || "Failed to save method");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteMethod = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    try {
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Payment method deleted");
      fetchMethods();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete method");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUpdating(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `payment_methods/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setMethodForm(prev => ({ ...prev, image_url: filePath }));
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async (paymentId: string, status: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("payments")
        .update({ status })
        .eq("id", paymentId);

      if (error) throw error;
      toast.success(`Payment status updated`);
      setSelectedPay(null);
      fetchPayments();
    } catch (error: any) {
      toast.error(error.message || "Failed to update payment");
    } finally {
      setUpdating(false);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.client?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.payment_stage?.toLowerCase().includes(search.toLowerCase()) ||
    p.status?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full"
      />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-950 font-heading tracking-tight mb-2">Payment Management</h2>
          <p className="text-slate-500 font-medium text-lg">Monitor and verify client payments and manage bank details.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Dialog open={isMethodDialogOpen} onOpenChange={(open) => {
            setIsMethodDialogOpen(open);
            if (!open) { setEditingMethod(null); setMethodForm({ provider_name: "", account_number: "", instructions: "", image_url: "" }); }
          }}>
          <DialogTrigger render={
            <Button className="rounded-[20px] bg-blue-600 text-white font-black h-14 px-8 shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95">
              <Plus className="w-4 h-4 mr-2" /> Manage Bank Details
            </Button>
          } />
            <DialogContent className="rounded-[40px] max-w-4xl border-none bg-white p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-3xl font-black font-heading tracking-tight">Manage Payment Options</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">Add multiple bank accounts or payment providers for clients to see.</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Form Side */}
                <div className="space-y-6">
                  <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
                    <h3 className="text-xl font-black text-slate-900">{editingMethod ? "Edit Option" : "Add New Option"}</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Provider Name</label>
                        <Input 
                          placeholder="e.g. HBL Bank, JazzCash" 
                          value={methodForm.provider_name}
                          onChange={e => setMethodForm(p => ({...p, provider_name: e.target.value}))}
                          className="h-12 rounded-xl border-slate-200 bg-white font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Number / IBAN</label>
                        <Input 
                          placeholder="e.g. 1234-5678-9012" 
                          value={methodForm.account_number}
                          onChange={e => setMethodForm(p => ({...p, account_number: e.target.value}))}
                          className="h-12 rounded-xl border-slate-200 bg-white font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Additional Instructions</label>
                        <Textarea 
                          placeholder="Special instructions for the client..." 
                          value={methodForm.instructions}
                          onChange={e => setMethodForm(p => ({...p, instructions: e.target.value}))}
                          className="rounded-xl border-slate-200 bg-white font-medium resize-none h-24"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">QR Code or Bank Logo</label>
                        <div className="flex items-center gap-4">
                          <Button 
                            variant="outline" 
                            className="w-full h-12 rounded-xl border-slate-200 gap-2 font-bold bg-white relative overflow-hidden"
                          >
                            <Upload className="w-4 h-4" /> 
                            {methodForm.image_url ? "Change Image" : "Upload Image"}
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={handleFileUpload}
                              accept="image/*"
                            />
                          </Button>
                          {methodForm.image_url && (
                            <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden shrink-0">
                               <Image 
                                 src={supabase.storage.from('documents').getPublicUrl(methodForm.image_url).data.publicUrl} 
                                 alt="Preview" 
                                 width={48} 
                                 height={48} 
                                 className="object-cover"
                               />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSaveMethod}
                      disabled={updating || !methodForm.provider_name || !methodForm.account_number}
                      className="w-full h-14 rounded-2xl bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200"
                    >
                      {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingMethod ? "Save Changes" : "Create Option")}
                    </Button>
                    {editingMethod && (
                      <Button 
                        variant="ghost" 
                        onClick={() => { setEditingMethod(null); setMethodForm({ provider_name: "", account_number: "", instructions: "", image_url: "" }); }}
                        className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-widest"
                      >
                        Cancel Editing
                      </Button>
                    )}
                  </div>
                </div>

                {/* List Side */}
                <div className="space-y-6 overflow-y-auto pr-2">
                  <h3 className="text-xl font-black text-slate-900">Current Options</h3>
                  <div className="space-y-4">
                    {methods.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold text-xs">No payment options added yet.</p>
                      </div>
                    ) : methods.map(method => (
                      <div key={method.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs overflow-hidden">
                             {method.image_url ? (
                               <Image 
                                 src={supabase.storage.from('documents').getPublicUrl(method.image_url).data.publicUrl} 
                                 alt={method.provider_name} 
                                 width={48} 
                                 height={48} 
                                 className="object-cover"
                               />
                             ) : method.provider_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 leading-none mb-1">{method.provider_name}</p>
                            <p className="text-[10px] font-bold text-slate-400 tracking-tight">{method.account_number}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600"
                            onClick={() => {
                              setEditingMethod(method);
                              setMethodForm({
                                provider_name: method.provider_name,
                                account_number: method.account_number,
                                instructions: method.instructions || "",
                                image_url: method.image_url || ""
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600"
                            onClick={() => handleDeleteMethod(method.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-[24px] border border-slate-200 shadow-sm w-full sm:w-96 group focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search by client name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-bold p-0 h-8 text-sm"
            />
          </div>
        </div>
      </div>

      <Card className="border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[48px] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-6 px-10 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Payment Details</th>
                  <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Client Name</th>
                  <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Payment Date</th>
                  <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Status</th>
                  <th className="py-6 px-10 text-right text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {filteredPayments.map((p, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: i * 0.03 }}
                      key={p.id} 
                      className="hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer"
                    >
                      <td className="py-8 px-10">
                        <div className="flex items-center space-x-5">
                          <div className="w-14 h-14 rounded-[22px] bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <TrendingUp className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-black text-slate-950 text-lg tracking-tight mb-0.5">{p.currency} {p.amount.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.payment_stage.replace(/_/g, ' ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-8">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-sm">{p.client?.full_name}</span>
                          <span className="text-[11px] text-slate-400 font-bold tracking-tight">{p.client?.phone}</span>
                        </div>
                      </td>
                      <td className="py-8 px-8 text-slate-500 font-bold text-xs">
                        <div className="flex items-center space-x-2 bg-slate-100/50 px-3 py-1.5 rounded-full border border-slate-100 w-fit">
                          <History className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] uppercase tracking-wider">{new Date(p.paid_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-8 px-8">
                        <Badge className={cn(
                          "rounded-full border px-4 py-1.5 text-[9px] uppercase tracking-[0.15em] font-black",
                          p.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" :
                          p.status === 'rejected' ? "bg-rose-500/10 text-rose-600 border-rose-200" :
                          "bg-amber-500/10 text-amber-600 border-amber-200"
                        )}>
                          <ShieldCheck className="w-3 h-3 mr-1.5" />
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-8 px-10 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-12 w-12 rounded-[18px] bg-white border border-slate-200 shadow-sm hover:bg-slate-100 text-slate-400 transition-all duration-300 shadow-slate-200/40"
                            onClick={() => window.open(supabase.storage.from('documents').getPublicUrl(p.receipt_url).data.publicUrl, '_blank')}
                          >
                            <Receipt className="w-5 h-5" />
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger render={
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-12 w-12 rounded-[18px] bg-slate-950 border border-slate-900 shadow-xl hover:bg-slate-900 text-white transition-all duration-500 shadow-slate-950/20"
                                onClick={() => setSelectedPay(p)}
                              />
                            }>
                              <CheckCircle2 className="w-5 h-5" />
                            </DialogTrigger>
                            <DialogContent className="rounded-[40px] max-w-lg border-none bg-white p-8 shadow-2xl overflow-hidden">
                              <DialogHeader className="mb-6 text-center sm:text-left">
                                <div className="w-16 h-16 bg-emerald-500 rounded-[22px] flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-200 mx-auto sm:mx-0">
                                  <DollarSign className="w-8 h-8" />
                                </div>
                                <DialogTitle className="text-3xl font-black font-heading tracking-tight mb-2">Verify Payment</DialogTitle>
                                <DialogDescription className="text-slate-500 font-medium text-lg leading-snug">
                                  Review and confirm payment of <span className="text-emerald-600 font-black">{selectedPay?.currency} {selectedPay?.amount.toLocaleString()}</span> for <span className="text-slate-950 font-black">{selectedPay?.client?.full_name}</span>.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="py-6 flex justify-center">
                                <motion.div 
                                  whileHover={{ scale: 1.05 }}
                                  className="p-8 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 relative group cursor-pointer text-center w-full max-w-xs" 
                                  onClick={() => window.open(supabase.storage.from('documents').getPublicUrl(selectedPay?.receipt_url).data.publicUrl, '_blank')}
                                >
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Eye className="w-5 h-5" />
                                  </div>
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">View Payment Receipt</p>
                                </motion.div>
                              </div>
                              
                              <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                <Button 
                                  variant="destructive" 
                                  className="rounded-[18px] h-14 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-100"
                                  onClick={() => handleUpdateStatus(selectedPay.id, 'rejected')}
                                  disabled={updating}
                                >
                                  <XCircle className="w-4 h-4 mr-2" /> Reject
                                </Button>
                                <Button 
                                  variant="default" 
                                  className="rounded-[18px] h-14 font-black uppercase text-[10px] tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-100"
                                  onClick={() => handleUpdateStatus(selectedPay.id, 'confirmed')}
                                  disabled={updating}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredPayments.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-[48px] border border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-10 h-10 text-slate-200" />
           </div>
           <h3 className="text-xl font-black text-slate-900 mb-2">No Payments Found</h3>
           <p className="text-slate-500 font-medium">Adjust your filters or search to find payments.</p>
        </div>
      )}
    </div>
  );
}
