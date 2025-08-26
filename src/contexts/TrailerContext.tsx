'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

interface TrailerContextType {
  trailerUrl: string | null;
  movieName: string | null;
  showTrailer: (url: string, name: string) => void;
  hideTrailer: () => void;
}

const TrailerContext = createContext<TrailerContextType | undefined>(undefined);

export function TrailerProvider({ children }: { children: ReactNode }) {
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [movieName, setMovieName] = useState<string | null>(null);

  const showTrailer = (url: string, name: string) => {
    setTrailerUrl(url);
    setMovieName(name);
  };

  const hideTrailer = () => {
    setTrailerUrl(null);
    setMovieName(null);
  };

  return (
    <TrailerContext.Provider value={{ trailerUrl, movieName, showTrailer, hideTrailer }}>
      {children}
    </TrailerContext.Provider>
  );
}

export function useTrailer() {
  const context = useContext(TrailerContext);
  if (context === undefined) {
    throw new Error('useTrailer must be used within a TrailerProvider');
  }
  return context;
}

