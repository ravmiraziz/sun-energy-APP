import React, { useState } from "react";
import {
  MdAdminPanelSettings,
  MdArrowForward,
  MdShield,
  MdLock,
  MdVisibility,
  MdLockReset,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type View = "login" | "forgot";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [view, setView] = useState<View>("login");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* LOGIN */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("LOGIN DATA:", { email, password });

    setTimeout(() => {
      login({
        user: {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          email,
          phone: "+998934905134",
          password,
          image_url: "https://picsum.photos/100/100?random=10",
          language: "ru",
          refresh_token: "FAKE_REFRESH_TOKEN",
          created_at: "01.01.2000",
          deleted_at: "",
        },
        token: "FAKE_ADMIN_TOKEN",
      });

      navigate("/admin");
    }, 1500);
  };

  /* FORGOT PASSWORD */
  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("SEND RESET PASSWORD TO:", email);

    setTimeout(() => {
      alert("Yangi parol emailingizga yuborildi");
      setLoading(false);
      setView("login");
    }, 1500);
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
              <MdAdminPanelSettings className="text-5xl mx-auto mb-4 size-20 p-3 rounded-full bg-primary flex items-center justify-center shadow-inner" />
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

                <button
                  disabled={loading}
                  className="w-full bg-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {loading ? "Yuborilmoqda..." : "Yangi parol yuborish"}
                  {!loading && <MdLockReset className="text-2xl" />}
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
            {loading && (
              <div className="mt-6 flex items-center justify-center gap-2 text_primary text-xs">
                <MdShield />
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
