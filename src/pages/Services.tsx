import React, { useEffect, useRef, useState } from "react";
import ServiceDrawer from "../components/ui/ServiceDrawer";
import { get, putData } from "../api/api";
import { MdAdd, MdEdit, MdSearch } from "react-icons/md";
import Pagination from "../components/ui/Pagination";
import { TbReload } from "react-icons/tb";
import DeleteModal from "../components/modals/DeleteModal";
import { formatPrice } from "../utils/formatter";
import { Wrench } from "lucide-react";
import { toast } from "sonner";

export interface ServiceFormValues {
  id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: number;
  category_id: string;
  is_active: boolean;
  ikpu_code: string;
  package_code: string;
  units: number;
  vat_percent: number;
}

interface DataService {
  data: {
    services: ServiceFormValues[];
    count: number;
  };
}

const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceFormValues[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ServiceFormValues | null>(null);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const fetchedOnce = useRef(false);

  const fetchServices = async (p = page) => {
    setLoading(true);
    try {
      const { data }: DataService = await get("app-services", {
        page: p,
        limit,
        search,
      });
      setServices(data.services || []);
      setTotalCount(data.count || 0);
      setPage(p);
    } catch (err) {
      console.error("Services fetch error:", err);
      toast.error("Xizmatlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    fetchServices();
  }, []);

  const handleToggle = async (item: ServiceFormValues, current: boolean) => {
    const newStatus = !current;
    setServices((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, is_active: newStatus } : p)),
    );
    try {
      await putData(`app-service`, {
        ...item,
        is_active: newStatus,
      });
      toast.success(
        newStatus ? "Xizmat faollashtirildi" : "Xizmat nofaol qilindi",
      );
    } catch (error) {
      setServices((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, is_active: current } : p)),
      );
      toast.error("Xizmat statusini yangilashda xatolik");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Xizmatlar Boshqaruvi
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Jami: {totalCount}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quyosh stansiyalarini o'rnatish, ta'mirlash va texnik servis tariflari
          </p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <MdAdd className="text-xl" />
          Yangi Xizmat
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#12211c] border border-white/5 flex flex-col sm:flex-row items-center gap-3 shadow-lg">
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 w-full relative"
        >
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#152721] border border-white/5 rounded-xl pl-11 pr-24 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40"
            placeholder="Xizmat nomi yoki tavsifi bo'yicha qidiruv..."
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
            fetchServices(1);
          }}
          title="Ro'yxatni yangilash"
          className="p-2.5 rounded-xl bg-[#152721] border border-white/5 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
        >
          <TbReload className={`text-xl ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl bg-[#12211c] border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="size-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <span className="text-xs font-medium">Xizmatlar yuklanmoqda...</span>
            </div>
          ) : services.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Xizmat</th>
                  <th className="px-5 py-4">Tavsif (Qisqacha)</th>
                  <th className="px-5 py-4">Narxi</th>
                  <th className="px-5 py-4 text-center">Holat</th>
                  <th className="px-5 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <Wrench className="size-4" />
                        </div>
                        <div className="flex flex-col max-w-xs">
                          <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {s.name_uz}
                          </span>
                          <span className="text-xs text-slate-400 line-clamp-1">
                            {s.name_ru}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 max-w-sm">
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {s.description_uz || s.description_ru}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-extrabold text-amber-400 text-sm">
                        {formatPrice(s.price)} so'm
                      </span>
                    </td>

                    {/* Active toggle */}
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(s, s.is_active)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer inline-flex items-center ${
                          s.is_active ? "bg-emerald-500" : "bg-slate-700"
                        }`}
                      >
                        <span
                          className={`size-4 rounded-full bg-white shadow-md transform transition-transform ${
                            s.is_active ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelected(s);
                            setOpen(true);
                          }}
                          title="Tahrirlash"
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                        >
                          <MdEdit className="text-lg" />
                        </button>
                        <DeleteModal
                          itemId={s.id || ""}
                          path="app-service"
                          confirm={() => {
                            toast.success("Xizmat o'chirildi");
                            fetchServices();
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-sm">
              <Wrench className="size-12 text-slate-600 mb-2" />
              Xizmatlar topilmadi
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Jami: {totalCount} ta xizmatdan {(page - 1) * limit + 1}-
            {Math.min(page * limit, totalCount)} ko'rsatilmoqda
          </span>
          <Pagination
            page={page}
            limit={limit}
            allCount={totalCount}
            onChange={(p) => fetchServices(p)}
          />
        </div>
      </div>

      {/* Drawer */}
      <ServiceDrawer
        open={open}
        initialValues={selected}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        onSuccess={() => fetchServices(1)}
      />
    </div>
  );
};

export default Services;
