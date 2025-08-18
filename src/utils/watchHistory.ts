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
  progress: number; // Phần trăm đã xem (0-100)
}

export class WatchHistoryManager {
  private static STORAGE_KEY = 'movie4you_watch_history';
  private static MAX_HISTORY_ITEMS = 50;

  // Lấy toàn bộ lịch sử
  static getHistory(): WatchHistoryItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading watch history:', error);
      return [];
    }
  }

  // Lưu/cập nhật progress xem phim
  static saveProgress(item: Omit<WatchHistoryItem, 'watchedAt' | 'progress'>) {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const progress = item.duration > 0 ? Math.round((item.currentTime / item.duration) * 100) : 0;
      
      const newItem: WatchHistoryItem = {
        ...item,
        watchedAt: new Date().toISOString(),
        progress
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
    } catch (error) {
      console.error('Error saving watch history:', error);
    }
  }

  // Lấy progress của một tập phim cụ thể
  static getProgress(movieId: string, episodeIndex: number, serverIndex: number): WatchHistoryItem | null {
    const history = this.getHistory();
    return history.find(
      h => h.movieId === movieId && 
           h.episodeIndex === episodeIndex && 
           h.serverIndex === serverIndex
    ) || null;
  }

  // Lấy tập phim gần nhất của một bộ phim
  static getLatestEpisode(movieId: string): WatchHistoryItem | null {
    const history = this.getHistory();
    const movieHistory = history.filter(h => h.movieId === movieId);
    return movieHistory.length > 0 ? movieHistory[0] : null;
  }

  // Xóa lịch sử của một phim
  static removeMovie(movieId: string) {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const filteredHistory = history.filter(h => h.movieId !== movieId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Error removing movie from history:', error);
    }
  }

  // Xóa toàn bộ lịch sử
  static clearHistory() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing watch history:', error);
    }
  }

  // Lấy danh sách phim đã xem (unique movies)
  static getWatchedMovies(): WatchHistoryItem[] {
    const history = this.getHistory();
    const uniqueMovies = new Map<string, WatchHistoryItem>();

    // Lấy tập gần nhất của mỗi phim
    history.forEach(item => {
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
