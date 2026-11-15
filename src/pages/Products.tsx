import React, { useEffect, useRef, useState } from "react";
import { MdAdd, MdEdit, MdSearch } from "react-icons/md";
import ProductDrawer from "../components/ui/ProductDrawer";
import { get, patch } from "../api/api";
import Pagination from "../components/ui/Pagination";
import DeleteModal from "../components/modals/DeleteModal";
import { TbReload } from "react-icons/tb";
import { formatPrice } from "../utils/formatter";
import { Zap, Package } from "lucide-react";
import { toast } from "sonner";

interface ProductImage {
  id?: number | string;
  image_url: string;
}

export interface Product {
  brand: string;
  category_id: string;
  created_at: string;
  description_ru: string;
  description_uz: string;
  id: string;
  images: ProductImage[];
  is_active: boolean;
  model: string;
  name_ru: string;
  name_uz: string;
  price: string;
  watt: number;
  units_of_measurement?: string;
  ikpu_code: string;
  package_code: string;
  units: number;
  vat_percent: number;
}

interface ResData {
  data: {
    products: Product[] | null;
    count: number;
  };
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const fetchedOnce = useRef(false);

  const fetchProducts = async (p = page) => {
    setLoading(true);
    try {
      const { data }: ResData = await get("/products", {
        page: p,
        limit,
        search,
      });
      setProducts(data.products || []);
      setTotalCount(data.count);
      setPage(p);
    } catch (err) {
      console.error("Products fetch error:", err);
      toast.error("Mahsulotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    fetchProducts();
  }, []);

  const handleToggle = async (id: string, current: boolean) => {
    const newStatus = !current;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: newStatus } : p)),
    );

    try {
      await patch(`product-status/${id}`, {
        id,
        is_active: newStatus,
      });
      toast.success(
        newStatus
          ? "Mahsulot faollashtirildi"
          : "Mahsulot nofaol holatga o'tkazildi",
      );
    } catch (error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: current } : p)),
      );
      toast.error("Statusni yangilashda xatolik yuz berdi");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Mahsulotlar Katalogi
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Jami: {totalCount}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quyosh panellari, inverterlar, chastotniklar va energiya uskunalari
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
          Yangi Mahsulot
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
            placeholder="Mahsulot nomi, model yoki brend bo'yicha qidiruv..."
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
            fetchProducts(1);
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
              <span className="text-xs font-medium">Mahsulotlar yuklanmoqda...</span>
            </div>
          ) : products.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Rasm</th>
                  <th className="px-5 py-4">Mahsulot Nomi</th>
                  <th className="px-5 py-4">Brend / Model</th>
                  <th className="px-5 py-4">Quvvati</th>
                  <th className="px-5 py-4">Narxi</th>
                  <th className="px-5 py-4 text-center">Holat</th>
                  <th className="px-5 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Image */}
                    <td className="px-5 py-4 w-16">
                      <div className="size-12 rounded-xl overflow-hidden bg-[#152721] border border-white/10 flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].image_url}
                            alt={product.name_uz}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Package className="size-6 text-slate-500" />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {product.name_uz}
                        </span>
                        <span className="text-xs text-slate-400 line-clamp-1">
                          {product.name_ru}
                        </span>
                      </div>
                    </td>

                    {/* Brand & Model */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/[0.04] text-slate-300 border border-white/5">
                          {product.brand || "Umumiy"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {product.model}
                        </span>
                      </div>
                    </td>

                    {/* Watt */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <Zap className="size-3.5" />
                        {product.watt}{" "}
                        {product.units_of_measurement === "watts" ? "W" : "kVt"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <span className="font-extrabold text-amber-400 text-sm whitespace-nowrap">
                        {formatPrice(product.price)} so'm
                      </span>
                    </td>

                    {/* Active Toggle */}
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(product.id, product.is_active)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer inline-flex items-center ${
                          product.is_active ? "bg-emerald-500" : "bg-slate-700"
                        }`}
                      >
                        <span
                          className={`size-4 rounded-full bg-white shadow-md transform transition-transform ${
                            product.is_active ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelected(product);
                            setOpen(true);
                          }}
                          title="Tahrirlash"
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                        >
                          <MdEdit className="text-lg" />
                        </button>
                        <DeleteModal
                          itemId={product.id}
                          path="product"
                          confirm={() => {
                            toast.success("Mahsulot o'chirildi");
                            fetchProducts();
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
              <Package className="size-12 text-slate-600 mb-2" />
              Mahsulotlar topilmadi
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Jami: {totalCount} ta mahsulotdan {(page - 1) * limit + 1}-
            {Math.min(page * limit, totalCount)} ko'rsatilmoqda
          </span>
          <Pagination
            page={page}
            limit={limit}
            allCount={totalCount}
            onChange={(p) => fetchProducts(p)}
          />
        </div>
      </div>

      {/* Drawer */}
      <ProductDrawer
        open={open}
        initialValues={selected}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        onSuccess={() => fetchProducts(1)}
      />
    </div>
  );
};

export default Products;
