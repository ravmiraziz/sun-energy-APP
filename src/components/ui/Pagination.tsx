import React from "react";
import clsx from "clsx";

/* ---------------------------------
 * TYPES
 * --------------------------------- */
type PageItem = number | "...";

interface PaginationProps {
  page: number; // current page (1-based)
  limit: number; // items per page
  allCount: number; // total items count
  onChange: (page: number) => void;
  className?: string;
}

/* ---------------------------------
 * HELPERS
 * --------------------------------- */
const getPages = (current: number, total: number): PageItem[] => {
  const pages: PageItem[] = [];

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  pages.push(1);

  if (current > 4) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) pages.push("...");

  pages.push(total);

  return pages;
};

/* ---------------------------------
 * COMPONENT
 * --------------------------------- */
const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  allCount,
  onChange,
  className = "",
}) => {
  const totalPages = Math.ceil(allCount / limit);
  if (totalPages <= 1) return null;

  const pages = getPages(page, totalPages);

  const handleChange = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
  };

  return (
    <div className={clsx("flex justify-end gap-1 pr-5", className)}>
      {/* PREV */}
      <button
        onClick={() => handleChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded-lg text-sm disabled:opacity-40"
      >
        «
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="px-2 py-1 text-slate-400 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => handleChange(p)}
            className={clsx(
              "px-3 py-1 rounded-lg text-sm transition",
              p === page
                ? "bg-primary text-white font-bold"
                : "hover:bg-slate-700",
            )}
          >
            {p}
          </button>
        ),
      )}

      {/* NEXT */}
      <button
        onClick={() => handleChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-lg text-sm disabled:opacity-40"
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
