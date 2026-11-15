import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MdShoppingCart,
  MdPersonAdd,
  MdEdit,
  MdCampaign,
} from "react-icons/md";
import { useAuth, type User } from "../context/AuthContext";
import { IoLogOut } from "react-icons/io5";
import CategoryDrawer from "../components/ui/CategoryDrawer";
import { get, putData } from "../api/api";
import UserDrawer from "../components/ui/UserDrawer";
import Announcement from "../components/ui/Announcement";
import { Wrench, Shield, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface AdminData {
  created_at: string;
  email: string;
  first_name: string;
  id: string;
  image_url: string;
  language: string;
  last_name: string;
  phone: string;
}

export interface CategoryData {
  id?: string;
  name_uz: string;
  name_ru: string;
  icon_name?: string;
  created_at?: string;
}

interface UserForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password?: string;
  password_confirm?: string;
}

interface ResData {
  data: {
    admins: User[];
    count: number;
  };
}

interface CatRes {
  data: {
    product_categories?: CategoryData[];
    count: number;
  };
}

interface SerRes {
  data: {
    service_categories?: CategoryData[];
    count: number;
  };
}

const Settings: React.FC = () => {
  const { user, logout, getUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [openAnnouncement, setOpenAnnouncement] = useState(false);
  const [selected, setSelected] = useState("product");
  const [openUser, setOpenUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminData | null>(null);
  const page = 1;
  const limit = 10;
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalCountService, setTotalCountService] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [services, setServices] = useState<CategoryData[]>([]);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  const fetchedOnce = useRef(false);

  const initialFromUser = (u: any): UserForm => ({
    first_name: u?.first_name ?? "",
    last_name: u?.last_name ?? "",
    email: u?.email ?? "",
    phone: u?.phone ?? "",
    password: "",
    password_confirm: "",
  });

  const [form, setForm] = useState<UserForm>(() => initialFromUser(user));
  const [initialForm, setInitialForm] = useState<UserForm>(() => initialFromUser(user));

  useEffect(() => {
    if (user) {
      const mapped = initialFromUser(user);
      setForm(mapped);
      setInitialForm(mapped);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isChanged = useMemo(() => {
    return (
      form.first_name !== initialForm.first_name ||
      form.last_name !== initialForm.last_name ||
      form.email !== initialForm.email ||
      form.phone !== initialForm.phone ||
      Boolean(form.password)
    );
  }, [form, initialForm]);

  const updateUser = async () => {
    if (form.password && form.password !== form.password_confirm) {
      toast.error("Parollar bir-biriga mos kelmadi!");
      return;
    }

    try {
      setSavingUser(true);
      const payload: any = {
        id: user?.id,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        language: user?.language || "uz",
        phone: form.phone,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await putData(`admin`, payload);
      toast.success("Profil ma'lumotlari muvaffaqiyatli yangilandi! 🎉");
      if (user?.id) getUser(user.id);
      setForm((p) => ({ ...p, password: "", password_confirm: "" }));
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Xatolik yuz berdi";
      toast.error(`Xatolik: ${msg}`);
    } finally {
      setSavingUser(false);
    }
  };

  const fetchCategories = async (p = 1) => {
    try {
      const { data }: CatRes = await get("product-categories", { page: p, limit });
      setCategories(data.product_categories || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServiceCategories = async (p = 1) => {
    try {
      const { data }: SerRes = await get("service-categories", { page: p, limit });
      setServices(data.service_categories || []);
      setTotalCountService(data.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data }: ResData = await get("/admins", { page: 1, limit: 50 });
      setAdmins(data.admins || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    fetchCategories();
    fetchServiceCategories();
    fetchAdmins();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Tizim Sozlamalari
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Profil, toifalar, e'lonlar va administratorlar boshqaruvi
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white font-bold text-sm transition-all"
        >
          <IoLogOut className="text-xl" />
          Tizimdan chiqish
        </button>
      </div>

      {/* Profile Form Card */}
      <div className="p-6 rounded-3xl bg-[#12211c] border border-white/5 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <UserIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Administrator Profili</h2>
            <p className="text-xs text-slate-400">
              Shaxsiy ma'lumotlar va hisob xavfsizligi sozlamalari
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Ism</label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Familiya</label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">E-pochta</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Telefon raqam</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Yangi Parol (ixtiyoriy)
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password || ""}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Parolni tasdiqlash
            </label>
            <input
              name="password_confirm"
              type="password"
              placeholder="••••••••"
              value={form.password_confirm || ""}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
            />
          </div>
        </div>

        {isChanged && (
          <div className="flex justify-end pt-2">
            <button
              disabled={savingUser}
              onClick={updateUser}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {savingUser ? "Saqlanmoqda..." : "Profilni Saqlash"}
            </button>
          </div>
        )}
      </div>

      {/* Quick Category & Announcement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Categories */}
        <div
          onClick={() => {
            setSelected("product");
            setOpen(true);
          }}
          className="p-6 rounded-3xl bg-[#12211c] border border-white/5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all cursor-pointer shadow-xl flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <MdShoppingCart className="text-2xl" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                Mahsulot Kategoriyalari
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Katalog mahsulotlari guruhlarini ko'rish va boshqarish
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>Jami: {totalCount} ta toifa</span>
            <span>Boshqarish →</span>
          </div>
        </div>

        {/* Service Categories */}
        <div
          onClick={() => {
            setSelected("service");
            setOpen(true);
          }}
          className="p-6 rounded-3xl bg-[#12211c] border border-white/5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all cursor-pointer shadow-xl flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Wrench className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                Servis Kategoriyalari
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Xizmat ko'rsatish yo'nalishlari va guruhlari
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-cyan-400">
            <span>Jami: {totalCountService} ta toifa</span>
            <span>Boshqarish →</span>
          </div>
        </div>

        {/* Announcement */}
        <div
          onClick={() => setOpenAnnouncement(true)}
          className="p-6 rounded-3xl bg-[#12211c] border border-white/5 hover:border-amber-500/40 hover:-translate-y-1 transition-all cursor-pointer shadow-xl flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <MdCampaign className="text-2xl" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                E'lonlar (Banner)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Mobil ilova va mini app bosh sahifasidagi aksiyalar
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-amber-400">
            <span>Aktiv e'lon</span>
            <span>Tahrirlash →</span>
          </div>
        </div>
      </div>

      {/* Admins Table Section */}
      <div className="rounded-3xl bg-[#12211c] border border-white/5 overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Administratorlar Ro'yxati</h2>
              <p className="text-xs text-slate-400">
                Tizimga kirish huquqiga ega bo'lgan xodimlar
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedUser(null);
              setOpenUser(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <MdPersonAdd className="text-lg" />
            Admin Qo'shish
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 flex justify-center text-slate-400 text-xs">
              Yuklanmoqda...
            </div>
          ) : admins.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Ism-Familiya</th>
                  <th className="px-5 py-3">E-pochta</th>
                  <th className="px-5 py-3">Telefon</th>
                  <th className="px-5 py-3">Qo'shilgan</th>
                  <th className="px-5 py-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-semibold text-white">
                      {adm.first_name} {adm.last_name}
                      {adm.id === user?.id && (
                        <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Siz
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-300">{adm.email}</td>
                    <td className="px-5 py-3 text-xs text-slate-300 font-mono">
                      +{adm.phone}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400">
                      {new Date(adm.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {adm.id !== user?.id && (
                        <button
                          onClick={() => {
                            setSelectedUser(adm);
                            setOpenUser(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                        >
                          <MdEdit className="text-lg" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">
              Adminlar topilmadi
            </div>
          )}
        </div>
      </div>

      {/* Drawers and Modals */}
      <CategoryDrawer
        type={selected}
        open={open}
        page={page}
        limit={limit}
        totalCount={selected === "product" ? totalCount : totalCountService}
        initialValues={selected === "service" ? services : categories}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          fetchCategories();
          fetchServiceCategories();
        }}
      />

      <UserDrawer
        open={openUser}
        initialValues={selectedUser}
        onClose={() => {
          setOpenUser(false);
          setSelectedUser(null);
        }}
        onSuccess={() => fetchAdmins()}
      />

      {openAnnouncement && (
        <Announcement close={() => setOpenAnnouncement(false)} />
      )}
    </div>
  );
};

export default Settings;
