import { supabase } from '@/lib/supabase';

export interface WatchProgress {
  id?: string;
  user_id: string;
  movie_id: string;
  movie_name: string;
  movie_slug: string;
  poster_url?: string;
  episode_index: number;
  episode_name?: string;
  server_index: number;
  progress_seconds: number;
  duration_seconds: number;
  watched_at?: string;
  created_at?: string;
  updated_at?: string;
}

export class WatchProgressService {
  private supabase = supabase;
  private static MAX_HISTORY_ITEMS = 50;

  // Save or update watch progress
  async saveProgress(progress: Omit<WatchProgress, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'watched_at'>) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return { error: 'User not authenticated' };

      const { data, error } = await this.supabase
        .from('watch_progress')
        .upsert(
          {
            ...progress,
            user_id: user.id,
            watched_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,movie_id,episode_index,server_index',
          }
        )
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { error: 'Failed to save progress' };
    }
  }

  // Get all watch history for current user
  async getHistory(): Promise<WatchProgress[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await this.supabase
        .from('watch_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(WatchProgressService.MAX_HISTORY_ITEMS);

      if (error) {
        return [];
      }

      return data || [];
    } catch (error) {
      return [];
    }
  }

  // Get progress for a specific movie/episode
  async getProgress(movieId: string, episodeIndex: number, serverIndex: number): Promise<WatchProgress | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await this.supabase
        .from('watch_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('movie_id', movieId)
        .eq('episode_index', episodeIndex)
        .eq('server_index', serverIndex)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        // Silent error for not found
      }

      return data || null;
    } catch (error) {
      return null;
    }
  }

  // Get latest watched episode for a movie
  async getLatestEpisode(movieId: string): Promise<WatchProgress | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await this.supabase
        .from('watch_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('movie_id', movieId)
        .order('watched_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Silent error for not found
      }

      return data || null;
    } catch (error) {
      return null;
    }
  }

  // Get unique watched movies (latest progress for each)
  async getWatchedMovies(): Promise<WatchProgress[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return [];

      // Get all progress records
      const { data, error } = await this.supabase
        .from('watch_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false });

      if (error) {
        return [];
      }

      // Filter to get unique movies (keep latest progress for each)
      const uniqueMovies = new Map<string, WatchProgress>();
      data?.forEach((item: WatchProgress) => {
        if (!uniqueMovies.has(item.movie_id)) {
          uniqueMovies.set(item.movie_id, item);
        }
      });

      return Array.from(uniqueMovies.values());
    } catch (error) {
      return [];
    }
  }

  // Remove all progress for a movie
  async removeMovie(movieId: string) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return { error: 'User not authenticated' };

      const { error } = await this.supabase
        .from('watch_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Failed to remove movie' };
    }
  }

  // Clear all watch history
  async clearHistory() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return { error: 'User not authenticated' };

      const { error } = await this.supabase
        .from('watch_progress')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Failed to clear history' };
    }
  }

  // Utility: Format time for display
  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // Utility: Format relative time
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

// Export singleton instance
export const watchProgressService = new WatchProgressService();
