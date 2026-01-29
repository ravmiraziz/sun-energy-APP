import { useState } from "react";
import { remove } from "../../api/api";
import { MdDelete, MdWarning } from "react-icons/md";

type Props = {
  itemId: string;
  path: string;
  confirm: () => void;
};

const DeleteModal = ({ itemId, path, confirm }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await remove(path, itemId);
      close();
      confirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 hover:text-red-500 transition-colors text-slate-400"
      >
        <MdDelete className="text-[18px]" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px]">
          <div className="relative w-full max-w-md bg_card rounded-[20px] p-8 modal-glow flex flex-col items-center text-center">
            <div className="mb-6 size-16 rounded-full bg-red-500/50 flex items-center justify-center">
              <MdWarning className="text-red-500 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              O'chirishni tasdiqlaysizmi?
            </h3>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Rostan ham ushbu ma'lumotni o'chirmoqchimisiz? Elsatma ushbu
              ma'lumot to'liq o'chirib yuboriladi
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                disabled={loading}
                onClick={() => setOpen(false)}
                className="flex-1 px-6 py-3.5 rounded-xl card_btn font-semibold hover:bg-white/5 transition-all text-sm"
              >
                Bekor qilish
              </button>
              <button
                disabled={loading}
                onClick={handleDelete}
                className={`flex-1 px-6 py-3.5 rounded-xl bg-red-600 ${loading && "opacity-30"} text-white font-bold transition-all text-sm shadow-lg shadow-red-900/20`}
              >
                {loading ? "...." : "O'chirib tashlash"}
              </button>
            </div>
            <div className="absolute inset-0 rounded-[20px] pointer-events-none border border-white/10 opacity-50"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteModal;
