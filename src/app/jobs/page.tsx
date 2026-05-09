"use client";

import { PublicNavbar } from "@/components/shared/public-navbar";
import { PublicFooter } from "@/components/shared/public-footer";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, MapPin, Search } from "lucide-react";

export default function JobsPage() {
  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black">Careers</Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-black text-secondary tracking-tighter">Current Openings</h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Find your next career opportunity in Canada. We update our job board daily with positions from across the country.
            </p>
          </div>

          <div className="bg-slate-50 rounded-[48px] p-12 text-center border-2 border-dashed border-slate-200">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-secondary tracking-tight">Adding newly Updated Jobs</h3>
              <p className="text-slate-500 font-medium">
                Our team is currently finalizing a new list of job openings across various sectors in Canada. Please check back in a few hours for the latest updates.
              </p>
              <div className="pt-6">
                <button className="px-8 py-4 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all">
                  Notify Me When Updated
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-40 grayscale pointer-events-none">
            {[
              { title: "Warehouse Associate", loc: "Brampton, ON", type: "Full-time" },
              { title: "Administrative Assistant", loc: "Toronto, ON", type: "Contract" },
              { title: "Delivery Driver", loc: "Mississauga, ON", type: "Full-time" }
            ].map((job, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-slate-400" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider">{job.type}</Badge>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-secondary mb-2">{job.title}</h4>
                  <div className="flex items-center space-x-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.loc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
