"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ChevronRight,
  User,
  ShieldCheck,
  RefreshCw,
  Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SupportDeskPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [newTicket, setNewTicket] = useState({ subject: "", description: "" });
  const supabase = createClient();

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchReplies(selectedTicket.id);
    }
  }, [selectedTicket]);

  async function fetchTickets() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

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

  async function handleCreateTicket() {
    if (!newTicket.subject || !newTicket.description) return;
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        client_id: user?.id,
        subject: newTicket.subject,
        description: newTicket.description,
        status: "open",
        priority: "normal"
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create ticket");
    } else {
      toast.success("Ticket issued successfully!");
      setNewTicket({ subject: "", description: "" });
      setCreating(false);
      fetchTickets();
      setSelectedTicket(data);
    }
    setSending(false);
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
        message: newReply
      });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewReply("");
      fetchReplies(selectedTicket.id);
    }
    setSending(false);
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-heading">Support Desk</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">Issue tickets and communicate directly with our administration team.</p>
        </div>
        <Button 
          onClick={() => setCreating(true)}
          className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black px-6 h-12 shadow-xl shadow-blue-500/20 gap-2"
        >
          <Plus className="w-4 h-4" /> NEW TICKET
        </Button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Tickets List */}
        <div className="w-80 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search tickets..." 
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
                  "w-full text-left p-5 rounded-3xl border-2 transition-all group",
                  selectedTicket?.id === ticket.id 
                    ? "border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-500/5" 
                    : "border-slate-50 bg-white hover:border-slate-200"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-black uppercase px-2 py-0",
                    ticket.status === 'open' ? "text-blue-600 border-blue-100" : "text-slate-400 border-slate-100"
                  )}>
                    {ticket.status}
                  </Badge>
                  <span className="text-[9px] font-bold text-slate-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
                <p className="font-black text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">{ticket.subject}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-1">{ticket.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {creating ? (
             <div className="flex-1 flex flex-col p-10 max-w-2xl mx-auto w-full">
                <div className="mb-10">
                  <h3 className="text-3xl font-black text-slate-900 font-heading">Issue New Ticket</h3>
                  <p className="text-slate-400 font-medium mt-2">Clearly describe your issue so we can assist you better.</p>
                </div>
                <div className="space-y-6 flex-1">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                     <Input 
                        placeholder="e.g. Visa Processing Delay" 
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
                        value={newTicket.subject}
                        onChange={e => setNewTicket(p => ({...p, subject: e.target.value}))}
                     />
                   </div>
                   <div className="space-y-2 flex-1 flex flex-col">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                     <Textarea 
                        placeholder="Please provide all relevant details..." 
                        className="flex-1 rounded-3xl border-slate-100 bg-slate-50/50 font-medium p-6 resize-none"
                        value={newTicket.description}
                        onChange={e => setNewTicket(p => ({...p, description: e.target.value}))}
                     />
                   </div>
                </div>
                <div className="mt-10 flex gap-4">
                  <Button variant="ghost" onClick={() => setCreating(false)} className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</Button>
                  <Button 
                    onClick={handleCreateTicket}
                    disabled={sending || !newTicket.subject || !newTicket.description}
                    className="flex-1 h-14 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ISSUE TICKET"}
                  </Button>
                </div>
             </div>
          ) : selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black text-slate-900 font-heading">{selectedTicket.subject}</h3>
                    <Badge className="bg-blue-600 rounded-full text-[9px] font-black tracking-widest px-2 py-0.5">{selectedTicket.status}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ticket ID: {selectedTicket.id.slice(0,8)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900 uppercase">Assigned To</p>
                    <p className="text-xs font-bold text-blue-600">Admin Support</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
                {/* Original Description */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 max-w-[80%]">
                    <div className="bg-white p-6 rounded-[28px] rounded-tl-none border border-slate-100 shadow-sm">
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">{selectedTicket.description}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase ml-2">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {replies.map((reply) => {
                   const isAdmin = reply.is_admin;
                   return (
                     <div key={reply.id} className={cn("flex gap-4", isAdmin ? "flex-row-reverse" : "")}>
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                          isAdmin ? "bg-blue-600 text-white" : "bg-slate-900 text-white"
                        )}>
                          {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>
                        <div className={cn("space-y-2 max-w-[80%]", isAdmin ? "items-end" : "")}>
                          <div className={cn(
                            "p-6 rounded-[28px] border shadow-sm",
                            isAdmin 
                              ? "bg-blue-600 text-white border-blue-500 rounded-tr-none" 
                              : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
                          )}>
                            <p className="text-sm font-medium leading-relaxed">{reply.message}</p>
                          </div>
                          <span className={cn("text-[9px] font-bold text-slate-400 uppercase", isAdmin ? "mr-2" : "ml-2")}>
                            {new Date(reply.created_at).toLocaleString()}
                          </span>
                        </div>
                     </div>
                   );
                })}
              </div>

              {/* Reply Input */}
              <div className="p-6 bg-white border-t border-slate-100">
                <div className="relative flex items-center">
                  <Input 
                    placeholder="Type your message..." 
                    className="h-16 pl-6 pr-20 rounded-[28px] border-slate-100 bg-slate-50/50 font-medium focus:ring-blue-600/5 transition-all"
                    value={newReply}
                    onChange={e => setNewReply(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                  />
                  <Button 
                    onClick={handleSendReply}
                    disabled={sending || !newReply}
                    className="absolute right-2 w-12 h-12 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
               <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8">
                  <MessageSquare className="w-10 h-10 text-slate-200" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 font-heading">Support Interaction Center</h3>
               <p className="text-slate-400 font-medium max-w-sm mt-2">Select a ticket from the left to view conversation history or issue a new ticket for assistance.</p>
               <Button 
                onClick={() => setCreating(true)}
                variant="outline" 
                className="mt-10 rounded-2xl border-slate-200 font-black uppercase text-[10px] tracking-widest px-8"
               >
                 Create First Ticket
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
