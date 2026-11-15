import React, { useEffect, useMemo, useState } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";
import { MdClose } from "react-icons/md";
import { post, putData } from "../../api/api";
import DeleteModal from "../modals/DeleteModal";
import { toast } from "sonner";
import { Shield } from "lucide-react";

interface UserValues {
  id?: string;
  email: string;
  first_name: string;
  language: string;
  last_name: string;
  password?: string;
  phone: string;
}

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: UserValues | null;
  onSuccess: () => void;
}

const UserDrawer: React.FC<UserDrawerProps> = ({
  open,
  onClose,
  initialValues,
  onSuccess,
}) => {
  const isEdit = useMemo(() => !!initialValues?.id, [initialValues]);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<UserValues>({
    email: "",
    first_name: "",
    language: "uz",
    last_name: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      if (initialValues) {
        setValues({
          id: initialValues.id,
          email: initialValues.email || "",
          first_name: initialValues.first_name || "",
          language: initialValues.language || "uz",
          last_name: initialValues.last_name || "",
          password: "",
          phone: initialValues.phone || "",
        });
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

    if (!values.first_name.trim()) {
      newErrors.first_name = true;
      missing.push("Ism");
    }
    if (!values.last_name.trim()) {
      newErrors.last_name = true;
      missing.push("Familiya");
    }
    if (!values.phone.trim()) {
      newErrors.phone = true;
      missing.push("Telefon");
    }
    if (!values.email.trim()) {
      newErrors.email = true;
      missing.push("E-pochta");
    }
    if (!initialValues && (!values.password || values.password.length < 6)) {
      newErrors.password = true;
      missing.push("Parol (kamida 6 belgi)");
    }

    setErrors(newErrors);

    if (missing.length > 0) {
      toast.error(`Iltimos, maydonlarni to'ldiring: ${missing.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const payload: any = {
      ...values,
      id: initialValues?.id,
    };

    if (!values.password) {
      delete payload.password;
    }

    try {
      if (isEdit) {
        await putData(`/admin`, payload);
        toast.success("Admin ma'lumotlari yangilandi! 🎉");
      } else {
        await post("/admin", payload);
        toast.success("Yangi admin qo'shildi! 🚀");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Adminni saqlashda xatolik";
      toast.error(`Xatolik: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDrawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Adminni tahrirlash" : "Yangi Admin"}
      width={600}
    >
      <div className="flex flex-col h-full bg-[#0e1a15] text-slate-100 select-none">
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isEdit ? "Adminni tahrirlash" : "Yangi Administrator"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Boshqaruv paneli uchun yangi xodim yoki huquqlar
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Ism <span className="text-emerald-400">*</span>
              </label>
              <input
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                placeholder="Shahzodbek"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.first_name
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Familiya <span className="text-emerald-400">*</span>
              </label>
              <input
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                placeholder="Ro'zmetov"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                  errors.last_name
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-white/10 focus:border-emerald-500"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Telefon raqam <span className="text-emerald-400">*</span>
            </label>
            <input
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="998901234567"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                errors.phone
                  ? "border-rose-500 ring-1 ring-rose-500"
                  : "border-white/10 focus:border-emerald-500"
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              E-pochta manzil <span className="text-emerald-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="admin@sunenergy.uz"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                errors.email
                  ? "border-rose-500 ring-1 ring-rose-500"
                  : "border-white/10 focus:border-emerald-500"
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Parol {isEdit ? "(O'zgartirish kerak bo'lsa kiriting)" : <span className="text-emerald-400">*</span>}
            </label>
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border transition-all ${
                errors.password
                  ? "border-rose-500 ring-1 ring-rose-500"
                  : "border-white/10 focus:border-emerald-500"
              }`}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 px-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-3">
          {initialValues?.id ? (
            <DeleteModal
              itemId={initialValues.id}
              path="admin"
              confirm={() => {
                toast.success("Admin o'chirildi");
                onSuccess();
                onClose();
              }}
            />
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Saqlanmoqda..." : isEdit ? "Yangilash" : "Admin Qo'shish"}
            </button>
          </div>
        </div>
      </div>
    </BaseDrawer>
  );
};

export default UserDrawer;
