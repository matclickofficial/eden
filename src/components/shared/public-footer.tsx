import Link from "next/link";
import { Globe, Mail, Phone, MapPin, Share2 } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-secondary border-t border-white/5 text-slate-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
               <Globe className="text-white w-6 h-6" />
            </div>
            <span className="font-heading font-black text-2xl text-white tracking-tighter">EDEN<span className="text-primary tracking-normal font-medium ml-1">IMMIGRATION</span></span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-400 font-medium">
            Canada's leading immigration experts. We provide professional assistance for LMIA, Work Permits, Study Visas, and Permanent Residency applications with a high success rate.
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary hover:text-white transition-all"><Share2 className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary hover:text-white transition-all"><Share2 className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary hover:text-white transition-all"><Share2 className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Services</h4>
          <ul className="space-y-4 text-xs font-bold">
            <li><Link href="/online-status" className="hover:text-primary transition-colors">Online Status</Link></li>
            <li><Link href="/apply-biometric" className="hover:text-primary transition-colors">Apply Biometric</Link></li>
            <li><Link href="/payments" className="hover:text-primary transition-colors">Make Payment</Link></li>
            <li><Link href="/jobs" className="hover:text-primary transition-colors">Current Openings</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Head Office</h4>
           <ul className="space-y-4 text-xs font-medium">
            <li className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Suite 200, 100 Front St W, Toronto, ON M5J 1E3, Canada</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-primary" />
              <span>+1 (416) 555-0198</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-primary" />
              <span>info@edenfoodcanada.com</span>
            </li>
           </ul>
        </div>

        <div>
           <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Newsletter</h4>
           <p className="text-[10px] mb-4 uppercase tracking-wider text-slate-500 font-bold">Get updates on latest visa policies.</p>
           <form className="flex space-x-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 bg-white/5 border-none rounded-lg px-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none text-white"
              />
              <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-all">Join</button>
           </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-[9px] uppercase font-bold tracking-[0.2em] flex flex-col md:flex-row items-center justify-between text-slate-500">
        <p>© 2024 Eden Immigration Experts Canada. RCIC Regulated.</p>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
