import React, { useEffect, useRef, useState } from "react";
import {
  MdSettings,
  MdArrowForward,
  MdSecurity,
  MdLock,
  MdVisibility,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth, type User } from "../../context/AuthContext";
import { post } from "../../api/api";
import axios from "axios";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkCode, setCheckCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
      if (data) {
        login({
          user: data.admin,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        navigate("/admin");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.StatusCode === 400) {
          setErrorMessage("Login yoki Parol xato!");
        }
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
      setLoading(false);
      setTimer(60);
      setCheckCode(true);
    } catch (error) {
      return;
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
        navigate("/admin");
      }
    } catch (error) {
      setErrorMessage("Nimadir xato ketti!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-125 h-125 bg-primary rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-primary rounded-full blur-[150px]"></div>
      </div>

      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-250 flex flex-col md:flex-row bg_card rounded-3xl shadow-2xl border border_color overflow-hidden min-h-150">
          <div className="w-full md:w-1/2 p-12 flex flex-col justify-center border-l border_color transition-all duration-500">
            <div className="text-center mb-10">
              <MdSettings className="text-5xl mx-auto mb-4 size-20 p-3 rounded-full bg-primary flex items-center justify-center shadow-inner" />
              <h2 className="text-3xl font-black text-white">
                {view === "login"
                  ? "Administratorga kirish"
                  : "Parolni tiklash"}
              </h2>
              <p className="text_primary text-sm mt-3">
                {view === "login"
                  ? "Email va parolingizni kiriting"
                  : "Email kiriting, yangi parol yuboriladi"}
              </p>
            </div>
            {view === "login" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold card_text uppercase tracking-widest">
                    E-pochta manzili
                  </label>
                  <input
                    required
                    className="w-full card_btn border border_color rounded-2xl px-5 py-4 text-white outline-none transition-all"
                    placeholder="enter@info.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold card_text uppercase tracking-widest">
                      Parol
                    </label>
                    <button
                      onClick={() => setView("forgot")}
                      type="button"
                      className="text_primary text-[10px] font-bold hover:underline"
                    >
                      Parolni tiklash?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      required
                      className="w-full card_btn border border_color rounded-2xl px-5 py-4 text-white outline-none transition-all"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <MdVisibility className="absolute right-4 top-1/2 -translate-y-1/2 card_text text-[20px] cursor-pointer hover:text-orange-400" />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {loading ? "Kirish..." : "Kirish"}
                  {!loading && <MdArrowForward />}
                </button>
              </form>
            )}
            {view === "forgot" && (
              <form onSubmit={handleForgot} className="space-y-6">
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="w-full card_btn rounded-xl px-4 py-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {checkCode && (
                  <div className="grid grid-cols-6 gap-3 mb-6">
                    {otp.map((val, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputsRef.current[i] = el;
                        }}
                        value={val}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        className="aspect-square text-center text-xl font-black rounded-xl bg-card border border_color"
                        maxLength={1}
                      />
                    ))}
                  </div>
                )}

                <button
                  disabled={loading}
                  onClick={() => checkCode && handleVerify()}
                  className="w-full bg-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {loading ? "Yuborilmoqda..." : "Yangi parol yuborish"}
                  {!loading && <MdLock className="text-2xl" />}
                </button>

                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text_primary text-sm font-bold w-full text-center hover:underline"
                >
                  ← Login’ga qaytish
                </button>
              </form>
            )}
            {errorMessage && (
              <span className="text-red-500 text-center my-2">
                {errorMessage}
              </span>
            )}
            {loading && (
              <div className="mt-6 flex items-center justify-center gap-2 text_primary text-xs">
                <MdSecurity />
                Xavfsiz tekshirilmoqda...
              </div>
            )}
          </div>

          {/* Right Panel: 2FA */}
          <div
            className={`w-full md:w-1/2 p-12 bg-background-dark/40 flex flex-col justify-center border-l border_color transition-all duration-500 not-md:hidden`}
          >
            <div className="flex flex-col items-center mb-10">
              <img src="/logo.svg" alt="logo" />
              <h2 className="text-2xl font-black text-white text-center">
                Assalomu alaykum Xush kelibsiz.
              </h2>
              <p className="card_text text-sm mt-3 text-center px-6">
                Ushbu bo'lim faqat adminlar uchun
              </p>
            </div>

            <div className="grid grid-cols-6 gap-3 mb-10"></div>

            <div className="mt-auto pt-8 flex items-center justify-center gap-2 opacity-50 card_text">
              <MdLock className="text-sm" />
              <span className="text-[10px] uppercase font-black tracking-widest">
                SSL shifrlangan sessiyasi
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center card_text text-[10px] font-bold uppercase tracking-widest border-t border_color bg_card backdrop-blur-sm">
        © 2024 Smart Energy & Commerce Admin Panel. Version 2.4.0-Stable
      </footer>
    </div>
  );
};

export default Login;
