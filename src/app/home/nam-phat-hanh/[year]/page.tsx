import { Metadata } from 'next';
import CategoryClient from './CategoryClient';

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  
  return {
    title: `Phim năm ${year} - Movie4You`,
    description: `Xem phim năm ${year} mới nhất, chất lượng HD. Tổng hợp các bộ phim hay nhất phát hành năm ${year}.`,
  };
}

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  // Future use: const resolvedSearchParams = await searchParams;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-6">
      <CategoryClient
        year={year}
        title={`Phim năm ${year}`}
      />
    </div>
  );
}
