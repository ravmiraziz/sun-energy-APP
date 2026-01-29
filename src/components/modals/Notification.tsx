import { useState } from "react";
import { MdCampaign, MdClose } from "react-icons/md";
import { post } from "../../api/api";

interface Props {
  close: () => void;
}

const Notification = ({ close }: Props) => {
  const [form, setForm] = useState({
    title_uz: "",
    description_uz: "",
    title_ru: "",
    description_ru: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    return Object.values(form).every((v) => v.trim() !== "");
  };

  const submit = async () => {
    if (!validate()) {
      setError("Barcha maydonlar majburiy!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await post("notification", form);
      alert("Bildirishnoma yuborildi!");
      close();
    } catch (e) {
      setError("Xatolik yuz berdi, qayta urinib ko'ring");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg_card w-full max-w-2xl rounded-xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <MdCampaign className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Yangi bildirishnoma</h2>
              <p className="text-xs text-slate-400 mt-1">
                Barcha foydalanuvchilar uchun bildirishnoma
              </p>
            </div>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* UZ */}
          <div className="flex flex-col gap-3 justify-center items-start">
            <span className="card_btn text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              UZ
            </span>

            <input
              name="title_uz"
              value={form.title_uz}
              onChange={onChange}
              placeholder="Sarlavha (UZ)"
              className="w-full card_btn rounded-xl px-4 py-3 text-sm"
            />

            <textarea
              name="description_uz"
              value={form.description_uz}
              onChange={onChange}
              placeholder="Tavsif (UZ)"
              rows={3}
              className="w-full card_btn rounded-xl px-4 py-3 text-sm resize-none"
            />
          </div>

          {/* RU */}
          <div className="flex flex-col gap-3 justify-center items-start">
            <span className="card_btn text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              RU
            </span>

            <input
              name="title_ru"
              value={form.title_ru}
              onChange={onChange}
              placeholder="Заголовок (RU)"
              className="w-full card_btn rounded-xl px-4 py-3 text-sm"
            />

            <textarea
              name="description_ru"
              value={form.description_ru}
              onChange={onChange}
              placeholder="Описание (RU)"
              rows={3}
              className="w-full card_btn rounded-xl px-4 py-3 text-sm resize-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={close}
            className="px-6 py-2.5 rounded-xl text-sm text-slate-400 hover:card_btn"
          >
            Bekor qilish
          </button>

          <button
            disabled={loading}
            onClick={submit}
            className="bg-primary px-8 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
          >
            {loading ? "Yuborilmoqda..." : "Yuborish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
