"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { animate, motion, useScroll, useTransform } from "framer-motion";

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
        isScrolled ? "py-4" : "py-8"
      )}
    >
      <div 
        className={cn(
          "max-w-7xl mx-auto px-8 h-16 rounded-[24px] flex items-center justify-between transition-all duration-500",
          isScrolled 
            ? "glass-dark bg-slate-950/90 text-white border-white/5 shadow-2xl" 
            : "bg-white/50 backdrop-blur-md border border-slate-100 shadow-sm"
        )}
      >
        <Link href="/" className="flex items-center space-x-3 group">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
            isScrolled ? "bg-white shadow-lg" : "bg-primary shadow-xl shadow-red-200"
          )}>
             <Globe className={cn("w-6 h-6", isScrolled ? "text-primary" : "text-white")} />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-heading font-black text-xl tracking-tight leading-none",
              isScrolled ? "text-white" : "text-secondary"
            )}>EDEN</span>
            <span className={cn(
              "text-[9px] uppercase tracking-[0.2em] font-bold mt-0.5",
              isScrolled ? "text-red-400" : "text-primary"
            )}>Immigration</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className={cn(
          "hidden lg:flex items-center space-x-8 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors",
          isScrolled ? "text-slate-300" : "text-slate-600"
        )}>
          {[
            { name: "Home", href: "/" },
            { name: "Online Status", href: "/online-status" },
            { name: "Apply Biometric", href: "/apply-biometric" },
            { name: "Payments", href: "/payments" },
            { name: "Current Openings", href: "/jobs" }
          ].map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className={cn(
                "hover:text-primary transition-all relative group py-2",
                isScrolled ? "hover:text-white" : "hover:text-secondary"
              )}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full rounded-full" />
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className={cn(
              "font-bold rounded-xl transition-colors",
              isScrolled ? "text-white hover:bg-white/10" : "text-secondary hover:bg-slate-100"
            )}>Client Login</Button>
          </Link>
          <Link href="/register">
            <Button className={cn(
              "font-bold rounded-xl px-8 h-11 transition-all shadow-lg",
              isScrolled ? "bg-white text-primary hover:bg-slate-100" : "bg-primary text-white hover:bg-red-700 shadow-red-200"
            )}>Apply Now</Button>
          </Link>
        </div>

        {/* Mobile Trigger */}
        <button 
          className={cn(
            "lg:hidden p-2 rounded-xl border transition-colors",
            isScrolled ? "border-white/10 text-white hover:bg-white/5" : "border-slate-100 text-secondary hover:bg-slate-50"
          )} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-24 left-6 right-6 bg-secondary border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl z-50 backdrop-blur-3xl"
        >
          <div className="flex flex-col space-y-6 text-center font-bold uppercase tracking-widest text-slate-400">
             {[
               { name: "Home", href: "/" },
               { name: "Online Status", href: "/online-status" },
               { name: "Apply Biometric", href: "/apply-biometric" },
               { name: "Payments", href: "/payments" },
               { name: "Current Openings", href: "/jobs" },
               { name: "About Us", href: "/about" },
               { name: "Contact Us", href: "/contact" }
             ].map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="hover:text-white text-sm">{item.name}</Link>
             ))}
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full font-bold h-14 rounded-2xl border-white/10 text-white hover:bg-white/5">Client Login</Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button className="w-full font-bold h-14 rounded-2xl bg-primary text-white hover:bg-red-700">Apply Now</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
