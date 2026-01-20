import { useEffect, useMemo, useState } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";
import {
  MdAddCircle,
  MdChevronLeft,
  MdClose,
  MdDelete,
  MdEdit,
  MdChevronRight as MdChevronRightIcon,
} from "react-icons/md";

export interface ProductFormValues {
  id?: string;
  name_uz: string;
  name_ru: string;
}

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: ProductFormValues | null;
  onSuccess: () => void;
}

const CategoryDrawer: React.FC<ProductDrawerProps> = ({
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
        });
      }
      setErrors({});
    }
  }, [open, initialValues]);

  /* INPUT CHANGE */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validate = () => {
    const newErrors: Record<string, boolean> = {};

    if (!values.name_uz.trim()) newErrors.name_uz = true;
    if (!values.name_ru.trim()) newErrors.name_ru = true;

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

  const categories = [
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
    { name_uz: "Nimadir", name_ru: "Nimadir" },
  ];

  return (
    <BaseDrawer
      open={open}
      onClose={() => {
        onClose();
        initialValues && onSuccess();
      }}
      title={isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}
      width={700}
    >
      <div className="flex items-start justify-between border-b border_color p-3">
        <div>
          <h2 className="text-2xl font-bold">
            {isEdit ? "Kategoryani yangilash" : "Kategorya qo'shish"}
          </h2>
          <p className="text-[#8fccba] text-sm mb-2">
            Mahsulotlarni turiga qarab ajratiladigan kategoriya nomi
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
      <div className="space-y-6 overflow-y-auto max-h-screen">
        {/* NAME */}
        <div className="flex justify-center not-md:flex-wrap gap-3 items-center rounded-lg bg_card p-6 ">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-medium">
              Kategoriya nomi (UZ) <span className="text-red-500">*</span>
            </label>
            <input
              name="name_uz"
              value={values.name_uz}
              onChange={handleChange}
              className={`form-input w-full h-12 rounded-xl bg_mode px-4 border ${
                errors.name_uz ? "border-red-500" : "border-[#306959]"
              }`}
              placeholder="Elektronika"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-medium">
              Kategoriya nomi (RU) <span className="text-red-500">*</span>
            </label>
            <input
              name="name_ru"
              value={values.name_ru}
              onChange={handleChange}
              className={`form-input w-full h-12 rounded-xl bg_mode px-4 border ${
                errors.name_ru ? "border-red-500" : "border-[#306959]"
              }`}
              placeholder="Электроника"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-full text-2xl bg-primary h-10 not-md:w-full p-2">
            <span className="md:hidden text-lg font-bold">Qo'shish</span>
            <MdAddCircle />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-6">
          {categories.length > 0 ? (
            categories.map((category) => {
              return (
                <div className="flex items-center justify-between w-full gap-4 border border_color p-2 px-5 rounded-lg bg_card">
                  <h2>{category.name_uz}</h2>
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 hover:text-orange-400 transition-colors text-slate-400">
                      <MdEdit className="text-[18px]" />
                    </button>
                    <button className="p-1.5 hover:text-red-500 transition-colors text-slate-400">
                      <MdDelete className="text-[18px]" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Kategoriyalar mavjud emas</p>
          )}
        </div>
        <div className="px-6 py-4 border-t border_color flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text_primary">
              Har bir sahifadagi qatorlar:
            </span>
            <select className="bg-transparent border-none text-xs font-bold bg_card focus:ring-0 p-0 pr-6">
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 transition-colors">
              <MdChevronLeft className="text-[20px]" />
            </button>
            <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-xs font-bold">
              1
            </button>
            <button className="size-8 flex items-center justify-center rounded-lg text_primary hover:bg-slate-800 transition-colors text-xs font-semibold">
              2
            </button>
            <button className="size-8 flex items-center justify-center rounded-lg text_primary hover:bg-slate-800 transition-colors text-xs font-semibold">
              3
            </button>
            <span className="px-2 text-slate-400 text-xs">...</span>
            <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 transition-colors">
              <MdChevronRightIcon className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </BaseDrawer>
  );
};

export default CategoryDrawer;
