import { useState } from 'react';
import { type UserRole } from '../types/roles';
import { Stethoscope, ArrowLeft, Mail, Lock, ArrowRight, Fingerprint, Eye, EyeOff, Users, FileText, Activity } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, role: UserRole) => void;
  onBack: () => void;
}

export const LoginPage = ({ onLogin, onBack }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let finalRole: UserRole = 'receptionist';
    if (email.toLowerCase().includes('doctor') || email.toLowerCase().includes('sarah')) finalRole = 'doctor';
    else if (email.toLowerCase().includes('admin')) finalRole = 'admin';
    else if (email.toLowerCase().includes('pharm')) finalRole = 'pharmacist';
    else if (email.toLowerCase().includes('patient')) finalRole = 'patient';
    onLogin(email, finalRole);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* Navbar */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border-color z-40 h-[76px] flex items-center justify-between px-6 md:px-12 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onBack}>
          <Stethoscope className="text-primary group-hover:scale-110 transition-transform" size={28} />
          <span className="font-extrabold text-[1.1rem] md:text-[1.25rem] text-primary leading-tight tracking-wider">
            SARJAN HEALTHCARE
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={onBack}
            className="text-text-gray hover:text-primary transition-colors font-semibold text-sm cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={onBack}
            className="text-text-gray hover:text-primary transition-colors font-semibold text-sm cursor-pointer"
          >
            About Us
          </button>
          <button 
            onClick={onBack}
            className="text-text-gray hover:text-primary transition-colors font-semibold text-sm cursor-pointer"
          >
            Doctors
          </button>
        </nav>

        {/* Action Button */}
        <button 
          onClick={onBack}
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </header>

      {/* Main Content (Split Screen) */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        <div 
          className="hidden md:flex md:w-[40%] bg-[#006657] text-white pt-6 pb-12 px-12 lg:pt-8 lg:pb-16 lg:px-16 flex-col justify-between relative overflow-hidden" 
        >
          <div className="max-w-lg mb-auto mt-0">
            {/* Staff Portal Pill Badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 font-bold tracking-widest text-[9px] uppercase mb-6 shadow-sm select-none">
              <Fingerprint size={12} className="text-white/80 animate-pulse" />
              Staff Portal
            </span>

            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4 text-white">
              Welcome Back<br />to your workspace
            </h1>
            
            <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-10 font-normal">
              Access your unified dashboard to manage patient queues, clinical EMRs, pharmacy inventory, and administrative logs in real-time.
            </p>

            {/* Features list (Glassmorphic Cards) */}
            <div className="space-y-4">
              
              {/* Feature 1 */}
              <div className="group bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex gap-4 items-start">
                  <div className="bg-white/10 p-2.5 rounded-xl text-white border border-white/10 shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">Zero-Wait Queue Management</h3>
                    <p className="text-white/70 text-sm mt-1 leading-relaxed">Seamlessly register and triage walk-in patients.</p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex gap-4 items-start">
                  <div className="bg-white/10 p-2.5 rounded-xl text-white border border-white/10 shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">Integrated EMR Access</h3>
                    <p className="text-white/70 text-sm mt-1 leading-relaxed">Instant retrieval of patient clinical history and vitals.</p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex gap-4 items-start">
                  <div className="bg-white/10 p-2.5 rounded-xl text-white border border-white/10 shrink-0">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">Automated Billing & Pharmacy</h3>
                    <p className="text-white/70 text-sm mt-1 leading-relaxed">Connected invoicing from doctor's desk to checkout.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-white/50 font-medium select-none border-t border-white/10 pt-6">
            &copy; {new Date().getFullYear()} Sarjan Healthcare. All rights reserved.
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-[60%] flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
          <div className="w-full max-w-md">
            <div className="text-center md:text-left mb-10">
              <h2 className="text-3xl font-extrabold text-text-dark tracking-tight">
                ACCOUNT <span className="text-primary">LOGIN</span>
              </h2>
              <p className="text-text-gray font-medium text-sm mt-2">
                Enter your credentials to access the secure portal.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-gray group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@sarjan.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-white border border-border-color rounded-xl text-sm font-semibold text-text-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wide mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-gray group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={showPassword ? "Now you see me... 👀" : "••••••••"}
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 hover:bg-white border border-border-color rounded-xl text-sm font-semibold text-text-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-gray hover:text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me / Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-border-color text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                  <span className="text-xs font-semibold text-text-gray group-hover:text-text-dark transition-colors">Remember Me</span>
                </label>
                <a href="#" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="group relative w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all mt-4 overflow-hidden"
              >
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
                {/* Subtle highlight overlay */}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border-color"></div>
                <span className="flex-shrink-0 px-4 text-[10px] font-bold text-text-gray tracking-widest uppercase">
                  OR CONTINUE WITH
                </span>
                <div className="flex-grow border-t border-border-color"></div>
              </div>

              <button 
                type="button"
                onClick={handleLogin}
                className="w-full py-3.5 bg-white border border-border-color hover:border-primary/50 hover:bg-slate-50 text-text-dark rounded-xl font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Fingerprint className="text-primary" size={20} />
                Sign in with Passkey
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-border-color/60 text-center">
              <p className="text-sm font-medium text-text-gray">
                Don't have an account? <a href="#" className="font-bold text-primary hover:text-primary-dark transition-colors">Contact IT Admin</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
