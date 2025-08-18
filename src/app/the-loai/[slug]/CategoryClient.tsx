"use client";

import { useState, useMemo, useCallback } from "react";
import { useInfiniteOphimList } from "@/hooks/useInfiniteOphimList";
import MovieCard from "@/components/MovieCard";
import FilterBar from "@/components/FilterBar";

interface CategoryClientProps {
  category: {
    slug: string;
    name: string;
  };
}

export default function CategoryClient({ category }: CategoryClientProps) {
  const slug = category.slug;
  const [initialLimit] = useState(12);
  const [loadMoreSize] = useState(6);
  const [sort_field] = useState("modified.time");
  const [sort_type] = useState("desc");
  const [country] = useState("");
  const [year] = useState("");

  const commonParams = useMemo(() => ({ sort_field, sort_type, country, year }), [sort_field, sort_type, country, year]);
  const { items, loading, error, hasMore, sentinelRef } = useInfiniteOphimList({
    kind: "the-loai",
    slugOrYear: slug,
    initialLimit,
    loadMoreSize,
    commonParams,
    resetKey: JSON.stringify(commonParams),
  });

  const handleFilterChange = useCallback(() => {
    // NOTE: hook hiện reset theo initial mount; filter thay đổi sẽ cập nhật qua URL và dẫn đến remount component.
    // Nếu muốn reset ngay trong hook, có thể mở rộng hook nhận "resetKey" phụ thuộc vào filters.
  }, []);

  return (
    <div className="space-y-4">
      {/* Filter Bar - Hide category filter since we're already on a category page */}
      <FilterBar
        onFilterChange={handleFilterChange}
        showCountryFilter={true}
        showCategoryFilter={false}
      />

      <div className="space-y-4">
        {items.length === 0 && !loading && !error && (
          <div className="text-center text-white/70 py-16">Không có dữ liệu.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((movie, idx) => (
            <MovieCard key={String(movie.id || `${movie.slug}-${movie.name}-${idx}`)} movie={movie} />
          ))}
        </div>

        {error && (
          <div className="text-center text-red-400 text-sm">{error}</div>
        )}

        {/* Invisible sentinel for infinite scroll */}
        {hasMore && (
          <div ref={sentinelRef} className="h-1" aria-hidden />
        )}
      </div>
    </div>
  );
}
