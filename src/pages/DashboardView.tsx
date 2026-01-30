import React, { useEffect, useRef, useState } from "react";
import {
  MdPayment,
  MdFlare,
  MdShoppingCart,
  MdRouter,
  MdPower,
  MdWarning,
  MdCheckCircle,
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
import { get } from "../api/api";
import { formatPrice } from "../utils/formatter";
import { Link } from "react-router-dom";

const data = [
  { date: "Du", amount: 2 },
  { date: "Se", amount: 4 },
  { date: "Cho", amount: 3 },
  { date: "Pa", amount: 4 },
  { date: "Ju", amount: 3 },
  { date: "Sha", amount: 5 },
  { date: "Ya", amount: 7 },
];

interface OrdersCaunt {
  new: number;
  success: number;
  canceled: number;
  delivered: number;
}

interface DashboardData {
  all_users_count: number;
  new_users_count: number;
  orders_count: OrdersCaunt;
  sales_history: {
    amount: number;
    date: string;
  }[];
  top_products: {
    count: number;
    name: string;
    total_sum: number;
  }[];
  top_services: {
    count: number;
    name: string;
    total_sum: number;
  }[];
  total_product_sales: string;
  total_revenue: string;
  total_service_sales: string;
}

interface getData {
  data: DashboardData;
}

const DashboardView: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchedOnce = useRef(false); // 🔥 MAGIC

  const kpis = [
    {
      label: "Umumiy daromad",
      value: formatPrice(dashboard?.total_revenue || 0),
      isPositive: true,
      icon: <MdPayment className="text-[26px]" />,
      colorClass: "revenue-card-gradient border-2 border-yellow-500",
    },
    {
      label: "Yangi foydalanuvchilar",
      value: formatPrice(dashboard?.new_users_count || 0),
      isPositive: true,
      icon: <MdFlare className="text-[26px]" />,
    },
    {
      label: "Jami mahsulotlar sotuvi",
      value: formatPrice(dashboard?.total_product_sales || 0),
      isPositive: false,
      icon: <MdShoppingCart className="text-[26px]" />,
    },
    {
      label: "Jami servislar sotuvi",
      value: formatPrice(dashboard?.total_service_sales || 0),
      isPositive: true,
      icon: <MdShoppingCart className="text-[26px]" />,
    },
  ];

  const nodeStatuses = [
    {
      id: "1",
      name: "Yangi buyurtmalar",
      count: dashboard?.orders_count.new,
      status: "new",
      icon: <MdRouter className="text-[26px]" />,
    },
    {
      id: "2",
      name: "Jarayondagi buyurtmalar",
      count: dashboard?.orders_count.delivered,
      status: "delivered",
      icon: <MdPower className="text-[26px]" />,
    },
    {
      id: "3",
      name: "Bajarilgan buyurtmalar",
      count: dashboard?.orders_count.success,
      status: "success",
      icon: <MdCheckCircle className="text-[26px]" />,
    },
    {
      id: "4",
      name: "Bekor qilingan buyurtmalar",
      count: dashboard?.orders_count.canceled,
      status: "canceled",
      icon: <MdWarning className="text-[26px]" />,
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data }: getData = await get("/dashboard", {
        from_date: "2026-01-01",
        to_date: "2026-01-31",
      });

      setDashboard(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;

    fetchedOnce.current = true;
    fetchProducts();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center pt-50 h-full w-full animate-pulse">
          Yuklanmoqda...
        </div>
      ) : (
        <div className="md:p-8 p-4 space-y-8 max-w-400 mx-auto w-full">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => (
              <div
                key={idx}
                className={`${kpi.colorClass || "border border_color"} bg_card rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-primary/5 transition-all duration-300 h-33 group`}
              >
                <div className="flex justify-between items-start">
                  <p
                    className={`${kpi.colorClass ? "text-white/80" : "text-slate-400"} text-sm font-semibold`}
                  >
                    {kpi.label}
                  </p>
                  <span
                    className={
                      kpi.colorClass ? "text-white/40" : "text-primary"
                    }
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
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Energy Chart Section */}
            <div className="xl:col-span-2 bg_card border border_color rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold">To'liq Sotuv Jarayoni</h2>
                  <p className="text-sm text-slate-400">
                    Ma'lum vaqt oralig'idagi bo'lib o'tgan sotuvlar
                  </p>
                </div>
                <div className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-background-dark shadow-lg shadow-primary/20">
                  Mavjud
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  className="outline-none"
                >
                  <AreaChart
                    className="outline-none select-none"
                    data={dashboard?.sales_history || data}
                  >
                    <defs>
                      <linearGradient
                        id="colorUsage"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#09f6b3"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#09f6b3"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1f2937"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
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
                      dataKey="amount"
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
                <h2 className="text-lg font-bold">Buyurtmalar soni</h2>
                <span className="flex items-center gap-1 text-[10px] font-bold text_primary uppercase">
                  <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                  Barchasi
                </span>
              </div>
              <div className="space-y-6 flex-1">
                {nodeStatuses.map((node) => (
                  <div key={node.id} className="flex items-center gap-4 group">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center transition-colors ${
                        node.status === "new"
                          ? "bg-orange-500/20 text-orange-500"
                          : node.status === "delivered"
                            ? "bg-blue-500/10 text-blue-500"
                            : node.status === "success"
                              ? "bg-green-500/30 text-green-500"
                              : "bg-red-500/40 text-red-500"
                      }`}
                    >
                      <span className="text-xl">{node.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">
                        {node.name}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${
                        node.status === "new"
                          ? "bg-orange-500/20 text-orange-500"
                          : node.status === "delivered"
                            ? "bg-blue-500/20 text-blue-500"
                            : node.status === "success"
                              ? "bg-green-500/30 text-green-500"
                              : "bg-red-500/40 text-red-500"
                      }`}
                    >
                      {node.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border_color">
                <Link to="/admin/orders">
                  <button className="w-full py-3 text-xs font-bold bg-primary rounded-xl transition-all active:scale-[0.98]">
                    Barchasini ko'rish
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Transactions Table */}
          {dashboard?.top_products && (
            <div className="bg_card border border_color rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border_color flex items-center justify-between">
                <h2 className="text-lg font-bold">Top Mahsulotlar</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="card_btn">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Nomi
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Soni
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Narxi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {dashboard?.top_products.map((tx, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4 font-bold text-sm text-nowrap">
                          {tx.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                              {tx.count}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-nowrap">
                          {formatPrice(tx.total_sum)} so'm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardView;
