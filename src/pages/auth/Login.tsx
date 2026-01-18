import React, { useState } from "react";
import { MdBolt, MdAdminPanelSettings, MdVisibility, MdArrowForward, MdVerifiedUser, MdShield, MdLock } from "react-icons/md";

const Login: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]"></div>
      </div>

      <header className="flex items-center justify-between px-8 py-4 border-b border-border-teal/30 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-white">
          <div className="bg-primary p-1.5 rounded-lg text-background-dark">
            <MdBolt />
          </div>
          <h1 className="text-lg font-bold tracking-tight">
            Smart Energy Admin
          </h1>
        </div>
        <button className="bg-primary text-background-dark px-4 py-2 rounded-xl text-xs font-bold hover:brightness-110 shadow-lg shadow-primary/20">
          Support
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-card-dark rounded-3xl shadow-2xl border border-border-teal/20 overflow-hidden min-h-[600px]">
          {/* Left Panel: Credentials */}
          <div
            className={`w-full md:w-1/2 p-12 flex flex-col justify-center transition-all duration-500 ${step === 2 ? "opacity-40 grayscale pointer-events-none scale-95" : "opacity-100"}`}
          >
            <div className="flex flex-col items-center mb-10">
              <MdAdminPanelSettings className="text-primary text-5xl mb-4" />
              <h2 className="text-3xl font-black text-white text-center">
                Admin Access
              </h2>
              <p className="text-slate-400 text-sm mt-3 text-center">
                Enter your secure credentials to manage energy assets.
              </p>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  required
                  className="w-full bg-surface-dark border border-border-teal/50 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="admin@energy-commerce.com"
                  type="email"
                  defaultValue="admin@smartenergy.io"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-primary text-[10px] font-bold uppercase hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    required
                    className="w-full bg-surface-dark border border-border-teal/50 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    type="password"
                    defaultValue="password123"
                  />
                  <MdVisibility className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-primary" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-background-dark font-black py-4 rounded-2xl hover:brightness-110 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Continue"}
                {!loading && (
                  <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>
          </div>

          {/* Right Panel: 2FA */}
          <div
            className={`w-full md:w-1/2 p-12 bg-background-dark/40 flex flex-col justify-center border-l border-border-teal/10 transition-all duration-500 ${step === 1 ? "opacity-40 grayscale blur-[2px]" : "opacity-100"}`}
          >
            <div className="flex flex-col items-center mb-10">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-inner">
                <MdVerifiedUser className="text-primary text-4xl" />
              </div>
              <h2 className="text-2xl font-black text-white text-center">
                Two-Factor Auth
              </h2>
              <p className="text-slate-400 text-sm mt-3 text-center px-6">
                Verification code sent to <br />
                <span className="text-primary font-bold">
                  adm***@energy-commerce.com
                </span>
              </p>
            </div>

            <div className="grid grid-cols-6 gap-3 mb-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input
                  key={i}
                  disabled={step === 1}
                  className="w-full aspect-square text-center text-xl font-black rounded-xl border border-border-teal bg-surface-dark text-white focus:ring-2 focus:ring-primary outline-none disabled:opacity-30"
                  maxLength={1}
                  type="text"
                  placeholder="-"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={step === 1 || loading}
              className="w-full border-2 border-primary/30 text-primary font-black py-4 rounded-2xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2 mb-6 disabled:opacity-20"
            >
              {loading ? "Verifying..." : "Verify & Access"}
              {!loading && (
                <MdShield />
              )}
            </button>

            <div className="text-center">
              <p className="text-slate-500 text-xs">
                Didn't receive code?{" "}
                <button className="text-primary hover:underline font-bold ml-1">
                  Resend in 0:59
                </button>
              </p>
            </div>

            <div className="mt-auto pt-8 flex items-center justify-center gap-2 opacity-30 text-white">
              <MdLock className="text-sm" />
              <span className="text-[10px] uppercase font-black tracking-widest">
                SSL Encrypted Session
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest border-t border-border-teal/10 bg-background-dark/50 backdrop-blur-sm">
        © 2024 Smart Energy & Commerce Admin Panel. Version 2.4.0-Stable
      </footer>
    </div>
  );
};

export default Login;
