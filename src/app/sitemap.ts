import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/home/category/phim-moi`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/home/category/phim-bo`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/home/category/phim-le`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/home/category/tv-shows`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/home/category/hoat-hinh`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/home/category/phim-chieu-rap`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/home/lich-su`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];

  // Fetch dynamic movie pages
  let moviePages: MetadataRoute.Sitemap = [];
  
  try {
    // Fetch latest movies for sitemap (limit to recent ones for performance)
    const categories = ['phim-moi-cap-nhat', 'phim-bo', 'phim-le'];
    
    for (const category of categories) {
      const response = await fetch(
        `${baseUrl}/api/ophim/v1/api/danh-sach/${category}?page=1`,
        { next: { revalidate: 3600 } }
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'success' && data.data?.items) {
          const movies = data.data.items.slice(0, 50); // Limit to 50 per category
          
          moviePages = moviePages.concat(
            movies.map((movie: { slug: string; modified?: { time?: string } }) => ({
              url: `${baseUrl}/home/phim/${movie.slug}`,
              lastModified: movie.modified?.time ? new Date(movie.modified.time) : new Date(),
              changeFrequency: 'weekly' as const,
              priority: 0.7,
            }))
          );
        }
      }
    }
  } catch (error) {
  }

  // Fetch category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  
  try {
    const response = await fetch(`${baseUrl}/api/ophim/v1/api/the-loai`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.status === 'success' && data.data?.items) {
        categoryPages = data.data.items.map((category: { slug: string }) => ({
          url: `${baseUrl}/home/the-loai/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
      }
    }
  } catch (error) {
  }

  return [...staticPages, ...moviePages, ...categoryPages];
}
