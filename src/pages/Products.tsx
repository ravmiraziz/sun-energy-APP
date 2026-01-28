import React, { useEffect, useRef, useState } from "react";
import {
  MdChevronRight,
  MdAdd,
  MdFilterList,
  MdEdit,
  MdDelete,
  MdChevronLeft,
  MdChevronRight as MdChevronRightIcon,
} from "react-icons/md";
import ProductDrawer from "../components/ui/ProductDrawer";
import { get, patch, putData } from "../api/api";
import Pagination from "../components/ui/Pagination";
import { AiOutlineProduct } from "react-icons/ai";

export interface ProductImage {
  id?: string; // backenddan kelgan bo‘lishi mumkin
  image_url?: string;
  file?: File; // yangi yuklangan
  preview?: string; // preview URL
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

  const fetchedOnce = useRef(false); // 🔥 MAGIC

  const fetchProducts = async (p = page) => {
    setLoading(true);
    try {
      const { data }: ResData = await get("/products");
      console.log(data);

      setProducts(data.products || []);
      setTotalCount(data.count);
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
          <p className="text-sm text_primary">
            Showing <span className="font-semibold text-white">1-5</span> of 250
            products
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
              <MdFilterList />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {products?.length > 0 &&
                products.map((product) => (
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
                      <span className="text-sm font-bold text-yellow-500">
                        {product.price}
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
                        <button className="p-1.5 hover:text-red-500 transition-colors text-slate-400">
                          <MdDelete className="text-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
