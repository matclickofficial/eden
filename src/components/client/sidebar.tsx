"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Files,
  CreditCard,
  MessageSquare,
  User,
  Users,
  Fingerprint,
  LogOut,
  ChevronRight,
  X,
  Globe,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard",         href: "/client/dashboard",  icon: LayoutDashboard },
  { label: "Apply Now",         href: "/client/apply",      icon: FileText },
  { label: "My Status",         href: "/client/status",     icon: Globe },
  { label: "Documents",         href: "/client/documents",  icon: Files },
  { label: "Virtual Interview", href: "/client/interview",  icon: Video },
  { label: "Family Management", href: "/client/family",     icon: Users },
  { label: "Secure Biometrics", href: "/client/biometrics", icon: Fingerprint },
  { label: "Payments",          href: "/client/payments",   icon: CreditCard },
  { label: "My Profile",        href: "/client/profile",    icon: User },
];

interface ClientSidebarProps {
  displayName?: string;
  initials?: string;
  email?: string;
  onClose?: () => void;
}

export function ClientSidebar({ displayName = "Client", initials = "CL", email = "", onClose }: ClientSidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full w-72 bg-[#0A1128] text-white shadow-2xl">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <Link href="/client/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="w-9 h-9 rounded-xl bg-[#D11218] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-lg italic">E</span>
          </div>
          <div>
            <p className="font-black text-base text-white leading-none">Eden Portal</p>
            <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-0.5">Client Area</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>
        )}
      </div>

      {/* User card */}
      <div className="mx-4 mt-5 mb-2 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D11218] flex items-center justify-center font-black text-sm text-white shrink-0 shadow-lg">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-white truncate leading-none">{displayName}</p>
            <p className="text-[11px] text-white/40 truncate mt-0.5">{email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto no-scrollbar">
        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-3 mb-2">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-[#D11218] text-white shadow-lg shadow-red-900/30"
                  : "text-white/50 hover:bg-white/8 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-white" : "text-white/50 group-hover:text-white/80")} />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/8 hover:text-white/70 transition-all group mb-1"
        >
          <Globe className="w-[18px] h-[18px]" />
          <span className="font-semibold text-sm">Back to Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
