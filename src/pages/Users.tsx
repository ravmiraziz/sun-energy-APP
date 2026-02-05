import React, { useEffect, useRef, useState } from "react";
import { MdSearch, MdPersonSearch } from "react-icons/md";
import { get } from "../api/api";
import Pagination from "../components/ui/Pagination";
import { TbReload } from "react-icons/tb";
import { Link } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";

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

  const fetchedOnce = useRef(false); // 🔥 MAGIC

  const fetchUsers = async (p = page) => {
    setLoading(true);
    try {
      const { data }: ResData = await get("/users", { page: p, limit, search });
      console.log(data);

      setUsers(data.users || []);
      setTotalCount(data.count);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;

    fetchedOnce.current = true;
    fetchUsers();
  }, []);

  return (
    <div className="p-8 max-w-400 mx-auto w-full space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            Foydalanuvchilar ma'lumotlari
          </h1>
          <p className="text_primary text-sm mt-1">
            Barcha foydalanuvchilar bo'yicha ko'rsatkichlar
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg_card rounded-2xl p-6 border border_color shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            Barcha foydalanuvchilar
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{totalCount}</p>
            <p className={`text_primary text-xs font-semibold`}>
              {/* {stat.trend} */}
            </p>
          </div>
        </div>
        <div className="bg_card p-4 rounded-2xl border border_color flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[24px]" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              className="w-full card_btn border-none rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-400"
              placeholder="Ism buyicha qidiruv..."
            />
            {search ? (
              <button
                onClick={() => fetchUsers(1)}
                className="absolute bg-primary right-2 top-1/2 -translate-y-1/2 text-[24px] rounded-md p-1"
              >
                <MdPersonSearch />
              </button>
            ) : (
              <button
                onClick={() => fetchUsers(1)}
                className="absolute bg-primary right-2 top-1/2 -translate-y-1/2 text-[24px] rounded-md p-1"
              >
                <TbReload className={`${loading && "animate-spin"} text-2xl`} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg_card rounded-2xl border border_color overflow-x-auto shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-full py-6 w-full animate-pulse">
            Yuklanmoqda...
          </div>
        ) : users?.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="card_btn border-b border_color">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Manzil
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Telefon raqam
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Qo'shilgan vaqt
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Xarita
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i} className="hover:bg-primary/5 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full border-2 border_color transition-all overflow-hidden">
                        {user.image_url ? (
                          <img
                            src={user.image_url}
                            alt={user.first_name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="flex items-center justify-center uppercase h-full card_btn">
                            {user.first_name.slice(0, 1)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold group-hover:text-yellow-500 transition-colors text-nowrap">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-xs card_text">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border border_color text-nowrap`}
                    >
                      {user.address}
                    </span>
                  </td>
                  <td className="px-6 py-4">+{user.phone}</td>
                  <td className="px-6 py-4">
                    <span>
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.lat && user.long ? (
                      <Link
                        className="group-hover:text-yellow-500"
                        target="_blank"
                        to={`https://yandex.uz/maps/?ll=${user.long},${user.lat}&z=16&pt=${user.long},${user.lat},pm2rdm`}
                      >
                        <FaMapLocationDot className="text-2xl" />
                      </Link>
                    ) : (
                      <span>---</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center py-6 justify-center h-full w-full">
            Ma'lumtlar qo'shilmagan
          </div>
        )}
        <div className="px-6 py-4 card_btn border-t border_color flex justify-end items-center">
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
