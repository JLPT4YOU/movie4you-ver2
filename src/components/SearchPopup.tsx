"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconSearch } from "./icons";

interface SearchMovie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  type: string;
}

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search function
  const searchMovies = async (keyword: string) => {
    if (keyword.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const url = `/api/ophim/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=8`;
      const options = { method: 'GET', headers: { accept: 'application/json' } };
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.status && data.data && data.data.items) {
        setSearchResults(data.data.items);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchMovies(searchQuery.trim());
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle ESC key to close search popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 search-popup">
      <div className="bg-netflix-dark/95 backdrop-blur-md rounded-2xl shadow-2xl border border-netflix-light-gray/20 w-full max-w-2xl mx-4 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-4 p-6 border-b border-netflix-light-gray/20">
          <IconSearch className="w-6 h-6 text-netflix-text-gray flex-shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm phim, diễn viên, đạo diễn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-netflix-white placeholder-netflix-text-gray text-lg outline-none"
            autoFocus
          />
          <button
            onClick={handleClose}
            className="text-netflix-text-gray hover:text-netflix-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-netflix-red"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((movie) => (
                <Link
                  key={movie._id}
                  href={`/phim/${movie.slug}`}
                  onClick={handleClose}
                  className="flex items-center gap-4 p-4 hover:bg-netflix-gray/30 transition-colors"
                >
                  <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-netflix-gray">
                    <Image
                      src={`https://img.ophim.live/uploads/movies/${movie.thumb_url || movie.poster_url}`}
                      alt={movie.name}
                      width={64}
                      height={96}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-movie.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-netflix-white font-medium text-lg truncate">
                      {movie.name}
                    </h3>
                    <p className="text-netflix-text-gray text-sm truncate">
                      {movie.origin_name} • {movie.year}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-netflix-red/20 text-netflix-red px-2 py-1 rounded">
                        {movie.type === 'series' ? 'Phim bộ' : 'Phim lẻ'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="text-center py-8 text-netflix-text-gray">
              Không tìm thấy kết quả cho &ldquo;{searchQuery}&rdquo;
            </div>
          ) : searchQuery.length > 0 ? (
            <div className="text-center py-8 text-netflix-text-gray">
              Nhập ít nhất 2 ký tự để tìm kiếm
            </div>
          ) : (
            <div className="text-center py-8 text-netflix-text-gray">
              Nhập từ khóa để tìm kiếm phim
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
