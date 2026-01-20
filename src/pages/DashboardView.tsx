import React from "react";
import {
  MdPayment,
  MdFlare,
  MdShoppingCart,
  MdTrendingUp,
  MdTrendingDown,
  MdRouter,
  MdPower,
  MdWarning,
  MdUpdate,
  MdRefresh,
  MdMoreHoriz,
} from "react-icons/md";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Du", usage: 4000 },
  { name: "Se", usage: 3000 },
  { name: "Cho", usage: 2000 },
  { name: "Pa", usage: 2780 },
  { name: "Ju", usage: 1890 },
  { name: "Sha", usage: 2390 },
  { name: "Ya", usage: 3490 },
];

const DashboardView: React.FC = () => {
  const kpis = [
    {
      label: "Umumiy daromad",
      value: "45,415,231 UZS",
      trend: "+12.5%",
      isPositive: true,
      icon: <MdPayment className="text-[26px]" />,
      colorClass: "revenue-card-gradient border-2 border-yellow-500",
    },
    {
      label: "Energiya sarfi",
      value: "12,840 kWh",
      trend: "+5.2%",
      isPositive: true,
      icon: <MdFlare className="text-[26px]" />,
    },
    {
      label: "Jami buyurtmalar",
      value: "1,254",
      trend: "-2.4%",
      isPositive: false,
      icon: <MdShoppingCart className="text-[26px]" />,
    },
    {
      label: "Active Nodes",
      value: "842 Nodes",
      trend: "System Online",
      isPositive: true,
      icon: <MdFlare className="text-[26px]" />,
    },
  ];

  const nodeStatuses = [
    {
      id: "1",
      name: "Node Cluster-09",
      location: "Sector 4, New York",
      status: "Active",
      icon: <MdRouter className="text-[26px]" />,
    },
    {
      id: "2",
      name: "Main Transformer B",
      location: "Sector 2, New Jersey",
      status: "Syncing",
      icon: <MdPower className="text-[26px]" />,
    },
    {
      id: "3",
      name: "Node Solar-22",
      location: "Sector 9, Arizona",
      status: "Alert",
      icon: <MdWarning className="text-[26px]" />,
    },
  ];

  const recentTransactions = [
    {
      id: "#ORD-7742",
      customer: "Jordan Smith",
      amount: "$1,240.00",
      date: "Oct 24, 2023",
      status: "Completed",
      avatar: "https://picsum.photos/40/40?random=10",
    },
    {
      id: "#ORD-7741",
      customer: "Sarah Jenkins",
      amount: "$842.12",
      date: "Oct 24, 2023",
      status: "Pending",
      avatar: "https://picsum.photos/40/40?random=11",
    },
    {
      id: "#ORD-7740",
      customer: "Michael Chen",
      amount: "$3,100.00",
      date: "Oct 23, 2023",
      status: "Completed",
      avatar: "https://picsum.photos/40/40?random=12",
    },
  ];

  return (
    <div className="md:p-8 p-4 space-y-8 max-w-400 mx-auto w-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`${kpi.colorClass || "border border_color"} bg_card rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-primary/5 transition-all duration-300 h-40 group`}
          >
            <div className="flex justify-between items-start">
              <p
                className={`${kpi.colorClass ? "text-white/80" : "text-slate-400"} text-sm font-semibold`}
              >
                {kpi.label}
              </p>
              <span
                className={kpi.colorClass ? "text-white/40" : "text-primary"}
              >
                {kpi.icon}
              </span>
            </div>
            <div>
              <p
                className={`${kpi.colorClass ? "text-white" : "text-white"} text-3xl font-bold tracking-tight`}
              >
                {kpi.value}
              </p>
              <p
                className={`${kpi.colorClass ? "text-white" : kpi.isPositive ? "text_primary" : "text-red-500"} text-xs font-medium mt-2 flex items-center gap-1`}
              >
                <span className="text-sm">
                  {kpi.isPositive ? <MdTrendingUp /> : <MdTrendingDown />}
                </span>
                {kpi.trend} {idx === 3 ? "" : "from last month"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Energy Chart Section */}
        <div className="xl:col-span-2 bg_card border border_color rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold">
                Energy Consumption Over Time
              </h2>
              <p className="text-sm text-slate-400">
                Weekly usage distribution by node clusters
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-bold rounded-lg card_btn transition-colors">
                Week
              </button>
              <button className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-background-dark shadow-lg shadow-primary/20">
                Month
              </button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#09f6b3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#09f6b3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "#09f6b3" }}
                />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#09f6b3"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsage)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Node Status Widget */}
        <div className="bg_card border border_color rounded-2xl p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Node Status</h2>
            <span className="flex items-center gap-1 text-[10px] font-bold text_primary uppercase">
              <span className="size-2 bg-primary rounded-full animate-pulse"></span>
              Live Grid
            </span>
          </div>
          <div className="space-y-6 flex-1">
            {nodeStatuses.map((node) => (
              <div key={node.id} className="flex items-center gap-4 group">
                <div
                  className={`size-10 rounded-full flex items-center justify-center transition-colors ${
                    node.status === "Active"
                      ? "bg-primary/10 text_primary"
                      : node.status === "Syncing"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-red-500/10 text-red-500"
                  }`}
                >
                  <span className="text-xl">{node.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">
                    {node.name}
                  </p>
                  <p className="text-xs text-slate-500">{node.location}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${
                    node.status === "Active"
                      ? "bg-primary/20 text_primary"
                      : node.status === "Syncing"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {node.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border_color">
            <div className="card_btn p-3 rounded-xl flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 dark:bg-card-dark rounded-lg text-slate-500">
                  <MdUpdate />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Last Sync
                  </p>
                  <p className="text-xs font-bold">2 mins ago</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <MdRefresh className="text-[26px]" />
              </button>
            </div>
            <button className="w-full py-3 text-xs font-bold bg-primary rounded-xl transition-all active:scale-[0.98]">
              View All Nodes
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg_card border border_color rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border_color flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="card_btn">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Order ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Customer
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="">
              {recentTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-sm">{tx.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover"
                        style={{ backgroundImage: `url(${tx.avatar})` }}
                      ></div>
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {tx.customer}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{tx.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        tx.status === "Completed"
                          ? "bg-primary/20 text_primary"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <MdMoreHoriz />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
