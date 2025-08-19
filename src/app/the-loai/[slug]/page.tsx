import CategoryClient from "./CategoryClient";

function slugTitle(slug: string) {
  const map: Record<string, string> = {
    // Thể loại
    "hanh-dong": "Hành Động",
    "tinh-cam": "Tình Cảm",
    "hai-huoc": "Hài Hước",
    "co-trang": "Cổ Trang",
    "tam-ly": "Tâm Lý",
    "hinh-su": "Hình Sự",
    "chien-tranh": "Chiến Tranh",
    "the-thao": "Thể Thao",
    "vo-thuat": "Võ Thuật",
    "vien-tuong": "Viễn Tưởng",
    "phieu-luu": "Phiêu Lưu",
    "khoa-hoc": "Khoa Học",
    "kinh-di": "Kinh Dị",
    "am-nhac": "Âm Nhạc",
    "than-thoai": "Thần Thoại",
    "tai-lieu": "Tài Liệu",
    "gia-dinh": "Gia Đình",
    "chinh-kich": "Chính kịch",
    "bi-an": "Bí ẩn",
    "hoc-duong": "Học Đường",
    "kinh-dien": "Kinh Điển",
    "phim-18": "Phim 18+",
  };
  return map[slug] || slug.replace(/-/g, " ");
}

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Future use: search parameters for filtering
  // const searchParamsData = searchParams ? await searchParams : {};
  // const sort_field = (searchParamsData?.sort_field as string) || "modified.time";
  // const sort_type = (searchParamsData?.sort_type as string) || "desc";
  // const country = (searchParamsData?.country as string) || "";
  // const category = (searchParamsData?.category as string) || "";
  // const year = (searchParamsData?.year as string) || "";

  const title = slugTitle(slug);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-6">
      <CategoryClient
        slug={slug}
        title={title}
      />
    </div>
  );
}
