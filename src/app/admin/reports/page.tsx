"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Download, 
  Calendar, 
  Filter,
  Users,
  Briefcase,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    // Mocking some data for the report visuals
    setStats({
      monthlyRevenue: [
        { month: 'Jan', val: 1200000 },
        { month: 'Feb', val: 1800000 },
        { month: 'Mar', val: 1500000 },
        { month: 'Apr', val: 2200000 },
      ],
      appStages: [
        { label: 'Submitted', count: 45, color: 'bg-blue-500' },
        { label: 'Processing', count: 28, color: 'bg-amber-500' },
        { label: 'Visa Filed', count: 15, color: 'bg-primary' },
        { label: 'Completed', count: 12, color: 'bg-secondary' },
      ]
    });
    setLoading(false);
  }

  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Reports & Analytics</h2>
          <p className="text-slate-500">Analyze application trends, revenue growth, and staff performance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="rounded-xl font-bold h-12">
            <Calendar className="w-4 h-4 mr-2" /> Last 30 Days
          </Button>
          <Button className="rounded-xl font-bold h-12 shadow-lg shadow-primary/20">
            <Download className="w-4 h-4 mr-2" /> Export PDF Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Growth Chart (Visual Representation) */}
        <Card className="xl:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center">
                <TrendingUp className="mr-2 text-emerald-600 w-5 h-5" /> Revenue Projection
              </CardTitle>
              <CardDescription>Monthly collection from processing fees</CardDescription>
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100">+22% Growth</Badge>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-between px-8 pb-10 space-x-4">
            {stats.monthlyRevenue.map((m: any) => (
              <div key={m.month} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-primary/10 rounded-t-xl group-hover:bg-primary transition-all duration-500 relative"
                  style={{ height: `${(m.val / 2500000) * 100}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    PKR {(m.val / 1000).toFixed(0)}k
                  </div>
                </div>
                <span className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{m.month}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Application Distribution */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Files by Stage</CardTitle>
            <CardDescription>Current status of all open files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {stats.appStages.map((stage: any) => (
              <div key={stage.label} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-700">{stage.label}</span>
                  <span className="font-black">{stage.count} Files</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", stage.color)}
                    style={{ width: `${(stage.count / 45) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="pt-6 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Avg. Completion</p>
                  <p className="text-xl font-black text-slate-900">14 Days</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Success Rate</p>
                  <p className="text-xl font-black text-emerald-600">92%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-primary text-white shadow-xl shadow-primary/20 border-none">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">New Signups</p>
                <h4 className="text-2xl font-black">124</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary text-white shadow-xl shadow-secondary/20 border-none">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Jobs Published</p>
                <h4 className="text-2xl font-black">18</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-600 text-white shadow-xl shadow-emerald-200 border-none">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Avg. Basket</p>
                <h4 className="text-2xl font-black">PKR 750k</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 text-white shadow-xl border-none">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">System Health</p>
                <h4 className="text-2xl font-black">99.9%</h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
