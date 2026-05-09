import { 
  ClipboardCheck, 
  Search, 
  FileCheck, 
  PlaneTakeoff, 
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: ClipboardCheck,
      title: "1. Basic Registration",
      desc: "Sign up on our portal and complete your basic professional profile. Our system will immediately prioritize your application.",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: Search,
      title: "2. Skilled Assessment",
      desc: "Our expert consultants review your experience and match you with the best international job openings.",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      icon: FileCheck,
      title: "3. Legal Documentation",
      desc: "Once a job is selected, we manage your LMIA, offer letter, and visa filing with 100% legal compliance.",
      color: "text-rose-600 bg-rose-50"
    },
    {
      icon: PlaneTakeoff,
      title: "4. Deployment & Success",
      desc: "Final visa approval, flight booking, and settlement assistance at your destination. Welcome to your new career!",
      color: "text-amber-600 bg-amber-50"
    }
  ];

  return (
    <div className="pb-32">
      {/* Header */}
      <section className="bg-slate-900 py-32 px-6 text-white text-center rounded-b-[60px] shadow-2xl relative overflow-hidden">
        <h1 className="text-4xl lg:text-7xl font-poppins font-black mb-6">How It Works</h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto italic">
          "A transparent, 4-step roadmap to your international dream job."
        </p>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
      </section>

      {/* Steps List */}
      <section className="max-w-7xl mx-auto px-6 -mt-16">
        <div className="space-y-8">
           {steps.map((step, i) => (
             <div key={i} className="bg-white rounded-[40px] p-10 lg:p-16 shadow-lg border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center group hover:border-primary/20 transition-all">
                <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                   <div className={`p-8 rounded-[40px] mb-8 transition-transform group-hover:scale-110 ${step.color}`}>
                      <step.icon className="w-16 h-16" />
                   </div>
                   <h2 className="text-3xl font-black text-slate-900">{step.title}</h2>
                </div>
                <div className="lg:col-span-8 space-y-6">
                   <p className="text-xl text-slate-500 leading-relaxed italic">
                      "{step.desc}"
                   </p>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(i+1) * 25}%` }}></div>
                   </div>
                   <div className="flex items-center space-x-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                      <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> Fully Verified</div>
                      <div className="flex items-center"><Zap className="w-4 h-4 mr-2 text-amber-500" /> Fast Track</div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="max-w-5xl mx-auto px-6 mt-32 text-center space-y-12">
         <h2 className="text-4xl font-black text-slate-900 mb-16">Got Questions?</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
           {[
             { q: "How long does the process take?", a: "Typical processing time ranges from 3 to 6 months depending on the country and job type." },
             { q: "What documents are required?", a: "Passport, Degree/Certifications, and Experience letters are mandatory for initial assessment." },
             { q: "Is registration free?", a: "Yes, initial registration and profile assessment are completely free." },
             { q: "Do you provide flight tickets?", a: "Ticket policies vary by employer; however, we assist in all booking arrangements." }
           ].map((faq, i) => (
             <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex items-start space-x-4">
                <HelpCircle className="w-6 h-6 text-primary shrink-0" />
                <div>
                   <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                   <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
             </div>
           ))}
         </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="bg-primary rounded-[60px] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
           <h2 className="text-4xl lg:text-6xl font-poppins font-black leading-tight mb-8">Ready for the Next Step?</h2>
           <Link href="/register">
             <Button className="h-16 px-12 text-lg font-bold rounded-2xl bg-white text-primary hover:bg-slate-100 shadow-xl">
                Create My Profile <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
           </Link>
        </div>
      </section>
    </div>
  );
}
