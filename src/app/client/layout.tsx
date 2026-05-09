"use client";

import { useState, useEffect } from "react";
import { ClientSidebar } from "@/components/client/sidebar";
import { Bell, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/client/dashboard": "Dashboard",
  "/client/apply": "Submit Application",
  "/client/status": "Application Status",
  "/client/documents": "Documents",
  "/client/payments": "Payments",
  "/client/messages": "Messages",
  "/client/profile": "My Profile",
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, role")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const pageTitle = PAGE_TITLES[pathname] ?? "Client Portal";
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Client";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile slides in */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <ClientSidebar
          displayName={displayName}
          initials={initials}
          email={user?.email ?? ""}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-6 shrink-0 border-b"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          {/* Left — mobile hamburger + page title */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                Eden Portal
              </p>
              <h1 className="text-lg font-black leading-tight" style={{ color: "var(--text-primary)" }}>
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right — notifications + user */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative" style={{ color: "var(--text-secondary)" }}>
              <Bell className="w-5 h-5" />
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white"
                style={{ background: "var(--error)" }}
              />
            </Button>

            <div className="flex items-center gap-3 pl-3 border-l" style={{ borderColor: "var(--border)" }}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none" style={{ color: "var(--text-primary)" }}>
                  {displayName}
                </p>
                <p className="text-xs mt-0.5 capitalize" style={{ color: "var(--text-secondary)" }}>
                  {profile?.role ?? "Client"}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shadow-md"
                style={{ background: "var(--primary)" }}
              >
                {initials}
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-red-50"
                style={{ color: "var(--text-secondary)" }}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto custom-scrollbar"
          style={{ background: "#f8fafc" }}
        >
          <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
