import { useState } from "react";
import type { OrderStatus } from "../../pages/Orders";

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
    { value: "new", label: "Yangi" },
    { value: "delivered", label: "Jarayonda" },
    { value: "success", label: "Bajarilgan" },
    { value: "canceled", label: "Bekor qilingan" },
  ] as const;

  const handleUpdate = () => {
    onUpdateStatus({
      id: item.id,
      status: selectedStatus,
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {statuses.map((item) => {
          const isActive = item.value === selectedStatus;

          return (
            <label
              key={item.value}
              className={`relative border p-3 rounded-lg cursor-pointer transition-all
                ${
                  isActive
                    ? "border-yellow-500 text-yellow-500"
                    : "card_btn border_color"
                }
              `}
            >
              {/* Hidden radio */}
              <input
                type="radio"
                name="orderStatus"
                value={item.value}
                checked={isActive}
                onChange={() => setSelectedStatus(item.value)}
                className="hidden"
              />

              <span className="absolute right-2 top-1 text-xs text_primary">
                {item.value}
              </span>

              <span className="font-bold">{item.label}</span>
            </label>
          );
        })}
      </div>

      <button
        onClick={handleUpdate}
        disabled={selectedStatus === item.status}
        className="w-full bg-primary font-black py-4 rounded-2xl transition-all
          hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        "{statuses.find((s) => s.value === selectedStatus)?.label}" ga
        o‘zgartirish
      </button>
    </div>
  );
};

export default OrderStatusUpdater;
