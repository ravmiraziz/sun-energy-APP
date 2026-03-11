import { useEffect, useMemo, useState } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";
import { MdClose } from "react-icons/md";
import { PaginatedSelect } from "./PaginationSelect";
import { post, putData, remove } from "../../api/api";
import type { Product } from "../../pages/Products";

interface ProductImage {
  file?: File; // yangi yuklangan rasm
  id?: string; // backenddagi eski rasm
  preview: string; // ko‘rsatish uchun URL
}

export interface ProductFormValues {
  id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: number;
  category_id: string;
  watt: string;
  // new select value for unit of measurement (kVt or VT)
  units_of_measurement: string;
  brand: string;
  model: string;
  images: ProductImage[];
  is_active: boolean;
  ikpu_code: string;
  package_code: string;
  units: number;
  vat_percent: number;
}

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Product | null;
  onSuccess: () => void;
}
interface Category {
  id: number;
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

  /* FORM STATE */
  const [values, setValues] = useState<ProductFormValues>({
    name_uz: "",
    name_ru: "",
    description_uz: "",
    description_ru: "",
    price: 0,
    category_id: "",
    watt: "",
    units_of_measurement: "kVt",
    brand: "",
    model: "",
    images: [],
    is_active: true,
    ikpu_code: "",
    package_code: "",
    units: 0,
    vat_percent: 0,
  });

  /* ERROR STATE */
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [category, setCategory] = useState<Category | null>(null);

