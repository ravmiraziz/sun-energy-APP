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

const Products: React.FC = () => {
  const [productsData] = useState([
    {
      id: "1",
      name: "Elite Series PV-500",
      sku: "SOL-500-ELT",
      category: "Solar Panels",
      price: "$1,299.00",
      status: true,
      image: "https://picsum.photos/100/100?random=20",
    },
    {
      id: "2",
      name: "Home Logic Smart Meter",
      sku: "MET-HL-01",
      category: "Meters",
      price: "$145.00",
      status: true,
      image: "https://picsum.photos/100/100?random=21",
    },
    {
      id: "3",
      name: "Storage Tech Giga-Cell",
      sku: "BAT-ST-10K",
      category: "Batteries",
      price: "$3,500.00",
      status: false,
      image: "https://picsum.photos/100/100?random=22",
    },
    {
      id: "4",
      name: "Energy Flow Inverter X",
      sku: "INV-EF-X1",
      category: "Inverters",
      price: "$890.00",
      status: true,
      image: "https://picsum.photos/100/100?random=23",
    },
    {
      id: "5",
      name: "Precision Pro Sensor",
      sku: "SEN-PRS-99",
      category: "Sensors",
      price: "$45.00",
      status: true,
      image: "https://picsum.photos/100/100?random=24",
    },
  ]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const fetchedOnce = useRef(false); // 🔥 MAGIC

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // const res = await get("/products");
      // setProducts(res.data);
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
    <div className="md:p-8 p-4 max-w-400 mx-auto w-full">
      <div className="flex items-center gap-2 text-sm text_primary mb-6">
        <a className="hover:text-primary transition-colors" href="#">
          Dashboard
        </a>
        <MdChevronRight className="text-[16px]" />
        <span className="text-white font-medium">Products Management</span>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Products Management
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
                <th className="px-6 py-4 w-16">Image</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg_card">
              {productsData.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <img
                      className="size-12 rounded-lg object-cover bg-slate-800 border border_color"
                      src={product.image}
                      alt={product.name}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white transition-colors">
                        {product.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono uppercase tracking-tighter">
                        SKU: {product.sku}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="card_btn px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border_color/50">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-yellow-500">
                      {product.price}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${product.status ? "bg-primary" : "bg-slate-700"}`}
                    >
                      <div
                        className={`size-3 bg-white rounded-full shadow transition-transform ${product.status ? "translate-x-5" : "translate-x-0"}`}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:text-primary transition-colors text-slate-400">
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
          onSuccess={() => fetchProducts()}
        />
        <div className="px-6 py-4 border-t border_color flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text_primary">Rows per page:</span>
            <select className="bg-transparent border-none text-xs font-bold bg_card focus:ring-0 p-0 pr-6">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 transition-colors">
              <MdChevronLeft className="text-[20px]" />
            </button>
            <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-xs font-bold">
              1
            </button>
            <button className="size-8 flex items-center justify-center rounded-lg text_primary hover:bg-slate-800 transition-colors text-xs font-semibold">
              2
            </button>
            <button className="size-8 flex items-center justify-center rounded-lg text_primary hover:bg-slate-800 transition-colors text-xs font-semibold">
              3
            </button>
            <span className="px-2 text-slate-400 text-xs">...</span>
            <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 transition-colors">
              <MdChevronRightIcon className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
