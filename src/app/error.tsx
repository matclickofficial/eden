"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 text-center border border-slate-100">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
           <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 font-poppins">Something went wrong!</h2>
        <p className="text-slate-500 mb-8 italic">
          "We encountered an unexpected error. Don't worry, our team has been notified."
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() => reset()} 
            className="w-full h-14 rounded-2xl font-bold bg-slate-900 hover:bg-primary transition-colors shadow-xl"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="w-full h-14 rounded-2xl font-bold text-slate-500"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
