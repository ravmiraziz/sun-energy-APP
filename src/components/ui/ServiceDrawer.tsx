import { useEffect, useMemo, useState } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";
import { MdClose } from "react-icons/md";

export interface ServiceFormValues {
  id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: number;
  category_id: string;
  is_activate?: boolean;
}

interface ServiceDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: ServiceFormValues | null;
  onSuccess: () => void;
}

const ServiceDrawer: React.FC<ServiceDrawerProps> = ({
  open,
  onClose,
  initialValues,
  onSuccess,
}) => {
  const isEdit = useMemo(() => !!initialValues?.id, [initialValues]);

  /* FORM STATE */
  const [values, setValues] = useState<ServiceFormValues>({
    name_uz: "",
    name_ru: "",
    description_uz: "",
    description_ru: "",
    price: 0,
    category_id: "",
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

  /* VALIDATION */
  const validate = () => {
    const newErrors: Record<string, boolean> = {};

    if (!values.name_uz.trim()) newErrors.name_uz = true;
    if (!values.name_ru.trim()) newErrors.name_ru = true;
    if (!values.description_uz.trim()) newErrors.description_uz = true;
    if (!values.description_ru.trim()) newErrors.description_ru = true;
    if (!values.category_id) newErrors.category_id = true;
    if (!values.price) newErrors.price = true;

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
      title={isEdit ? "Servisni tahrirlash" : "Yangi Servis qo‘shish"}
      width={700}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between border-b border_color">
        <div>
          <h2 className="text-2xl font-bold">
            {isEdit ? "Servisni yangilash" : "Yangi Servis Qo'shish"}
          </h2>
          <p className="text-[#8fccba] text-sm mb-2">
            Yangi servislarni ro'yxatlash uchun tafsilotlarni to'ldiring.
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
              Servis nomi (UZ) <span className="text-red-500">*</span>
            </label>
            <input
              name="name_uz"
              value={values.name_uz}
              onChange={handleChange}
              className={`form-input w-full h-14 rounded-xl bg-[#18342c] px-4 border ${
                errors.name_uz ? "border-red-500" : "border-[#306959]"
              }`}
              placeholder="Panelni Tozalash"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              Servis nomi (RU) <span className="text-red-500">*</span>
            </label>
            <input
              name="name_ru"
              value={values.name_ru}
              onChange={handleChange}
              className={`form-input w-full h-14 rounded-xl bg-[#18342c] px-4 border ${
                errors.name_ru ? "border-red-500" : "border-[#306959]"
              }`}
              placeholder="Очистка панели"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            Servisga tavsif (UZ) <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description_uz"
            value={values.description_uz}
            onChange={handleChange}
            className={`form-input w-full h-25 py-4 rounded-xl bg-[#18342c] px-4 border ${
              errors.description_uz ? "border-red-500" : "border-[#306959]"
            }`}
            placeholder="Quyosh panellari quyosh nuri ko'p bo'lganda yaxshi ishlaydi. Chang, gulchang, barglar yoki qushlarning axlati quyosh nurini to'sib qo'yishi va panellaringizni kamroq samarali qilishi mumkin. Hatto kichik miqdordagi axloqsizlik ham tizimingiz ishlab chiqaradigan..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            Servisga tavsif (RU) <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description_ru"
            value={values.description_ru}
            onChange={handleChange}
            className={`form-input w-full h-25 py-4 rounded-xl bg-[#18342c] px-4 border ${
              errors.description_ru ? "border-red-500" : "border-[#306959]"
            }`}
            placeholder="Солнечные панели работают наиболее эффективно при достаточном количестве солнечного света. Пыль, пыльца, листья или птичий помет могут блокировать солнечный свет и снижать эффективность панелей. Даже небольшое количество..."
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
          {isEdit ? "Yangilash" : "Servis qo'shish"}
        </button>
      </div>
    </BaseDrawer>
  );
};

export default ServiceDrawer;
