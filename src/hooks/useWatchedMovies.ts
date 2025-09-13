"use client";

import { useCallback, useEffect, useState } from "react";
import { WatchHistoryManager, WatchHistoryItem } from "@/utils/watchHistory";
import { useAuth } from "@/contexts/AuthContext";

export function useWatchedMovies() {
  const { user } = useAuth();
  const [items, setItems] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const fresh = await WatchHistoryManager.getWatchedMovies(user?.id);
      setItems(fresh);
    } catch {
      // fallback already handled in getWatchedMovies, but ensure we always have something
      setItems(WatchHistoryManager.getWatchedMoviesSync());
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // Show local immediately for snappy UX
    setItems(WatchHistoryManager.getWatchedMoviesSync());
    setLoading(false);

    // Then refresh from Supabase (if logged in)
    load();

    // Refresh when window regains focus
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  return { items, loading, reload: load } as const;
}
