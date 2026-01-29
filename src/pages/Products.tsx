import React, { useEffect, useRef, useState } from "react";
import { MdAdd, MdFilterList, MdEdit, MdSearch } from "react-icons/md";
import ProductDrawer from "../components/ui/ProductDrawer";
import { get, patch } from "../api/api";
import Pagination from "../components/ui/Pagination";
import { AiOutlineProduct } from "react-icons/ai";
import DeleteModal from "../components/modals/DeleteModal";
import { TbDatabaseSearch, TbReload } from "react-icons/tb";
import { formatPrice } from "../utils/formatter";

interface ProductImage {
  id?: number;
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

  const fetchedOnce = useRef(false); // 🔥 MAGIC

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
    } catch (error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: current } : p)),
      );
      console.error("Status update failed", error);
    }
  };

  return (
    <div className="md:p-8 p-4 max-w-400 mx-auto w-full">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Mahsulotlar boshqaruvi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and track your energy asset inventory
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-primary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-1 hover:opacity-90 shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02]"
        >
          <MdAdd className="text-[20px]" />
          Qo'shish
        </button>
      </div>

      <div className="card_btn rounded-2xl border border_color overflow-hidden shadow-sm flex flex-col">
        <div className="px-6 py-4 border-b border_color flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
              <MdFilterList />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[24px]" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg_mode border-none rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-400 min-w-50"
              placeholder="Mahsulot nomi bo'yicha qidiruv"
            />
            {search ? (
              <button
                onClick={() => fetchProducts(1)}
                className="absolute bg-primary right-2 top-1/2 -translate-y-1/2 text-[24px] rounded-md p-1"
              >
                <TbDatabaseSearch />
              </button>
            ) : (
              <button
                onClick={() => fetchProducts(1)}
                className="absolute bg-primary right-2 top-1/2 -translate-y-1/2 text-[24px] rounded-md p-1"
              >
                <TbReload className={`${loading && "animate-spin"} text-2xl`} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full py-6 w-full animate-pulse">
              Yuklanmoqda...
            </div>
          ) : products?.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="uppercase text-[11px] font-bold tracking-widest border-b border_color">
                  <th className="px-6 py-4 w-16">Rasm</th>
                  <th className="px-6 py-4">Nomi</th>
                  <th className="px-6 py-4">Brend</th>
                  <th className="px-6 py-4">Narx</th>
                  <th className="px-6 py-4">Qo'shilgan vaqti</th>
                  <th className="px-6 py-4">Holati</th>
                  <th className="px-6 py-4 text-right">Qo'shimcha </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg_card">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      {product?.images?.length > 0 ? (
                        <img
                          className="h-12 w-full overflow-hidden rounded-lg object-contain bg-slate-800 border border_color"
                          src={product?.images[0].image_url}
                          alt={product.name_uz}
                        />
                      ) : (
                        <div className="h-12 w-full overflow-hidden rounded-lg flex items-center justify-center text-2xl text_primary bg-slate-800 border border_color">
                          <AiOutlineProduct />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white transition-colors text-nowrap">
                          {product.name_uz}
                        </span>
                        <span className="text-xs text-slate-500 font-mono uppercase tracking-tighter">
                          WATT: {product.watt}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="card_btn px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border_color/50">
                        {product.brand}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-yellow-500 text-nowrap">
                        {formatPrice(product.price)} so'm
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text_primary text-nowrap">
                        {new Date(product.created_at).toLocaleDateString()}
                        {" | "}
                        {new Date(product.created_at).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        onClick={() =>
                          handleToggle(product.id, product.is_active)
                        }
                        className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors
      ${product.is_active ? "bg-primary" : "bg-slate-700"}`}
                      >
                        <div
                          className={`size-3 bg-white rounded-full shadow transition-transform
        ${product.is_active ? "translate-x-5" : "translate-x-0"}`}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelected(product);
                            setOpen(true);
                          }}
                          className="p-1.5 hover:text-primary transition-colors text-slate-400"
                        >
                          <MdEdit className="text-[18px]" />
                        </button>
                        <DeleteModal
                          itemId={product?.id || ""}
                          path="product"
                          confirm={() => fetchProducts()}
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
        </div>
        <ProductDrawer
          open={open}
          initialValues={selected}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
          onSuccess={() => fetchProducts(1)}
        />
        <div className="px-6 py-4 card_btn border-t border_color flex justify-end items-center">
          <Pagination
            page={page}
            limit={limit}
            allCount={totalCount}
            onChange={(p) => fetchProducts(p)}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
