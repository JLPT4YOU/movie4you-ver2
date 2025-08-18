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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const title = slugTitle(slug);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      </div>

      <CategoryClient category={{ slug, name: title }} />
    </div>
  );
}
