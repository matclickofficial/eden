"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, LockKeyhole, ShieldCheck, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { loginSchema } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || null;
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    // DEMO BYPASS for checking/testing
    if (values.email === "demo@eden.com" && values.password === "password123") {
      document.cookie = "demo-session=true; path=/; max-age=3600";
      toast.success("Welcome to the Demo Portal!");
      router.push(redirectTo || "/client/dashboard");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message === "Invalid login credentials"
          ? "Invalid email or password. Did you register first?"
          : error.message);
        return;
      }

      toast.success("Welcome back to Eden!");

      // If there's a redirect param (e.g. from /apply-now or /online-status), use it
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      // Otherwise check role and redirect to appropriate dashboard
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "admin" || profile?.role === "staff") {
        router.push("/admin/dashboard");
      } else {
        router.push("/client/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 relative overflow-hidden px-4 login-gradient">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -ml-48 -mb-48" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
           <Link href="/" className="inline-flex items-center space-x-3 group mb-8">
              <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-white w-7 h-7" />
              </div>
              <span className="font-heading font-black text-3xl text-slate-950 tracking-tight">EDEN</span>
           </Link>
           <h1 className="text-4xl font-black text-slate-950 tracking-tight mb-3">Welcome Back</h1>
           <p className="text-slate-500 font-medium tracking-tight">Access your immigration portal</p>
        </div>

        <Card className="border-white/50 bg-white/70 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[40px] p-2">
          <CardContent className="pt-8 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="name@email.com" {...field} className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-blue-500/20 px-5" />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between ml-1">
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500">Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-[10px] text-blue-600 hover:underline font-black uppercase tracking-widest"
                        >
                          Forgot?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-blue-500/20 px-5" />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-14 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 shadow-xl shadow-slate-200 text-base font-bold transition-all group" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>Access Portal <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="pb-8 flex flex-col gap-4 items-center">
            <Button 
              variant="outline" 
              type="button"
              className="w-full h-12 rounded-2xl border-slate-200 text-slate-500 font-bold hover:bg-slate-50"
              onClick={() => {
                form.setValue("email", "demo@eden.com");
                form.setValue("password", "password123");
                form.handleSubmit(onSubmit)();
              }}
            >
              Check with Demo Account
            </Button>
            <p className="text-sm font-medium text-slate-500">
              New to Eden?{" "}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">
                Create account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
