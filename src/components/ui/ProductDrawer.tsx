import React, { useEffect, useMemo, useState } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";
import { MdClose, MdCloudUpload, MdDelete } from "react-icons/md";
import { PaginatedSelect } from "./PaginationSelect";
import { post, putData, remove } from "../../api/api";
import type { Product } from "../../pages/Products";
import { toast } from "sonner";
import { Layers } from "lucide-react";

interface ProductImage {
  file?: File;
  id?: string;
  preview: string;
}

export interface ProductFormValues {
  id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: number | string;
  category_id: string;
  watt: string;
  units_of_measurement: string;
  brand: string;
  model: string;
  images: ProductImage[];
  is_active: boolean;
  ikpu_code: string;
  package_code: string;
  units: number | string;
  vat_percent: number | string;
}

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Product | null;
  onSuccess: () => void;
}

interface Category {
  id: string | number;
  name_ru: string;
  name_uz: string;
  created_at?: string;
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({
  open,
  onClose,
  initialValues,
  onSuccess,
}) => {
  const isEdit = useMemo(() => !!initialValues?.id, [initialValues]);
  const [loading, setLoading] = useState(false);

  /* FORM STATE */
  const [values, setValues] = useState<ProductFormValues>({
    name_uz: "",
    name_ru: "",
    description_uz: "",
    description_ru: "",
    price: "",
    category_id: "",
    watt: "",
    units_of_measurement: "kilowatts",
    brand: "",
    model: "",
    images: [],
    is_active: true,
    ikpu_code: "00702001001000001",
    package_code: "123456",
    units: 0,
    vat_percent: 12,
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [category, setCategory] = useState<Category | null>(null);

  /* RESET / EDIT INITIALIZATION */
  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      setValues({
        id: initialValues.id,
        name_uz: initialValues.name_uz || "",
        name_ru: initialValues.name_ru || "",
        description_uz: initialValues.description_uz || "",
        description_ru: initialValues.description_ru || "",
        price: initialValues.price || "",
        category_id: String(initialValues.category_id || ""),
        watt: String(initialValues.watt || ""),
        units_of_measurement: initialValues.units_of_measurement || "kilowatts",
        brand: initialValues.brand || "",
        model: initialValues.model || "",
        is_active: initialValues.is_active ?? true,
        images: initialValues.images
          ? initialValues.images.map((img) => ({
              id: String(img.id),
              preview: img.image_url,
            }))
          : [],
        ikpu_code: initialValues.ikpu_code || "00702001001000001",
        package_code: initialValues.package_code || "123456",
        units: initialValues.units ?? 0,
        vat_percent: initialValues.vat_percent ?? 12,
      });

      if (initialValues.category_id) {
        setCategory({
          id: initialValues.category_id,
          name_uz: "Tanlangan Kategoriya",
          name_ru: "Выбранная категория",
        });
      } else {
        setCategory(null);
      }
    } else {
      setValues({
        name_uz: "",
        name_ru: "",
        description_uz: "",
        description_ru: "",
        price: "",
        category_id: "",
        watt: "",
        units_of_measurement: "kilowatts",
        brand: "",
        model: "",
        images: [],
        is_active: true,
        ikpu_code: "00702001001000001",
        package_code: "123456",
        units: 0,
        vat_percent: 12,
      });
      setCategory(null);
    }

    setErrors({});
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

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const mapped: ProductImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setValues((prev) => ({
      ...prev,
      images: [...prev.images, ...mapped],
    }));
    setErrors((prev) => ({ ...prev, images: false }));
  };

  const removeImage = async (image: ProductImage, index: number) => {
    try {
      if (image.id) {
        await remove("product-image", String(image.id));
        toast.info("Rasm o'chirildi");
        onSuccess();
      }

      setValues((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } catch (error) {
      toast.error("Rasmni o'chirishda xatolik yuz berdi");
    }
  };

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return;

    setValues((prev) => {
      const updated = [...prev.images];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, moved);
      return { ...prev, images: updated };
    });

    setDragIndex(null);
  };

  /* VALIDATION */
  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    const missing: string[] = [];

    if (!values.name_uz.trim()) {
      newErrors.name_uz = true;
      missing.push("Mahsulot nomi (UZ)");
    }
    if (!values.name_ru.trim()) {
      newErrors.name_ru = true;
      missing.push("Mahsulot nomi (RU)");
    }
    if (!values.description_uz.trim()) {
      newErrors.description_uz = true;
      missing.push("Tavsif (UZ)");
    }
    if (!values.description_ru.trim()) {
      newErrors.description_ru = true;
      missing.push("Tavsif (RU)");
    }
    if (!category?.id && !values.category_id) {
      newErrors.category_id = true;
      missing.push("Kategoriya");
    }
    if (!values.model.trim()) {
      newErrors.model = true;
      missing.push("Model");
    }
    if (!values.watt) {
      newErrors.watt = true;
      missing.push("Quvvat (Watt/kVt)");
    }
    if (!values.price || Number(values.price) <= 0) {
      newErrors.price = true;
      missing.push("Narx");
    }
    if (!values.ikpu_code.trim()) {
      newErrors.ikpu_code = true;
      missing.push("IKPU kodi");
    }
    if (!values.package_code.trim()) {
      newErrors.package_code = true;
      missing.push("O'lchov birligi (Package code)");
    }
    if (values.images.length === 0) {
      newErrors.images = true;
      missing.push("Kamida 1 ta rasm");
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

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name_uz", values.name_uz);
      formData.append("name_ru", values.name_ru);
      formData.append("description_uz", values.description_uz);
      formData.append("description_ru", values.description_ru);
      formData.append("price", String(values.price));
      formData.append("category_id", String(category?.id || values.category_id));
      formData.append("watt", String(values.watt));
      formData.append("units_of_measurement", values.units_of_measurement);
      formData.append("brand", values.brand || values.model);
      formData.append("model", values.model);
      formData.append("ikpu_code", values.ikpu_code);
      formData.append("package_code", values.package_code);
      formData.append("units", String(values.units || 0));
      formData.append("vat_percent", String(values.vat_percent || 0));
      formData.append("is_active", values.is_active ? "1" : "0");

      values.images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        }
      });

      if (isEdit) {
        formData.append("id", initialValues?.id || "");
        await putData(`/product`, formData);
        toast.success("Mahsulot muvaffaqiyatli yangilandi! 🎉");
      } else {
        await post("/product", formData);
        toast.success("Mahsulot muvaffaqiyatli qo'shildi! 🚀");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Product submission failed:", err);
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.Data ||
        "Mahsulotni saqlashda xatolik yuz berdi";
      toast.error(`Xatolik: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDrawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}
      width={720}
    >
      <div className="flex flex-col h-full bg-[#0e1a15] text-slate-100 select-none">
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {isEdit ? "Mahsulotni tahrirlash" : "Yangi Mahsulot Qo'shish"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Katalog parametrlarini to'ldiring va rasm yuklang
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
          {/* NOM / NAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Nomi (O'zbekcha) <span className="text-emerald-400">*</span>
              </label>
              <input
                name="name_uz"
                value={values.name_uz}
                onChange={handleChange}
                placeholder="Masalan: Quyosh paneli 550W Tier-1"
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.name_uz
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Nomi (Ruscha) <span className="text-emerald-400">*</span>
              </label>
              <input
                name="name_ru"
                value={values.name_ru}
                onChange={handleChange}
                placeholder="Например: Солнечная панель 550W"
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.name_ru
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                }`}
              />
            </div>
          </div>

          {/* TAVSIF / DESCRIPTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Tavsif (O'zbekcha) <span className="text-emerald-400">*</span>
              </label>
              <textarea
                rows={3}
                name="description_uz"
                value={values.description_uz}
                onChange={handleChange}
                placeholder="Mahsulot parametrlari, kafolat va xususiyatlari..."
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.description_uz
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Tavsif (Ruscha) <span className="text-emerald-400">*</span>
              </label>
              <textarea
                rows={3}
                name="description_ru"
                value={values.description_ru}
                onChange={handleChange}
                placeholder="Параметры, гарантия и характеристики..."
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.description_ru
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                }`}
              />
            </div>
          </div>

          {/* KATEGORIYA VA QUVVAT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Kategoriya <span className="text-emerald-400">*</span>
              </label>
              <PaginatedSelect<Category>
                value={category}
                onChange={(cat) => {
                  setCategory(cat);
                  setValues((prev) => ({ ...prev, category_id: String(cat.id) }));
                  setErrors((prev) => ({ ...prev, category_id: false }));
                }}
                endpoint="product-categories"
                labelKey="name_uz"
                placeholder="Kategoriyani tanlang..."
                className={errors.category_id ? "ring-1 ring-rose-500 rounded-xl" : ""}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  Quvvati <span className="text-emerald-400">*</span>
                </label>
                <div className="flex items-center gap-1 bg-[#152721] p-0.5 rounded-lg border border-white/5 text-[11px]">
                  <button
                    type="button"
                    onClick={() =>
                      setValues((p) => ({ ...p, units_of_measurement: "kilowatts" }))
                    }
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                      values.units_of_measurement === "kilowatts"
                        ? "bg-emerald-500 text-[#0b1411]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    kVt
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setValues((p) => ({ ...p, units_of_measurement: "watts" }))
                    }
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                      values.units_of_measurement === "watts"
                        ? "bg-emerald-500 text-[#0b1411]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Watt
                  </button>
                </div>
              </div>
              <input
                name="watt"
                type="number"
                value={values.watt}
                onChange={handleChange}
                placeholder={values.units_of_measurement === "kilowatts" ? "10" : "550"}
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.watt
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                }`}
              />
            </div>
          </div>

          {/* BREND, MODEL VA NARX */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Brend / Ishlab chiqaruvchi
              </label>
              <input
                name="brand"
                value={values.brand}
                onChange={handleChange}
                placeholder="Jinko, Longi, Deye..."
                className="w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Model kodi <span className="text-emerald-400">*</span>
              </label>
              <input
                name="model"
                value={values.model}
                onChange={handleChange}
                placeholder="JKM550M-72HL4"
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.model
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Narxi (so'm) <span className="text-emerald-400">*</span>
              </label>
              <input
                name="price"
                type="number"
                value={values.price}
                onChange={handleChange}
                placeholder="1500000"
                className={`w-full px-4 py-3 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.price
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                }`}
              />
            </div>
          </div>

          {/* SOLIQ VA E-TIJORAT KODLARI */}
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

          {/* RASMLAR YUKLASH */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                Mahsulot rasmlari <span className="text-emerald-400">*</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Birinchi rasm asosiy hisoblanadi (surib tartiblang)
              </span>
            </label>

            <label
              className={`w-full py-8 px-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all bg-[#152721]/50 hover:bg-[#152721] ${
                errors.images ? "border-rose-500" : "border-emerald-500/30 hover:border-emerald-500"
              }`}
            >
              <input
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              <MdCloudUpload className="text-4xl text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-white">
                Rasmlarni tanlang yoki bu yerga sudrab keltiring
              </p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Maksimal 10MB)</p>
            </label>

            {/* PREVIEWS */}
            {values.images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                {values.images.map((img, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border cursor-move group transition-all ${
                      i === 0
                        ? "border-emerald-400 ring-2 ring-emerald-500/40"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={img.preview}
                      alt="preview"
                      className="size-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500 text-[#0b1411]">
                        ASOSIY
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(img, i)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-rose-400 hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdDelete className="text-base" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAOL HOLAT (ACTIVE) */}
          <div className="p-4 rounded-xl bg-[#152721] border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Faol Holat (Katalogda ko'rinadi)</p>
              <p className="text-xs text-slate-400">
                O'chirilsa, mahsulot mijozlarga sotuvda ko'rinmaydi
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
            {loading ? "Saqlanmoqda..." : isEdit ? "O'zgarishlarni saqlash" : "Mahsulotni qo'shish"}
          </button>
        </div>
      </div>
    </BaseDrawer>
  );
};

export default ProductDrawer;
