import React, { useEffect, useRef, useState } from "react";
import {
  MdClose,
  MdSearch,
  MdReceipt,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";
import { get, putData } from "../api/api";
import Pagination from "../components/ui/Pagination";
import { TbReload } from "react-icons/tb";
import { formatPrice } from "../utils/formatter";
import { PiFilePdfFill } from "react-icons/pi";
import OrderStatusUpdater from "../components/ui/OrderStatusUpdater";
import { ShoppingBag, Wrench } from "lucide-react";
import { toast } from "sonner";

interface ProductInfo {
  id: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: string;
}

interface ProductItem {
  amount: number;
  created_at: string;
  id: string;
  order_id: string;
  product_id: string;
  product_info: ProductInfo;
  total_price: string;
  unit_price: object;
}

export interface Service {
  description_ru: string;
  description_uz: string;
  name_ru: string;
  name_uz: string;
  price: string;
}

interface User {
  address: string;
  first_name: string;
  last_name: string;
  lat: number;
  long: number;
  phone: string;
}

export interface Order {
  created_at: string;
  file_url?: string;
  id: string;
  items?: ProductItem[];
  service?: Service;
  note?: string;
  address?: string;
  phone_number?: string;
  order_id?: string;
  service_id?: string;
  payment_method: string;
  status: string;
  total_price: string;
  user: User;
  user_id: string;
}

interface ResData {
  data: {
    product_orders?: Order[];
    service_orders?: Order[];
    count: number;
  };
}

export type OrderStatus = "new" | "delivered" | "success" | "canceled";
type OrderType = "product" | "service";

const Orders: React.FC = () => {
  const [showDetails, setShowDetails] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<OrderType>("product");
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchedOnce = useRef(false);

  const fetchOrders = async (p = page, type = activeTab) => {
    setLoading(true);

    let params: any = {
      page: p,
      limit,
      phone_number: "",
      order_id: "",
      service_id: "",
    };

    if (search.startsWith("+")) {
      params.phone_number = search.slice(1);
    } else if (type === "service") {
      params.service_id = search;
      delete params.order_id;
    } else {
      params.order_id = search;
      delete params.service_id;
    }

    try {
      if (type === "product") {
        const { data }: ResData = await get("product-orders", params);
        setOrders(data.product_orders || []);
        setTotalCount(data.count || 0);
      } else {
        const { data }: ResData = await get("service-orders", params);
        setOrders(data.service_orders || []);
        setTotalCount(data.count || 0);
      }
      setPage(p);
    } catch (err) {
      console.error("Orders fetch error:", err);
      toast.error("Buyurtmalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const getDownload = async (file_link: string) => {
    try {
      const response = await fetch(file_link);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `buyurtma_kvitansiya_${Date.now()}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Kvitansiya yuklab olindi");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Faylni yuklab olishda xatolik");
    }
  };

  const onTabChange = (type: OrderType) => {
    setActiveTab(type);
    setPage(1);
    fetchOrders(1, type);
  };

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    fetchOrders();
  }, []);

  const updateOrderStatus = async (data: { id: string; status: string }) => {
    try {
      await putData(`${activeTab}-order`, data);
      toast.success("Buyurtma holati muvaffaqiyatli o'zgartirildi");
      fetchOrders();
      if (showDetails && showDetails.id === data.id) {
        setShowDetails((prev) => (prev ? { ...prev, status: data.status } : null));
      }
    } catch (error) {
      toast.error("Buyurtma holatini yangilashda xatolik");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <span className="size-1.5 rounded-full bg-sky-400 animate-pulse" />
            Yangi
          </span>
        );
      case "success":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="size-1.5 rounded-full bg-amber-400" />
            Jarayonda
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Yakunlangan
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="size-1.5 rounded-full bg-rose-400" />
            Bekor qilingan
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="relative flex h-full overflow-hidden select-none">
      {/* Main List Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Buyurtmalar Boshqaruvi
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Jami: {totalCount}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Mijozlar buyurtmalari, kvitansiyalar va holat monitoringi
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 rounded-2xl bg-[#12211c] border border-white/5">
            <button
              onClick={() => onTabChange("product")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "product"
                  ? "bg-emerald-500 text-[#0b1411] shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShoppingBag className="size-4" />
              Mahsulotlar
            </button>
            <button
              onClick={() => onTabChange("service")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "service"
                  ? "bg-emerald-500 text-[#0b1411] shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wrench className="size-4" />
              Xizmatlar
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-[#12211c] border border-white/5 flex flex-col sm:flex-row items-center gap-3 shadow-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrders(1);
            }}
            className="flex-1 w-full relative"
          >
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#152721] border border-white/5 rounded-xl pl-11 pr-24 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40"
              placeholder="Telefon (+998...) yoki buyurtma ID bo'yicha qidiruv..."
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500 hover:text-[#0b1411] transition-all"
            >
              Qidirish
            </button>
          </form>

          <button
            onClick={() => {
              setSearch("");
              fetchOrders(1);
            }}
            title="Ro'yxatni yangilash"
            className="p-2.5 rounded-xl bg-[#152721] border border-white/5 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
          >
            <TbReload className={`text-xl ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Orders Table Container */}
        <div className="rounded-3xl bg-[#12211c] border border-white/5 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                <div className="size-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                <span className="text-xs font-medium">Buyurtmalar yuklanmoqda...</span>
              </div>
            ) : orders.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-4">Mijoz</th>
                    <th className="px-5 py-4">Tafsilot</th>
                    <th className="px-5 py-4">To'lov Turi</th>
                    <th className="px-5 py-4">Umumiy Narx</th>
                    <th className="px-5 py-4">Sana</th>
                    <th className="px-5 py-4 text-center">Holat</th>
                    <th className="px-5 py-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setShowDetails(order)}
                      className={`hover:bg-white/[0.03] transition-colors cursor-pointer group ${
                        showDetails?.id === order.id ? "bg-white/[0.04]" : ""
                      }`}
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {order.user?.first_name || "Mijoz"}{" "}
                            {order.user?.last_name || ""}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            +{order.user?.phone || order.phone_number || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Items / Service Info */}
                      <td className="px-5 py-4 max-w-xs">
                        {order.items && order.items.length > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                              {order.items[0]?.product_info?.name_uz}
                            </span>
                            {order.items.length > 1 && (
                              <span className="text-[10px] text-emerald-400 font-bold">
                                +{order.items.length - 1} ta boshqa mahsulot
                              </span>
                            )}
                          </div>
                        ) : order.service ? (
                          <span className="text-xs font-semibold text-slate-200">
                            {order.service.name_uz}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-white/[0.04] text-slate-300 border border-white/5 capitalize">
                          {order.payment_method === "cash"
                            ? "Naqd"
                            : order.payment_method === "uzum_nasiya"
                            ? "Uzum Nasiya"
                            : order.payment_method}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-extrabold text-amber-400 text-sm">
                          {formatPrice(order.total_price)} so'm
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}{" "}
                        <span className="text-slate-500 font-mono">
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* PDF download */}
                      <td className="px-5 py-4 text-right">
                        {order.file_url && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              getDownload(order.file_url!);
                            }}
                            title="Kvitansiyani yuklab olish"
                            className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all inline-flex items-center gap-1"
                          >
                            <PiFilePdfFill className="text-xl" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-sm">
                <MdReceipt className="size-12 text-slate-600 mb-2" />
                Buyurtmalar topilmadi
              </div>
            )}
          </div>

          {/* Footer Pagination */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Jami: {totalCount} ta buyurtmadan {(page - 1) * limit + 1}-
              {Math.min(page * limit, totalCount)} ko'rsatilmoqda
            </span>
            <Pagination
              page={page}
              limit={limit}
              allCount={totalCount}
              onChange={(p) => fetchOrders(p)}
            />
          </div>
        </div>
      </div>

      {/* Slide-over Order Details Sidebar */}
      {showDetails && (
        <aside className="w-96 border-l border-white/5 bg-[#0e1a15] p-6 flex flex-col overflow-y-auto space-y-6 z-30 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-white">
                Buyurtma Tafsilotlari
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                ID: {showDetails.id.slice(0, 8)}...
              </p>
            </div>
            <button
              onClick={() => setShowDetails(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          {/* Customer info */}
          <div className="p-4 rounded-2xl bg-[#152721] border border-white/5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Mijoz Ma'lumotlari
            </span>
            <p className="font-bold text-white text-sm">
              {showDetails.user?.first_name || "Mijoz"}{" "}
              {showDetails.user?.last_name || ""}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MdPhone className="text-emerald-400" />
              <span>+{showDetails.user?.phone || showDetails.phone_number || "—"}</span>
            </div>
            {(showDetails.user?.address || showDetails.address) && (
              <div className="flex items-start gap-2 text-xs text-slate-300 pt-1">
                <MdLocationOn className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{showDetails.user?.address || showDetails.address}</span>
              </div>
            )}
          </div>

          {/* Items breakdown */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tarkibi
            </span>
            {showDetails.items ? (
              <div className="space-y-2">
                {showDetails.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#152721] border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">
                        {it.product_info?.name_uz}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {it.amount} dona × {formatPrice(it.total_price)} so'm
                      </span>
                    </div>
                    <span className="font-bold text-xs text-amber-400">
                      {formatPrice(it.total_price)} so'm
                    </span>
                  </div>
                ))}
              </div>
            ) : showDetails.service ? (
              <div className="p-3 rounded-xl bg-[#152721] border border-white/5 space-y-1">
                <span className="text-xs font-semibold text-white">
                  {showDetails.service.name_uz}
                </span>
                <p className="text-xs text-amber-400 font-bold">
                  {formatPrice(showDetails.service.price)} so'm
                </p>
              </div>
            ) : null}
          </div>

          {/* Total & Payment Method */}
          <div className="p-4 rounded-2xl bg-[#152721] border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">To'lov usuli:</span>
              <span className="font-bold text-white uppercase">
                {showDetails.payment_method}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-2">
              <span className="text-xs font-bold text-slate-300">Jami to'lov:</span>
              <span className="text-base font-black text-amber-400">
                {formatPrice(showDetails.total_price)} so'm
              </span>
            </div>
          </div>

          {/* Status updater */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Buyurtma Holatini O'zgartirish
            </span>
            <OrderStatusUpdater
              item={{
                id: showDetails.id,
                status: showDetails.status as OrderStatus,
              }}
              onUpdateStatus={updateOrderStatus}
            />
          </div>
        </aside>
      )}
    </div>
  );
};

export default Orders;
