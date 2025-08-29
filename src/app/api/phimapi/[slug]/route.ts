import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const apiUrl = process.env.PHIMAPI_URL || 'https://phimapi.com';
    
    const response = await fetch(`${apiUrl}/phim/${slug}`, {
      headers: {
        'User-Agent': `Mozilla/5.0 (compatible; ${process.env.CUSTOM_APP_NAME || 'Movie4You'}/${process.env.CUSTOM_VERSION || '1.0'})`,
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Content not found' },
        {
          status: response.status >= 500 ? 502 : 404,
          headers: { 'x-powered-by': process.env.CUSTOM_APP_NAME || 'Movie4You' }
        }
      );
    }

    const data = await response.json();

    // Expand PhimAPI episodes to include s1 and s2 server variants when link_m3u8 uses s4.phim1280.tv
    const originalEpisodes = Array.isArray((data as any)?.episodes) ? (data as any).episodes : [];

    const cloneEpisodesWithVariant = (episodes: any[], variant: 's1' | 's2') => {
      return episodes.map((ep) => {
        const serverData = Array.isArray(ep?.server_data) ? ep.server_data : [];
        const clonedServerData = serverData.map((item: any) => {
          const originalM3u8: string | undefined = item?.link_m3u8;
          let rewrittenM3u8 = originalM3u8;
          if (typeof originalM3u8 === 'string') {
            // Only rewrite when domain matches s4.phim1280.tv
            rewrittenM3u8 = originalM3u8.replace(/https?:\/\/s4\.phim1280\.tv\//, `https://${variant}.phim1280.tv/`);
          }
          return {
            ...item,
            link_m3u8: rewrittenM3u8,
          };
        });
        return {
          ...ep,
          server_name: `${ep?.server_name || 'Server'} (${variant})`,
          server_data: clonedServerData,
        };
      });
    };

    const s1Episodes = cloneEpisodesWithVariant(originalEpisodes, 's1');
    const s2Episodes = cloneEpisodesWithVariant(originalEpisodes, 's2');
    const expandedEpisodes = [...originalEpisodes, ...s1Episodes, ...s2Episodes];

    // Format response similar to ophim structure
    return NextResponse.json({
      status: true,
      movie: (data as any).movie || data,
      episodes: expandedEpisodes
    }, {
      headers: { 'x-powered-by': process.env.CUSTOM_APP_NAME || 'Movie4You' }
    });
  } catch (error) {
    // Log error internally but don't expose details
    console.error('API Service Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again later.' },
      {
        status: 502,
        headers: { 'x-powered-by': process.env.CUSTOM_APP_NAME || 'Movie4You' }
      }
    );
  }
}
