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

    // Preload critical API endpoints
    const criticalEndpoints = [
      '/api/ophim/v1/api/the-loai',
      '/api/ophim/v1/api/quoc-gia',
      '/api/ophim/v1/api/nam-phat-hanh'
    ];

    criticalEndpoints.forEach(endpoint => {
      fetch(endpoint, { 
        method: 'GET',
        priority: 'low' as RequestPriority
      }).catch(() => {
        // Ignore errors for preload
      });
    });

    // DNS prefetch for external domains
    const externalDomains = [
      'img.ophim.live',
      'phimapi.com',
      'phim.nguonc.com'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `https://${domain}`;
      document.head.appendChild(link);
    });

  }, [heroImageUrl, criticalImages]);

  return null;
}
