export type NormalizedMovie = {
  id?: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  modified: { time: string };
  // Allow additional fields without strict typing to ease integration
  [key: string]: any;
};

export const OPHIM_IMG_BASE = process.env.OPHIM_IMG_BASE || "https://img.ophim.live";
export const PLACEHOLDER_POSTER = "/placeholder-movie.jpg";

/**
 * Tạo slug tiếng Việt an toàn để dùng làm URL/path.
 * Ví dụ: "Hành Động 2024" -> "hanh-dong-2024".
 */
export function slugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Chuẩn hóa một item phim từ OPHIM (bao gồm cả trường hợp m.item.movie).
 * Đảm bảo trả về cấu trúc thống nhất: id, name, slug, thumb/poster, year, modified.
 */
export function normalizeMovie(item: Record<string, any>): NormalizedMovie | null {
  const m = item?.movie ?? item;
  if (!m) return null;
  const id: string = String(m._id || m.id || m.slug || "") + "-" + String(m?.modified?.time || m?.modified_time || "");
  const name = m.name || m.title || m.origin_name || "";
  const slug = m.slug || slugify(name);
  const thumb_url = m.thumb_url || m.poster_url || m.thumb || "";
  const poster_url = m.poster_url || m.thumb_url || m.poster || "";
  const year = Number(m.year || m.release_year || 0) || 0;
  const modified = { time: m?.modified?.time || m?.modified_time || "" } as { time: string };
  return { id, name, slug, origin_name: m.origin_name || name, thumb_url, poster_url, year, modified } as NormalizedMovie;
}

/**
 * Tạo query string an toàn từ object params, bỏ qua giá trị rỗng/undefined.
 */
export function buildSearch(params: Record<string, any>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  });
  return sp.toString();
}

/**
 * Chuẩn hóa URL ảnh từ OPHIM. Nếu là đường dẫn tương đối sẽ nối vào OPHIM_IMG_BASE.
 * Trả về placeholder khi chuỗi trống.
 */
export function resolveImageUrl(src?: string): string {
  const s = (src || "").trim();
  if (!s) return PLACEHOLDER_POSTER;
  if (s.startsWith("http")) return s;
  const path = s.startsWith("/") ? s : `/uploads/movies/${s}`;
  return `${OPHIM_IMG_BASE}${path}`;
}

