import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MdPalette,
  MdAccountCircle,
  MdPhotoCamera,
  MdSecurity,
  MdBuild,
  MdShoppingCart,
  MdPersonAdd,
  MdEdit,
} from "react-icons/md";

import { useAuth, type User } from "../context/AuthContext";
import { IoLogOut } from "react-icons/io5";
import CategoryDrawer from "../components/ui/CategoryDrawer";
import { get, patch, putData } from "../api/api";
import UserDrawer from "../components/ui/UserDrawer";
import DeleteModal from "../components/modals/DeleteModal";
import Announcement from "../components/ui/Announcement";

interface AdminData {
  created_at: string;
  email: string;
  first_name: string;
  id: string;
  image_url: string;
  language: string;
  last_name: string;
  phone: string;
}

export interface AnnouncementData {
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: number;
}

export interface CategoryData {
  id?: string;
  name_uz: string;
  name_ru: string;
  icon_name?: string;
  created_at?: string;
}

interface UserForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password?: string;
  password_confirm?: string;
}

interface ResData {
  data: {
    admins: User[];
    count: number;
  };
}

interface CatRes {
  data: {
    product_categories?: CategoryData[];
    count: number;
  };
}

interface SerRes {
  data: {
    service_categories?: CategoryData[];
    count: number;
  };
}

type UserFormKey = keyof UserForm;

