"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Users, 
  ShieldCheck, 
  Briefcase, 
  TrendingUp,
  Star,
  Award,
  Search,
  MessageCircle,
  FileSearch,
  CreditCard,
  UserCheck,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PublicNavbar } from "@/components/shared/public-navbar";
import { PublicFooter } from "@/components/shared/public-footer";
import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);
  const slides = [
    {
      title: "Expert Visa Services to Seamlessly Guide You to Your Dream Life in Canada",
      subtitle: "Canadian Immigration Expertise",
      desc: "Personalized guidance for your unique journey. Thousands of successful applications and happy families.",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Proven Success and Streamlined Work Permit Services",
      subtitle: "Work Permit Services",
      desc: "Comprehensive support for your professional future and transition into life in Canada.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-red-100 selection:text-primary">
      <PublicNavbar />
      
      {/* Hero Slider */}
      <section className="relative h-[90vh] min-h-[700px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-secondary/70 z-10" />
            <Image 
              src={slides[currentSlide].image} 
              alt="Hero" 
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-4xl"
          >
            <Badge className="bg-primary text-white mb-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
              {slides[currentSlide].subtitle}
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-white leading-[1.1] mb-8 tracking-tighter">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed mb-10 font-medium">
              {slides[currentSlide].desc}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link href={user ? "/client/apply" : "/login"}>
                <Button size="lg" className="h-16 px-10 text-lg font-bold bg-primary hover:bg-red-700 rounded-xl shadow-2xl shadow-red-500/20">
                  Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" className="h-16 px-10 text-lg font-bold bg-white text-secondary hover:bg-slate-50 rounded-xl shadow-xl">
                  Client Login
                </Button>
              </Link>
              <Link href={user ? "/client/status" : "/online-status"}>
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold border-white/20 text-white hover:bg-white/10 rounded-xl">
                  Check Online Status
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-[0.2em] px-4 py-1">GROW BEYOND BORDERS</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-secondary tracking-tighter">Our Immigration Solutions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Immigrate to Canada", icon: UserCheck, desc: "Turn your Canadian aspirations into reality with a wide range of personalized immigration options." },
              { title: "Canadian Work Permits", icon: Briefcase, desc: "Unsure about work permits? We’ll clarify the rules and guide you to your Canadian job." },
              { title: "Family Sponsorships", icon: Award, desc: "Reconnect with family by sponsoring them to become permanent residents in Canada." },
              { title: "Business Immigration", icon: TrendingUp, desc: "Seize opportunities in a dynamic, stable economy with our business immigration expertise." },
              { title: "Study in Canada", icon: Calendar, desc: "Study in Canada to unlock doors to skilled worker immigration and a brighter future." },
              { title: "Expert Legal Support", icon: ShieldCheck, desc: "Rely on our seasoned legal team to expertly manage every step of your Canadian journey." },
              { title: "Work Permit Services", icon: Globe, desc: "Your dream of calling Canada home is closer than ever with our expert visa solutions." },
              { title: "Settling into Life in Canada", icon: Star, desc: "Hit the ground running with our top-tier settlement resources and insider know-how." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <service.icon className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-black text-secondary mb-3 leading-tight">{service.title}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-10">
            <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black">Why Choose Us</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-secondary tracking-tighter leading-tight">
              At Eden Food Canada, we’re dedicated to making your dreams a reality.
            </h2>
            <p className="text-slate-500 font-medium">Here’s why families and individuals choose us:</p>
            <div className="space-y-8">
              {[
                { title: "Fast Tracks to New Beginnings", desc: "Efficient processing and expert strategy to get you to Canada as quickly as possible." },
                { title: "Trusted Hands, Happy Hearts", desc: "Compassionate service backed by years of expertise and a proven track record." },
                { title: "Your Journey, Our Commitment", desc: "We are with you from initial consultation to your successful arrival and beyond." }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-6">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-secondary mb-2">{item.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative aspect-[4/3] lg:aspect-auto h-[400px] lg:h-[600px]">
            <Image 
              src="https://images.unsplash.com/photo-1522071823991-b9671f903f70?auto=format&fit=crop&q=80&w=1000" 
              alt="Why Eden" 
              fill
              className="rounded-[64px] shadow-3xl relative z-10 object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8 Steps to Success */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-red-500/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-24">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-[0.2em] px-4 py-1">THE EDEN JOURNEY</Badge>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-secondary tracking-tighter">8 Steps to Your Visa Success</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto italic">Your transparent, expert-guided path to a new life in Canada.</p>
          </div>

          <div className="space-y-32">
            {[
              {
                step: "01",
                title: "Initial Consultation",
                desc: "We kick off with a free, tailored consultation to discuss your plans – whether it’s work, study, or residency in Canada.",
                image: "/images/steps/step1.png"
              },
              {
                step: "02",
                title: "Eligibility Assessment",
                desc: "Our team evaluates your profile against the immigration or visa requirements of Canada.",
                image: "/images/steps/step2.png"
              },
              {
                step: "03",
                title: "Document Preparation",
                desc: "We help you gather and organize the required documents, ensuring they align with the specific standards of your chosen destination.",
                image: "/images/steps/step3.png"
              },
              {
                step: "04",
                title: "Application Submission",
                desc: "Eden Food Canada expertly prepares and submits your visa application to the relevant authorities in Canada.",
                image: "/images/steps/step4.png"
              },
              {
                step: "05",
                title: "Biometrics & Interviews",
                desc: "We coordinate and prepare you for biometrics or interviews, as required by the immigration or visa offices of Canada.",
                image: "/images/steps/step5.png"
              },
              {
                step: "06",
                title: "Tracking & Updates",
                desc: "Stay informed! We monitor your application’s progress and provide updates based on the processing timelines of your selected country.",
                image: "/images/steps/step6.png"
              },
              {
                step: "07",
                title: "Visa Approval",
                desc: "Once approved, we ensure you receive your visa documents and guide you on the next steps for your move to Canada.",
                image: "/images/steps/step7.png"
              },
              {
                step: "08",
                title: "Arrival Support",
                desc: "Our assistance extends beyond approval – we offer practical tips for travel and settling into life in Canada.",
                image: "/images/steps/step8.png"
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={cn(
                  "flex flex-col lg:flex-row items-center gap-16 lg:gap-24",
                  i % 2 !== 0 && "lg:flex-row-reverse"
                )}
              >
                <div className="flex-1 space-y-8">
                  <div className="flex items-center space-x-6">
                    <span className="text-7xl font-black text-primary/10 font-heading leading-none">{step.step}</span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-heading font-black text-secondary tracking-tight">{step.title}</h3>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                  <Link href={user ? "/client/apply" : "/register"}>
                    <Button variant="link" className="text-primary font-black p-0 h-auto text-base hover:text-red-700 group">
                      Apply Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                <div className="flex-1 w-full relative aspect-video lg:aspect-auto h-[400px]">
                  <div className="absolute inset-0 bg-primary/5 rounded-[48px] rotate-3 scale-105 -z-10" />
                  <Image 
                    src={step.image} 
                    alt={step.title} 
                    fill 
                    className="object-cover rounded-[48px] shadow-2xl"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-32 bg-slate-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-4">
              <Badge className="bg-primary text-white border-none rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black">Success Stories</Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tighter">Real Stories, Real Success</h2>
            </div>
            <p className="text-slate-400 font-medium max-w-sm text-lg italic">Join the thousands of individuals who have successfully relocated to Canada with Eden Food.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "A New Career in Toronto",
                name: "Ahmad K.",
                category: "Work Permit",
                desc: "After months of searching, Eden Food Canada helped me secure a work permit for a top tech firm in Toronto. The support was unparalleled.",
                image: "/images/stories/story1.png"
              },
              {
                title: "Academic Excellence in Vancouver",
                name: "Sarah L.",
                category: "Study Visa",
                desc: "My dream of studying in Canada became a reality. From university selection to visa approval, they were with me every step.",
                image: "/images/stories/story2.png"
              },
              {
                title: "Reunited with Family",
                name: "The Miller Family",
                category: "Permanent Residency",
                desc: "We are finally together in our new home. The family sponsorship process was handled with such care and professionalism.",
                image: "/images/stories/story3.png"
              }
            ].map((story, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group relative h-[600px] rounded-[48px] overflow-hidden bg-slate-900 shadow-2xl"
              >
                <Image src={story.image} alt={story.title} fill className="object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <Badge className="w-fit bg-primary text-white mb-4">{story.category}</Badge>
                  <h3 className="text-2xl font-black mb-3">{story.title}</h3>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6 line-clamp-3">"{story.desc}"</p>
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{story.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Verified Alumnus</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-primary text-primary" />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-heading font-black text-secondary tracking-tighter">Client Success Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Max Benjamin", text: "I had an outstanding experience with the consultancy for my Canadian study visa. The process was well-structured and seamless, thanks to the dedicated team." },
              { name: "Chloe Savannah", text: "I had a great experience with the consultancy for my Canadian immigration process. The entire journey was smooth and well-managed from start to finish." },
              { name: "Ethan Sebastian", text: "I had an excellent experience with the consultancy for my family sponsorship visa to Canada. The process was well-organized and hassle-free." }
            ].map((t, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-slate-50 border border-slate-100">
                <div className="flex space-x-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 font-medium italic mb-8">"{t.text}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200" />
                  <div>
                    <h4 className="font-bold text-secondary">{t.name}</h4>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Verified Client</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/12897840100" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all group"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-20 bg-white text-secondary px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us!
        </span>
      </a>

      <PublicFooter />
    </div>
  );
}

