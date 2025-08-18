import { Metadata } from 'next';
import CategoryClient from './CategoryClient';

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Map country slugs to Vietnamese names
  const countryNames: { [key: string]: string } = {
    'han-quoc': 'Hàn Quốc',
    'trung-quoc': 'Trung Quốc',
    'nhat-ban': 'Nhật Bản',
    'thai-lan': 'Thái Lan',
    'au-my': 'Âu Mỹ',
    'viet-nam': 'Việt Nam',
    'dai-loan': 'Đài Loan',
    'hong-kong': 'Hồng Kông',
    'an-do': 'Ấn Độ',
    'philippines': 'Philippines',
    'singapore': 'Singapore',
    'indonesia': 'Indonesia',
    'malaysia': 'Malaysia',
    'anh': 'Anh',
    'phap': 'Pháp',
    'duc': 'Đức',
    'nga': 'Nga',
    'canada': 'Canada',
    'uc': 'Úc',
    'tay-ban-nha': 'Tây Ban Nha',
    'y': 'Ý',
    'brazil': 'Brazil',
    'mexico': 'Mexico',
    'argentina': 'Argentina',
    'chile': 'Chile',
    'colombia': 'Colombia',
    'peru': 'Peru',
    'venezuela': 'Venezuela',
    'ecuador': 'Ecuador',
    'bolivia': 'Bolivia',
    'uruguay': 'Uruguay',
    'paraguay': 'Paraguay',
    'khac': 'Khác'
  };

  const countryName = countryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return {
    title: `Phim ${countryName} - Movie4You`,
    description: `Xem phim ${countryName} mới nhất, chất lượng HD. Tổng hợp các bộ phim hay nhất từ ${countryName}.`,
  };
}

export default async function CountryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  
  // Map country slugs to Vietnamese names
  const countryNames: { [key: string]: string } = {
    'han-quoc': 'Hàn Quốc',
    'trung-quoc': 'Trung Quốc',
    'nhat-ban': 'Nhật Bản',
    'thai-lan': 'Thái Lan',
    'au-my': 'Âu Mỹ',
    'viet-nam': 'Việt Nam',
    'dai-loan': 'Đài Loan',
    'hong-kong': 'Hồng Kông',
    'an-do': 'Ấn Độ',
    'philippines': 'Philippines',
    'singapore': 'Singapore',
    'indonesia': 'Indonesia',
    'malaysia': 'Malaysia',
    'anh': 'Anh',
    'phap': 'Pháp',
    'duc': 'Đức',
    'nga': 'Nga',
    'canada': 'Canada',
    'uc': 'Úc',
    'tay-ban-nha': 'Tây Ban Nha',
    'y': 'Ý',
    'brazil': 'Brazil',
    'mexico': 'Mexico',
    'argentina': 'Argentina',
    'chile': 'Chile',
    'colombia': 'Colombia',
    'peru': 'Peru',
    'venezuela': 'Venezuela',
    'ecuador': 'Ecuador',
    'bolivia': 'Bolivia',
    'uruguay': 'Uruguay',
    'paraguay': 'Paraguay',
    'khac': 'Khác'
  };

  const countryName = countryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Phim {countryName}</h1>
      </div>

      <CategoryClient
        slug={slug}
        initialLimit={24}
        loadMoreSize={12}
        sort_field={(resolvedSearchParams?.sort_field as string) || "modified.time"}
        sort_type={(resolvedSearchParams?.sort_type as string) || "desc"}
        country={(resolvedSearchParams?.country as string) || ""}
        category={(resolvedSearchParams?.category as string) || ""}
        year={(resolvedSearchParams?.year as string) || ""}
      />
    </div>
  );
}
