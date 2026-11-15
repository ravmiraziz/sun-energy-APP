import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdReceipt,
  MdGroup,
  MdSettings,
  MdMiscellaneousServices,
} from "react-icons/md";

const Sidebar: React.FC = () => {
  const navbars = [
    { link: "/admin", icon: MdDashboard, label: "Boshqaruv" },
    { link: "/admin/orders", icon: MdReceipt, label: "Buyurtmalar" },
    { link: "/admin/products", icon: MdInventory, label: "Mahsulotlar" },
    { link: "/admin/services", icon: MdMiscellaneousServices, label: "Xizmatlar" },
    { link: "/admin/users", icon: MdGroup, label: "Foydalanuvchilar" },
    { link: "/admin/settings", icon: MdSettings, label: "Sozlamalar" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0e1a15] border-r border-white/5 not-md:hidden flex flex-col z-50 h-screen sticky top-0 select-none">
        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-white/5">
          <Link to="/admin" className="flex items-center">
            <img src="/logo.svg" alt="Sun Energy" className="h-10 object-contain" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navbars.map((navbar) => (
            <NavLink
              key={navbar.link}
              to={navbar.link}
              end
              className={({ isActive }) =>
                `w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-colors text-sm ${
                  isActive
                    ? "bg-white/[0.06] text-emerald-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <navbar.icon
                    className={`text-xl ${
                      isActive ? "text-emerald-400" : "text-slate-400"
                    }`}
                  />
                  <span>{navbar.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <p className="text-[11px] font-medium text-slate-500 text-center">
            Powered by SYSTEMLABUZ
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Dock Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0b1411]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex justify-around items-center md:hidden shadow-2xl">
        {navbars.map((navbar) => (
          <NavLink
            key={navbar.link}
            to={navbar.link}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-colors ${
                isActive
                  ? "text-emerald-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`
            }
          >
            <navbar.icon className="text-xl" />
            <span className="text-[10px] mt-0.5">
              {navbar.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
