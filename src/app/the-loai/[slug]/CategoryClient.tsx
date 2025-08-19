"use client";

import CategoryPageWrapper from "@/components/CategoryPageWrapper";

interface CategoryPageProps {
  slug: string;
  title: string;
}

export default function GenrePage({ slug, title }: CategoryPageProps) {
  return (
    <CategoryPageWrapper
      type="genre"
      slug={slug}
      title={title}
    />
  );
}
