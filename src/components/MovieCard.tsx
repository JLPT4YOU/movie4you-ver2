"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { resolveImageUrl, PLACEHOLDER_POSTER } from "@/utils/ophim";

interface MovieCardProps {
  movie: {
    name: string;
    slug: string;
    origin_name: string;
    thumb_url: string;
    poster_url: string;
    year: number;
    time?: string;
    episode_time?: string;
    modified: {
      time: string;
    };
  };
  lazy?: boolean;
}

export default function MovieCard({ movie, lazy = true }: MovieCardProps) {
  const [isVisible, setIsVisible] = useState(!lazy);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  const placeholder = PLACEHOLDER_POSTER;
  const resolvedSrc = imageError ? placeholder : resolveImageUrl(movie.thumb_url, 400, 90);
  const duration = movie.time || movie.episode_time || "";

  return (
    <div ref={cardRef}>
      <Link
        href={`/phim/${movie.slug}`}
        className="relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10 block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-netflix-gray shadow-[0_10px_20px_rgba(0,0,0,0.35)]">
          {isVisible ? (
            <Image
              src={resolvedSrc}
              alt={movie.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
              loading={lazy ? "lazy" : "eager"}
              priority={!lazy}
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-netflix-gray animate-pulse" />
          )}

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-netflix-black/85 via-netflix-black/40 to-transparent" />

          {/* Title and metadata */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-netflix-white text-sm font-semibold drop-shadow line-clamp-1">{movie.name}</h3>
            <div className="mt-1 text-[11px] text-netflix-white/90 flex items-center gap-2">
              <span>{movie.year || ""}</span>
              {duration && <span className="inline-block w-1 h-1 rounded-full bg-netflix-white/70" />}
              {duration && <span className="truncate" title={duration}>{duration}</span>}
            </div>
          </div>

          {/* Play button overlay */}
          {isHovered && isVisible && (
            <div 
              className="absolute inset-0 flex items-center justify-center opacity-0 animate-fade-in transition-opacity duration-300 z-10 pointer-events-none"
              style={{ opacity: 1 }}>
              <div className="bg-netflix-white/90 rounded-full p-3 hover:bg-netflix-white transition-colors shadow">
                <svg className="w-6 h-6 text-netflix-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
