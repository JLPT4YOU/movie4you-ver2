"use client";

import { useState } from "react";
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
    time?: string; // e.g., "120 phút"
    episode_time?: string; // e.g., "45 phút/tập"
    modified: {
      time: string;
    };
  };
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const placeholder = PLACEHOLDER_POSTER;
  const resolvedSrc = imageError ? placeholder : resolveImageUrl(movie.thumb_url);


  const duration = movie.time || movie.episode_time || "";

  return (
    <Link
      href={`/phim/${movie.slug}`}
      className="relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10 block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-netflix-gray shadow-[0_10px_20px_rgba(0,0,0,0.35)]">
        <Image
          src={resolvedSrc}
          alt={movie.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          priority={false}
          onError={() => setImageError(true)}
        />

        {/* Permanent bottom gradient for text legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-netflix-black/85 via-netflix-black/40 to-transparent" />

        {/* Always-visible title + meta */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-netflix-white text-sm font-semibold drop-shadow line-clamp-1">{movie.name}</h3>
          <div className="mt-1 text-[11px] text-netflix-white/90 flex items-center gap-2">
            <span>{movie.year || ""}</span>
            {duration && <span className="inline-block w-1 h-1 rounded-full bg-netflix-white/70" />}
            {duration && <span className="truncate" title={duration}>{duration}</span>}
          </div>
        </div>

        {/* Play button overlay - only show when this specific card is hovered */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 animate-fade-in transition-opacity duration-300"
               style={{ opacity: 1 }}>
            <button className="bg-netflix-white/90 rounded-full p-3 hover:bg-netflix-white transition-colors shadow">
              <svg className="w-6 h-6 text-netflix-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
