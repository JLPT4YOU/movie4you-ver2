import { watchProgressService, WatchProgress, WatchProgressInput } from '@/services/watchProgressService';

export interface WatchHistoryItem {
  movieId: string;
  movieName: string;
  movieSlug: string;
  posterUrl: string;
  episodeIndex: number;
  episodeName: string;
  serverIndex: number;
  currentTime: number; // Thời gian hiện tại (giây)
  duration: number; // Tổng thời lượng (giây)
  watchedAt: string; // ISO timestamp
}

export class WatchHistoryManager {
  private static STORAGE_KEY = 'movie4you_watch_history';
  private static MAX_HISTORY_ITEMS = 50;
  // Throttle Supabase writes per (userId+movie+episode+server)
  private static THROTTLE_MS = 5000;
  private static pending: Map<string, {
    latest: Omit<WatchHistoryItem, 'watchedAt'>;
    userId?: string;
    lastSentAt: number;
    timeoutId: ReturnType<typeof setTimeout> | null;
  }> = new Map();

  private static makeKey(item: Omit<WatchHistoryItem, 'watchedAt'>, userId?: string) {
    return `${userId || 'anon'}:${item.movieId}:${item.episodeIndex}:${item.serverIndex}`;
  }

  private static async sendToSupabase(item: Omit<WatchHistoryItem, 'watchedAt'>, userId: string) {
    // Double check duration before sending to Supabase
    if (!item.duration || item.duration <= 0) {
      return;
    }
    const progressInput = this.convertToProgressInput(item);
    await watchProgressService.saveProgress(userId, progressInput);
  }

  private static scheduleSupabaseSave(item: Omit<WatchHistoryItem, 'watchedAt'>, userId?: string) {
    if (!userId) return; // only throttle remote when authenticated
    const key = this.makeKey(item, userId);
    const now = Date.now();
    const entry = this.pending.get(key) || { latest: item, userId, lastSentAt: 0, timeoutId: null };
    entry.latest = item;
    entry.userId = userId;

    const elapsed = now - entry.lastSentAt;
    const shouldSendNow = elapsed >= this.THROTTLE_MS;

    if (shouldSendNow) {
      // Fire immediately and reset timer window
      entry.lastSentAt = now;
      if (entry.timeoutId) {
        clearTimeout(entry.timeoutId);
        entry.timeoutId = null;
      }
      this.pending.set(key, entry);
      this.sendToSupabase(item, userId).catch(() => {});
    } else {
      // Schedule a send after remaining throttle window
      const remaining = Math.max(this.THROTTLE_MS - elapsed, 1000);
      if (!entry.timeoutId) {
        entry.timeoutId = setTimeout(async () => {
          entry.lastSentAt = Date.now();
          entry.timeoutId = null;
          try {
            await this.sendToSupabase(entry.latest, userId);
          } catch {
            // silent
          }
        }, remaining);
      } else {
        // Timer already scheduled; keep latest data and wait
      }
      this.pending.set(key, entry);
    }
  }

  // Convert Supabase WatchProgress to WatchHistoryItem
  private static convertToHistoryItem(progress: WatchProgress): WatchHistoryItem {
    return {
      movieId: progress.movie_id,
      movieName: progress.movie_name,
      movieSlug: progress.movie_slug,
      posterUrl: progress.poster_url || '',
      episodeIndex: progress.episode_index,
      episodeName: progress.episode_name || '',
      serverIndex: progress.server_index,
      currentTime: Number(progress.progress_seconds),
      duration: Number(progress.duration_seconds),
      watchedAt: progress.watched_at
    };
  }

  // Convert WatchHistoryItem to Supabase input format
  private static convertToProgressInput(item: Omit<WatchHistoryItem, 'watchedAt'>): WatchProgressInput {
    return {
      movie_id: item.movieId,
      movie_name: item.movieName,
      movie_slug: item.movieSlug,
      poster_url: item.posterUrl,
      episode_index: item.episodeIndex,
      episode_name: item.episodeName,
      server_index: item.serverIndex,
      progress_seconds: item.currentTime,
      duration_seconds: item.duration
    };
  }