const Settings: React.FC = () => {
  const { user, logout, getUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("product");
  const [openUser, setOpenUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminData | null>(null);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalCountService, setTotalCountService] = useState<number>(0);
  const [totalCountUser, setTotalCountUser] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [services, setServises] = useState<CategoryData[]>([]);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchedOnce = useRef(false); // 🔥 MAGIC
  const fetchedOnceUser = useRef(false);
  const initialFromUser = (user: any): UserForm => ({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [form, setForm] = useState<UserForm>(() => initialFromUser(user));

  const [initialForm, setInitialForm] = useState<UserForm>(() =>
    initialFromUser(user),
  );

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const mapped = initialFromUser(user);
      setForm(mapped);
      setInitialForm(mapped);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isChanged = useMemo(() => {
    return (
      form.first_name !== initialForm.first_name ||
      form.last_name !== initialForm.last_name ||
      form.email !== initialForm.email ||
      form.phone !== initialForm.phone ||
      form.password
    );
  }, [form, initialForm]);

  const updateUser = async () => {
    setError(null);

    if (form.password && form.password !== form.password_confirm) {
      setError("Parollar mos emas");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        id: user?.id,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        language: user?.language,
        phone: form.phone,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await putData(`admin`, payload);

      getUser(user?.id || "");
    } catch (err) {
      setError("Ma'lumotlarni yangilashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const fields: {
    label: string;
    name: UserFormKey;
    type: string;
  }[] = [
    { label: "Ism", name: "first_name", type: "text" },
    { label: "Familiya", name: "last_name", type: "text" },
    { label: "E-pochta manzil", name: "email", type: "email" },
    { label: "Telefon raqam", name: "phone", type: "text" },
    { label: "Yangi Parol", name: "password", type: "password" },
    {
      label: "Parolni tasdiqlash",
      name: "password_confirm",
      type: "password",
    },
  ];

  const cancelChanges = () => {
    setForm(initialForm);
    setError(null);
  };

  const fetchCategories = async (p = page) => {
    setLoading(true);
    try {
      const { data }: CatRes = await get("product-categories", { page, limit });

      const { data: services }: SerRes = await get("service-categories", {
        page,
        limit,
      });
      setCategories(data.product_categories || []);
      setTotalCount(data.count || 0);
      setServises(services.service_categories || []);
      setTotalCountService(services?.count || 0);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, [selected]);

  const fetchUser = async (p = page) => {
    setLoading(true);
    try {
      const { data }: ResData = await get("admins", { page: p, limit });
      setAdmins(data.admins || []);
      setTotalCountUser(data.count || 0);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      await patch(`admin/${user?.id}`, formData);
      getUser(user?.id || "");
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;

    fetchedOnce.current = true;
    fetchCategories();
  }, []);

  useEffect(() => {
    if (fetchedOnceUser.current) return;

    fetchedOnceUser.current = true;
    fetchUser();
  }, []);

  return (
    <div className="p-8 max-w-400 mx-auto w-full space-y-12">
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            Admin Sozlamalari
          </h2>
          <p className="card_text text_primary text-base">
            Profilingiz, ruxsatnomalaringiz va tizim sozlamalaringizni
            boshqaring.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={logout}
            className="px-6 py-2.5 bg-red-500 rounded-xl flex items-center justify-center gap-2 font-bold text-sm hover:opacity-90 transition-all"
          >
            Chiqish <IoLogOut className="text-[20px]" />
          </button>
          <button
            onClick={() => setOpenUser(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background-dark rounded-xl font-bold text-sm tracking-tight hover:brightness-110 shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02]"
          >
            <MdPersonAdd className="text-[24px]" />
            Admin qo'shish
          </button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <MdPalette className="text-primary text-[24px]" />
          <h3 className="text-xl font-bold">Servis & Mahsulotlar</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              key: "service",
              label: "Servis turlari",
              desc: "Servis kategoriya turlari bo'limi",
              icon: MdBuild,
            },
            {
              key: "product",
              label: "Mahsulot turlari",
              desc: "Mahsulotlar kategoriyasi sozlamalari",
              icon: MdShoppingCart,
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => {
                setOpen(true);
                setSelected(item.key);
              }}
              className="flex items-center justify-between p-6 rounded-2xl border border_color bg_card shadow-sm cursor-pointer hover:opacity-70"
            >
              <div className="flex flex-col gap-1">
                <p className="font-bold">{item.label}</p>
                <p className="text-xs card_text">{item.desc}</p>
              </div>
              <item.icon
                className={`text-3xl ${i === 1 ? "text-orange-400" : "text-blue-400"}`}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Announcement mode="create" type="service" />
          <Announcement mode="create" type="product" />

          {/* <div className="relative bg-primary rounded-3xl p-6 shadow-xl shadow-primary/10 overflow-hidden h-full">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-black/10 backdrop-blur-md">
                <MdAutoAwesome className="text-[16px] text-black mr-1 leading-none" />
                <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                  Yangi
                </span>
              </div>
              <button className="bg-black text-primary px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-gray-900 transition-colors">
                Ko'rish
              </button>
            </div>
            <h3 className="text-2xl font-extrabold text-black mb-1 relative z-10 leading-tight">
              PowerWall Pro 3
            </h3>
            <p className="text-black/80 text-sm mb-6 max-w-[80%] font-medium leading-relaxed relative z-10">
              Sizning aqlli uyingiz uchun keyingi avlod energiya saqlash tizimi.
            </p>
            <div className="flex items-baseline space-x-2 relative z-10">
              <span className="text-2xl font-bold text-black">129$</span>
              <span className="text-sm font-medium text-black/40 line-through">
                180$
              </span>
            </div>
          </div> */}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <MdAccountCircle className="text-primary text-[24px]" />
          <h3 className="text-xl font-bold">Admin Profile</h3>
        </div>
        <div className="bg_card border border_color rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="relative group mx-auto md:mx-0">
              {user?.image_url ? (
                <img
                  src={user?.image_url}
                  loading="lazy"
                  alt="profile_image"
                  className="size-32 rounded-full bg-center bg-cover border-4 border_color shadow-xl"
                />
              ) : (
                <div className="size-32 rounded-full flex items-center justify-center text-5xl bg-center bg-cover border-4 border_color shadow-xl">
                  {user?.first_name?.slice(0, 1)}
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />

              {/* BUTTON */}
              <button
                type="button"
                onClick={handleButtonClick}
                className="absolute bottom-0 right-0 size-10 bg-primary text-background-dark rounded-full flex items-center justify-center border-4 border-white dark:border-card-dark hover:scale-110 transition-transform"
              >
                <MdPhotoCamera className="text-md" />
              </button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] font-bold card_text uppercase tracking-widest">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name] ?? ""}
                    onChange={handleChange}
                    className="w-full bg_card border_color rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              ))}

              {/* ERROR */}
              {error && (
                <div className="md:col-span-2 text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* BUTTONS */}
              {isChanged && (
                <>
                  <button
                    onClick={cancelChanges}
                    className="bg_card border border_color p-2 rounded-lg w-full"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={updateUser}
                    disabled={loading}
                    className="bg-primary p-2 rounded-lg w-full disabled:opacity-50"
                  >
                    {loading ? "Saqlanmoqda..." : "O'zgartirish"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 pb-20">
        <div className="flex items-center gap-2">
          <MdSecurity className="text-primary text-[24px]" />
          <h3 className="text-xl font-bold">Adminlar ro'yxati</h3>
        </div>
        <div className="bg_card border border_color rounded-2xl overflow-x-auto shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-full py-6 w-full animate-pulse">
              Yuklanmoqda...
            </div>
          ) : admins?.length > 0 ? (
            <table className="w-full text-left">
              <thead className="card_btn">
                <tr className="border-b border_color">
                  <th className="px-6 py-4 text-[10px] font-bold text_primary uppercase tracking-widest">
                    Ism
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text_primary uppercase text-center">
                    E-pochta
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text_primary uppercase text-center">
                    Telefon
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text_primary uppercase text-center">
                    Qo'shilgan vaqti
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text_primary uppercase text-center">
                    Qo'shimcha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-teal">
                {admins.map((item, i) => (
                  <tr
                    key={i}
                    className={
                      user?.id === item.id
                        ? "opacity-40 touch-none"
                        : "hover:bg-primary/5 transition-colors"
                    }
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{item.first_name}</p>
                      <p className="text-[10px] card_text">{item.last_name}</p>
                    </td>
                    <td className="px-6 py-4 text-center">{item.email}</td>
                    <td className="px-6 py-4 text-center">+{item.phone}</td>
                    <td className="px-6 py-4 text-center">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user?.id === item.id ? (
                        <span>Bu siz</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(item);
                              setOpenUser(true);
                            }}
                            className="p-1.5 hover:text-primary transition-colors text-slate-400"
                          >
                            <MdEdit className="text-[18px]" />
                          </button>
                          <DeleteModal
                            itemId={user?.id || ""}
                            path="admin"
                            confirm={() => fetchUser()}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center py-6 justify-center h-full w-full">
              Ma'lumtlar qo'shilmagan
            </div>
          )}
        </div>
      </section>
      <CategoryDrawer
        type={selected}
        open={open}
        page={page}
        limit={limit}
        totalCount={
          selected === "product"
            ? totalCount
            : selected === "service"
              ? totalCountService
              : totalCountUser
        }
        initialValues={selected === "service" ? services : categories}
        onClose={() => {
          setOpen(false);
        }}
        onSuccess={(p) => fetchCategories(p)}
      />
      <UserDrawer
        open={openUser}
        initialValues={selectedUser}
        onClose={() => {
          setOpenUser(false);
          setSelectedUser(null);
        }}
        onSuccess={() => fetchUser(page)}
      />
    </div>
  );
};

export default Settings;
