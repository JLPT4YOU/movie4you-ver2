"use client";

import CategoryPageWrapper from "@/components/CategoryPageWrapper";

interface CategoryPageProps {
  slug: string;
  title: string;
}

export default function CountryPage({ slug, title }: CategoryPageProps) {
  return (
    <CategoryPageWrapper
      type="country"
      slug={slug}
      title={title}
    />
  );
}
