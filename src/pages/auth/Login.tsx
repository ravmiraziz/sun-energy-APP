import React, { useEffect, useRef, useState } from "react";
import {
  MdArrowForward,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth, type User } from "../../context/AuthContext";
import { post } from "../../api/api";
import axios from "axios";
import { Zap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type View = "login" | "forgot";
const OTP_LENGTH = 6;

interface LoginData {
  data: {
    admin: User;
    access_token: string;
    refresh_token: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [view, setView] = useState<View>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkCode, setCheckCode] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(60);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  /* TIMER */
  useEffect(() => {
    if (view === "forgot" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [view, timer]);

  /* LOGIN */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data }: LoginData = await post("admin-login", {
        email,
        password,
      });
      if (data && data.admin) {
        login({
          user: data.admin,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        toast.success(`Xush kelibsiz, ${data.admin.first_name}! 🎉`);
        navigate("/admin");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.StatusCode === 400 || err.response?.status === 400) {
          toast.error("Email yoki parol noto'g'ri kiritildi!");
        } else {
          toast.error("Tizimga kirishda xatolik yuz berdi");
        }
      } else {
        toast.error("Tarmoqda xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  /* FORGOT PASSWORD */
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await post("admin-register", { email });
      setTimer(60);
      setCheckCode(true);
      toast.success("Tasdiqlash kodi emailingizga yuborildi");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Email yuborishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    const code = otp.join("");

    try {
      const { data }: LoginData = await post("admin-verify", {
        code: Number(code),
        email,
      });
      if (data) {
        login({
          user: data.admin,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        toast.success("Muvaffaqiyatli tasdiqlandi!");
        navigate("/admin");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.Data || "Tasdiqlash kodi xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1411] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 size-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 size-96 rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-4xl bg-[#12211c] rounded-3xl shadow-2xl border border-white/5 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left: Form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="size-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                <Zap className="size-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {view === "login" ? "Tizimga kirish" : "Parolni tiklash"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {view === "login"
                  ? "Smart Energy boshqaruv paneliga kirish uchun ma'lumotlaringizni kiriting"
                  : "Emailingizga tasdiqlash kodi yuboriladi"}
              </p>
            </div>

            {view === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    E-pochta manzil
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sunenergy.uz"
                    className="w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Parol
                    </label>
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      Parolni unutdingizmi?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? (
                        <MdVisibilityOff className="text-lg" />
                      ) : (
                        <MdVisibility className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Kirilmoqda..." : "Kirish"}
                  {!loading && <MdArrowForward className="text-lg" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    E-pochta manzil
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sunenergy.uz"
                    className="w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
                  />
                </div>

                {checkCode && (
                  <div className="grid grid-cols-6 gap-2 my-4">
                    {otp.map((val, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputsRef.current[i] = el;
                        }}
                        value={val}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        className="aspect-square text-center text-lg font-black rounded-xl bg-[#152721] border border-white/10 text-white focus:border-emerald-500"
                        maxLength={1}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => (checkCode ? handleVerify() : handleForgot)}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading
                    ? "Yuborilmoqda..."
                    : checkCode
                    ? "Kodni tasdiqlash"
                    : "Tiklash kodini yuborish"}
                </button>

                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-xs text-slate-400 hover:text-white w-full text-center block pt-2"
                >
                  ← Kirish oynasiga qaytish
                </button>
              </form>
            )}
          </div>

          {/* Right: Branding Graphic */}
          <div className="hidden md:flex flex-col justify-between p-12 bg-white/[0.02] border-l border-white/5 relative overflow-hidden">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <ShieldCheck className="size-3.5" />
                Avtorizatsiyalangan Xavfsiz Boshqaruv
              </span>
              <h3 className="text-3xl font-black text-white leading-tight">
                Sun Energy Pro <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">
                  Energiya & Tijorat
                </span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ushbu bo'lim faqat vakolatli administratorlar uchun mo'ljallangan. Barcha harakatlar audit qilinadi va monitoring ostida olib boriladi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#152721] border border-white/5 flex items-center gap-3">
              <MdLock className="text-emerald-400 text-xl" />
              <div>
                <p className="text-xs font-bold text-white">SSL Shifrlangan Sessiya</p>
                <p className="text-[10px] text-slate-400">256-bit xavfsizlik protokoli</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-[11px] text-slate-500 border-t border-white/5 bg-[#0b1411]">
        © {new Date().getFullYear()} Sun Energy Admin Platform • Powered by SYSTEMLAB
      </footer>
    </div>
  );
};

export default Login;
