import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const apiUrl = process.env.NGUONC_URL || 'https://phim.nguonc.com';
    
    const response = await fetch(`${apiUrl}/api/film/${slug}`, {
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

    // Format response similar to ophim structure
    return NextResponse.json({
      status: true,
      movie: data.movie || data,
      episodes: data.episodes || []
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
