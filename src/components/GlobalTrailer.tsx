'use client';

import { useTrailer } from '@/contexts/TrailerContext';
import TrailerPopup from './TrailerPopup';

export default function GlobalTrailer() {
  const { trailerUrl, movieName, hideTrailer } = useTrailer();

  if (!trailerUrl || !movieName) {
    return null;
  }

  return <TrailerPopup trailerUrl={trailerUrl} movieName={movieName} onClose={hideTrailer} />;
}

