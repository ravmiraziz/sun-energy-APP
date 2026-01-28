import { useEffect, useMemo, useState } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";
import { MdClose } from "react-icons/md";
import { post, putData } from "../../api/api";

interface UserValues {
  id?: string;
  email: string;
  first_name: string;
  language: string;
  last_name: string;
  password?: string;
  phone: string;
}

interface userDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: UserValues | null;
  onSuccess: () => void;
}

const UserDrawer: React.FC<userDrawerProps> = ({
  open,
  onClose,
  initialValues,
  onSuccess,
}) => {
  const isEdit = useMemo(() => !!initialValues?.id, [initialValues]);

  /* FORM STATE */
  const [values, setValues] = useState<UserValues>({
    email: "",
    first_name: "",
    language: "uz",
    last_name: "",
    password: "",
    phone: "",
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
          email: "",
          first_name: "",
          language: "uz",
          last_name: "",
          password: "",
          phone: "",
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

    if (!values.email.trim()) newErrors.email = true;
    if (!values.first_name.trim()) newErrors.first_name = true;
    if (!values.language.trim()) newErrors.language = true;
    if (!values.last_name.trim()) newErrors.last_name = true;
    if (!values.password?.trim() && !initialValues) newErrors.password = true;
    if (!values.phone.trim()) newErrors.phone = true;

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

    if (!values.password) {
      delete values.password;
    }

    if (isEdit) {
      await putData(`/admin`, payload);
    } else {
      await post("/admin", payload);
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
            {isEdit ? "Ma'lumotlarni yangilash" : "Yangi Admin Qo'shish"}
          </h2>
          <p className="text-[#8fccba] text-sm mb-2">
            Yangi Admin uchun tafsilotlarni to'ldiring.
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
              Ism <span className="text-red-500">*</span>
            </label>
            <input
              name="first_name"
              value={values.first_name}
              onChange={handleChange}
              className={`form-input w-full h-14 rounded-xl bg-[#18342c] px-4 border ${
                errors.first_name ? "border-red-500" : "border-[#306959]"
              }`}
              placeholder="Ibodulla"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">
              Familiya <span className="text-red-500">*</span>
            </label>
            <input
              name="last_name"
              value={values.last_name}
              onChange={handleChange}
              className={`form-input w-full h-14 rounded-xl bg-[#18342c] px-4 border ${
                errors.last_name ? "border-red-500" : "border-[#306959]"
              }`}
              placeholder="Jumaniyozov"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            Telefon raqam <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            value={values.phone}
            onChange={handleChange}
            className={`form-input w-full h-14 rounded-xl bg-[#18342c] px-4 border ${
              errors.phone ? "border-red-500" : "border-[#306959]"
            }`}
            placeholder="998 __   ___ __ __"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            E-pochta manzil <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            className={`form-input w-full h-14 rounded-xl bg-[#18342c] px-4 border ${
              errors.email ? "border-red-500" : "border-[#306959]"
            }`}
            placeholder="example@gmail.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            Parol <span className="text-red-500">*</span>
          </label>
          <input
            name="password"
            value={values.password}
            onChange={handleChange}
            className={`form-input w-full h-14 rounded-xl bg-[#18342c] px-4 border ${
              errors.password ? "border-red-500" : "border-[#306959]"
            }`}
            placeholder="***********"
          />
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
          {isEdit ? "Admin Ma'lumotini Yangilash" : "Admin Qo'shish"}
        </button>
      </div>
    </BaseDrawer>
  );
};

export default UserDrawer;
