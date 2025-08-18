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

export default async function YearPage({ params }: PageProps) {
  const { year } = await params;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Phim năm {year}</h1>
      </div>

      <CategoryClient year={year} />
    </div>
  );
}
