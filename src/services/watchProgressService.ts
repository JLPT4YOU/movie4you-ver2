import { supabase } from '@/lib/supabase';

export interface WatchProgress {
  id: string;
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
  watched_at: string;
  created_at: string;
  updated_at: string;
}

export interface WatchProgressInput {
  movie_id: string;
  movie_name: string;
  movie_slug: string;
  poster_url?: string;
  episode_index: number;
  episode_name?: string;
  server_index: number;
  progress_seconds: number;
  duration_seconds: number;
}

class WatchProgressService {
  /**
   * Save or update watch progress for a user
   */
  async saveProgress(userId: string, progressData: WatchProgressInput): Promise<WatchProgress | null> {
    try {
      const now = new Date().toISOString();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as unknown as { from: (t: string) => any })
        .from('watch_progress')
        .upsert(
          [
            {
              user_id: userId,
              ...progressData,
              watched_at: now,
              updated_at: now,
            },
          ],
          {
            onConflict: 'user_id,movie_id,episode_index,server_index',
            ignoreDuplicates: false,
          }
        )
        .select();

      if (error) {
        // Debug log to diagnose why progress is not saved (RLS, 401, etc.)
        // Safe to keep in development; remove or gate by env in production if noisy
        console.error('[watch_progress] upsert error:', error);
        return null;
      }

      return Array.isArray(data) ? (data[0] as WatchProgress) : (data as unknown as WatchProgress);
    } catch {
      return null;
    }
  }

  /**
   * Get watch progress for a specific movie, episode, and server
   */
  async getProgress(
    userId: string,
    movieId: string,
    episodeIndex: number,
    serverIndex: number
  ): Promise<WatchProgress | null> {
    try {
      const { data, error } = await supabase
        .from('watch_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('movie_id', movieId)
        .eq('episode_index', episodeIndex)
        .eq('server_index', serverIndex)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        return null;
      }

      return data || null;
    } catch {
      return null;
    }
  }

  /**
   * Get the latest watch progress for a specific movie episode across ANY server.
   * Useful when resuming an episode without caring which server was used last.
   */
  async getLatestEpisodeProgress(
    userId: string,
    movieId: string,
    episodeIndex: number
  ): Promise<WatchProgress | null> {
    try {
      const { data, error } = await supabase
        .from('watch_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('movie_id', movieId)
        .eq('episode_index', episodeIndex)
        .order('watched_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        return null;
      }

      return data || null;
    } catch {
      return null;
    }
  }

  /**
   * Get all watch progress for a user (for continue watching)
   */
  async getUserWatchHistory(userId: string, limit = 20): Promise<WatchProgress[]> {
    try {
      const { data, error } = await supabase
        .from('watch_progress')
        .select('*')
        .eq('user_id', userId)
        .order('watched_at', { ascending: false })
        .limit(limit);

      if (error) {
        return [];
      }

      return data || [];
    } catch {
      return [];
    }
  }

  /**
   * Get watch progress for a specific movie (all episodes and servers)
   */
  async getMovieProgress(userId: string, movieId: string): Promise<WatchProgress[]> {
    try {
      const { data, error } = await supabase
        .from('watch_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('movie_id', movieId)
        .order('episode_index', { ascending: true })
        .order('server_index', { ascending: true });

      if (error) {
        return [];
      }

      return data || [];
    } catch {
      return [];
    }
  }

  /**
   * Remove watch progress for a specific movie
   */
  async removeMovieProgress(userId: string, movieId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('watch_progress')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', movieId);

      if (error) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear all watch progress for a user
   */
  async clearUserProgress(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('watch_progress')
        .delete()
        .eq('user_id', userId);

      if (error) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Format time in seconds to readable format
   */
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Calculate watch percentage
   */
  getWatchPercentage(progressSeconds: number, durationSeconds: number): number {
    if (durationSeconds <= 0) return 0;
    return Math.min(100, Math.max(0, (progressSeconds / durationSeconds) * 100));
  }
}

export const watchProgressService = new WatchProgressService();
