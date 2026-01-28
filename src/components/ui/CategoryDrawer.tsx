import { useEffect, useState } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";
import { MdAddCircleOutline, MdClose, MdDelete, MdEdit } from "react-icons/md";
import Pagination from "./Pagination";
import { post, putData } from "../../api/api";
import { GrClearOption } from "react-icons/gr";

export interface ProductFormValues {
  id?: string;
  name_uz: string;
  name_ru: string;
  icon_name?: string;
}

interface updateItem {
  id?: string;
  name_uz: string;
  name_ru: string;
  icon_name?: string;
  created_at?: string;
}

interface ProductDrawerProps {
  type?: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (p?: number) => void;
  initialValues: updateItem[];
  page: number;
  limit: number;
  totalCount: number;
}

const CategoryDrawer: React.FC<ProductDrawerProps> = ({
  type,
  open,
  page,
  limit,
  totalCount,
  onClose,
  initialValues,
  onSuccess,
}) => {
  const [update, setUpdate] = useState<updateItem | null>(null);

  /* FORM STATE */
  const [values, setValues] = useState<ProductFormValues>({
    name_uz: "",
    name_ru: "",
    icon_name: "bolt",
  });

  /* ERROR STATE */
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  /* INPUT CHANGE */
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
    });
  };

  const validate = () => {
    const newErrors: Record<string, boolean> = {};

    if (!values.name_uz.trim()) newErrors.name_uz = true;
    if (!values.name_ru.trim()) newErrors.name_ru = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRadioChange = (value: string) => {
    setValues((prev) => ({
      ...prev,
      icon_name: value,
    }));
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...values,
      id: update?.id,
    };

    if (update) {
      await putData(`${type}-category`, payload);
    } else {
      await post(`${type}-category`, payload);
    }

    onSuccess();
    clear();
  };

  useEffect(() => {
    if (update) {
      setValues({
        name_ru: update.name_ru,
        name_uz: update.name_uz,
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
        initialValues && onSuccess();
      }}
      title={update ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}
      width={600}
    >
      <div className="flex flex-col">
        <div className="p-6 border-b border_color">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white">
              Category Management
            </h3>
            <button
              onClick={onClose}
              className="card_text hover:text-white transition-colors"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>
          <p className="card_text text-xs">
            Organize your products and services into distinct categories.
          </p>
        </div>
        <div className="p-6 space-y-5 border-b border_color">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text_primary">
                Nomi (uz)
              </label>
              <input
                name="name_uz"
                value={values.name_uz}
                onChange={handleChange}
                className={`w-full bg_card border rounded-lg px-4 ${errors.name_uz ? "border-red-500" : "border_color"} py-2.5 text-sm outline-none transition-all placeholder:text-slate-600`}
                placeholder="e.g. Solar Panels"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text_primary">
                Nomi (ru)
              </label>
              <input
                name="name_ru"
                value={values.name_ru}
                onChange={handleChange}
                className={`w-full bg_card border rounded-lg px-4 ${errors.name_ru ? "border-red-500" : "border_color"} py-2.5 text-sm outline-none transition-all placeholder:text-slate-600`}
                placeholder="e.g. residential-energy"
                type="text"
              />
            </div>
          </div>
          {type === "service" && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text_primary">
                Category Icon / Type
              </label>

              <div className="flex items-center justify-between bg_card p-2 rounded-lg border border_color">
                {CATEGORY_ICONS.map((icon) => (
                  <label
                    key={icon}
                    className="w-full flex items-center justify-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="categoryType"
                      value={icon}
                      checked={values.icon_name === icon}
                      onChange={() => handleRadioChange(icon)}
                      className="sr-only peer"
                    />

                    <div
                      className={`
                        size-9 rounded-md flex items-center justify-center border transition-all",
                        ${
                          values.icon_name === icon
                            ? "border-(--primary) bg-(--primary)/10 text-(--primary)"
                            : "border-transparent card_text"
                        }
                      `}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {icon}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              className="w-full bg-primary hover:brightness-110 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <MdAddCircleOutline className="text-2xl" />
              {update ? "O'zgartirish" : "Qo'shish"}
            </button>
            {update && (
              <button
                type="button"
                onClick={clear}
                className="w-1/4 bg-primary hover:brightness-110 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <GrClearOption className="text-2xl" />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text_primary">
              Mavjud Kategoriyalar
            </h4>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded card_text font-medium uppercase">
              Jami: {totalCount || 0}
            </span>
          </div>
          <div className="space-y-3">
            {initialValues.length > 0 ? (
              initialValues.map((item) => {
                return (
                  <div
                    key={item?.id}
                    className="flex items-center justify-between p-3 bg_card border border_color rounded-xl hover:border-slate-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {type === "service" && (
                        <div className="size-10 bg-slate-800/50 rounded-lg flex items-center justify-center text-(--primary)">
                          <span className="material-symbols-outlined text-xl">
                            {item.icon_name}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">
                          {item.name_uz}
                        </span>
                        <span className="text-[11px] text_primary">
                          {item.name_ru}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setUpdate(item);
                        }}
                        className="p-2 card_text hover:text-white hover:bg-slate-800 rounded-md transition-all"
                      >
                        <MdEdit className="text-2xl" />
                      </button>
                      <button className="p-2 card_text hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all">
                        <MdDelete className="text-2xl" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 bg_card border-t border_color text-center">
                <span className="text-[10px] card_text font-medium uppercase tracking-widest">
                  Qo'shilgan kategoryilar mavjud emas
                </span>
              </div>
            )}
          </div>
        </div>
        <div>
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
