import React, { useEffect, useMemo, useState } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";
import { MdClose } from "react-icons/md";
import { post, putData } from "../../api/api";
import { PaginatedSelect } from "./PaginationSelect";
import type { ServiceFormValues } from "../../pages/Services";
import { toast } from "sonner";
import { Wrench } from "lucide-react";

interface ServiceDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: ServiceFormValues | null;
  onSuccess: () => void;
}

interface ServiceCategoryItem {
  id: string | number;
  name_ru: string;
  name_uz: string;
  icon_name?: string;
}

const ServiceDrawer: React.FC<ServiceDrawerProps> = ({
  open,
  onClose,
  initialValues,
  onSuccess,
}) => {
  const isEdit = useMemo(() => !!initialValues?.id, [initialValues]);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<ServiceFormValues>({
    name_uz: "",
    name_ru: "",
    description_uz: "",
    description_ru: "",
    price: 0,
    is_active: true,
    category_id: "",
    ikpu_code: "00702001001000001",
    package_code: "123456",
    units: 0,
    vat_percent: 12,
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [serviceData, setServiceData] = useState<ServiceCategoryItem | null>(null);

  useEffect(() => {
    if (open) {
      if (initialValues) {
        setValues({
          ...initialValues,
          ikpu_code: initialValues.ikpu_code || "00702001001000001",
          package_code: initialValues.package_code || "123456",
          units: initialValues.units ?? 0,
          vat_percent: initialValues.vat_percent ?? 12,
        });

        if (initialValues.category_id) {
          setServiceData({
            id: initialValues.category_id,
            name_uz: "Tanlangan Kategoriya",
            name_ru: "Выбранная категория",
          });
        } else {
          setServiceData(null);
        }
      } else {
        setValues({
          name_uz: "",
          name_ru: "",
          description_uz: "",
          description_ru: "",
          price: 0,
          is_active: true,
          category_id: "",
          ikpu_code: "00702001001000001",
          package_code: "123456",
          units: 0,
          vat_percent: 12,
        });
        setServiceData(null);
      }
      setErrors({});
    }
  }, [open, initialValues]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    const missing: string[] = [];

    if (!values.name_uz.trim()) {
      newErrors.name_uz = true;
      missing.push("Xizmat nomi (UZ)");
    }
    if (!values.name_ru.trim()) {
      newErrors.name_ru = true;
      missing.push("Xizmat nomi (RU)");
    }
    if (!values.description_uz.trim()) {
      newErrors.description_uz = true;
      missing.push("Tavsif (UZ)");
    }
    if (!values.description_ru.trim()) {
      newErrors.description_ru = true;
      missing.push("Tavsif (RU)");
    }
    if (!serviceData?.id && !values.category_id) {
      newErrors.category_id = true;
      missing.push("Kategoriya");
    }
    if (!values.price || Number(values.price) <= 0) {
      newErrors.price = true;
      missing.push("Xizmat narxi");
    }
    if (!values.ikpu_code.trim()) {
      newErrors.ikpu_code = true;
      missing.push("IKPU kodi");
    }
    if (!values.package_code.trim()) {
      newErrors.package_code = true;
      missing.push("O'lchov birligi (Package code)");
    }

    setErrors(newErrors);

    if (missing.length > 0) {
      toast.error(
        `Iltimos, maydonlarni to'ldiring: ${missing.slice(0, 3).join(", ")}${
          missing.length > 3 ? " va boshqalar" : ""
        }`,
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        ...values,
        price: Number(values.price),
        units: Number(values.units || 0),
        vat_percent: Number(values.vat_percent || 0),
        id: initialValues?.id,
        category_id: String(serviceData?.id || values.category_id),
      };

      if (isEdit) {
        await putData(`/app-service`, payload);
        toast.success("Xizmat muvaffaqiyatli yangilandi! 🎉");
      } else {
        await post("/app-service", payload);
        toast.success("Yangi xizmat muvaffaqiyatli qo'shildi! 🚀");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      const serverMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data?.Data ||
        "Xizmatni saqlashda xatolik yuz berdi";
      toast.error(`Xatolik: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDrawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Servisni tahrirlash" : "Yangi Servis qo‘shish"}
      width={700}
    >
      <div className="flex flex-col h-full bg-[#0e1a15] text-slate-100 select-none">
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wrench className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isEdit ? "Servisni tahrirlash" : "Yangi Servis Qo'shish"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Xizmat ko'rsatish tariflari va parametrlarini kiriting
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

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Servis nomi (UZ) <span className="text-emerald-400">*</span>
              </label>
              <input
                name="name_uz"
                value={values.name_uz}
                onChange={handleChange}
                placeholder="Masalan: Quyosh panellari montaji"
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.name_uz
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Servis nomi (RU) <span className="text-emerald-400">*</span>
              </label>
              <input
                name="name_ru"
                value={values.name_ru}
                onChange={handleChange}
                placeholder="Монтаж солнечных панелей"
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.name_ru
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Tavsif (UZ) <span className="text-emerald-400">*</span>
              </label>
              <textarea
                rows={3}
                name="description_uz"
                value={values.description_uz}
                onChange={handleChange}
                placeholder="Xizmat shartlari va jarayon..."
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.description_uz
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Tavsif (RU) <span className="text-emerald-400">*</span>
              </label>
              <textarea
                rows={3}
                name="description_ru"
                value={values.description_ru}
                onChange={handleChange}
                placeholder="Условия и процесс услуги..."
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.description_ru
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Servis Kategoriyasi <span className="text-emerald-400">*</span>
              </label>
              <PaginatedSelect<ServiceCategoryItem>
                value={serviceData}
                onChange={(cat) => {
                  setServiceData(cat);
                  setValues((prev) => ({ ...prev, category_id: String(cat.id) }));
                  setErrors((prev) => ({ ...prev, category_id: false }));
                }}
                endpoint="service-categories"
                labelKey="name_uz"
                placeholder="Kategoriyani tanlang..."
                className={errors.category_id ? "ring-1 ring-rose-500 rounded-xl" : ""}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Xizmat Narxi (so'm) <span className="text-emerald-400">*</span>
              </label>
              <input
                name="price"
                type="number"
                value={values.price}
                onChange={handleChange}
                placeholder="500000"
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.price
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                МХИК (IKPU) Kodi <span className="text-emerald-400">*</span>
              </label>
              <input
                name="ikpu_code"
                value={values.ikpu_code}
                onChange={handleChange}
                placeholder="00702001001000001"
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.ikpu_code
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                O'lchov kodi <span className="text-emerald-400">*</span>
              </label>
              <input
                name="package_code"
                value={values.package_code}
                onChange={handleChange}
                placeholder="123456"
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.package_code
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">QQS (%)</label>
              <input
                name="vat_percent"
                type="number"
                value={values.vat_percent}
                onChange={handleChange}
                placeholder="12"
                className="w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#152721] border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Faol Holat</p>
              <p className="text-xs text-slate-400">
                Xizmat buyurtma qilish uchun ochiq bo'ladi
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={values.is_active}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, is_active: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 px-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-semibold text-slate-300 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Saqlanmoqda..." : isEdit ? "O'zgarishlarni saqlash" : "Servisni qo'shish"}
          </button>
        </div>
      </div>
    </BaseDrawer>
  );
};

export default ServiceDrawer;
