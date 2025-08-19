"use client";

import CategoryClient from "@/components/CategoryClient";

interface CategoryPageWrapperProps {
  type: 'category' | 'genre' | 'country' | 'year';
  slug: string;
  title: string;
}

export default function CategoryPageWrapper({ type, slug, title }: CategoryPageWrapperProps) {
  return (
    <CategoryClient
      type={type}
      slug={slug}
      title={title}
      endpoint="/danh-sach/phim-moi-cap-nhat"
    />
  );
}
