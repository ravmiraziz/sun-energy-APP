import React from "react";
import {
  MdFilterList,
  MdOutlineFileDownload,
  MdExpandMore,
  MdClose,
  MdSolarPower,
  MdAccountBalanceWallet,
} from "react-icons/md";
const Orders: React.FC = () => {
  const orders = [
    {
      id: "#8821",
      customer: "Alex Rivera",
      volume: "450 kWh",
      price: "$128.50",
      date: "Oct 12, 14:30",
      status: "Success",
    },
    {
      id: "#8822",
      customer: "SolarCorp Solutions",
      volume: "1.2 MWh",
      price: "$450.00",
      date: "Oct 12, 15:45",
      status: "Pending",
    },
    {
      id: "#8823",
      customer: "Jordan Smith",
      volume: "120 kWh",
      price: "$35.20",
      date: "Oct 13, 09:15",
      status: "Success",
    },
    {
      id: "#8824",
      customer: "Green Logistics Ltd.",
      volume: "890 kWh",
      price: "$210.00",
      date: "Oct 13, 10:30",
      status: "Failed",
    },
    {
      id: "#8825",
      customer: "Maria Garcia",
      volume: "300 kWh",
      price: "$85.00",
      date: "Oct 13, 11:20",
      status: "Success",
    },
    {
      id: "#8826",
      customer: "TechHub Campus",
      volume: "2.5 MWh",
      price: "$895.00",
      date: "Oct 14, 08:00",
      status: "Pending",
    },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-black leading-tight tracking-tight">
              Orders Management
            </h1>
            <p className="text_primary text-sm mt-1">
              Review and manage all incoming energy commerce transactions.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border_color bg_card text-sm font-bold transition-all">
              <MdFilterList className="text-[22px]" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all transform hover:scale-[1.02]">
              <MdOutlineFileDownload className="text-[22px]" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/10">
            All Sources
          </button>
          {["Solar PV", "Main Grid", "Wind Turbine"].map((filter, i) => (
            <button
              key={i}
              className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg_card px-5 text-xs font-bold uppercase tracking-wider text-slate-400 border border-transparent transition-all"
            >
              {filter} <MdExpandMore className="text-base" />
            </button>
          ))}
        </div>

        <div className="bg_card border border_color rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="card_btn border-b border_color">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Order ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Customer
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Energy Volume
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Price
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={i}
                  className={`cursor-pointer transition-all hover:bg-slate-800/30 ${i === 0 ? "bg-primarys border-l-4 border-l-orange-400" : ""}`}
                >
                  <td className="px-6 py-5 font-bold text-sm">{order.id}</td>
                  <td className="px-6 py-5 text-sm text-slate-300">
                    {order.customer}
                  </td>
                  <td className="px-6 py-5 text-sm card_text">
                    {order.volume}
                  </td>
                  <td className="px-6 py-5 font-bold text-sm">{order.price}</td>
                  <td className="px-6 py-5 card_text text-xs">{order.date}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        order.status === "Success"
                          ? "bg-primary/10 card_text border-primary/20"
                          : order.status === "Pending"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 border-t border_color flex justify-between items-center card_btn">
            <p className="text-[10px] font-bold text_primary uppercase tracking-widest">
              Showing 1 to 10 of 124 orders
            </p>
            <div className="flex items-center gap-2">
              <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-xs font-bold">
                1
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg text_primary hover:bg-slate-800 transition-colors text-xs font-semibold">
                2
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg text_primary hover:bg-slate-800 transition-colors text-xs font-semibold">
                3
              </button>
              <span className="px-2 text-slate-400 text-xs">...</span>
              <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="w-100 border-l border_color bg_card h-full flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-10 overflow-y-auto">
        <div className="p-6 border-b border_color flex items-center justify-between">
          <h3 className="text-xl font-black">Order Details</h3>
          <button className="text-slate-400 hover:text-primary transition-colors">
            <MdClose className="text-[24px]" />
          </button>
        </div>

        <div className="p-8 space-y-10">
          <div className="card_btn rounded-2xl p-6 shadow-inner">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black card_text uppercase tracking-[0.2em] mb-1">
                  Order #8821
                </p>
                <p className="text-xl font-black leading-tight">
                  450 kWh Solar Energy
                </p>
              </div>
              <span className="bg-primary text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Confirmed
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <MdSolarPower className="text-2xl" />
              </div>
              <div>
                <p className="text-[10px] card_text font-bold uppercase tracking-widest">
                  Origin Source
                </p>
                <p className="text-sm font-black">Arizona Solar Farm #4</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">
              Payment Breakdown
            </h4>
            <div className="space-y-4">
              {[
                { label: "Energy Base Rate", val: "$108.00" },
                { label: "Grid Transmission Fee", val: "$12.50" },
                { label: "Carbon Offset Tax", val: "$8.00" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm font-medium"
                >
                  <span className="card_text">{item.label}</span>
                  <span className="text-white">{item.val}</span>
                </div>
              ))}
              <div className="pt-4 border-t border_color flex justify-between items-baseline">
                <span className="font-bold text-sm">Total Charged</span>
                <span className="font-black text_primary text-2xl">
                  $128.50
                </span>
              </div>
            </div>
            <div className="mt-6 p-4 card_btn rounded-xl flex items-center gap-4 border border_color/50 dark:border-border-teal/50">
              <MdAccountBalanceWallet className="text-primary text-[24px]" />
              <div>
                <p className="text-[10px] card_text font-bold uppercase">
                  Payment Method
                </p>
                <p className="text-xs font-black">Smart Wallet (USDC)</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">
              Grid Connection
            </h4>
            <div className="space-y-6 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-primary/20"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="size-4 rounded-full bg-primary border-4 border_color shadow-sm mt-1"></div>
                <div>
                  <p className="text-sm font-black">Meter ID: MRT-22910-X</p>
                  <p className="text-[10px] card_text font-bold uppercase mt-1">
                    Reading synced at 14:32
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="size-4 rounded-full bg-primary border-4 border_color shadow-sm mt-1"></div>
                <div>
                  <p className="text-sm font-black">
                    Grid Segment: Phoenix-North-04
                  </p>
                  <p className="text-[10px] card_text font-bold uppercase mt-1">
                    Transmission stability: 99.9%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <button className="w-full bg-primary font-black py-4 rounded-2xl hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              Download Receipt
            </button>
            <button className="w-full bg_card font-black py-4 rounded-2xl hover:bg-slate-800 transition-all border border_color">
              Contact Customer
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Orders;
