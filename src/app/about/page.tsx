"use client";

import { PublicNavbar } from "@/components/shared/public-navbar";
import { PublicFooter } from "@/components/shared/public-footer";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, Target, Rocket, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      <main className="pt-40 pb-20">
        {/* Hero Section */}
        <section className="px-6 mb-32">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <Badge className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                About Us
              </Badge>
              <h1 className="text-5xl md:text-7xl font-heading font-black text-secondary tracking-tighter leading-[1.1]">
                Leaders in <span className="text-primary">HR Solution</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                The world of work is changing, and we’re helping you stay ahead. Whether you’re looking for a new job or to hire your next star employee, we’re here to help.
              </p>
            </div>
            <div className="flex-1 relative">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000" 
                alt="Our Team" 
                className="rounded-[64px] shadow-3xl"
              />
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-12 bg-white rounded-[48px] border border-slate-100 shadow-xl shadow-secondary/5 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-black text-secondary tracking-tight">Our Vision</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-lg">
                  To be the most trusted immigration and HR solutions provider globally, connecting talent with opportunity and dreams with reality.
                </p>
              </div>
              <div className="p-12 bg-secondary text-white rounded-[48px] shadow-xl shadow-secondary/20 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-black tracking-tight">Our Mission</h3>
                <p className="text-slate-300 font-medium leading-relaxed text-lg">
                  To provide seamless, transparent, and expert guidance for Canadian immigration, ensuring every client's journey is smooth and successful.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl font-heading font-black text-secondary tracking-tighter">Our Core Values</h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">The principles that guide everything we do at Eden Food Canada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: "Integrity", icon: Award, desc: "Honest and transparent communication in every interaction." },
                { title: "Expertise", icon: Users, desc: "Deep knowledge of Canadian immigration law and HR trends." },
                { title: "Commitment", icon: Target, desc: "Unwavering dedication to our clients' success." },
                { title: "Innovation", icon: Rocket, desc: "Leveraging modern technology for a seamless process." }
              ].map((value, i) => (
                <div key={i} className="text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-secondary">{value.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
