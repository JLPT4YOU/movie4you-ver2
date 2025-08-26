"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import FilterBar from "@/components/FilterBar";
import { useInfiniteOphimList, type FetchPathKind } from "@/hooks/useInfiniteOphimList";

type CategoryType = 'category' | 'year' | 'country' | 'genre';

interface CategoryClientProps {
  type: CategoryType;
  slug?: string;
  year?: number;
  title: string;
  endpoint: string;
}

interface ListParams {
  [key: string]: string | number | undefined;
}

export default function CategoryClient({ 
  type, 
  slug, 
  year,
  title,
  endpoint
}: CategoryClientProps) {
  const searchParams = useSearchParams();
  const [listParams, setListParams] = useState<ListParams>({});

  // Configure which filters to show based on category type
  const showCountryFilter = type !== 'country';
  const showCategoryFilter = type !== 'genre';
  const showYearFilter = type !== 'year';

  // Map component type to hook kind
  const kind = useMemo((): FetchPathKind => {
    if (type === 'year') return 'nam-phat-hanh';
    if (type === 'country') return 'quoc-gia';
    if (type === 'genre') return 'the-loai';
    return 'danh-sach';
  }, [type]);

  // Get slugOrYear based on type
  const slugOrYear = useMemo(() => {
    if (type === 'year') return year?.toString() || '';
    return slug || endpoint.split('/').pop() || '';
  }, [type, year, slug, endpoint]);

  // Set up initial parameters based on type
  useEffect(() => {
    const params: ListParams = {};
    
    // Add search params
    const sortField = searchParams.get('sort_field');
    const sortType = searchParams.get('sort_type');
    const country = searchParams.get('country');
    const category = searchParams.get('category');
    const yearParam = searchParams.get('year');

    if (sortField) params.sort_field = sortField;
    if (sortType) params.sort_type = sortType;
    if (country && showCountryFilter) params.country = country;
    if (category && showCategoryFilter) params.category = category;
    if (yearParam && showYearFilter) params.year = yearParam;

    setListParams(params);
  }, [searchParams, type, showCountryFilter, showCategoryFilter, showYearFilter]);

  const { items, loading, error, hasMore, sentinelRef } = useInfiniteOphimList({
    kind,
    slugOrYear,
    initialLimit: 24,
    loadMoreSize: 12,
    commonParams: listParams
  });

  const handleFilterChange = (filters: {
    sort_field: string;
    sort_type: string;
    country: string;
    year: string;
    category: string;
  }) => {
    const newParams: ListParams = {};

    // Apply new filters
    if (filters.sort_field) newParams.sort_field = filters.sort_field;
    if (filters.sort_type) newParams.sort_type = filters.sort_type;
    if (filters.country && showCountryFilter) newParams.country = filters.country;
    if (filters.category && showCategoryFilter) newParams.category = filters.category;
    if (filters.year && showYearFilter) newParams.year = filters.year;

    setListParams(newParams);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>
      
      <FilterBar
        onFilterChange={handleFilterChange}
        showCountryFilter={showCountryFilter}
        showCategoryFilter={showCategoryFilter}
        showYearFilter={showYearFilter}
      />

      {error && (
        <div className="text-center py-8 text-red-500">
          Error loading movies: {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-800 animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          Không tìm thấy phim nào
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
            {items.map((movie: any) => (
              <MovieCard key={movie._id || movie.slug} movie={movie} />
            ))}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className="h-1" aria-hidden />
          )}
        </>
      )}
    </div>
  );
}
