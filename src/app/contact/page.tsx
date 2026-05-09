"use client";

import { PublicNavbar } from "@/components/shared/public-navbar";
import { PublicFooter } from "@/components/shared/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MessageSquare, Phone, Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black">Get In Touch</Badge>
                <h1 className="text-5xl md:text-7xl font-heading font-black text-secondary tracking-tighter">Contact Us Today!</h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  Ready to start your Canadian journey? Fill out the form below, and our expert team at Eden Food Canada will reach out via WhatsApp to assist you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-secondary">WhatsApp Support</h4>
                  <p className="text-sm text-slate-500">+1 (289) 784-0100</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-secondary">Email Us</h4>
                  <p className="text-sm text-slate-500">info@edenfoodcanada.com</p>
                </div>
              </div>

              <div className="p-10 bg-secondary rounded-[48px] text-white space-y-8">
                <h3 className="text-2xl font-black tracking-tight">Our Office</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <p className="text-slate-300 font-medium text-sm">Toronto, Ontario, Canada</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-primary" />
                    <p className="text-slate-300 font-medium text-sm">+1 (416) 555-0199</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-[48px] p-10 md:p-14 border border-slate-100 shadow-2xl shadow-secondary/5">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Full Name</label>
                    <input type="text" className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-bold text-secondary focus:border-primary outline-none transition-all" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">WhatsApp Number</label>
                    <input type="tel" className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-bold text-secondary focus:border-primary outline-none transition-all" placeholder="+1 (___) ___-____" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Passport Number</label>
                    <input type="text" className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-bold text-secondary focus:border-primary outline-none transition-all" placeholder="Enter passport number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Your Message</label>
                    <textarea className="w-full h-40 bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 font-bold text-secondary focus:border-primary outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
                  </div>
                  <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-red-700 text-white font-black text-lg transition-all shadow-xl shadow-red-500/20">
                    Send Message <Send className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
