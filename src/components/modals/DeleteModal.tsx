import { useState } from "react";
import { remove } from "../../api/api";
import { MdDelete, MdWarning } from "react-icons/md";
import { toast } from "sonner";

type Props = {
  itemId: string;
  path: string;
  confirm: () => void;
};

const DeleteModal = ({ itemId, path, confirm }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!itemId) return;
    setLoading(true);

    try {
      await remove(path, itemId);
      setOpen(false);
      confirm();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "O'chirishda xatolik yuz berdi";
      toast.error(`Xatolik: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="O'chirish"
        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
      >
        <MdDelete className="text-lg" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
          <div className="relative w-full max-w-md bg-[#12211c] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4 size-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <MdWarning className="text-3xl" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              O'chirishni tasdiqlaysizmi?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Ushbu ma'lumot tizimdan butunlay o'chiriladi. Ushbu amalni ortga qaytarib bo'lmaydi.
            </p>

            <div className="flex gap-3 w-full">
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-lg shadow-rose-600/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? "O'chirilmoqda..." : "Ha, o'chirilsin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
