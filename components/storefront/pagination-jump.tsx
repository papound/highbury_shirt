"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

export function PaginationJump({ currentPage, totalPages, searchParams }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(String(currentPage));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const p = Number(value);
    if (!p || p < 1 || p > totalPages) return;
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v !== undefined) params.set(k, v);
    }
    params.set("page", String(p));
    router.push(`/products?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <span className="text-sm text-slate-400 whitespace-nowrap">ไปหน้า</span>
      <input
        type="number"
        min={1}
        max={totalPages}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-14 h-9 rounded-xl border border-slate-200 bg-white text-center text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
      />
      <button
        type="submit"
        className="h-9 px-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
      >
        ไป
      </button>
    </form>
  );
}
