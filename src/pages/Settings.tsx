import React from "react";
import {
  MdPalette,
  MdAccountCircle,
  MdPhotoCamera,
  MdExpandMore,
  MdSecurity,
  MdConstruction,
  MdShoppingCart,
} from "react-icons/md";

import { useAuth } from "../context/AuthContext";
import { IoLogOutOutline } from "react-icons/io5";

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-8 max-w-400 mx-auto w-full space-y-12">
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            Admin Sozlamalari
          </h2>
          <p className="card_text text_primary text-base">
            Profilingiz, ruxsatnomalaringiz va tizim sozlamalaringizni
            boshqaring.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 card_btn rounded-xl font-bold text-sm hover:opacity-90 transition-all">
            Tashlab ketish
          </button>
          <button className="px-6 py-2.5 bg-primary rounded-xl font-bold text-sm shadow-lg  hover:scale-[1.02] active:scale-[0.98] transition-all">
            O'zgarishlarni saqlash
          </button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <MdPalette className="text-primary text-[24px]" />
          <h3 className="text-xl font-bold">Servis & Mahsulotlar</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: "Servis turlari",
              desc: "Servis kategoriya turlari bo'limi",
              icon: MdConstruction,
            },
            {
              label: "Mahsulot turlari",
              desc: "Mahsulotlar kategoriyasi sozlamalari",
              icon: MdShoppingCart,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-6 rounded-2xl border border_color bg_card shadow-sm cursor-pointer hover:opacity-70"
            >
              <div className="flex flex-col gap-1">
                <p className="font-bold">{item.label}</p>
                <p className="text-xs card_text">{item.desc}</p>
              </div>
              <item.icon
                className={`text-3xl ${i === 1 ? "text-orange-400" : "text-blue-400"}`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <MdAccountCircle className="text-primary text-[24px]" />
          <h3 className="text-xl font-bold">Admin Profile</h3>
        </div>
        <div className="bg_card border border_color rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="relative group mx-auto md:mx-0">
              <div
                className="size-32 rounded-full bg-center bg-cover border-4 border_color shadow-xl"
                style={{
                  backgroundImage: `url('https://picsum.photos/200/200?random=1')`,
                }}
              />
              <button className="absolute bottom-0 right-0 size-10 bg-primary text-background-dark rounded-full flex items-center justify-center border-4 border-white dark:border-card-dark hover:scale-110 transition-transform">
                <MdPhotoCamera className="text-md" />
              </button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative">
              {[
                { label: "Ism", val: user?.first_name, type: "text" },
                { label: "Familiya", val: user?.last_name, type: "text" },
                {
                  label: "E-pochta manzil",
                  val: user?.email,
                  type: "email",
                },
                {
                  label: "Timezone",
                  val: "(GMT-08:00) Pacific Time",
                  type: "select",
                  options: ["(GMT-08:00) Pacific Time", "(GMT+00:00) London"],
                },
              ].map((field, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[10px] font-bold card_text dark:text_primary/60 uppercase tracking-widest">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <div className="relative">
                      <select className="w-full bg_card border_color rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary appearance-none transition-all">
                        {field.options?.map((opt, j) => (
                          <option key={j}>{opt}</option>
                        ))}
                      </select>
                      <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[24px]" />
                    </div>
                  ) : (
                    <input
                      className="w-full bg_card border_color rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                      type={field.type}
                      defaultValue={field.val}
                    />
                  )}
                </div>
              ))}
              <button
                className="absolute top-0 right-0 text-red-500 flex items-center gap-2 justify-center"
                onClick={logout}
              >
                Chiqish <IoLogOutOutline className="text-[20px]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 pb-20">
        <div className="flex items-center gap-2">
          <MdSecurity className="text-primary text-[24px]" />
          <h3 className="text-xl font-bold">Module Access</h3>
        </div>
        <div className="bg_card border border_color rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="card_btn">
              <tr className="border-b border_color">
                <th className="px-6 py-4 text-[10px] font-bold text_primary uppercase tracking-widest">
                  Module
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text_primary uppercase text-center">
                  Read
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text_primary uppercase text-center">
                  Write
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text_primary uppercase text-center">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-teal">
              {[
                { name: "Energy Monitoring", desc: "Real-time grid analytics" },
                {
                  name: "Commerce & Billing",
                  desc: "Transaction logs & invoices",
                },
                {
                  name: "API Configuration",
                  desc: "External service integration",
                },
              ].map((mod, i) => (
                <tr key={i} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">{mod.name}</p>
                    <p className="text-[10px] card_text">{mod.desc}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-300 text_primary focus:ring-primary bg-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      defaultChecked={i === 0}
                      className="rounded border-slate-300 text_primary focus:ring-primary bg-transparent"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text_primary focus:ring-primary bg-transparent"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Settings;
