'use client';

import { useTrailer } from '@/contexts/TrailerContext';
import dynamic from 'next/dynamic';

// Lazy-load trailer popup overlay
const TrailerPopup = dynamic(() => import('./TrailerPopup'));

export default function GlobalTrailer() {
  const { trailerUrl, movieName, hideTrailer } = useTrailer();

  if (!trailerUrl || !movieName) {
    return null;
  }

  return <TrailerPopup trailerUrl={trailerUrl} movieName={movieName} onClose={hideTrailer} />;
}

