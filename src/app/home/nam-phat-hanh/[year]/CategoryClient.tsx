"use client";

import CategoryPageWrapper from "@/components/CategoryPageWrapper";

interface CategoryPageProps {
  year: string;
  title: string;
}

export default function YearPage({ year, title }: CategoryPageProps) {
  return (
    <CategoryPageWrapper
      type="year"
      slug={year}
      title={title}
    />
  );
}
