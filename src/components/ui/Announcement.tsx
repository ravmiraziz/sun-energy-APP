import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { get, post } from "../../api/api";
import { formatPrice } from "../../utils/formatter";
import { toast } from "sonner";
import { Megaphone } from "lucide-react";

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
  ikpu_code: string;
  package_code: string;
  units: number;
  vat_percent: number;
}

interface AnnouncementProps {
  mode?: Mode;
  type?: AnnouncementType;
  initialData?: AnnouncementData;
  close?: () => void;
}

interface ResData {
  data: AnnouncementData;
}

export default function Announcement({
  type: initialType = "product",
  initialData,
  close,
}: AnnouncementProps) {
  const [type, setType] = useState<AnnouncementType>(initialType);
  const [postData, setPostData] = useState<AnnouncementData>(
    initialData || {
      name_uz: "",
      name_ru: "",
      description_uz: "",
      description_ru: "",
      price: 0,
      ikpu_code: "00702001001000001",
      package_code: "123456",
      units: 0,
      vat_percent: 12,
    },
  );

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

  const getData = async () => {
    setLoading(true);
    try {
      const { data }: ResData = await get(endpoint);
      if (data) {
        setPostData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await post(endpoint, postData);
      toast.success("E'lon muvaffaqiyatli saqlandi! 🎉");
      if (close) close();
    } catch (err: any) {
      const msg = err?.response?.data?.error || "E'lonni saqlashda xatolik";
      toast.error(`Xatolik: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-2xl bg-[#12211c] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Megaphone className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">E'lon Banner Sozlamasi</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mijozlar ilovasida aks etuvchi maxsus aksiya yoki taklif
              </p>
            </div>
          </div>
          {close && (
            <button
              onClick={close}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
            >
              <MdClose className="text-2xl" />
            </button>
          )}
        </div>

        {/* Type toggle */}
        <div className="flex gap-2 p-1 rounded-xl bg-[#152721] border border-white/5 w-fit">
          <button
            type="button"
            onClick={() => setType("product")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              type === "product"
                ? "bg-emerald-500 text-[#0b1411]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Mahsulot E'loni
          </button>
          <button
            type="button"
            onClick={() => setType("service")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              type === "service"
                ? "bg-emerald-500 text-[#0b1411]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Servis E'loni
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/10 to-transparent border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black">
              Maxsus Taklif
            </span>
            <span className="text-xs font-bold text-emerald-400 capitalize">
              {type}
            </span>
          </div>
          <h3 className="text-lg font-black text-white">
            {postData.name_uz || "E'lon sarlavhasi (UZ)"}
          </h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2">
            {postData.description_uz || "E'lon tavsifi..."}
          </p>
          <div className="mt-3">
            <span className="text-base font-extrabold text-amber-400">
              {postData.price ? formatPrice(postData.price) + " so'm" : "0 so'm"}
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nomi (UZ)</label>
              <input
                value={postData.name_uz}
                onChange={(e) => handleChange("name_uz", e.target.value)}
                placeholder="Nomi UZ"
                className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nomi (RU)</label>
              <input
                value={postData.name_ru}
                onChange={(e) => handleChange("name_ru", e.target.value)}
                placeholder="Nomi RU"
                className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tavsif (UZ)</label>
              <textarea
                rows={2}
                value={postData.description_uz}
                onChange={(e) => handleChange("description_uz", e.target.value)}
                placeholder="Tavsif UZ"
                className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tavsif (RU)</label>
              <textarea
                rows={2}
                value={postData.description_ru}
                onChange={(e) => handleChange("description_ru", e.target.value)}
                placeholder="Tavsif RU"
                className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Narxi (so'm)</label>
            <input
              type="number"
              value={postData.price || ""}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            {close && (
              <button
                type="button"
                onClick={close}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300"
              >
                Bekor qilish
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Saqlanmoqda..." : "E'lonni Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
