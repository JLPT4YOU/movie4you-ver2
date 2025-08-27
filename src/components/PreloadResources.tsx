"use client";

import { useEffect } from "react";

interface PreloadResourcesProps {
  heroImageUrl?: string;
  criticalImages?: string[];
}

export default function PreloadResources({ heroImageUrl, criticalImages = [] }: PreloadResourcesProps) {
  useEffect(() => {
    // Preload hero image with high priority
    if (heroImageUrl) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImageUrl;
      link.fetchPriority = 'high';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }

    // Preload critical images
    criticalImages.forEach((imageUrl, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;
      link.fetchPriority = index < 3 ? 'high' : 'low';
      document.head.appendChild(link);
    });

    // Only preload API endpoints that are actually used immediately
    // Remove unused API preloads to avoid warnings

  }, [heroImageUrl, criticalImages]);

  return null;
}
