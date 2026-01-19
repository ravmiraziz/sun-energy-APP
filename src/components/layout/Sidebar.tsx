import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdBolt,
  MdDashboard,
  MdInventory2,
  MdReceiptLong,
  MdGroup,
  MdSettings,
  MdAddCircle,
} from "react-icons/md";

const Sidebar: React.FC = () => {
  const navbars = [
    { link: "/admin", icon: MdDashboard, label: "Boshqaruv" },
    { link: "/admin/products", icon: MdInventory2, label: "Mahsulotlar" },
    { link: "/admin/orders", icon: MdReceiptLong, label: "Buyurtmalar" },
    { link: "/admin/users", icon: MdGroup, label: "Foydalanuvchilar" },
    { link: "/admin/services", icon: MdDashboard, label: "Servislar" },
    { link: "/admin/settings", icon: MdSettings, label: "Sozlamalar" },
  ];
  return (
    <>
      <aside className="w-64 bg_card border-r border_color not-md:hidden flex flex-col z-20 transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center  shadow-lg shadow-primary/20">
            <MdBolt className="font-bold text-[24px]" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Smart Energy</h1>
            <p className="text-xs text-slate-400">Enterprise Control</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navbars.map((navbar) => {
            return (
              <NavLink
                key={navbar.link}
                to={navbar.link}
                end
                className={({ isActive }) =>
                  `nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive ? "text-[#fbbf24]" : "card_text"
                  }`
                }
              >
                <navbar.icon className="text-[24px]" />
                <span className="text-sm font-semibold">{navbar.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="bg-card p-4 rounded-xl mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Support
            </p>
            <p className="text-xs text-slate-400 mb-3 leading-tight">
              Need help with grid management?
            </p>
            <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors">
              Open Ticket
            </button>
          </div>
          <button className="w-full bg-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
            <MdAddCircle className="text-sm" />
            Add Node
          </button>
        </div>
      </aside>
      <nav className="fixed overflow-x-auto px-3 bottom-0 w-full bg-[#064e3b]/90 backdrop-blur-xl border-t border-emerald-900/50 pt-4 pb-2 flex justify-between items-center gap-4 z-50 rounded-t-3xl shadow-2xl md:hidden">
        {navbars.map((navbar) => {
          return (
            <NavLink
              key={navbar.link}
              to={navbar.link}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-all nav-link w-full rounded-xl duration-200 group ${
                  isActive ? "text-[#fbbf24]" : "card_text"
                }`
              }
            >
              <navbar.icon />
              <span className="text-sm font-semibold">{navbar.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
