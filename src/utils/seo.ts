// SEO utilities for movie website
import { Metadata } from 'next';
import { MovieDetail } from '@/types/movie';

// Generate optimized meta title
export function generateTitle(title: string, subtitle?: string): string {
  const siteName = 'MOVIE4YOU';
  const baseTitle = subtitle 
    ? `${title} - ${subtitle}` 
    : title;
  
  // Add SEO keywords to title
  const seoSuffix = 'Xem Phim Online HD Vietsub';
  
  return `${baseTitle} | ${seoSuffix} | ${siteName}`;
}

// Generate optimized meta description
export function generateDescription(movie: MovieDetail): string {
  const year = movie.year || new Date().getFullYear();
  const quality = movie.quality || 'HD';
  const episodes = movie.episode_current 
    ? `${movie.episode_current}/${movie.episode_total || '??'} tập` 
    : 'Full';
  
  return `Xem phim ${movie.name} (${movie.origin_name}) ${year} ${quality} Vietsub miễn phí. ${episodes}. ${movie.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...`;
}

// Generate keywords for movie
export function generateKeywords(movie: MovieDetail): string[] {
  const keywords = [
    'xem phim online',
    'phim hd vietsub',
    'phim mới nhất',
    movie.name.toLowerCase(),
    movie.origin_name?.toLowerCase(),
    `phim ${movie.name}`,
    `xem phim ${movie.name}`,
    `${movie.name} vietsub`,
    `${movie.name} ${movie.year}`,
  ];
  
  // Add categories as keywords
  if (movie.category) {
    movie.category.forEach(cat => {
      keywords.push(`phim ${cat.name.toLowerCase()}`);
    });
  }
  
  // Add country as keyword
  if (movie.country?.[0]) {
    keywords.push(`phim ${movie.country[0].name.toLowerCase()}`);
  }
  
  // Add type-specific keywords
  if (movie.type === 'series') {
    keywords.push('phim bộ', `phim bộ ${movie.name}`);
  } else {
    keywords.push('phim lẻ', `phim lẻ ${movie.name}`);
  }
  
  return keywords;
}

// Generate movie structured data (Schema.org)
export function generateMovieSchema(movie: MovieDetail, url: string) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': movie.type === 'series' ? 'TVSeries' : 'Movie',
    name: movie.name,
    alternateName: movie.origin_name,
    url: url,
    image: movie.thumb_url,
    description: movie.content?.replace(/<[^>]*>/g, ''),
    dateCreated: movie.year,
    genre: movie.category?.map(c => c.name),
    countryOfOrigin: {
      '@type': 'Country',
      name: movie.country?.[0]?.name
    },
    numberOfEpisodes: movie.episode_total,
    actor: movie.actor?.map(name => ({
      '@type': 'Person',
      name: name
    })),
    director: movie.director?.map(name => ({
      '@type': 'Person', 
      name: name
    })),
    aggregateRating: movie.imdb ? {
      '@type': 'AggregateRating',
      ratingValue: movie.imdb.vote_average,
      ratingCount: movie.imdb.vote_count,
      bestRating: 10,
      worstRating: 0
    } : undefined,
    trailer: movie.trailer_url ? {
      '@type': 'VideoObject',
      name: `${movie.name} - Trailer`,
      embedUrl: movie.trailer_url,
      thumbnailUrl: movie.thumb_url,
      uploadDate: new Date().toISOString()
    } : undefined
  };
  
  // Remove undefined values
  return JSON.parse(JSON.stringify(schema));
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Generate website structured data
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MOVIE4YOU',
    alternateName: 'Movie4You - Xem Phim Online',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com'}/tim-kiem?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// Generate Open Graph tags
export function generateOpenGraph(movie: MovieDetail, url: string): Metadata['openGraph'] {
  return {
    title: `${movie.name} (${movie.year})`,
    description: generateDescription(movie),
    url: url,
    siteName: 'MOVIE4YOU',
    images: [
      {
        url: movie.poster_url || movie.thumb_url,
        width: 1200,
        height: 630,
        alt: movie.name,
      }
    ],
    locale: 'vi_VN',
    type: 'video.movie',
    videos: movie.trailer_url ? [
      {
        url: movie.trailer_url,
        width: 1280,
        height: 720,
      }
    ] : undefined,
  };
}

// Generate Twitter Card tags
export function generateTwitterCard(movie: MovieDetail): Metadata['twitter'] {
  return {
    card: 'summary_large_image',
    title: `${movie.name} (${movie.year})`,
    description: generateDescription(movie),
    images: [movie.poster_url || movie.thumb_url],
  };
}
