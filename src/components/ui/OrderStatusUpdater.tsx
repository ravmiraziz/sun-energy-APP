import { useState } from "react";
import type { OrderStatus } from "../../pages/Orders";
import { CheckCircle2, Clock, Truck, XCircle } from "lucide-react";

interface Props {
  item: {
    id: string;
    status: OrderStatus;
  };
  onUpdateStatus: (data: { id: string; status: OrderStatus }) => void;
}

const OrderStatusUpdater = ({ item, onUpdateStatus }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    item.status,
  );

  const statuses = [
    { value: "new", label: "Yangi", icon: Clock, color: "text-sky-400" },
    { value: "success", label: "Jarayonda", icon: CheckCircle2, color: "text-amber-400" },
    { value: "delivered", label: "Yakunlangan", icon: Truck, color: "text-emerald-400" },
    { value: "canceled", label: "Bekor qilingan", icon: XCircle, color: "text-rose-400" },
  ] as const;

  const handleUpdate = () => {
    onUpdateStatus({
      id: item.id,
      status: selectedStatus,
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {statuses.map((st) => {
          const isActive = st.value === selectedStatus;
          const Icon = st.icon;

          return (
            <button
              key={st.value}
              type="button"
              onClick={() => setSelectedStatus(st.value)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm"
                  : "bg-[#152721] border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`size-3.5 ${st.color}`} />
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleUpdate}
        disabled={selectedStatus === item.status}
        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        "{statuses.find((s) => s.value === selectedStatus)?.label}" ga o'zgartirish
      </button>
    </div>
  );
};

export default OrderStatusUpdater;
