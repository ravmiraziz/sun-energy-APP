import React, { useEffect, useRef, useState } from "react";
import ServiceDrawer from "../components/ui/ServiceDrawer";
import { get, putData } from "../api/api";
import { MdAdd, MdEdit, MdInventory, MdSearch } from "react-icons/md";
import Pagination from "../components/ui/Pagination";
import { TbDatabaseSearch, TbReload } from "react-icons/tb";
import DeleteModal from "../components/modals/DeleteModal";
import { formatPrice } from "../utils/formatter";

export interface ServiceFormValues {
  id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: number;
  category_id: string;
  is_active: boolean;
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
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const fetchedOnce = useRef(false); // 🔥 MAGIC

  const fetchServices = async (p = page) => {
    setLoading(true);
    try {
      const { data }: DataService = await get("app-services", {
        page: p,
        limit,
        search,
      });
      setServices(data.services);
      setTotalCount(data.count);
      setPage(p);
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
    } catch (error) {
      setServices((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, is_active: current } : p)),
      );
      console.error("Status update failed", error);
    }
  };

  return (
    <div className="flex-1 p-8  ">
      <div className="flex not-md:flex-wrap gap-3 justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Xizmatlarni boshqarish
          </h2>
          <p className="text-slate-400 mt-1">
            Energiya xizmatingiz takliflarini yarating, kuzatib boring va
            boshqaring.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-primary text-background-dark px-6 py-3 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <MdAdd className="text-[20px]" />
          Servis qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
        <div className="bg_card p-6 rounded-2xl border border_color flex flex-col gap-2">
          <div className="flex justify-between items-start card_text">
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Jami Servislar soni
            </p>
            <MdInventory className="text-2xl" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white">{totalCount}</p>
            <p className="text-xs font-bold text-slate-400">Mavjud</p>
          </div>
        </div>
        <div className="bg_card p-4 rounded-2xl border border_color flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[24px]" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              className="w-full card_btn border-none rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-400"
              placeholder="Servis nomi buyicha qidiruv..."
            />
            {search ? (
              <button
                onClick={() => fetchServices(1)}
                className="absolute bg-primary right-2 top-1/2 -translate-y-1/2 text-[24px] rounded-md p-1"
              >
                <TbDatabaseSearch />
              </button>
            ) : (
              <button
                onClick={() => fetchServices(1)}
                className="absolute bg-primary right-2 top-1/2 -translate-y-1/2 text-[24px] rounded-md p-1"
              >
                <TbReload className={`${loading && "animate-spin"} text-2xl`} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg_card rounded-2xl border border_color shadow-xl overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full py-6 w-full animate-pulse">
            Yuklanmoqda...
          </div>
        ) : services?.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="card_btn text-[10px] font-bold uppercase tracking-widest text_primary border-b border_color">
                <th className="px-8 py-5">Service</th>
                <th className="px-8 py-5">Tafsif</th>
                <th className="px-8 py-5">Price Model</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {services.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-primary/5 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {/* <img
                        src={s.image}
                        className="size-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border_color"
                        alt={s.name}
                      /> */}
                      <div className="flex flex-col max-w-xs">
                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                          {s.name_uz}
                        </span>
                        <span className="text-xs card_text line-clamp-1">
                          {s.name_ru}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      {s.description_uz.slice(0, 300)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-highlight-yellow text-nowrap">
                        {formatPrice(s?.price)} so'm
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      onClick={() => handleToggle(s, s.is_active)}
                      className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors
      ${s.is_active ? "bg-primary" : "bg-slate-700"}`}
                    >
                      <div
                        className={`size-3 bg-white rounded-full shadow transition-transform
        ${s.is_active ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelected(s);
                          setOpen(true);
                        }}
                        className="p-1.5 hover:text-primary transition-colors text-slate-400"
                      >
                        <MdEdit className="text-[18px]" />
                      </button>
                      <DeleteModal
                        itemId={s?.id || ""}
                        path="app-service"
                        confirm={() => fetchServices()}
                      />
                    </div>
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
        <div className="py-4 px-6 border-t border_color flex justify-end items-center card_btn">
          <Pagination
            page={page}
            limit={limit}
            allCount={totalCount}
            onChange={(p) => fetchServices(p)}
          />
        </div>
      </div>
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
