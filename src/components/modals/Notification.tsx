import { useEffect, useState } from "react";
import { MdClear, MdClose, MdEdit } from "react-icons/md";
import { get, post, putData } from "../../api/api";
import DeleteModal from "./DeleteModal";
import { toast } from "sonner";
import { Smartphone, Bell } from "lucide-react";

interface Props {
  close: () => void;
}

interface NotData {
  created_at: string;
  deleted_at: string;
  description_ru: string;
  description_uz: string;
  id: string;
  title_ru: string;
  title_uz: string;
}

interface ResData {
  data: {
    notifications: NotData[];
    count: number;
  };
}

const Notification = ({ close }: Props) => {
  const [form, setForm] = useState({
    title_uz: "",
    description_uz: "",
    title_ru: "",
    description_ru: "",
  });

  const [notifications, setNotifications] = useState<NotData[]>([]);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState<NotData | null>(null);
  const [currentVersion, setCurrentVersion] = useState("");
  const [versionRequired, setVersionRequired] = useState(false);

  const clear = () => {
    setUpdate(null);
    setForm({
      title_uz: "",
      description_uz: "",
      title_ru: "",
      description_ru: "",
    });
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchData = async (p = page) => {
    try {
      const { data }: ResData = await get("notifications", { page: p, limit });
      setNotifications(data.notifications || []);
      setTotalCount(data.count || 0);
      setPage(p);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVersion = async () => {
    try {
      const { data }: { data: { version_name: string; is_required: boolean } } =
        await get("version");
      if (data) {
        setCurrentVersion(data.version_name || "");
        setVersionRequired(Boolean(data.is_required));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateVersion = async () => {
    try {
      await post("version", {
        version_name: currentVersion,
        is_required: versionRequired,
      });
      toast.success("Ilova versiyasi yangilandi! 🎉");
      fetchVersion();
    } catch (error) {
      toast.error("Versiyani yangilashda xatolik");
    }
  };

  useEffect(() => {
    fetchData();
    fetchVersion();
  }, []);

  useEffect(() => {
    if (update) {
      setForm(update);
    }
  }, [update]);

  const validate = () => {
    return Object.values(form).every((v) => v.trim() !== "");
  };

  const submit = async () => {
    if (!validate()) {
      toast.error("Barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);

    try {
      if (update) {
        await putData("notification", { ...form, id: update?.id });
        toast.success("Bildirishnoma yangilandi! 🎉");
      } else {
        await post("notification", form);
        toast.success("Bildirishnoma muvaffaqiyatli yuborildi! 🚀");
      }
      clear();
      fetchData();
    } catch (e: any) {
      toast.error("Bildirishnoma yuborishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-2xl bg-[#12211c] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bell className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Bildirishnomalar Markazi</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Barcha foydalanuvchilar telefoniga push-xabar yuborish
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* VERSION SETTINGS */}
        <div className="p-4 rounded-2xl bg-[#152721] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Smartphone className="size-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-white">Ilova versiyasi</p>
              <p className="text-[11px] text-slate-400">Majburiy yangilanish sozlamasi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={currentVersion}
              onChange={(e) => setCurrentVersion(e.target.value)}
              placeholder="1.0.0"
              className="w-24 px-3 py-1.5 rounded-lg bg-[#0e1a15] border border-white/10 text-xs text-white"
            />
            <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={versionRequired}
                onChange={(e) => setVersionRequired(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              Majburiy
            </label>
            <button
              onClick={updateVersion}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-[#0b1411] font-bold text-xs hover:bg-emerald-600 transition-colors"
            >
              Saqlash
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {update ? "Bildirishnomani Tahrirlash" : "Yangi Xabar Yozish"}
            </span>
            {update && (
              <button
                onClick={clear}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <MdClear /> Bekor qilish
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase">
                O'zbekcha
              </span>
              <input
                name="title_uz"
                value={form.title_uz}
                onChange={onChange}
                placeholder="Sarlavha (UZ)"
                className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
              />
              <textarea
                rows={3}
                name="description_uz"
                value={form.description_uz}
                onChange={onChange}
                placeholder="Xabar matni (UZ)..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase">
                Ruscha
              </span>
              <input
                name="title_ru"
                value={form.title_ru}
                onChange={onChange}
                placeholder="Заголовок (RU)"
                className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500"
              />
              <textarea
                rows={3}
                name="description_ru"
                value={form.description_ru}
                onChange={onChange}
                placeholder="Текст уведомления (RU)..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#152721] text-sm text-white border border-white/10 focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              disabled={loading}
              onClick={submit}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0b1411] font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Yuborilmoqda..." : update ? "O'zgartirish" : "Yuborish"}
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS HISTORY */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Yuborilgan Bildirishnomalar
            </span>
            <span className="text-xs text-amber-400 font-bold">
              Jami: {totalCount} ta
            </span>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#152721] border border-white/5 flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">
                      {item.title_uz}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">
                      {item.description_uz}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      {new Date(item.created_at).toLocaleDateString()}{" "}
                      {new Date(item.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setUpdate(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400"
                    >
                      <MdEdit className="text-base" />
                    </button>
                    <DeleteModal
                      itemId={item.id}
                      path="notification"
                      confirm={() => {
                        toast.success("Bildirishnoma o'chirildi");
                        fetchData();
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 text-xs py-4">
                Hozircha bildirishnomalar mavjud emas
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
