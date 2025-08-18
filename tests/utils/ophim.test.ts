import { describe, it, expect } from "vitest";
import { slugify, buildSearch, resolveImageUrl, normalizeMovie, OPHIM_IMG_BASE, PLACEHOLDER_POSTER } from "@/utils/ophim";

describe("ophim utils", () => {
  it("slugify should simplify Vietnamese and spaces", () => {
    expect(slugify("Hành Động 2024!"))
      .toBe("hanh-dong-2024");
  });

  it("buildSearch should skip empty/undefined and serialize values", () => {
    const qs = buildSearch({ a: "1", b: "", c: undefined, d: 2 });
    // Order may vary; validate contains keys
    expect(qs.includes("a=1")).toBe(true);
    expect(qs.includes("d=2")).toBe(true);
    expect(qs.includes("b=")).toBe(false);
    expect(qs.includes("c=")).toBe(false);
  });

  it("resolveImageUrl should return placeholder for empty", () => {
    expect(resolveImageUrl("")).toBe(PLACEHOLDER_POSTER);
  });

  it("resolveImageUrl should passthrough absolute URL", () => {
    const url = "https://example.com/img.jpg";
    expect(resolveImageUrl(url)).toBe(url);
  });

  it("resolveImageUrl should prefix relative path correctly", () => {
    expect(resolveImageUrl("movie.jpg")).toBe(`${OPHIM_IMG_BASE}/uploads/movies/movie.jpg`);
    expect(resolveImageUrl("/uploads/movies/movie.jpg")).toBe(`${OPHIM_IMG_BASE}/uploads/movies/movie.jpg`);
  });

  it("normalizeMovie should map common fields and fallback slug", () => {
    const raw: any = {
      name: "Phim Test",
      thumb_url: "thumb.jpg",
      poster_url: "poster.jpg",
      year: "2024",
      modified: { time: "123" },
    };
    const m = normalizeMovie(raw)!;
    expect(m.name).toBe("Phim Test");
    expect(m.slug).toBe("phim-test");
    expect(m.year).toBe(2024);
    expect(m.thumb_url).toBe("thumb.jpg");
    expect(m.poster_url).toBe("poster.jpg");
    expect(typeof m.id).toBe("string");
  });
});

