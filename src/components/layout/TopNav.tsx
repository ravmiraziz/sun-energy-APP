import React from "react";
import { MdSearch } from "react-icons/md";

const TopNav: React.FC = () => {
  return (
    <header className="h-16 border-b border_color dark:border-border-teal flex items-center justify-between px-8 sticky top-0 bg_card backdrop-blur-md z-30 transition-colors">
      <div className="flex items-center gap-4 w-1/3">
        <label className="relative flex-1 max-w-sm">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            className="w-full card_btn border-none rounded-xl pl-10 pr-4 py-2 text-sm"
            placeholder="Search data, nodes, or orders..."
            type="text"
          />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-8 w-px bg-slate-200 dark:bg-border-teal"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="hidden lg:block text-right">
            <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors">
              Alex Rivera
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mt-1">
              Super Admin
            </p>
          </div>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20 group-hover:border-primary transition-all"
            style={{
              backgroundImage: `url('https://picsum.photos/100/100?random=1')`,
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
