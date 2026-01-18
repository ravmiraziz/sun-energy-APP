import React from "react";

const Services: React.FC = () => {
  return (
    <div className="flex-1 pb-32">
      <header className="px-6 pt-12 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Xizmatlar</h1>
          <p className="text-sm text-emerald-400 font-medium">
            Xizmat ko'rsatish va qo'llab-quvvatlash
          </p>
        </div>
        <button className="p-2 rounded-full bg-[#064e3b] border border-emerald-800">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <div className="px-6 mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400">
            search
          </span>
          <input
            className="w-full bg-[#064e3b] rounded-2xl pl-11 pr-4 py-4 text-sm focus:ring-[#FFB800]"
            placeholder="Xizmatni toping..."
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
            tune
          </span>
        </div>
      </div>

      <div className="px-6 mb-8 flex gap-3 overflow-x-auto no-scrollbar">
        <button className="px-5 py-2.5 bg-[#FFB800] text-black font-bold rounded-full text-sm">
          Barchasi
        </button>
        <button className="px-5 py-2.5 bg-[#064e3b] rounded-full text-sm font-medium border border-emerald-800">
          Tozalash
        </button>
        <button className="px-5 py-2.5 bg-[#064e3b] rounded-full text-sm font-medium border border-emerald-800">
          Ta'mirlash
        </button>
      </div>

      <div className="px-6 mb-8">
        <div className="bg-[#FFB800] rounded-3xl p-6 relative overflow-hidden text-black shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-xl -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-6">
            <span className="px-3 py-1 bg-black/10 rounded-md text-[10px] font-bold uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">
                auto_awesome
              </span>{" "}
              Premium
            </span>
            <button className="bg-black text-[#FFB800] px-4 py-1.5 rounded-full text-xs font-bold">
              Sotib Olish
            </button>
          </div>
          <h3 className="text-2xl font-extrabold mb-1">
            Yillik Quyosh Tekshiruvi
          </h3>
          <p className="text-sm mb-6 opacity-70">To'liq diagnostika paketi.</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">129$</span>
            <span className="text-sm opacity-40 line-through">180$</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          Ommabop Xizmatlar{" "}
          <span className="w-1.5 h-1.5 bg-[#FFB800] rounded-full"></span>
        </h2>
        <ServiceCard
          name="Panelni Tozalash"
          desc="Samaradorlikni oshirish"
          price="49$"
          rating="4.9"
          icon="cleaning_services"
          color="primary"
        />
        <ServiceCard
          name="Tizim Diagnostikasi"
          desc="Inverter holati"
          price="89$"
          rating="4.8"
          icon="monitor_heart"
          color="blue"
        />
        <ServiceCard
          name="Batareya Xizmati"
          desc="Optimallashtirish"
          price="120$"
          rating="5.0"
          icon="battery_charging_full"
          color="emerald"
        />
      </div>

      {/* <Navigation current={AppScreen.SERVICES} onNavigate={onNavigate} /> */}
    </div>
  );
};

const ServiceCard: React.FC<{
  name: string;
  desc: string;
  price: string;
  rating: string;
  icon: string;
  color: string;
}> = ({ name, desc, price, rating, icon, color }) => (
  <div className="bg-[#064e3b] p-4 rounded-2xl flex items-center justify-between border border-emerald-800/50">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-[#022c22] rounded-xl flex items-center justify-center">
        <span
          className={`material-symbols-outlined text-${color === "primary" ? "[#FFB800]" : color + "-400"}`}
        >
          {icon}
        </span>
      </div>
      <div>
        <h4 className="font-bold text-sm">{name}</h4>
        <p className="text-[10px] text-emerald-400">{desc}</p>
        <div className="flex items-center mt-1 text-[10px]">
          <span className="material-symbols-outlined text-[#FFB800] text-xs material-symbols-fill">
            star
          </span>
          <span className="font-bold ml-1">{rating}</span>
        </div>
      </div>
    </div>
    <div className="text-right flex flex-col items-end gap-2">
      <span className="font-bold text-[#FFB800]">{price}</span>
      <button className="bg-[#FFB800] text-black text-[10px] font-bold px-3 py-1.5 rounded-lg">
        Sotib Olish
      </button>
    </div>
  </div>
);

export default Services;
