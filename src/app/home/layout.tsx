import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata: Metadata = {
  title: 'MOVIE4YOU - Xem phim online miễn phí',
  description: 'Xem phim online miễn phí chất lượng HD, phim mới, phim hay 2024. Phim bộ, phim lẻ, phim chiếu rạp cập nhật liên tục.',
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
