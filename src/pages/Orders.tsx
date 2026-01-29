import React, { useEffect, useRef, useState } from "react";
import {
  MdExpandMore,
  MdClose,
  MdAccountBalanceWallet,
  MdSearch,
} from "react-icons/md";
import { get, putData } from "../api/api";
import Pagination from "../components/ui/Pagination";
import { TbDatabaseSearch, TbReload } from "react-icons/tb";
import { formatPrice } from "../utils/formatter";
import { generateReceiptPDF } from "../utils/generateReceipt";
import { PiFilePdfFill } from "react-icons/pi";
import OrderStatusUpdater from "../components/ui/OrderStatusUpdater";

interface ProductInfo {
  id: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: string;
}

interface Product {
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
  id: string;
  items?: Product[];
  service?: Service;
  note?: string;
  address?: string;
  phone_number?: string;
  order_id?: string;
  service_id?: string;
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

  const fetchedOnce = useRef(false); // 🔥 MAGIC

  const fetchOrders = async (p = page, type = activeTab) => {
    setLoading(true);

    let params: any = {
      page: p,
      limit,
      phone_number: "",
      order_id: "",
    };

    if (search.slice(0, 1) === "+") {
      params.phone_number = search.slice(1);
    } else {
      params.order_id = search;
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
    } finally {
      setLoading(false);
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
      fetchOrders();
      setShowDetails(null);
    } catch (error) {
      return;
    }
  };

  return (
    <div className="relative flex h-full overflow-auto">
      <div className="flex-1 flex flex-col overflow-y-auto px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-black leading-tight tracking-tight">
              Buyurtmalar boshqaruvi
            </h1>
            <p className="text_primary text-sm mt-1">
              Review and manage all incoming energy commerce transactions.
            </p>
          </div>
          {/* <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border_color bg_card text-sm font-bold transition-all">
              <MdFilterList className="text-[22px]" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all transform hover:scale-[1.02]">
              <MdFileDownload className="text-[22px]" />
              Export CSV
            </button>
          </div> */}
        </div>

        <div className="flex not-lg:flex-wrap gap-3 mb-6 pb-2 scrollbar-hide">
          {[
            { key: "product", value: "Mahsulotlar buyurtmasi" },
            { key: "service", value: "Servislar buyurtmasi" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => onTabChange(filter.key as OrderType)}
              className={`
                flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold uppercase tracking-wider transition-all
                ${
                  activeTab === filter.key
                    ? "bg-primary text-black"
                    : "bg_card text-slate-400"
                }
              `}
            >
              {filter.value}
              <MdExpandMore className="text-base" />
            </button>
          ))}
          <div className="flex-1 w-full relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[24px]" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              className="w-full card_btn border-none rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-400 min-w-50"
              placeholder="Buyurtma raqami 01... yoki telefon raqam +998... bo'yicha qidiruv"
            />
            {search ? (
              <button
                onClick={() => fetchOrders(1)}
                className="absolute bg-primary right-2 top-1/2 -translate-y-1/2 text-[24px] rounded-md p-1"
              >
                <TbDatabaseSearch />
              </button>
            ) : (
              <button
                onClick={() => fetchOrders(1)}
                className="absolute bg-primary right-2 top-1/2 -translate-y-1/2 text-[24px] rounded-md p-1"
              >
                <TbReload className={`${loading && "animate-spin"} text-2xl`} />
              </button>
            )}
          </div>
        </div>

