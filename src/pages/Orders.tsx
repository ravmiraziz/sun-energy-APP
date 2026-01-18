import React from "react";

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
            <p className="text-slate-500 dark:text-primary/60 text-sm mt-1">
              Review and manage all incoming energy commerce transactions.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border_color dark:border-border-teal bg_card text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <span className="material-symbols-outlined text-lg">
                filter_list
              </span>
              Filter
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-background-dark text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all transform hover:scale-[1.02]">
              <span className="material-symbols-outlined text-lg">
                download
              </span>
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary text-background-dark px-5 font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/10">
            All Sources
          </button>
          {["Solar PV", "Main Grid", "Wind Turbine"].map((filter, i) => (
            <button
              key={i}
              className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-card-dark px-5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border border-transparent hover:border-primary/20 transition-all"
            >
              {filter}{" "}
              <span className="material-symbols-outlined text-base">
                expand_more
              </span>
            </button>
          ))}
        </div>

        <div className="bg_card border border_color dark:border-border-teal rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="card_btn/50 border-b border_color dark:border-border-teal">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Order ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Energy Volume
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Price
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-teal">
              {orders.map((order, i) => (
                <tr
                  key={i}
                  className={`cursor-pointer transition-all hover:bg-primary/5 ${i === 0 ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
                >
                  <td className="px-6 py-5 font-bold text-sm">{order.id}</td>
                  <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-300">
                    {order.customer}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500">
                    {order.volume}
                  </td>
                  <td className="px-6 py-5 font-bold text-sm">{order.price}</td>
                  <td className="px-6 py-5 text-slate-500 text-xs">
                    {order.date}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        order.status === "Success"
                          ? "bg-primary/10 text-primary border-primary/20"
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
          <div className="p-6 border-t border_color dark:border-border-teal flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing 1 to 10 of 124 orders
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg_card text-[10px] font-bold border border_color dark:border-border-teal hover:border-primary transition-all">
                Prev
              </button>
              <button className="px-4 py-2 rounded-xl bg-primary text-background-dark text-[10px] font-bold">
                1
              </button>
              <button className="px-4 py-2 rounded-xl bg_card text-[10px] font-bold border border_color dark:border-border-teal hover:border-primary transition-all">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="w-[400px] border-l border_color dark:border-border-teal bg_card h-full flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-10 overflow-y-auto">
        <div className="p-6 border-b border_color dark:border-border-teal flex items-center justify-between">
          <h3 className="text-xl font-black">Order Details</h3>
          <button className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 space-y-10">
          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 shadow-inner">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                  Order #8821
                </p>
                <p className="text-xl font-black leading-tight">
                  450 kWh Solar Energy
                </p>
              </div>
              <span className="bg-primary text-background-dark text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Confirmed
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-2xl">
                  solar_power
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
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
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-slate-900 dark:text-white">
                    {item.val}
                  </span>
                </div>
              ))}
              <div className="pt-4 border-t border_color dark:border-border-teal flex justify-between items-baseline">
                <span className="font-bold text-sm">Total Charged</span>
                <span className="font-black text-primary text-2xl">
                  $128.50
                </span>
              </div>
            </div>
            <div className="mt-6 p-4 card_btn rounded-xl flex items-center gap-4 border border_color/50 dark:border-border-teal/50">
              <span className="material-symbols-outlined text-primary">
                account_balance_wallet
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
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
                <div className="size-4 rounded-full bg-primary border-4 border-white dark:border-card-dark shadow-sm mt-1"></div>
                <div>
                  <p className="text-sm font-black">Meter ID: MRT-22910-X</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                    Reading synced at 14:32
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="size-4 rounded-full bg-primary border-4 border-white dark:border-card-dark shadow-sm mt-1"></div>
                <div>
                  <p className="text-sm font-black">
                    Grid Segment: Phoenix-North-04
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                    Transmission stability: 99.9%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <button className="w-full bg-primary text-background-dark font-black py-4 rounded-2xl hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              Download Receipt
            </button>
            <button className="w-full bg-slate-100 dark:bg-surface-dark text-slate-900 dark:text-white font-black py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border_color dark:border-border-teal">
              Contact Customer
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Orders;
