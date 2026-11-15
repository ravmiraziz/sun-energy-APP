import React, { useState } from "react";
import { MdNotifications } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Notification from "../modals/Notification";
import { User as UserIcon } from "lucide-react";

const TopNav: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-white/5 flex items-center justify-between z-40 px-6 sticky top-0 bg-[#0e1a15]/90 backdrop-blur-md transition-colors select-none">
        {/* Mobile Logo */}
        <div className="flex items-center md:hidden">
          <Link to="/admin">
            <img src="/logo.svg" alt="Sun Energy" className="h-8 object-contain" />
          </Link>
        </div>

        {/* Empty placeholder for desktop spacing */}
        <div className="hidden md:block" />

        {/* Actions & Profile */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notification Button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            title="Bildirishnoma"
            className="size-10 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/5 text-slate-300 hover:text-emerald-400 hover:bg-white/[0.08] transition-colors"
          >
            <MdNotifications className="text-xl" />
          </button>

          <div className="h-6 w-px bg-white/10" />

          {/* User Profile Info */}
          <Link to="/admin/settings" className="group">
            <div className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/[0.03] transition-colors">
              <div className="size-9 rounded-full bg-emerald-600/30 border border-emerald-500/20 overflow-hidden flex items-center justify-center text-emerald-300 font-bold text-sm">
                {user?.image_url ? (
                  <img
                    loading="lazy"
                    src={user?.image_url}
                    alt="avatar"
                    className="size-full object-cover"
                  />
                ) : user?.first_name ? (
                  <span>{user.first_name.slice(0, 1).toUpperCase()}</span>
                ) : (
                  <UserIcon className="size-4" />
                )}
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "Administrator"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {user?.phone ? `+${user.phone}` : "Bosh Administrator"}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {open && <Notification close={() => setOpen(false)} />}
      </header>
    </>
  );
};

export default TopNav;