  // Lấy toàn bộ lịch sử (Supabase + localStorage fallback)
  static async getHistory(userId?: string): Promise<WatchHistoryItem[]> {
    if (typeof window === 'undefined') return [];
    
    // If user is authenticated, get from Supabase
    if (userId) {
      try {
        const supabaseHistory = await watchProgressService.getUserWatchHistory(userId, this.MAX_HISTORY_ITEMS);
        return supabaseHistory.map(this.convertToHistoryItem);
      } catch {
        // Fallback to localStorage
      }
    }

    // Fallback to localStorage
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  // Get history synchronously from localStorage only (for compatibility)
  static getHistorySync(): WatchHistoryItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  // Lưu/cập nhật progress xem phim (Supabase + localStorage)
  static async saveProgress(item: Omit<WatchHistoryItem, 'watchedAt'>, userId?: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // Don't save if duration is 0 or invalid
    if (!item.duration || item.duration <= 0) {
      return;
    }

    try {
      
      // Throttle Supabase writes
      this.scheduleSupabaseSave(item, userId);

      // Always save to localStorage as fallback
      const history = this.getHistorySync();
      const newItem: WatchHistoryItem = {
        ...item,
        watchedAt: new Date().toISOString()
      };

      // Tìm item cũ (cùng phim + tập)
      const existingIndex = history.findIndex(
        h => h.movieId === item.movieId && 
             h.episodeIndex === item.episodeIndex && 
             h.serverIndex === item.serverIndex
      );

      if (existingIndex >= 0) {
        // Cập nhật item cũ
        history[existingIndex] = newItem;
      } else {
        // Thêm item mới vào đầu
        history.unshift(newItem);
      }

      // Giới hạn số lượng items
      if (history.length > this.MAX_HISTORY_ITEMS) {
        history.splice(this.MAX_HISTORY_ITEMS);
      }

      // Sắp xếp theo thời gian xem gần nhất
      history.sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch {
      // silent
    }
  }

  // Force flush all pending Supabase writes (use on pagehide/beforeunload)
  static async flushPending(): Promise<void> {
    const entries = Array.from(this.pending.entries());
    this.pending.clear();
    await Promise.all(entries.map(async ([, entry]) => {
      try {
        if (entry.timeoutId) clearTimeout(entry.timeoutId);
        if (entry.userId) {
          await this.sendToSupabase(entry.latest, entry.userId);
        }
      } catch {
        // silent
      }
    }));
  }

  // Lấy progress của một tập phim cụ thể (Supabase + localStorage)
  static async getProgress(movieId: string, episodeIndex: number, serverIndex: number, userId?: string): Promise<WatchHistoryItem | null> {
    // If user is authenticated, try Supabase first
    if (userId) {
      try {
        const progress = await watchProgressService.getProgress(userId, movieId, episodeIndex, serverIndex);
        if (progress) {
          return this.convertToHistoryItem(progress);
        }
      } catch {
        // silent
      }
    }

    // Fallback to localStorage
    const history = this.getHistorySync();
    return history.find(
      (h: WatchHistoryItem) => h.movieId === movieId && 
           h.episodeIndex === episodeIndex && 
           h.serverIndex === serverIndex
    ) || null;
  }

  // Lấy progress của một tập phim bất kể server nào (ưu tiên Supabase, fallback localStorage)
  static async getEpisodeProgressAnyServer(movieId: string, episodeIndex: number, userId?: string): Promise<WatchHistoryItem | null> {
    // Supabase first: query latest progress for this episode across any server
    if (userId) {
      try {
        const progress = await watchProgressService.getLatestEpisodeProgress(userId, movieId, episodeIndex);
        if (progress) {
          return this.convertToHistoryItem(progress);
        }
      } catch (error) {
        console.error('Error loading progress from Supabase:', error);
      }
    }

    // Fallback to localStorage: find latest watchedAt for this episode across servers
    const history = this.getHistorySync();
    const candidates = history.filter(
      (h: WatchHistoryItem) => h.movieId === movieId && h.episodeIndex === episodeIndex
    );
    if (candidates.length === 0) {
      return null;
    }
    candidates.sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());
    return candidates[0];
  }

  // Lấy tập phim gần nhất của một bộ phim (Supabase + localStorage)
  static async getLatestEpisode(movieId: string, userId?: string): Promise<WatchHistoryItem | null> {
    // If user is authenticated, try Supabase first
    if (userId) {
      try {
        const movieProgress = await watchProgressService.getMovieProgress(userId, movieId);
        
        if (movieProgress.length > 0) {
          // Sort by episode index and return the latest
          const sorted = movieProgress.sort((a, b) => new Date(b.watched_at).getTime() - new Date(a.watched_at).getTime());
          return this.convertToHistoryItem(sorted[0]);
        }
      } catch (error) {
        console.error('Error loading latest episode from Supabase:', error);
      }
    }

    // Fallback to localStorage
    const history = this.getHistorySync();
    const movieHistory = history.filter((h: WatchHistoryItem) => h.movieId === movieId);
    return movieHistory.length > 0 ? movieHistory[0] : null;
  }

  // Xóa lịch sử của một phim (Supabase + localStorage)  
  static async removeMovie(movieId: string, userId?: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // If user is authenticated, remove from Supabase
      if (userId) {
        await watchProgressService.removeMovieProgress(userId, movieId);
      }

      // Always remove from localStorage as well
      const history = this.getHistorySync();
      const filteredHistory = history.filter((h: WatchHistoryItem) => h.movieId !== movieId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredHistory));
    } catch {
      // silent
    }
  }

  // Xóa toàn bộ lịch sử (Supabase + localStorage)
  static async clearHistory(userId?: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      // If user is authenticated, clear from Supabase
      if (userId) {
        await watchProgressService.clearUserProgress(userId);
      }

      // Always clear localStorage as well
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // silent
    }
  }

  // Lấy danh sách phim đã xem (unique movies) - Supabase + localStorage
  static async getWatchedMovies(userId?: string): Promise<WatchHistoryItem[]> {
    const history = await this.getHistory(userId);
    const uniqueMovies = new Map<string, WatchHistoryItem>();

    // Lấy tập gần nhất của mỗi phim
    history.forEach((item: WatchHistoryItem) => {
      if (!uniqueMovies.has(item.movieId) || 
          new Date(item.watchedAt) > new Date(uniqueMovies.get(item.movieId)!.watchedAt)) {
        uniqueMovies.set(item.movieId, item);
      }
    });

    return Array.from(uniqueMovies.values())
      .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());
  }

  // Lấy danh sách phim đã xem (synchronous version for compatibility)
  static getWatchedMoviesSync(): WatchHistoryItem[] {
    const history = this.getHistorySync();
    const uniqueMovies = new Map<string, WatchHistoryItem>();

    // Lấy tập gần nhất của mỗi phim
    history.forEach((item: WatchHistoryItem) => {
      if (!uniqueMovies.has(item.movieId) || 
          new Date(item.watchedAt) > new Date(uniqueMovies.get(item.movieId)!.watchedAt)) {
        uniqueMovies.set(item.movieId, item);
      }
    });

    return Array.from(uniqueMovies.values())
      .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());
  }

  // Format thời gian để hiển thị
  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // Format thời gian relative (vd: "2 giờ trước")
  static formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const watchTime = new Date(timestamp);
    const diffMs = now.getTime() - watchTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return watchTime.toLocaleDateString('vi-VN');
  }
}
