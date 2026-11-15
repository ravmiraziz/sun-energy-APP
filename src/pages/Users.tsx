import React, { useEffect, useRef, useState } from "react";
import { MdSearch, MdLocationOn } from "react-icons/md";
import { get } from "../api/api";
import Pagination from "../components/ui/Pagination";
import { TbReload } from "react-icons/tb";
import { Link } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";
import { Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";

interface User {
  id?: string;
  email: string;
  first_name: string;
  image_url: string;
  created_at: string;
  address?: string;
  language: string;
  last_name: string;
  password?: string;
  phone: string;
  lat?: number;
  long?: number;
}

interface ResData {
  data: {
    users: User[];
    count: number;
  };
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const limit = 20;
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchedOnce = useRef(false);

  const fetchUsers = async (p = page) => {
    setLoading(true);
    try {
      const { data }: ResData = await get("/users", { page: p, limit, search });
      setUsers(data.users || []);
      setTotalCount(data.count || 0);
      setPage(p);
    } catch (err) {
      console.error("Users fetch error:", err);
      toast.error("Foydalanuvchilarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    fetchUsers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Foydalanuvchilar Ro'yxati
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Jami: {totalCount} nafar
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mijozlar hisoblari, kontaktlar va xaritadagi manzillar
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#12211c] border border-white/5 flex flex-col sm:flex-row items-center gap-3 shadow-lg">
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 w-full relative"
        >
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#152721] border border-white/5 rounded-xl pl-11 pr-24 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40"
            placeholder="Ism, familiya yoki telefon bo'yicha qidiruv..."
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500 hover:text-[#0b1411] transition-all"
          >
            Qidirish
          </button>
        </form>

        <button
          onClick={() => {
            setSearch("");
            fetchUsers(1);
          }}
          title="Ro'yxatni yangilash"
          className="p-2.5 rounded-xl bg-[#152721] border border-white/5 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
        >
          <TbReload className={`text-xl ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-[#12211c] border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="size-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <span className="text-xs font-medium">Foydalanuvchilar yuklanmoqda...</span>
            </div>
          ) : users.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Foydalanuvchi</th>
                  <th className="px-5 py-4">Telefon</th>
                  <th className="px-5 py-4">Manzil</th>
                  <th className="px-5 py-4">Ro'yxatdan o'tgan</th>
                  <th className="px-5 py-4 text-center">Xarita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user, i) => (
                  <tr
                    key={user.id || i}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* User profile */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 overflow-hidden flex items-center justify-center text-emerald-400 font-bold text-sm">
                          {user.image_url ? (
                            <img
                              src={user.image_url}
                              alt={user.first_name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <span>{user.first_name ? user.first_name.slice(0, 1).toUpperCase() : "U"}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {user.email || "E-pochta ko'rsatilmagan"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-xs text-slate-300">
                      +{user.phone}
                    </td>

                    {/* Address */}
                    <td className="px-5 py-4 max-w-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-slate-300 border border-white/5 line-clamp-1">
                        <MdLocationOn className="text-emerald-400 shrink-0" />
                        {user.address || "Manzil kiritilmagan"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}{" "}
                      <span className="text-slate-500 font-mono">
                        {new Date(user.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    {/* Map Pin */}
                    <td className="px-5 py-4 text-center">
                      {user.lat && user.long ? (
                        <Link
                          target="_blank"
                          to={`https://yandex.uz/maps/?ll=${user.long},${user.lat}&z=16&pt=${user.long},${user.lat},pm2rdm`}
                          title="Xaritada ko'rish"
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-[#0b1411] transition-all"
                        >
                          <FaMapLocationDot className="text-base" />
                        </Link>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-sm">
              <UsersIcon className="size-12 text-slate-600 mb-2" />
              Foydalanuvchilar topilmadi
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Jami: {totalCount} ta foydalanuvchidan {(page - 1) * limit + 1}-
            {Math.min(page * limit, totalCount)} ko'rsatilmoqda
          </span>
          <Pagination
            page={page}
            limit={limit}
            allCount={totalCount}
            onChange={(p) => fetchUsers(p)}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
