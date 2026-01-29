import { useEffect, useRef, useState } from "react";
import { MdAutoAwesome } from "react-icons/md";
import clsx from "clsx";
import { get, post } from "../../api/api";
import { formatPrice } from "../../utils/formatter";

type Mode = "create" | "update";
type AnnouncementType = "service" | "product";

export interface AnnouncementData {
  id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: number;
  created_at?: string;
}

interface AnnouncementProps {
  mode: Mode;
  type: AnnouncementType;
  initialData?: AnnouncementData;
}

interface ResData {
  data: AnnouncementData;
}

export default function Announcement({
  mode,
  type,
  initialData,
}: AnnouncementProps) {
  const [postData, setPostData] = useState<AnnouncementData>(
    initialData || {
      name_uz: "",
      name_ru: "",
      description_uz: "",
      description_ru: "",
      price: 0,
    },
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const endpoint =
    type === "service" ? "service-announcement" : "product-announcement";

  const handleChange = (
    key: keyof AnnouncementData,
    value: string | number,
  ) => {
    setPostData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const fetchedOnce = useRef(false); // 🔥 MAGIC

  const getData = async () => {
    setLoading(true);
    try {
      const { data }: ResData = await get(endpoint);
      setPostData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;

    fetchedOnce.current = true;
    getData();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await post(endpoint, postData);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Xatolik ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative bg-primary rounded-3xl p-6 shadow-xl shadow-primary/10 overflow-hidden ">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-black/10 backdrop-blur-md">
            <MdAutoAwesome className="text-[16px] text-black mr-1" />
            <span className="text-[10px] font-bold tracking-wider text-black uppercase">
              {mode === "create" ? "Yangi" : "Premium"}
            </span>
          </div>

          <span
            onClick={() => setOpen(!open)}
            className="bg-black text-primary px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer"
          >
            {type === "service" ? "Servis" : "Mahsulot"}
          </span>
        </div>

        <h3 className="text-2xl font-extrabold text-black mb-1 leading-tight">
          {postData.name_uz || "Nomi"}
        </h3>

        <p className="text-black/80 text-sm mb-6 max-w-[80%] font-medium leading-relaxed">
          {postData.description_uz || "Tavsif"}
        </p>

        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-black">
            {postData.price ? formatPrice(postData.price) + " so'm" : "0 so'm"}
          </span>
        </div>
      </div>
      {open && (
        <div className="bg_card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold">
            {mode === "create" ? "Yangi e'lon" : "E'lonni tahrirlash"}
          </h2>

          <input
            placeholder="Nomi (UZ)"
            value={postData.name_uz}
            onChange={(e) => handleChange("name_uz", e.target.value)}
            className="w-full h-11 px-4 rounded-xl card_btn"
          />

          <input
            placeholder="Nomi (RU)"
            value={postData.name_ru}
            onChange={(e) => handleChange("name_ru", e.target.value)}
            className="w-full h-11 px-4 rounded-xl card_btn"
          />

          <textarea
            placeholder="Tavsif (UZ)"
            value={postData.description_uz}
            onChange={(e) => handleChange("description_uz", e.target.value)}
            className="w-full min-h-20 px-4 py-2 rounded-xl card_btn"
          />

          <textarea
            placeholder="Tavsif (RU)"
            value={postData.description_ru}
            onChange={(e) => handleChange("description_ru", e.target.value)}
            className="w-full min-h-20 px-4 py-2 rounded-xl card_btn"
          />

          <input
            type="number"
            placeholder="Narx"
            value={postData.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            className="w-full h-11 px-4 rounded-xl card_btn"
          />

          <button
            disabled={loading}
            onClick={handleSubmit}
            className={clsx(
              "w-full h-11 rounded-xl font-bold transition",
              loading
                ? "bg-gray-400"
                : "bg-primary text-black hover:opacity-90",
            )}
          >
            {loading
              ? "Yuklanmoqda..."
              : mode === "create"
                ? "Saqlash"
                : "Yangilash"}
          </button>
        </div>
      )}
    </div>
  );
}
