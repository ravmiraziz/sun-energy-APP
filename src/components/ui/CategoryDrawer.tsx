import React, { useEffect, useState } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";
import { MdAddCircleOutline, MdClose, MdEdit } from "react-icons/md";
import Pagination from "./Pagination";
import { post, putData } from "../../api/api";
import { GrClearOption } from "react-icons/gr";
import DeleteModal from "../modals/DeleteModal";
import { toast } from "sonner";
import { Tag } from "lucide-react";

export interface CategoryFormValues {
  id?: string;
  name_uz: string;
  name_ru: string;
  icon_name?: string;
}

interface UpdateItem {
  id?: string;
  name_uz: string;
  name_ru: string;
  icon_name?: string;
  created_at?: string;
}

interface CategoryDrawerProps {
  type?: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (p?: number) => void;
  initialValues: UpdateItem[];
  page: number;
  limit: number;
  totalCount: number;
}

const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  type = "product",
  open,
  page,
  limit,
  totalCount,
  onClose,
  initialValues,
  onSuccess,
}) => {
  const [update, setUpdate] = useState<UpdateItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<CategoryFormValues>({
    name_uz: "",
    name_ru: "",
    icon_name: "bolt",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const clear = () => {
    setUpdate(null);
    setValues({
      name_ru: "",
      name_uz: "",
      icon_name: "bolt",
    });
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!values.name_uz.trim()) newErrors.name_uz = true;
    if (!values.name_ru.trim()) newErrors.name_ru = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Kategoriya nomi (UZ va RU) to'ldirilishi shart!");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const payload = {
      ...values,
      id: update?.id,
    };

    try {
      if (update) {
        await putData(`${type}-category`, payload);
        toast.success("Kategoriya muvaffaqiyatli yangilandi! 🎉");
      } else {
        await post(`${type}-category`, payload);
        toast.success("Yangi kategoriya muvaffaqiyatli qo'shildi! 🚀");
      }

      onSuccess(page);
      clear();
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Kategoriyani saqlashda xatolik yuz berdi";
      toast.error(`Xatolik: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (update) {
      setValues({
        name_ru: update.name_ru,
        name_uz: update.name_uz,
        icon_name: update.icon_name || "bolt",
      });
    }
  }, [update]);

  const CATEGORY_ICONS = [
    "bolt",
    "eco",
    "settings",
    "construction",
    "query_stats",
  ] as const;

  return (
    <BaseDrawer
      open={open}
      onClose={() => {
        onClose();
        if (initialValues) onSuccess(page);
      }}
      title={update ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
      width={640}
    >
      <div className="flex flex-col h-full bg-[#0e1a15] text-slate-100 select-none">
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Tag className="size-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {type === "service" ? "Servis" : "Mahsulot"} Kategoriyalari
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Katalog guruhlarini boshqarish va tartibga solish
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* INPUT FORM */}
        <div className="p-6 border-b border-white/5 space-y-4 bg-white/[0.01]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Nomi (UZ) <span className="text-emerald-400">*</span>
              </label>
              <input
                name="name_uz"
                value={values.name_uz}
                onChange={handleChange}
                placeholder="Masalan: Inverterlar"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.name_uz
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Nomi (RU) <span className="text-emerald-400">*</span>
              </label>
              <input
                name="name_ru"
                value={values.name_ru}
                onChange={handleChange}
                placeholder="Инверторы"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.name_ru
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
          </div>

          {/* ICONS IF SERVICE */}
          {type === "service" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Belgi (Icon)
              </label>
              <div className="flex gap-2">
                {CATEGORY_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setValues((p) => ({ ...p, icon_name: icon }))}
                    className={`size-10 rounded-xl border flex items-center justify-center transition-all ${
                      values.icon_name === icon
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-[#152721] border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <MdAddCircleOutline className="text-xl" />
              {loading ? "Saqlanmoqda..." : update ? "O'zgartirish" : "Kategoriya Qo'shish"}
            </button>
            {update && (
              <button
                type="button"
                onClick={clear}
                title="Tozalash"
                className="p-2.5 rounded-xl bg-[#152721] border border-white/10 text-slate-400 hover:text-white transition-all"
              >
                <GrClearOption className="text-xl" />
              </button>
            )}
          </div>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mavjud Kategoriyalar
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Jami: {totalCount || 0}
            </span>
          </div>

          {initialValues.length > 0 ? (
            <div className="space-y-2">
              {initialValues.map((item) => (
                <div
                  key={item?.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#152721] border border-white/5 hover:border-white/15 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                      {item.icon_name ? (
                        <span className="material-symbols-outlined text-sm">
                          {item.icon_name}
                        </span>
                      ) : (
                        <Tag className="size-3.5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        {item.name_uz}
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.name_ru}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setUpdate(item)}
                      title="Tahrirlash"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    >
                      <MdEdit className="text-lg" />
                    </button>
                    <DeleteModal
                      itemId={item?.id || ""}
                      path={`${type}-category`}
                      confirm={() => {
                        toast.success("Kategoriya o'chirildi");
                        onSuccess(page);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Kategoriyalar mavjud emas
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          <Pagination
            page={page}
            limit={limit}
            allCount={totalCount}
            onChange={(p) => onSuccess(p)}
          />
        </div>
      </div>
    </BaseDrawer>
  );
};

export default CategoryDrawer;
