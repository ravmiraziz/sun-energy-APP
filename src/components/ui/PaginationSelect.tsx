import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { get } from "../../api/api";

export interface BaseCategory {
  id: string;
  name_uz: string;
  name_ru: string;
}

// product category
export interface ProductCategory extends BaseCategory {
  created_at: string;
}

// service category
export interface ServiceCategory extends BaseCategory {
  icon_name: string;
  created_at: string;
}

export type EndpointType = "service-categories" | "product-categories";

export interface PaginatedApiResponse {
  product_categories?: ProductCategory[];
  service_categories?: ServiceCategory[];
  count: number;
}

export async function fetchCategories<T>(
  endpoint: EndpointType,
  params: {
    page: number;
    limit: number;
    search?: string;
  },
): Promise<{ items: T[]; count: number }> {
  const { data }: { data: PaginatedApiResponse } = await get(endpoint, params);

  if (endpoint === "service-categories") {
    return {
      items: (data.service_categories ?? []) as T[],
      count: data.count,
    };
  }

  return {
    items: (data.product_categories ?? []) as T[],
    count: data.count,
  };
}

interface PaginatedSelectProps<T> {
  endpoint: EndpointType;
  value?: T | null;
  onChange: (item: T) => void;
  labelKey: keyof T;
  placeholder?: string;
  limit?: number;
  className?: string;
}

export function PaginatedSelect<T extends { id: string | number }>({
  endpoint,
  value,
  onChange,
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

    const { items: newItems, count } = await fetchCategories<T>(endpoint, {
      page: reset ? 1 : page,
      limit,
      search,
    });

    setItems((prev) => (reset ? newItems : [...prev, ...newItems]));
    setTotal(count);
    setLoading(false);
  };

  // open yoki search o‘zgarsa
  useEffect(() => {
    if (open) {
      setPage(1);
      loadData(true);
    }
  }, [open, search]);

  // pagination
  useEffect(() => {
    if (page > 1) loadData();
  }, [page]);

  const handleScroll = () => {
    if (!listRef.current || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 10 && items.length < total) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className={clsx("relative", className)}>
      {/* SELECT */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full h-12 px-4 bg_card rounded-xl bg-nav flex justify-between items-center"
      >
        <span>{value ? String(value[labelKey]) : placeholder}</span>
        <span>▾</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 w-full mt-2 rounded-xl bg_card border border-white/10">
          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 border-b border-white/10 bg-transparent outline-none"
          />

          {/* LIST */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto"
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-white/10"
              >
                {String(item[labelKey])}
              </button>
            ))}

            {loading && (
              <p className="py-2 text-center text-sm opacity-50">Loading...</p>
            )}

            {!loading && items.length === 0 && (
              <p className="py-2 text-center text-sm opacity-50">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
