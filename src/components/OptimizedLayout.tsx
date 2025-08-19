"use client";

import { ReactNode } from "react";

interface OptimizedLayoutProps {
  children: ReactNode;
}

export default function OptimizedLayout({ children }: OptimizedLayoutProps) {
  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Fixed header height to prevent layout shift */}
      <div className="h-16" />
      
      {/* Main content with fixed dimensions */}
      <main className="relative">
        {children}
      </main>
      
      {/* Footer with fixed height */}
      <footer className="mt-auto">
        {/* Footer content will be loaded here */}
      </footer>
    </div>
  );
}
