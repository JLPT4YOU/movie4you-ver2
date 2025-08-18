import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.scrollY and related properties
Object.defineProperty(window, "scrollY", { value: 0, writable: true });
Object.defineProperty(window, "innerHeight", { value: 800, writable: true });
Object.defineProperty(document.documentElement, "scrollTop", { value: 0, writable: true });
Object.defineProperty(document.documentElement, "clientHeight", { value: 800, writable: true });
Object.defineProperty(document.documentElement, "scrollHeight", { value: 1600, writable: true });
