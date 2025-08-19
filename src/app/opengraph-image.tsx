import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'MOVIE4YOU - Xem Phim Online HD Vietsub Thuyết Minh Miễn Phí';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #e50914 0%, #ff6b6b 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
          }}
        >
          MOVIE4YOU
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Xem Phim Online HD Vietsub Thuyết Minh Miễn Phí
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#999999',
            marginTop: 20,
          }}
        >
          Phim Mới Cập Nhật 2025
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
