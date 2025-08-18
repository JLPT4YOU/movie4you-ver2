import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInfiniteOphimList } from "@/hooks/useInfiniteOphimList";

// Simple mock for fetch
const makeItems = (n: number) => Array.from({ length: n }, (_, i) => ({ name: `Movie ${i+1}`, slug: `movie-${i+1}`, modified: { time: `${i}` } }));

describe("useInfiniteOphimList", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async (input: any) => {
      const url = String(input);
      const u = new URL(url, "http://localhost");
      const page = Number(u.searchParams.get("page") || 1);
      const limit = Number(u.searchParams.get("limit") || 6);
      const items = makeItems(limit);
      return {
        ok: true,
        json: async () => ({ data: { items } }),
      } as any;
    }));
  });

  afterEach(() => {
    (globalThis.fetch as any)?.mockRestore?.();
  });

  it("loads initial page and resets on resetKey change", async () => {
    const { result, rerender } = renderHook((props: any) => useInfiniteOphimList(props), {
      initialProps: { kind: "danh-sach", slugOrYear: "moi-cap-nhat", initialLimit: 4, loadMoreSize: 4, commonParams: {}, resetKey: "a" },
    });

    // initial load is async; wait a tick
    await act(async () => {});
    expect(result.current.items.length).toBe(4);

    // change resetKey to trigger reset
    rerender({ kind: "danh-sach", slugOrYear: "moi-cap-nhat", initialLimit: 4, loadMoreSize: 4, commonParams: {}, resetKey: "b" });
    await act(async () => {});
    expect(result.current.items.length).toBe(4);
  });
});

