"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, UserPlus, ShieldCheck, ArrowRight } from "lucide-react";

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
import { registerSchema } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            phone: values.phone,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Registration successful! Welcome to the elite tier.");
      router.push("/login");
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-20 lg:py-0 login-gradient">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mb-48" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-10">
           <Link href="/" className="inline-flex items-center space-x-3 group mb-8">
              <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-white w-7 h-7" />
              </div>
              <span className="font-heading font-black text-3xl text-slate-950 tracking-tight">EDEN</span>
           </Link>
           <h1 className="text-4xl font-black text-slate-950 tracking-tight mb-3">Begin Your Journey</h1>
           <p className="text-slate-500 font-medium tracking-tight">Register for your secure client portal</p>
        </div>

        <Card className="border-white/50 bg-white/70 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[40px] p-2">
          <CardContent className="pt-8 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Legal Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Johnathan Doe" {...field} className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-blue-500/20 px-5" />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Contact No.</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 ••• ••• ••••" {...field} className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-blue-500/20 px-5" />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-blue-500/20 px-5" />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-blue-500/20 px-5" />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 shadow-xl shadow-slate-200 text-base font-bold transition-all group" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="pb-8 justify-center">
            <p className="text-sm font-medium text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-bold hover:underline">
                Unlock portal
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
