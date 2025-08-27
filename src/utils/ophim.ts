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
  [key: string]: unknown;
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
export function normalizeMovie(item: Record<string, unknown>): NormalizedMovie | null {
  const source = (item as { movie?: Record<string, unknown> }).movie ?? item;
  if (!source || typeof source !== "object") return null;

  type LooseMovie = {
    _id?: unknown;
    id?: unknown;
    slug?: unknown;
    name?: unknown;
    title?: unknown;
    origin_name?: unknown;
    thumb_url?: unknown;
    poster_url?: unknown;
    thumb?: unknown;
    poster?: unknown;
    year?: unknown;
    release_year?: unknown;
    modified?: { time?: unknown };
    modified_time?: unknown;
  };

  const m = source as LooseMovie;

  const getString = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : v == null ? fallback : String(v));
  const getNumber = (v: unknown, fallback = 0): number => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const id = `${getString(m._id || m.id || m.slug)}-${getString(m?.modified?.time || m?.modified_time)}`.replace(/-$/, "");
  const name = getString(m.name || m.title || m.origin_name);
  const slug = getString(m.slug) || slugify(name);
  const thumb_url = getString(m.thumb_url || m.poster_url || m.thumb);
  const poster_url = getString(m.poster_url || m.thumb_url || m.poster);
  const year = getNumber(m.year || m.release_year);
  const modified = { time: getString(m?.modified?.time || m?.modified_time) } as { time: string };

  return { id, name, slug, origin_name: getString(m.origin_name) || name, thumb_url, poster_url, year, modified };
}

/**
 * Tạo query string an toàn từ object params, bỏ qua giá trị rỗng/undefined.
 */
export function buildSearch(params: Record<string, string | number | boolean | undefined | null>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  return sp.toString();
}

/**
 * Chuẩn hóa URL ảnh từ OPHIM. Nếu là đường dẫn tương đối sẽ nối vào OPHIM_IMG_BASE.
 * Trả về placeholder khi chuỗi trống.
 */
export function resolveImageUrl(src?: string, width?: number, quality?: number): string {
  const s = (src || "").trim();
  if (!s) return PLACEHOLDER_POSTER;

  let imageUrl: string;
  if (s.startsWith("http")) {
    imageUrl = s;
  } else {
    const path = s.startsWith("/") ? s : `/uploads/movies/${s}`;
    imageUrl = `${OPHIM_IMG_BASE}${path}`;
  }

  // Optimize with wsrv.nl
  const wsrvUrl = new URL("https://wsrv.nl");
  wsrvUrl.searchParams.set("url", imageUrl);
  wsrvUrl.searchParams.set("w", String(width || 400)); // Default width 400px
  wsrvUrl.searchParams.set("q", String(quality || 80)); // Default quality 80
  wsrvUrl.searchParams.set("output", "webp"); // Output as WebP for better compression
  wsrvUrl.searchParams.set("fit", "cover"); // Crop to fit dimensions
  wsrvUrl.searchParams.set("a", "attention"); // Smart cropping

  return wsrvUrl.toString();
}

/**
 * Trả về URL ảnh gốc (không qua wsrv.nl) để dùng với next/image.
 * Cho phép Next.js tự tối ưu kích thước theo `sizes`/viewport, tránh double proxy.
 */
export function resolveOriginalImageUrl(src?: string): string {
  const s = (src || "").trim();
  if (!s) return PLACEHOLDER_POSTER;

  if (s.startsWith("http")) {
    return s;
  }

  const path = s.startsWith("/") ? s : `/uploads/movies/${s}`;
  return `${OPHIM_IMG_BASE}${path}`;
}

