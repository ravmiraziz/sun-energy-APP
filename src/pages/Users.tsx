import React from "react";
import { MdPersonAdd, MdSearch, MdExpandMore, MdEditNote, MdDelete } from "react-icons/md";

const Users: React.FC = () => {
  const users = [
    {
      name: "Alex Rivera",
      email: "alex.rivera@smartenergy.io",
      role: "Admin",
      status: "Active",
      login: "2 hours ago",
      avatar: "https://picsum.photos/40/40?random=1",
    },
    {
      name: "Sarah Chen",
      email: "s.chen@energy.com",
      role: "User",
      status: "Active",
      login: "Oct 24, 2023",
      avatar: "https://picsum.photos/40/40?random=2",
    },
    {
      name: "Marcus Thompson",
      email: "m.thompson@dev.io",
      role: "User",
      status: "Inactive",
      login: "Never",
      avatar: "https://picsum.photos/40/40?random=3",
    },
    {
      name: "Jasmine V.",
      email: "jasmine@smartenergy.io",
      role: "Admin",
      status: "Active",
      login: "Just now",
      avatar: "https://picsum.photos/40/40?random=4",
    },
  ];

  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            User Management
          </h1>
          <p className="text-slate-500 dark:text-primary/60 text-sm mt-1">
            Manage administrative roles and end-user permissions.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background-dark rounded-xl font-bold text-sm tracking-tight hover:brightness-110 shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02]">
          <MdPersonAdd />
          Create New User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Users",
            val: "1,284",
            trend: "+12%",
            color: "text_primary",
          },
          {
            label: "Active Admins",
            val: "42",
            trend: "0%",
            color: "text-slate-400",
          },
          {
            label: "Energy Consumers",
            val: "1,242",
            trend: "-2.4%",
            color: "text-orange-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg_card rounded-2xl p-6 border border_color dark:border-border-teal shadow-sm"
          >
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{stat.val}</p>
              <p className={`${stat.color} text-xs font-semibold`}>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg_card p-4 rounded-2xl border border_color dark:border-border-teal flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full card_btn border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary text-slate-700 dark:text-white placeholder:text-slate-400"
            placeholder="Search by name, email or role..."
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex h-12 items-center justify-center gap-2 rounded-xl card_btn px-5 border border-transparent hover:border-primary/30 text-slate-700 dark:text-white text-sm font-medium transition-all">
            All Roles{" "}
            <MdExpandMore />
          </button>
          <button className="flex h-12 items-center justify-center gap-2 rounded-xl card_btn px-5 border border-transparent hover:border-primary/30 text-slate-700 dark:text-white text-sm font-medium transition-all">
            Status: Active{" "}
            <MdExpandMore />
          </button>
        </div>
      </div>

      <div className="bg_card rounded-2xl border border_color dark:border-border-teal overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="card_btn border-b border_color dark:border-border-teal">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                User
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Role
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Last Login
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-border-teal">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-primary/5 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full border-2 border_color transition-all overflow-hidden">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold group-hover:text-primary transition-colors">
                        {user.name}
                      </span>
                      <span className="text-xs card_text">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      user.role === "Admin"
                        ? "bg-primary/10 text_primary border_color"
                        : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white border_color dark:border-white/20"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${user.status === "Active" ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"}`}
                    >
                      <div
                        className={`size-3 bg-white rounded-full transition-transform ${user.status === "Active" ? "translate-x-5" : "translate-x-0"}`}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {user.login}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 text-slate-400">
                    <button className="hover:text-primary transition-colors">
                      <MdEditNote className="text-xl" />
                    </button>
                    <button className="hover:text-red-500 transition-colors">
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 card_btn border-t border_color dark:border-border-teal flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing 1 to 4 of 1,284 users
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg bg_card text-[10px] font-bold border border_color dark:border-border-teal hover:border-primary transition-all">
              Prev
            </button>
            <button className="px-3 py-1 rounded-lg bg-primary text-background-dark text-[10px] font-bold">
              1
            </button>
            <button className="px-3 py-1 rounded-lg bg_card text-[10px] font-bold border border_color dark:border-border-teal hover:border-primary transition-all">
              2
            </button>
            <button className="px-3 py-1 rounded-lg bg_card text-[10px] font-bold border border_color dark:border-border-teal hover:border-primary transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