  /* RESET / EDIT */
  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      setValues({
        id: initialValues.id,
        name_uz: initialValues.name_uz,
        name_ru: initialValues.name_ru,
        description_uz: initialValues.description_uz,
        description_ru: initialValues.description_ru,
        price: Number(initialValues.price),
        category_id: String(initialValues.category_id),
        watt: String(initialValues.watt),
        units_of_measurement: initialValues.units_of_measurement || "kVt",
        brand: initialValues.brand,
        model: initialValues.model,
        is_active: initialValues.is_active,
        images: initialValues.images
          ? initialValues.images.map((img) => ({
              id: String(img.id),
              preview: img.image_url,
            }))
          : [],
        ikpu_code: initialValues.ikpu_code || "",
        package_code: initialValues.package_code || "",
        units: initialValues.units || 0,
        vat_percent: initialValues.vat_percent || 0,
      });
    } else {
      setValues({
        name_uz: "",
        name_ru: "",
        description_uz: "",
        description_ru: "",
        price: 0,
        category_id: "",
        watt: "",
        units_of_measurement: "kVt",
        brand: "",
        model: "",
        images: [],
        is_active: true,
        ikpu_code: "",
        package_code: "",
        units: 0,
        vat_percent: 0,
      });
    }

    setErrors({});
  }, [open, initialValues]);

  /* INPUT CHANGE */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  /* IMAGE UPLOAD */
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
  };

  /* REMOVE IMAGE */
  const removeImage = async (image: ProductImage, index: number) => {
    try {
      // faqat backenddagi rasm bo‘lsa
      if (image.id) {
        await remove("product-image", String(image.id));
        onSuccess();
      }

      setValues((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } catch (error) {
      return;
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
  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!values.name_uz.trim()) newErrors.name_uz = true;
    if (!values.name_ru.trim()) newErrors.name_ru = true;
    if (!values.description_uz.trim()) newErrors.description_uz = true;
    if (!values.description_ru.trim()) newErrors.description_ru = true;
    if (!category) newErrors.category_id = true;
    if (!values.model) newErrors.model = true;
    if (!values.watt) newErrors.watt = true;
    if (!values.units_of_measurement) newErrors.units_of_measurement = true;
    if (!values.price) newErrors.price = true;
    if (!values.ikpu_code) newErrors.ikpu_code = true;
    if (!values.package_code) newErrors.package_code = true;
    if (values.images.length === 0) newErrors.images = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const formData = new FormData();

      formData.append("name_uz", values.name_uz);
      formData.append("name_ru", values.name_ru);
      formData.append("description_uz", values.description_uz);
      formData.append("description_ru", values.description_ru);
      formData.append("price", String(values.price));
      formData.append("category_id", String(category?.id));
      formData.append("watt", values.watt);
      formData.append("units_of_measurement", values.units_of_measurement);
      formData.append("brand", values.brand);
      formData.append("model", values.model);
      formData.append("ikpu_code", values.ikpu_code);
      formData.append("package_code", values.package_code);
      formData.append("units", String(values.units));
      formData.append("vat_percent", String(values.vat_percent));

      // 🔥 boolean
      formData.append("is_active", values.is_active ? "1" : "0");

      // 🔥 images
      values.images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        }
      });

      if (isEdit) {
        formData.append("id", initialValues?.id || "");
        await putData(`/product`, formData);
      } else {
        await post("/product", formData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BaseDrawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}
      width={700}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between border-b border_color">
        <div>
          <h2 className="text-2xl font-bold">
            {isEdit ? "Mahsulotni yangilash" : "Yangi Mahsulot Qo'shish"}
          </h2>
          <p className="text-[#8fccba] text-sm mb-2">
            Yangi energiya aktivini ro'yxatlash uchun tafsilotlarni to'ldiring.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full "
        >
          <MdClose className="text-2xl" />
        </button>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-screen">
        {/* NAME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              Mahsulot nomi (UZ) <span className="text-red-500">*</span>
            </label>
            <input
              name="name_uz"
              value={values.name_uz}
              onChange={handleChange}
              className={`form-input w-full h-14 rounded-xl bg_card px-4 border ${
                errors.name_uz ? "border-red-500" : "border_color"
              }`}
              placeholder="ThinkPower 5 kVt inverter"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              Mahsulot nomi (RU) <span className="text-red-500">*</span>
            </label>
            <input
              name="name_ru"
              value={values.name_ru}
              onChange={handleChange}
              className={`form-input w-full h-14 rounded-xl bg_card px-4 border ${
                errors.name_ru ? "border-red-500" : "border_color"
              }`}
              placeholder="Инвертор ThinkPower 5 кВт"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            Mahsulotga tavsif (UZ) <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description_uz"
            value={values.description_uz}
            onChange={handleChange}
            className={`form-input w-full h-25 py-4 rounded-xl bg_card px-4 border ${
              errors.description_uz ? "border-red-500" : "border_color"
            }`}
            placeholder="Asosiy Texnik Ko‘rsatkichlar Nominal quvvat: 5000 Vt (5 kW) Maksimal chiqish quvvati: 5500 Vt AC chiqish kuchlanishi: 400 V (3 fazali) Chiqish chastotasi: 50/60 Hz Chiqish toki: 10 A Samaradorlik: Maksimal – 98.2%; Yevropa samaradorligi – 97.7% MPPT"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            Mahsulotga tavsif (RU) <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description_ru"
            value={values.description_ru}
            onChange={handleChange}
            className={`form-input w-full h-25 py-4 rounded-xl bg_card px-4 border ${
              errors.description_ru ? "border-red-500" : "border_color"
            }`}
            placeholder="Основные технические характеристики Номинальная мощность: 5000 Вт (5 кВт) Максимальная выходная мощность: 5500 Вт Выходное напряжение переменного тока: 400 В (3-фазное) Выходная частота: 50/60 Гц Выходной ток: 10 А"
          />
        </div>

        {/* CATEGORY + PRICE */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            Narx (UZS) <span className="text-red-500">*</span>
          </label>
          <input
            name="price"
            type="number"
            inputMode="numeric"
            value={values.price}
            onChange={handleChange}
            className={`h-14 rounded-xl bg_card px-4 border ${
              errors.price ? "border-red-500" : "border_color"
            }`}
            placeholder="0.00"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`flex flex-col border gap-2 ${errors.category_id ? "border-red-500" : "border-transparent"}`}
          >
            <label className="font-medium">
              Kategoriya <span className="text-red-500">*</span>
            </label>
            <PaginatedSelect<Category>
              value={category}
              onChange={(e) => setCategory(e)}
              endpoint="product-categories"
              labelKey="name_uz"
              placeholder="Kategoriyani tanlang"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">
              {values.units_of_measurement === "watts" ? "Brand" : "Panel turi"}
              <span className="text-red-500">*</span>
            </label>
            <input
              name="brand"
              type="text"
              value={values.brand}
              onChange={handleChange}
              className={`h-14 rounded-xl bg_card px-4 border ${
                errors.price ? "border-red-500" : "border_color"
              }`}
              placeholder="___"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              {values.units_of_measurement === "watts"
                ? "Model"
                : "Inverter turi"}
              <span className="text-red-500">*</span>
            </label>
            <input
              name="model"
              type="text"
              value={values.model}
              onChange={handleChange}
              className={`h-14 rounded-xl bg_card px-4 border ${
                errors.model ? "border-red-500" : "border_color"
              }`}
              placeholder="____"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              kVt <span className="text-red-500">*</span>
            </label>
            {/* input group with select appended */}
            <div className="flex items-center">
              <input
                name="watt"
                type="text"
                value={values.watt}
                onChange={handleChange}
                className={`flex-1 h-14 bg_card px-4 border-t border-b border-l ${
                  errors.watt ? "border-red-500" : "border_color"
                } rounded-l-xl`}
                placeholder="5000"
              />
              <select
                name="units_of_measurement"
                value={values.units_of_measurement}
                onChange={handleChange}
                className={`h-14 bg_card px-4 border-t border-b border-r ${
                  errors.units_of_measurement
                    ? "border-red-500"
                    : "border_color"
                } rounded-r-xl`}
              >
                <option value="kilowatts">kVt</option>
                <option value="watts">VT</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              МХИК коди: "00702001001000001"
              <span className="text-red-500">*</span>
            </label>
            <input
              name="ikpu_code"
              type="text"
              value={values.ikpu_code}
              onChange={handleChange}
              className={`h-14 rounded-xl bg_card px-4 border ${
                errors.ikpu_code ? "border-red-500" : "border_color"
              }`}
              placeholder="00101001001000000"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              Ўлчов бирлиги: "1837252"
              <span className="text-red-500">*</span>
            </label>
            <input
              name="package_code"
              type="text"
              value={values.package_code}
              onChange={handleChange}
              className={`h-14 rounded-xl bg_card px-4 border ${
                errors.package_code ? "border-red-500" : "border_color"
              }`}
              placeholder="123456"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Қадоқлар</label>
            <input
              name="units"
              type="number"
              value={values.units}
              onChange={handleChange}
              className={`h-14 rounded-xl bg_card px-4 border ${
                errors.units ? "border-red-500" : "border_color"
              }`}
              placeholder="1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">QQS (%)</label>
            <input
              name="vat_percent"
              type="number"
              value={values.vat_percent}
              onChange={handleChange}
              className={`h-14 rounded-xl bg_card px-4 border ${
                errors.vat_percent ? "border-red-500" : "border_color"
              }`}
              placeholder="12"
            />
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            Mahsulot rasmi <span className="text-red-500">*</span>
          </label>

          {(!initialValues || values?.images?.length <= 0) && (
            <label
              className={`w-full h-32 bg_card border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer ${
                errors.images ? "border-red-500" : "border_color"
              }`}
            >
              <input
                type="file"
                multiple
                hidden
                name="images"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              <span className="text-[#8fccba] p-5 text-center">
                Bo'lim ustiga bosing yoki faylni shu yurga surib olib keling
              </span>
            </label>
          )}

          {/* PREVIEW */}
          {values?.images?.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {values.images.map((img, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden border cursor-move
          ${i === 0 ? "border-primary ring-2 ring-primary" : "border_color"}`}
                >
                  <img
                    src={img.preview}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />

                  {/* MAIN badge */}
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-xs bg-primary text-black px-2 rounded">
                      MAIN
                    </span>
                  )}

                  {/* REMOVE */}
                  <button
                    type="button"
                    onClick={() => removeImage(img, i)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                  >
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {initialValues && (
          <div className="col-span-2 flex items-center justify-between p-4 bg_card rounded-xl border border-transparent">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Faol holat</span>
              <span className="text-xs text-slate-500 dark:text-[#8fccba]">
                Ushbu bo'lim mahsulot qolmaganida o'chirilishi kerak
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                name="is_active"
                checked={values.is_active}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
                className="sr-only peer"
                type="checkbox"
              />
              <div
                className={`w-11 h-6 ${values.is_active ? "bg-primary" : "card_btn"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary`}
              />
            </label>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/5 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="h-12 px-6 rounded-xl border border-white/20 text-white"
        >
          Qaytish
        </button>
        <button
          onClick={handleSubmit}
          className="h-12 px-6 rounded-xl bg-primary text-[#10221d] font-bold"
        >
          {isEdit ? "Yangilash" : "Mahsultni qo'shish"}
        </button>
      </div>
    </BaseDrawer>
  );
};

export default ProductDrawer;
