"use client";

import { useEffect } from "react";

interface SmartResourceHintsProps {
  enableImagePreconnect?: boolean;
  enableAPIPreload?: boolean;
}

export default function SmartResourceHints({ 
  enableImagePreconnect = false,
  enableAPIPreload = false 
}: SmartResourceHintsProps) {
  useEffect(() => {
    // Only add resource hints when they're actually needed
    if (enableImagePreconnect) {
      // Add preconnect for img.ophim.live only when images are about to load
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://wsrv.nl';
      document.head.appendChild(link);
    }

    if (enableAPIPreload) {
      // Preload critical API endpoints after LCP using idle time
      const schedule = (cb: () => void) => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(cb, { timeout: 5000 });
        } else {
          setTimeout(cb, 2000);
        }
      };

      schedule(() => {
        const criticalEndpoints = [
          '/api/ophim/v1/api/danh-sach/phim-chieu-rap?page=1&limit=6&sort_field=modified.time&sort_type=desc'
        ];

        criticalEndpoints.forEach(endpoint => {
          fetch(endpoint, {
            method: 'GET',
            priority: 'low' as RequestPriority
          }).catch(() => {
            // Ignore errors for preload
          });
        });
      });
    }

  }, [enableImagePreconnect, enableAPIPreload]);

  return null;
}
