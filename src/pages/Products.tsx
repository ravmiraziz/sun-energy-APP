import React, { useState } from "react";

const Products: React.FC = () => {
  const [products] = useState([
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

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <a className="hover:text-primary transition-colors" href="#">
          Dashboard
        </a>
        <span className="material-symbols-outlined text-[16px]">
          chevron_right
        </span>
        <span className="text-slate-900 dark:text-white font-medium">
          Products Management
        </span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Products Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and track your energy asset inventory
          </p>
        </div>
        <button className="bg-primary text-background-dark px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02]">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Product
        </button>
      </div>

      <div className="bg_card rounded-2xl border border-slate-200 dark:border-border-teal overflow-hidden shadow-sm flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-teal flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              1-5
            </span>{" "}
            of 250 products
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold tracking-widest border-b border-slate-200 dark:border-border-teal">
                <th className="px-6 py-4 w-16">Image</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-teal">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <img
                      className="size-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-border-teal"
                      src={product.image}
                      alt={product.name}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {product.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono uppercase tracking-tighter">
                        SKU: {product.sku}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 dark:bg-surface-dark px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-slate-200 dark:border-border-teal/50">
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
                      className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${product.status ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"}`}
                    >
                      <div
                        className={`size-3 bg-white rounded-full shadow transition-transform ${product.status ? "translate-x-5" : "translate-x-0"}`}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:text-primary transition-colors text-slate-400">
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                      <button className="p-1.5 hover:text-red-500 transition-colors text-slate-400">
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-border-teal flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Rows per page:
            </span>
            <select className="bg-transparent border-none text-xs font-bold text-slate-900 dark:text-white focus:ring-0 p-0 pr-6">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
            </button>
            <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-background-dark text-xs font-bold">
              1
            </button>
            <button className="size-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold">
              2
            </button>
            <button className="size-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold">
              3
            </button>
            <span className="px-2 text-slate-400 text-xs">...</span>
            <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
