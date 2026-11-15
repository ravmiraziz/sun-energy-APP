import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNav from "../components/layout/TopNav";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1411] text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto not-md:pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
