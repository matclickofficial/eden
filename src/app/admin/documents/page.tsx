"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Files, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  AlertCircle,
  FileText,
  User,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Edit3,
  Filter,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    const { data, error } = await supabase
      .from("documents")
      .select(`
        *,
        client:client_id (full_name, phone)
      `)
      .order("uploaded_at", { ascending: false });

    if (error) {
      toast.error("Failed to load documents");
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  }

  const handleUpdateStatus = async (docId: string, status: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("documents")
        .update({ 
          status, 
          admin_note: adminNote,
          verified_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq("id", docId);

      if (error) throw error;
      toast.success(`Document status updated`);
      setSelectedDoc(null);
      setAdminNote("");
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.message || "Failed to update document");
    } finally {
      setUpdating(false);
    }
  };

  const filteredDocs = documents.filter(d => 
    d.client?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.doc_type?.toLowerCase().includes(search.toLowerCase()) ||
    d.status?.toLowerCase().includes(search.toLowerCase())
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
          <h2 className="text-4xl font-black text-slate-950 font-heading tracking-tight mb-2">Document Verification</h2>
          <p className="text-slate-500 font-medium text-lg">Review and approve documents submitted by clients.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-[24px] border border-slate-200 shadow-sm w-full sm:w-96 group focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search by client or document type..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-bold p-0 h-8 text-sm"
            />
          </div>
          <Button className="rounded-[20px] bg-slate-950 text-white font-black h-14 px-8 shadow-2xl shadow-slate-200 hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-95">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <Card className="border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[48px] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="py-6 px-10 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Document Type</th>
                    <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Client Name</th>
                    <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Upload Date</th>
                    <th className="py-6 px-8 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Current Status</th>
                    <th className="py-6 px-10 text-right text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredDocs.map((doc, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: i * 0.03 }}
                        key={doc.id} 
                        className="hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer"
                      >
                        <td className="py-8 px-10">
                          <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 rounded-[22px] bg-slate-950 flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-black text-slate-950 text-base tracking-tight capitalize">{doc.doc_type.replace(/_/g, ' ')}</p>
                              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center mt-0.5">
                                <ShieldCheck className="w-3 h-3 mr-1.5" /> PENDING REVIEW
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-8">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-sm">{doc.client?.full_name}</span>
                            <span className="text-[11px] text-slate-400 font-bold tracking-tight">{doc.client?.phone}</span>
                          </div>
                        </td>
                        <td className="py-8 px-8 text-slate-500 font-bold text-xs">
                          <div className="flex items-center space-x-2 bg-slate-100/50 px-3 py-1.5 rounded-full border border-slate-100 w-fit">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] uppercase tracking-wider">{new Date(doc.uploaded_at).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-8 px-8">
                          <Badge className={cn(
                            "rounded-full border px-4 py-1.5 text-[9px] uppercase tracking-[0.15em] font-black",
                            doc.status === 'approved' ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" :
                            doc.status === 'rejected' ? "bg-rose-500/10 text-rose-600 border-rose-200" :
                            doc.status === 'reupload_required' ? "bg-amber-500/10 text-amber-600 border-amber-200" :
                            "bg-blue-500/10 text-blue-600 border-blue-200"
                          )}>
                            {doc.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-8 px-10 text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-12 w-12 rounded-[18px] bg-white border border-slate-200 shadow-sm hover:bg-slate-100 text-slate-400 transition-all duration-300 shadow-slate-200/40"
                              onClick={() => window.open(supabase.storage.from('documents').getPublicUrl(doc.file_url).data.publicUrl, '_blank')}
                            >
                              <Eye className="w-5 h-5" />
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger render={
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-12 w-12 rounded-[18px] bg-slate-950 border border-slate-900 shadow-xl hover:bg-slate-900 text-white transition-all duration-500 shadow-slate-950/20"
                                  onClick={() => {
                                    setSelectedDoc(doc);
                                    setAdminNote(doc.admin_note || "");
                                  }}
                                />
                              }>
                                <Edit3 className="w-5 h-5" />
                              </DialogTrigger>
                              <DialogContent className="rounded-[40px] max-w-lg border-none bg-white p-8 shadow-2xl overflow-hidden">
                                <DialogHeader className="mb-6">
                                  <div className="w-16 h-16 bg-blue-600 rounded-[22px] flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-200">
                                    <ShieldCheck className="w-8 h-8" />
                                  </div>
                                  <DialogTitle className="text-3xl font-black font-heading tracking-tight mb-2">Verify Document</DialogTitle>
                                  <DialogDescription className="text-slate-500 font-medium text-lg leading-snug">
                                    Review document: <span className="text-slate-950 font-black capitalize">{selectedDoc?.doc_type.replace(/_/g, ' ')}</span> for <span className="text-slate-950 font-black">{selectedDoc?.client?.full_name}</span>.
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-6 py-2">
                                  <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                      <MessageSquare className="w-3 h-3 mr-2" /> Verification Note
                                    </label>
                                    <Textarea 
                                      className="rounded-[24px] min-h-[140px] border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium p-6 resize-none" 
                                      placeholder="Provide details about the verification status..."
                                      value={adminNote}
                                      onChange={(e) => setAdminNote(e.target.value)}
                                    />
                                  </div>
                                </div>
                                
                                <DialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                                  <Button 
                                    variant="destructive" 
                                    className="rounded-[18px] h-14 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-100"
                                    onClick={() => handleUpdateStatus(selectedDoc.id, 'rejected')}
                                    disabled={updating}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="rounded-[18px] h-14 font-black uppercase text-[10px] tracking-widest border-amber-200 text-amber-600 hover:bg-amber-50"
                                    onClick={() => handleUpdateStatus(selectedDoc.id, 'reupload_required')}
                                    disabled={updating}
                                  >
                                    <Clock className="w-4 h-4 mr-2" /> Re-upload
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    className="rounded-[18px] h-14 font-black uppercase text-[10px] tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-100"
                                    onClick={() => handleUpdateStatus(selectedDoc.id, 'approved')}
                                    disabled={updating}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
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
      </div>
      
      {filteredDocs.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-[48px] border border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Files className="w-10 h-10 text-slate-200" />
           </div>
           <h3 className="text-xl font-black text-slate-900 mb-2">No Documents Found</h3>
           <p className="text-slate-500 font-medium">Adjust filters or search criteria to see results.</p>
        </div>
      )}
    </div>
  );
}
