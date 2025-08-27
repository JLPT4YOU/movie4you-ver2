"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface DropdownItem {
  _id: string;
  name: string;
  slug: string;
  year?: number;
}

interface LazyDropdownProps {
  title: string;
  apiEndpoint: string;
  urlPrefix: string; // '/the-loai', '/quoc-gia', '/nam-phat-hanh'
  isOpen: boolean;
  onToggle: () => void;
}

export default function LazyDropdown({
  title,
  apiEndpoint,
  urlPrefix,
  isOpen,
  onToggle
}: LazyDropdownProps) {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch data when dropdown opens
  const fetchData = useCallback(async () => {
    if (loaded || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(apiEndpoint, {
        headers: { accept: 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 3600 } // Cache 1 hour
      });
      
      if (!response.ok) throw new Error(`Failed to fetch ${apiEndpoint}`);
      
      const data = await response.json();
      let itemsArray: DropdownItem[] = [];
      
      // Handle different response structures
      if (data.status && data.data) {
        if (Array.isArray(data.data)) {
          itemsArray = data.data;
        } else if (data.data.items && Array.isArray(data.data.items)) {
          itemsArray = data.data.items;
        } else if (typeof data.data === 'object') {
          itemsArray = Object.values(data.data).filter((item: unknown) => 
            item && typeof item === 'object' && (item as DropdownItem)._id && (item as DropdownItem).name && ((item as DropdownItem).slug || (item as DropdownItem).year)
          ) as DropdownItem[];
        }
      }
      
      setItems(itemsArray);
      setLoaded(true);
    } catch (error) {
      console.error(`Error fetching ${apiEndpoint}:`, error);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, loaded, loading]);

  // Load data when dropdown opens
  useEffect(() => {
    if (isOpen && !loaded) {
      fetchData();
    }
  }, [isOpen, loaded, fetchData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center space-x-1 text-netflix-white hover:text-netflix-red transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-netflix-black border border-netflix-gray rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-netflix-gray rounded"></div>
                ))}
              </div>
            </div>
          ) : items.length > 0 ? (
            <div className="py-2">
              <div className="grid grid-cols-2 gap-1 p-2">
                {items.map((item) => (
                  <Link
                    key={item._id}
                    href={`${urlPrefix}/${item.slug || item.year}`}
                    className="block px-3 py-2 text-sm text-netflix-white hover:bg-netflix-gray hover:text-netflix-red transition-colors rounded"
                    onClick={onToggle}
                  >
                    {item.name || item.year}
                  </Link>
                ))}
              </div>
            </div>
          ) : loaded ? (
            <div className="p-4 text-center text-netflix-gray text-sm">
              Không có dữ liệu
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
