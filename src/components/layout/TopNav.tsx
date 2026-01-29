import React, { useState } from "react";
import { MdNotifications } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Notification from "../modals/Notification";

const TopNav: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border_color flex items-center justify-between z-50 px-8 sticky gap-4 top-0 bg_card backdrop-blur-md transition-colors">
        <div>
          <Link to="/admin" className="md:hidden">
            <img src="/logo.svg" alt="logo" className="object-contain h-18" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setOpen(true)}
              className="size-10 flex items-center justify-center rounded-xl card_btn text-slate-600 dark:text-slate-400 relative hover:text-primary transition-colors"
            >
              <MdNotifications className="text-[22px]" />
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-border-teal"></div>

          <Link to="/admin/settings">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mt-1">
                  {user?.phone}
                </p>
              </div>
              <div className="bg-center flex items-center justify-center bg-no-repeat aspect-square bg-cover overflow-hidden rounded-full size-10 border-2 border-primary/20 group-hover:border-primary transition-all">
                {user?.image_url ? (
                  <img loading="lazy" src={user?.image_url} alt="avatar" />
                ) : (
                  <span className="text-md">
                    {user?.first_name?.slice(0, 1)}
                  </span>
                )}
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