        <div className="bg_card border border_color rounded-2xl overflow-x-auto shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-full py-6 w-full animate-pulse">
              Yuklanmoqda...
            </div>
          ) : orders?.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="card_btn border-b border_color">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                    Buyurtma ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                    Buyurtmachi
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                    Telefon
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                    Narx
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                    Vaqt
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text_primary">
                    Xolat
                  </th>
                </tr>
              </thead>
              <tbody className="w-full">
                {orders.map((order, i) => (
                  <tr
                    key={i}
                    className={`cursor-pointer transition-all hover:bg-slate-800/30 ${showDetails?.id === order.id ? "bg_mode border-l-4 border-l-orange-400" : ""}`}
                  >
                    <td className="px-6 py-5 font-bold text-sm">
                      <span className="select-none">#</span>
                      {order.order_id ? order.order_id : order?.service_id}
                    </td>
                    <td
                      onClick={() => setShowDetails(order)}
                      className="px-6 py-5 text-sm text-slate-300 text-nowrap"
                    >
                      {order.user.first_name} {order.user.last_name}
                    </td>
                    <td className="px-6 py-5 text-sm card_text">
                      +{order.user.phone}
                    </td>
                    <td className="px-6 py-5 font-bold text-sm text-yellow-500 text-nowrap">
                      {formatPrice(order.total_price)} so'm
                    </td>
                    <td className="px-6 py-5 text_primary text-xs text-nowrap">
                      {new Date(order.created_at).toLocaleDateString()}
                      {" - "}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        onClick={() => setShowDetails(order)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                          order.status === "new"
                            ? "bg-orange-500/20 text-orange-500"
                            : order.status === "delivered"
                              ? "bg-blue-500/20 text-blue-500"
                              : order.status === "success"
                                ? "bg-green-500/30 text-green-500"
                                : "bg-red-500/40 text-red-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center py-6 justify-center h-full w-full">
              Ma'lumtlar qo'shilmagan
            </div>
          )}
          <div className="w-full py-4 px-6 border-t border_color flex justify-between items-center card_btn">
            <p className="text-[10px] font-bold text_primary uppercase tracking-widest">
              Jami: {totalCount} ta buyurtma
            </p>
            <Pagination
              page={page}
              limit={limit}
              allCount={totalCount}
              onChange={(p) => fetchOrders(p)}
            />
          </div>
        </div>
      </div>

      {showDetails && (
        <aside className="absolute right-0 top-0 md:w-100 w-full border-l border_color bg_card h-full flex flex-col z-10 overflow-y-auto">
          <div className="p-4 border-b border_color flex items-center justify-between">
            <h3 className="text-xl font-black">
              {activeTab === "product" ? "Buyurtma" : "Servis"} ma'lumotlari
            </h3>
            <button
              onClick={() => setShowDetails(null)}
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <MdClose className="text-[24px]" />
            </button>
          </div>

          <div className="p-8 space-y-10">
            <div className="card_btn rounded-2xl p-6 shadow-inner">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black card_text uppercase tracking-[0.2em] mb-1">
                    Buyurtma <span className="select-none">#</span>
                    {showDetails.order_id
                      ? showDetails.order_id
                      : showDetails.service_id}
                  </p>
                  <p className="text-xl font-black leading-tight">
                    {showDetails.user.first_name} {showDetails.user.last_name}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    showDetails.status === "new"
                      ? "bg-orange-500/20 text-orange-500"
                      : showDetails.status === "delivered"
                        ? "bg-blue-500/20 text-blue-500"
                        : showDetails.status === "success"
                          ? "bg-green-500/30 text-green-500"
                          : "bg-red-500/40 text-red-500"
                  }`}
                >
                  {showDetails.status}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => {
                    if (activeTab === "product")
                      generateReceiptPDF(showDetails);
                  }}
                  className={`size-12 rounded-full bg-primary flex items-center justify-center shadow-sm ${activeTab === "product" ? "cursor-pointer" : "cursor-no-drop"}`}
                >
                  <PiFilePdfFill className="text-2xl" />
                </div>
                <div>
                  <p className="text-[10px] card_text font-bold uppercase tracking-widest">
                    +{showDetails.user.phone}
                  </p>
                  <p className="text-sm font-black">
                    {showDetails.user.address}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">
                To'lovlarning taqsimlanishi
              </h4>
              <div className="space-y-4">
                {showDetails.items ? (
                  showDetails.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm font-medium"
                    >
                      <div>
                        <span className="text_primary">{item.amount} ta</span>{" "}
                        <span className="card_text">
                          {item.product_info.name_uz}
                        </span>
                      </div>
                      <span className="text-white">
                        {formatPrice(item.total_price)} so'm
                      </span>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className="flex justify-between text-sm font-medium">
                      <div>
                        <span className="card_text">
                          {showDetails?.service?.name_uz}
                        </span>
                      </div>
                      <span className="text-white">
                        {formatPrice(showDetails?.service?.price || 0)} so'm
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-400 mt-6 tracking-[0.2em]">
                        Habar
                      </h4>
                      <span className="text-sm">{showDetails.note}</span>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-400 mt-6 tracking-[0.2em]">
                        Manzil
                      </h4>
                      <span className="text-sm">{showDetails.address}</span>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-400 mt-6 tracking-[0.2em]">
                        Telefon Raqam
                      </h4>
                      <span className="text-sm">
                        {showDetails.phone_number}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 p-4 card_btn rounded-xl flex items-center gap-4 border border_color/50 dark:border-border-teal/50">
                <MdAccountBalanceWallet className="text-primary text-[24px]" />
                <div>
                  <p className="text-[10px] card_text font-bold uppercase">
                    To'lov turi
                  </p>
                  <p className="text-xs font-black">Naqt to'lov</p>
                </div>
              </div>
              <div className="pt-4 border-t border_color flex justify-between items-baseline">
                <span className="font-bold text-sm">Jami to'lov:</span>
                <span className="font-black text_primary text-2xl">
                  {formatPrice(showDetails.total_price)} so'm
                </span>
              </div>
            </div>

            {showDetails && (
              <OrderStatusUpdater
                item={{
                  id: showDetails.id,
                  status: showDetails.status as OrderStatus,
                }}
                onUpdateStatus={updateOrderStatus}
              />
            )}
          </div>
        </aside>
      )}
    </div>
  );
};

export default Orders;
