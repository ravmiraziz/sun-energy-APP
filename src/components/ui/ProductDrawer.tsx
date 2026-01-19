import { useEffect, useMemo, useState } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";
import { MdClose } from "react-icons/md";

export interface ProductFormValues {
  id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: number;
  category_id: string;
  watt: string;
  brand: string;
  model: string;
  images: File[];
  is_active?: string;
}

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: ProductFormValues | null;
  onSuccess: () => void;
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
    brand: "",
    images: [],
    model: "",
  });

  /* ERROR STATE */
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  /* RESET / EDIT */
  useEffect(() => {
    if (open) {
      if (initialValues) {
        setValues(initialValues);
      } else {
        setValues({
          name_uz: "",
          name_ru: "",
          description_uz: "",
          description_ru: "",
          price: 0,
          category_id: "",
          watt: "",
          brand: "",
          images: [],
          model: "",
        });
      }
      setErrors({});
    }
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

    const fileArray = Array.from(files);

    setValues((prev) => ({
      ...prev,
      images: [...prev.images, ...fileArray],
    }));

    setErrors((prev) => ({ ...prev, images: false }));
  };

  /* REMOVE IMAGE */
  const removeImage = (index: number) => {
    setValues((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /* VALIDATION */
  const validate = () => {
    const newErrors: Record<string, boolean> = {};

    if (!values.name_uz.trim()) newErrors.name_uz = true;
    if (!values.name_ru.trim()) newErrors.name_ru = true;
    if (!values.description_uz.trim()) newErrors.description_uz = true;
    if (!values.description_ru.trim()) newErrors.description_ru = true;
    if (!values.category_id) newErrors.category_id = true;
    if (!values.model) newErrors.model = true;
    if (!values.watt) newErrors.watt = true;
    if (!values.price) newErrors.price = true;
    if (values.images.length === 0) newErrors.images = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...values,
      id: initialValues?.id,
    };

    if (isEdit) {
      console.log("UPDATE PRODUCT:", payload);
    } else {
      console.log("CREATE PRODUCT:", payload);
    }

    onSuccess();
    onClose();
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
              className={`form-input w-full h-14 rounded-xl bg-[#18342c] px-4 border ${
                errors.name_uz ? "border-red-500" : "border-[#306959]"
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
              className={`form-input w-full h-14 rounded-xl bg-[#18342c] px-4 border ${
                errors.name_ru ? "border-red-500" : "border-[#306959]"
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
            className={`form-input w-full h-25 py-4 rounded-xl bg-[#18342c] px-4 border ${
              errors.description_uz ? "border-red-500" : "border-[#306959]"
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
            className={`form-input w-full h-25 py-4 rounded-xl bg-[#18342c] px-4 border ${
              errors.description_ru ? "border-red-500" : "border-[#306959]"
            }`}
            placeholder="Основные технические характеристики Номинальная мощность: 5000 Вт (5 кВт) Максимальная выходная мощность: 5500 Вт Выходное напряжение переменного тока: 400 В (3-фазное) Выходная частота: 50/60 Гц Выходной ток: 10 А"
          />
        </div>

        {/* CATEGORY + PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              Kategoriya <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={values.category_id}
              onChange={handleChange}
              className={`h-14 rounded-xl bg-[#18342c] px-4 border ${
                errors.category_id ? "border-red-500" : "border-[#306959]"
              }`}
            >
              <option value="">Turini tanlang</option>
              <option value="solar">Solar</option>
              <option value="wind">Wind</option>
              <option value="battery">Battery</option>
            </select>
          </div>

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
              className={`h-14 rounded-xl bg-[#18342c] px-4 border ${
                errors.price ? "border-red-500" : "border-[#306959]"
              }`}
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              Madeli <span className="text-red-500">*</span>
            </label>
            <input
              name="model"
              type="text"
              value={values.model}
              onChange={handleChange}
              className={`h-14 rounded-xl bg-[#18342c] px-4 border ${
                errors.model ? "border-red-500" : "border-[#306959]"
              }`}
              placeholder="004030-3"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              WATT <span className="text-red-500">*</span>
            </label>
            <input
              name="watt"
              type="number"
              min={0}
              inputMode="numeric"
              value={values.watt}
              onChange={handleChange}
              className={`h-14 rounded-xl bg-[#18342c] px-4 border ${
                errors.watt ? "border-red-500" : "border-[#306959]"
              }`}
              placeholder="5000"
            />
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            Mahsulot rasmi <span className="text-red-500">*</span>
          </label>

          <label
            className={`w-full h-32 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer ${
              errors.images ? "border-red-500" : "border-[#306959]"
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

          {/* PREVIEW */}
          {values.images.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {values.images.map((file, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-lg overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full"
                  >
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
