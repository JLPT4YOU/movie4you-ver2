"use client";

import dynamic from "next/dynamic";

// Lazy load components
const HeroSection = dynamic(() => import("@/components/OptimizedHeroSection"), {
  loading: () => (
    <div className="min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] bg-netflix-black animate-pulse" />
  )
});

const MovieSection = dynamic(() => import("@/components/OptimizedMovieSection"), {
  ssr: false,
  loading: () => (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-96 bg-netflix-gray/10 rounded animate-pulse" />
    </div>
  )
});

export default function Home() {
  return (
    <>
      <HeroSection />
      <MovieSection />
    </>
  );
}
