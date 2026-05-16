"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ChevronRight,
  User,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Filter,
  CheckCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AdminSupportDeskPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [filter, setFilter] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  useEffect(() => {
    if (selectedTicket) {
      fetchReplies(selectedTicket.id);
    }
  }, [selectedTicket]);

  async function fetchTickets() {
    setLoading(true);
    let query = supabase
      .from("support_tickets")
      .select("*, client:profiles(full_name, role)")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    setTickets(data || []);
    setLoading(false);
  }

  async function fetchReplies(ticketId: string) {
    const { data } = await supabase
      .from("ticket_replies")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    setReplies(data || []);
  }

  async function handleSendReply() {
    if (!newReply || !selectedTicket) return;
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("ticket_replies")
      .insert({
        ticket_id: selectedTicket.id,
        sender_id: user?.id,
        message: newReply,
        is_admin: true
      });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewReply("");
      fetchReplies(selectedTicket.id);
    }
    setSending(false);
  }

  async function handleUpdateStatus(status: string) {
    if (!selectedTicket) return;
    const { error } = await supabase
      .from("support_tickets")
      .update({ status })
      .eq("id", selectedTicket.id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Ticket marked as ${status}`);
      fetchTickets();
      setSelectedTicket({...selectedTicket, status});
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-heading">Admin Command Support</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">Manage and respond to client inquiries and issues.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
             <SelectTrigger className="w-40 rounded-2xl border-slate-100 bg-white shadow-sm font-bold text-[10px] uppercase tracking-widest">
                <SelectValue placeholder="Filter Status" />
             </SelectTrigger>
             <SelectContent className="rounded-2xl border-none bg-slate-950 text-white">
                <SelectItem value="all" className="font-bold">ALL TICKETS</SelectItem>
                <SelectItem value="open" className="font-bold">OPEN</SelectItem>
                <SelectItem value="closed" className="font-bold">CLOSED</SelectItem>
             </SelectContent>
          </Select>
          <Button 
            variant="ghost" 
            onClick={fetchTickets}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm"
          >
            <RefreshCw className={cn("w-4 h-4", loading ? "animate-spin" : "")} />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Tickets List */}
        <div className="w-96 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by client or subject..." 
              className="pl-10 h-12 rounded-2xl border-slate-100 bg-white shadow-sm"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
            {loading ? (
              <div className="flex flex-col gap-3">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />)}
              </div>
            ) : tickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={cn(
                  "w-full text-left p-6 rounded-[32px] border-2 transition-all group",
                  selectedTicket?.id === ticket.id 
                    ? "border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-500/5" 
                    : "border-slate-50 bg-white hover:border-slate-200"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    <Badge variant="outline" className={cn(
                      "text-[8px] font-black uppercase px-2 py-0",
                      ticket.status === 'open' ? "text-blue-600 border-blue-100" : "text-slate-400 border-slate-100"
                    )}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
                <p className="font-black text-slate-900 text-base truncate group-hover:text-blue-600 transition-colors leading-tight">{ticket.subject}</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                      <User className="w-3 h-3" />
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{ticket.client?.full_name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-[48px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-black text-slate-900 font-heading">{selectedTicket.subject}</h3>
                      <Badge className="bg-blue-600 rounded-full text-[10px] font-black tracking-widest px-3 py-1">{selectedTicket.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Client: {selectedTicket.client?.full_name} · ID: {selectedTicket.id.slice(0,8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   {selectedTicket.status === 'open' ? (
                     <Button 
                      onClick={() => handleUpdateStatus('closed')}
                      variant="outline"
                      className="rounded-2xl border-slate-200 h-12 px-6 font-black uppercase text-[10px] tracking-widest hover:bg-slate-950 hover:text-white transition-all"
                     >
                       <CheckCircle className="w-4 h-4 mr-2" /> Mark as Resolved
                     </Button>
                   ) : (
                    <Button 
                      onClick={() => handleUpdateStatus('open')}
                      variant="outline"
                      className="rounded-2xl border-slate-200 h-12 px-6 font-black uppercase text-[10px] tracking-widest"
                     >
                       Re-open Ticket
                     </Button>
                   )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/20">
                {/* Original Description */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-[20px] bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="space-y-3 max-w-[80%]">
                    <div className="bg-white p-8 rounded-[32px] rounded-tl-none border border-slate-100 shadow-sm">
                      <p className="text-base text-slate-700 font-medium leading-relaxed">{selectedTicket.description}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase ml-3">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {replies.map((reply) => {
                   const isAdmin = reply.is_admin;
                   return (
                     <div key={reply.id} className={cn("flex gap-5", isAdmin ? "flex-row-reverse" : "")}>
                        <div className={cn(
                          "w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0",
                          isAdmin ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-900 text-white"
                        )}>
                          {isAdmin ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </div>
                        <div className={cn("space-y-3 max-w-[80%]", isAdmin ? "items-end" : "")}>
                          <div className={cn(
                            "p-8 rounded-[32px] border shadow-sm",
                            isAdmin 
                              ? "bg-blue-600 text-white border-blue-500 rounded-tr-none shadow-blue-500/5" 
                              : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
                          )}>
                            <p className="text-base font-medium leading-relaxed">{reply.message}</p>
                          </div>
                          <span className={cn("text-[10px] font-black text-slate-400 uppercase", isAdmin ? "mr-3" : "ml-3")}>
                            {new Date(reply.created_at).toLocaleString()}
                          </span>
                        </div>
                     </div>
                   );
                })}
              </div>

              {/* Reply Input */}
              <div className="p-8 bg-white border-t border-slate-50">
                <div className="relative flex items-center">
                  <Input 
                    placeholder="Draft response to client..." 
                    className="h-20 pl-8 pr-24 rounded-[32px] border-slate-100 bg-slate-50/50 font-medium focus:ring-blue-600/5 transition-all text-base shadow-inner"
                    value={newReply}
                    onChange={e => setNewReply(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                  />
                  <Button 
                    onClick={handleSendReply}
                    disabled={sending || !newReply}
                    className="absolute right-3 w-14 h-14 rounded-[24px] bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <Send className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
               <div className="w-32 h-32 bg-slate-50 rounded-[48px] flex items-center justify-center mb-10">
                  <MessageSquare className="w-12 h-12 text-slate-200" />
               </div>
               <h3 className="text-3xl font-black text-slate-900 font-heading">Command Intelligence</h3>
               <p className="text-slate-400 font-medium max-w-sm mt-3">Select a client ticket to begin operational response. All communications are logged for audit purposes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
