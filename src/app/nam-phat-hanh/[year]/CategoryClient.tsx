"use client";

import { useState, useMemo } from "react";
import MovieCard from "@/components/MovieCard";
import { useInfiniteOphimList } from "@/hooks/useInfiniteOphimList";


export default function CategoryClient({ year }: { year: string }) {
  const [initialLimit] = useState(12);
  const [loadMoreSize] = useState(6);
  const [sort_field] = useState("modified.time");
  const [sort_type] = useState("desc");
  const [country] = useState("");
  const [category] = useState("");

  const commonParams = useMemo(() => ({ sort_field, sort_type, country, category }), [sort_field, sort_type, country, category]);
  const { items, loading, error, hasMore, sentinelRef } = useInfiniteOphimList({
    kind: "nam-phat-hanh",
    slugOrYear: year,
    initialLimit,
    loadMoreSize,
    commonParams,
    resetKey: JSON.stringify(commonParams),
  });


  if (items.length === 0 && !loading && !error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-400 mt-8">Không tìm thấy phim nào cho năm {year}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
  );
}
