import React from "react";
import { NavLink } from "react-router-dom";
import { MdBolt, MdDashboard, MdInventory2, MdReceiptLong, MdGroup, MdSettings, MdAddCircle } from "react-icons/md";

const Sidebar: React.FC = () => {
  return (
    <>
      <aside className="w-64 bg_mode border-r border_color not-sm:hidden flex flex-col z-20 transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center  shadow-lg shadow-primary/20">
            <MdBolt className="font-bold" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Smart Energy</h1>
            <p className="text-xs text-slate-400">Enterprise Control</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? "text-[#fbbf24]" : "text-gray-500"
              }`
            }
          >
            <MdDashboard />
            <span className="text-sm font-semibold">Boshqaruv</span>
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? "text-[#fbbf24]" : "text-gray-500"
              }`
            }
          >
            <MdInventory2 />
            <span className="text-sm font-semibold">Mahsulotlar</span>
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? "text-[#fbbf24]" : "text-gray-500"
              }`
            }
          >
            <MdReceiptLong />
            <span className="text-sm font-semibold">Buyurtmalar</span>
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? "text-[#fbbf24]" : "text-gray-500"
              }`
            }
          >
            <MdGroup />
            <span className="text-sm font-semibold">Foydalanuvchilar</span>
          </NavLink>
          <NavLink
            to="/admin/services"
            className={({ isActive }) =>
              `nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? "text-[#fbbf24]" : "text-gray-500"
              }`
            }
          >
            <MdGroup />
            <span className="text-sm font-semibold">Serveslar</span>
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? "text-[#fbbf24]" : "text-gray-500"
              }`
            }
          >
            <MdSettings />
            <span className="text-sm font-semibold">Sozlamalar</span>
          </NavLink>
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
      <nav className="fixed bottom-0 w-full bg-[#064e3b]/90 backdrop-blur-xl border-t border-emerald-900/50 pt-4 pb-8 flex justify-between items-center gap-1 z-50 rounded-t-3xl shadow-2xl sm:hidden">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all nav-link w-full rounded-xl duration-200 group ${
              isActive ? "text-[#fbbf24]" : "text-gray-500"
            }`
          }
        >
          <MdDashboard />
          <span className="text-sm font-semibold">Boshqaruv</span>
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all nav-link w-full rounded-xl duration-200 group ${
              isActive ? "text-[#fbbf24]" : "text-gray-500"
            }`
          }
        >
          <MdInventory2 />
          <span className="text-sm font-semibold">Mahsulotlar</span>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all nav-link w-full rounded-xl duration-200 group ${
              isActive ? "text-[#fbbf24]" : "text-gray-500"
            }`
          }
        >
          <MdReceiptLong />
          <span className="text-sm font-semibold">Buyurtmalar</span>
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all nav-link w-full rounded-xl duration-200 group ${
              isActive ? "text-[#fbbf24]" : "text-gray-500"
            }`
          }
        >
          <MdGroup />
          <span className="text-sm font-semibold">Foydalanuvchilar</span>
        </NavLink>
        <NavLink
          to="/admin/services"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all nav-link w-full rounded-xl duration-200 group ${
              isActive ? "text-[#fbbf24]" : "text-gray-500"
            }`
          }
        >
          <MdGroup />
          <span className="text-sm font-semibold">Serveslar</span>
        </NavLink>
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all nav-link w-full rounded-xl duration-200 group ${
              isActive ? "text-[#fbbf24]" : "text-gray-500"
            }`
          }
        >
          <MdSettings />
          <span className="text-sm font-semibold">Sozlamalar</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Sidebar;
