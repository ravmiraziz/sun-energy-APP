import React, { useEffect, useRef, useState } from "react";
import {
  MdPayment,
  MdShoppingCart,
  MdCheckCircle,
  MdCancel,
  MdPendingActions,
  MdCalendarToday,
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
import { Users, TrendingUp, Sparkles } from "lucide-react";
import { get } from "../api/api";
import { formatPrice } from "../utils/formatter";

interface OrdersCount {
  new: number;
  success: number;
  canceled: number;
  delivered: number;
}

interface DashboardData {
  all_users_count: number;
  new_users_count: number;
  orders_count: OrdersCount;
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

interface GetData {
  data: DashboardData;
}

const DashboardView: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchedOnce = useRef(false);

  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toLocaleDateString("en-CA");
  });

  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toLocaleDateString("en-CA");
  });

  const fetchDashboard = async (from = fromDate, to = toDate) => {
    setLoading(true);
    try {
      const { data }: GetData = await get("/dashboard", {
        from_date: from,
        to_date: to,
      });
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    fetchDashboard();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboard(fromDate, toDate);
  };

  const kpis = [
    {
      label: "Umumiy daromad",
      value: `${formatPrice(dashboard?.total_revenue || 0)} so'm`,
      subtitle: "Barcha tushumlar hisobi",
      icon: <MdPayment className="size-6 text-amber-400" />,
      accentBorder: "border-amber-500/20",
      accentBg: "bg-amber-500/10",
      glow: "shadow-[0_0_25px_rgba(245,158,11,0.08)]",
    },
    {
      label: "Yangi foydalanuvchilar",
      value: formatPrice(dashboard?.new_users_count || 0),
      subtitle: `Jami: ${formatPrice(dashboard?.all_users_count || 0)} nafar`,
      icon: <Users className="size-6 text-emerald-400" />,
      accentBorder: "border-emerald-500/20",
      accentBg: "bg-emerald-500/10",
      glow: "shadow-[0_0_25px_rgba(16,185,129,0.08)]",
    },
    {
      label: "Mahsulotlar sotuvi",
      value: `${formatPrice(dashboard?.total_product_sales || 0)} so'm`,
      subtitle: "Uskuna va butlovchi qismlar",
      icon: <MdShoppingCart className="size-6 text-cyan-400" />,
      accentBorder: "border-cyan-500/20",
      accentBg: "bg-cyan-500/10",
      glow: "shadow-[0_0_25px_rgba(6,182,212,0.08)]",
    },
    {
      label: "Servis xizmatlari",
      value: `${formatPrice(dashboard?.total_service_sales || 0)} so'm`,
      subtitle: "O'rnatish va ta'mirlash",
      icon: <TrendingUp className="size-6 text-indigo-400" />,
      accentBorder: "border-indigo-500/20",
      accentBg: "bg-indigo-500/10",
      glow: "shadow-[0_0_25px_rgba(99,102,241,0.08)]",
    },
  ];

  const nodeStatuses = [
    {
      id: "new",
      name: "Yangi buyurtmalar",
      count: dashboard?.orders_count?.new || 0,
      icon: <MdPendingActions className="size-5 text-sky-400" />,
      bg: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    },
    {
      id: "success",
      name: "Jarayondagi",
      count: dashboard?.orders_count?.success || 0,
      icon: <Sparkles className="size-5 text-amber-400" />,
      bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    },
    {
      id: "delivered",
      name: "Yakunlangan",
      count: dashboard?.orders_count?.delivered || 0,
      icon: <MdCheckCircle className="size-5 text-emerald-400" />,
      bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    {
      id: "canceled",
      name: "Bekor qilingan",
      count: dashboard?.orders_count?.canceled || 0,
      icon: <MdCancel className="size-5 text-rose-400" />,
      bg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Header with Title and Date Range Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Boshqaruv Paneli
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quyosh energiyasi va tijorat platformasi umumiy ko'rsatkichlari
          </p>
        </div>

        {/* Date Filter Bar */}
        <form
          onSubmit={handleFilterSubmit}
          className="flex flex-wrap items-center gap-2.5 p-1.5 rounded-2xl bg-[#12211c] border border-white/5"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300">
            <MdCalendarToday className="text-emerald-400 text-sm" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-white font-medium text-xs focus:outline-none"
            />
          </div>
          <span className="text-slate-500 text-xs">—</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-white font-medium text-xs focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Yangilanmoqda..." : "Filtrlash"}
          </button>
        </form>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-[#12211c] border ${kpi.accentBorder} ${kpi.glow} relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {kpi.label}
              </span>
              <div className={`p-2.5 rounded-xl ${kpi.accentBg}`}>
                {kpi.icon}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {kpi.value}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                {kpi.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Statuses Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {nodeStatuses.map((st) => (
          <div
            key={st.id}
            className="p-4 rounded-2xl bg-[#12211c] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors"
          >
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">{st.name}</span>
              <p className="text-2xl font-black text-white">{st.count}</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${st.bg}`}>
              {st.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Sales Trend Chart */}
      <div className="p-6 rounded-3xl bg-[#12211c] border border-white/5 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="size-5 text-emerald-400" />
              Sotuvlar Dinamikasi
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tanlangan muddat bo'yicha tushumlar grafikasi
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          {dashboard?.sales_history && dashboard.sales_history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.sales_history}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${Number(val) / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b1411",
                    borderColor: "rgba(16, 185, 129, 0.3)",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                  }}
                  formatter={(value: any) => [`${formatPrice(value)} so'm`, "Sotuv"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Tanlangan davr uchun sotuvlar statistikasi topilmadi
            </div>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      {dashboard?.top_products && dashboard.top_products.length > 0 && (
        <div className="rounded-3xl bg-[#12211c] border border-white/5 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                Eng ko'p sotilgan mahsulotlar
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Yetakchi mahsulotlar bo'yicha daromad
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Mahsulot Nomi</th>
                  <th className="px-6 py-4 text-center">Sotilgan Soni</th>
                  <th className="px-6 py-4 text-right">Umumiy Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dashboard.top_products.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.count} dona
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-amber-400">
                      {formatPrice(item.total_sum)} so'm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
