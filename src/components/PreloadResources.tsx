"use client";

import { useEffect } from "react";

interface PreloadResourcesProps {
  heroImageUrl?: string;
  criticalImages?: string[];
}

export default function PreloadResources({ heroImageUrl, criticalImages = [] }: PreloadResourcesProps) {
  useEffect(() => {
    const createdLinks: HTMLLinkElement[] = [];

    // Preload hero image with high priority
    if (heroImageUrl) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImageUrl;
      link.fetchPriority = 'high';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      createdLinks.push(link);
    }

    // Preload critical images
    criticalImages.forEach((imageUrl, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;
      link.fetchPriority = index < 3 ? 'high' : 'low';
      document.head.appendChild(link);
      createdLinks.push(link);
    });

    // Cleanup on unmount or when deps change
    return () => {
      createdLinks.forEach((link) => {
        try {
          document.head.removeChild(link);
        } catch {}
      });
    };
  }, [heroImageUrl, criticalImages]);

  return null;
}
