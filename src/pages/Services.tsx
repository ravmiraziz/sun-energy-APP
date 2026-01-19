import React, { useEffect, useRef, useState } from "react";
import ServiceDrawer from "../components/ui/ServiceDrawer";

const SERVICES = [
  {
    id: "1",
    name: "Solar Array Maintenance",
    description: "Bi-annual professional cleaning and inverter inspection.",
    category: "Maintenance",
    price: 299,
    priceUnit: "visit",
    status: "Active",
    image: "https://picsum.photos/400/300?random=1",
  },
  {
    id: "2",
    name: "EV Charger Installation",
    description: "Level 2 home charging station setup and certification.",
    category: "Installation",
    price: 850,
    priceUnit: "fixed",
    status: "Active",
    image: "https://picsum.photos/400/300?random=2",
  },
  {
    id: "3",
    name: "Energy Efficiency Audit",
    description: "Full thermal imaging and energy consumption report.",
    category: "Consulting",
    price: 149,
    priceUnit: "hour",
    status: "Inactive",
    image: "https://picsum.photos/400/300?random=3",
  },
  {
    id: "4",
    name: "24/7 Emergency Support",
    description: "Immediate response for grid failure or battery issues.",
    category: "Support",
    price: 45,
    priceUnit: "month",
    status: "Active",
    image: "https://picsum.photos/400/300?random=4",
  },
];

const Services: React.FC = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const fetchedOnce = useRef(false); // 🔥 MAGIC

  const fetchServices = async () => {
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
    fetchServices();
  }, []);
  return (
    <div className="flex-1 p-8  ">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Services Management
          </h2>
          <p className="text-slate-400 mt-1">
            Create, monitor, and manage your energy service offerings.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-primary text-background-dark px-6 py-3 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Servis qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        <div className="bg_card p-6 rounded-2xl border border_color flex flex-col gap-2">
          <div className="flex justify-between items-start card_text">
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Total Services
            </p>
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white">48</p>
            <p className="text-xs font-bold text-slate-400">Active Catalog</p>
          </div>
        </div>
        <div className="bg_card p-6 rounded-2xl border border_color relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1 h-full bg-primary"></div>
          <div className="flex justify-between items-start card_text">
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Active Contracts
            </p>
            <span className="material-symbols-outlined text-primary">bolt</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white">42</p>
            <p className="text-xs font-bold text-primary">87.5%</p>
          </div>
        </div>
        <div className="bg_card p-6 rounded-2xl border border_color relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1 h-full bg-highlight-yellow"></div>
          <div className="flex justify-between items-start card_text">
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Service Revenue
            </p>
            <span className="material-symbols-outlined text-highlight-yellow">
              payments
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white">$124.5k</p>
            <p className="text-xs font-bold text-highlight-yellow">+14.2%</p>
          </div>
        </div>
      </div>

      <div className="bg_card rounded-2xl border border_color shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="card_btn text-[10px] font-bold uppercase tracking-widest text_primary border-b border_color">
              <th className="px-8 py-5">Service</th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5">Price Model</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {SERVICES.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-primary/5 transition-colors group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={s.image}
                      className="size-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border_color"
                      alt={s.name}
                    />
                    <div className="flex flex-col max-w-xs">
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                        {s.name}
                      </span>
                      <span className="text-xs card_text line-clamp-1">
                        {s.description}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                    {s.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-highlight-yellow">
                      ${s.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] card_text font-bold uppercase tracking-widest">
                      per {s.priceUnit}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center">
                    <div
                      className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200
                      ${s.status === "Active" ? "bg-primary" : "bg-slate-700"}
                    `}
                    >
                      <div
                        className={`bg-white size-3 rounded-full shadow-md transition-transform duration-200
                        ${s.status === "Active" ? "translate-x-4" : "translate-x-0"}
                      `}
                      ></div>
                    </div>
                    <span
                      className={`ml-3 text-[10px] font-bold uppercase ${s.status === "Active" ? "text-primary" : "card_text"}`}
                    >
                      {s.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 card_text">
                    <button className="p-2 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        edit
                      </span>
                    </button>
                    <button className="p-2 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        delete
                      </span>
                    </button>
                    <button className="p-2 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        more_horiz
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ServiceDrawer
        open={open}
        initialValues={selected}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        onSuccess={() => fetchServices()}
      />
    </div>
  );
};

export default Services;
