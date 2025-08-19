"use client";

import CategoryPageWrapper from "@/components/CategoryPageWrapper";

interface CategoryPageProps {
  slug: string;
  title: string;
}

export default function CategoryPage({ slug, title }: CategoryPageProps) {
  return (
    <CategoryPageWrapper
      type="category"
      slug={slug}
      title={title}
    />
  );
}
