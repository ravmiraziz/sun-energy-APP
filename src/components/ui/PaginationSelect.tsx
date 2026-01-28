import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { get } from "../../api/api";
import type { CategoryData } from "../../pages/Settings";

interface PaginatedSelectProps<T> {
  value?: T | null;
  onChange: (item: T) => void;
  endpoint: string;
  labelKey: keyof T;
  placeholder?: string;
  limit?: number;
  className?: string;
}

interface DataRes {
  data: {
    product_categories?: CategoryData[];
    service_categories?: CategoryData[];
    count: number;
  };
}

export function PaginatedSelect<T extends { id: number | string }>({
  value,
  onChange,
  endpoint,
  labelKey,
  placeholder = "Select...",
  limit = 10,
  className,
}: PaginatedSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  const loadData = async (reset = false) => {
    setLoading(true);
    const { data }: DataRes = await get(endpoint, {
      page: reset ? 1 : page,
      limit,
      search,
    });

    console.log(data);

    if (endpoint === "service-categories") {
      setItems((prev) =>
        reset ? data.service_categories : [...prev, ...data.service_categories],
      );
    } else {
      setItems((prev) =>
        reset ? data.product_categories : [...prev, ...data.product_categories],
      );
    }

    setTotal(data.count);
    setLoading(false);
  };

  useEffect(() => {
    if (open) loadData(true);
  }, [open, search]);

  useEffect(() => {
    if (page > 1) loadData();
  }, [page]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      items.length < total &&
      !loading
    ) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className={clsx("relative", className)}>
      {/* SELECT INPUT */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full h-12 px-4 bg_card rounded-xl bg-nav text-left flex items-center justify-between"
      >
        <span>{value ? String(value[labelKey]) : placeholder}</span>
        <span>▾</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg_card card_text border border-white/10">
          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 bg_card border-b border-white/10 outline-none"
          />

          {/* LIST */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto"
          >
            {items?.length > 0 &&
              items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-white/10"
                >
                  {String(item[labelKey])}
                </button>
              ))}

            {loading && (
              <p className="text-center py-2 text-white/40 text-sm">
                Loading...
              </p>
            )}

            {!loading && items?.length === 0 && (
              <p className="text-center py-2 text-white/40 text-sm">
                No results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
