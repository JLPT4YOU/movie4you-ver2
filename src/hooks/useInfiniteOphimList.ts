import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildSearch, normalizeMovie, type NormalizedMovie } from "@/utils/ophim";

export type FetchPathKind = "danh-sach" | "the-loai" | "quoc-gia" | "nam-phat-hanh";

export interface InfiniteListOptions {
  kind: FetchPathKind;
  slugOrYear: string; // slug cho danh-sach/the-loai/quoc-gia, hoặc year string cho nam-phat-hanh
  initialLimit?: number; // default 12-24 tuỳ trang
  loadMoreSize?: number; // default 6-12 tuỳ trang
  commonParams?: Record<string, string | number | undefined>; // sort_field, sort_type, country, category, year
  resetKey?: string | number; // thay đổi để reset danh sách (khi filter đổi)
}

export interface InfiniteListState<T = NormalizedMovie> {
  items: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook dùng chung để load danh sách phim theo từng trang với Infinite Scroll (IntersectionObserver + fallback scroll).
 * Đã bao gồm de-duplicate bằng id/slug+name, và map normalizeMovie.
 */
export function useInfiniteOphimList({
  kind,
  slugOrYear,
  initialLimit = 12,
  loadMoreSize = 6,
  commonParams = {},
}: InfiniteListOptions): InfiniteListState {
  const [items, setItems] = useState<NormalizedMovie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const seenRef = useRef<Set<string>>(new Set());
  const loadingRef = useRef<boolean>(false);

  const basePath = useMemo(() => {
    switch (kind) {
      case "danh-sach":
        return `/api/ophim/v1/api/danh-sach/${slugOrYear}`;
      case "the-loai":
        return `/api/ophim/v1/api/the-loai/${slugOrYear}`;
      case "quoc-gia":
        return `/api/ophim/v1/api/quoc-gia/${slugOrYear}`;
      case "nam-phat-hanh":
        return `/api/ophim/v1/api/nam-phat-hanh/${slugOrYear}`;
      default:
        return "";
    }
  }, [kind, slugOrYear]);

  const fetchPage = useCallback(async (nextPage: number, size: number) => {
    setLoading(true);
    loadingRef.current = true;
    setError(null);
    try {
      const qs = buildSearch({ ...commonParams, page: nextPage, limit: size });
      const res = await fetch(`${basePath}?${qs}`, { headers: { accept: "application/json" }, cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rawItems = (json?.data?.items || json?.items || []) as Array<Record<string, unknown>>;
      const normalized = rawItems
        .map((item) => normalizeMovie((item as { movie?: Record<string, unknown> })?.movie || item))
        .filter(Boolean) as NormalizedMovie[];

      // de-duplicate by id or slug
      const fresh = normalized.filter((m) => {
        const key = m.id || m.slug;
        if (!key) return true; // keep if cannot determine key
        if (seenRef.current.has(key)) return false;
        seenRef.current.add(key);
        return true;
      });

      setItems((prev) => [...prev, ...fresh]);
      setHasMore((Array.isArray(rawItems) ? rawItems.length : 0) >= size);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Fetch error");
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [basePath, commonParams]);

  // initial load
  useEffect(() => {
    if (loadingRef.current) return;
    setItems([]);
    setPage(1);
    seenRef.current.clear();
    setHasMore(true);
    fetchPage(1, initialLimit);
  }, [fetchPage, initialLimit]);

  // IntersectionObserver to load more
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !loadingRef.current) {
        const next = page + 1;
        setPage(next);
        fetchPage(next, loadMoreSize);
      }
    }, { rootMargin: "300px 0px", threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, page, loadMoreSize, fetchPage, items.length]);

  // Fallback: scroll listener
  useEffect(() => {
    const onScroll = () => {
      if (!hasMore || loadingRef.current) return;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const fullH = document.documentElement.scrollHeight;
      if (scrollY + vh >= fullH - 400) {
        const next = page + 1;
        setPage(next);
        fetchPage(next, loadMoreSize);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, page, loadMoreSize, fetchPage]);

  return { items, loading, error, hasMore, sentinelRef };
}

