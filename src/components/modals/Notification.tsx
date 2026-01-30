import { useEffect, useState } from "react";
import { MdCampaign, MdClear, MdClose, MdEdit } from "react-icons/md";
import { get, post, putData } from "../../api/api";
import DeleteModal from "./DeleteModal";
import Pagination from "../ui/Pagination";

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
  const [error, setError] = useState("");

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
      setTotalCount(data.count);
      setPage(p);
    } catch (error) {
      console.log();
    }
  };

  useEffect(() => {
    fetchData();
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
      setError("Barcha maydonlar majburiy!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (update) {
        await putData("notification", { ...form, id: update?.id });
      } else {
        await post("notification", form);
        alert("Bildirishnoma yuborildi!");
      }
      clear();
      fetchData();
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
            <div className="flex items-center justify-between w-full">
              <span className="card_btn text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                UZ
              </span>
              {update && (
                <button onClick={clear} className="bg-primary px-1 rounded-lg">
                  <MdClear />
                </button>
              )}
            </div>

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

          <div className="text-[10px] flex items-center justify-between p-2 font-bold text-slate-400 uppercase tracking-widest mb-1">
            <p>Yuborilaganlar</p>{" "}
            <p>
              Jami:
              <span className="text-yellow-500"> {totalCount} </span> ta
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {notifications.length > 0 &&
              notifications.map((item) => {
                return (
                  <div
                    key={item?.id}
                    className="flex items-center justify-between p-3 bg_card border border_color rounded-xl hover:border-slate-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">
                          {item.title_uz}
                        </span>
                        <span className="text-[11px] text_primary">
                          {item.description_uz}
                        </span>
                        <span className="text-[11px] card_text">
                          {new Date(item.created_at).toLocaleDateString()}
                          {" | "}
                          {new Date(item.created_at).toLocaleTimeString()}
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
                        <MdEdit />
                      </button>
                      <DeleteModal
                        itemId={item?.id || ""}
                        path={`notification`}
                        confirm={() => fetchData()}
                      />
                    </div>
                  </div>
                );
              })}
            <div className="px-6 py-4 card_btn border-t border_color flex justify-end items-center">
              <Pagination
                page={page}
                limit={limit}
                allCount={totalCount}
                onChange={(p) => fetchData(p)}
              />
            </div>
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
