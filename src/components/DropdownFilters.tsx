"use client";

import { useRouter } from "next/navigation";

interface Country {
  _id: string;
  name: string;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Year {
  year: number;
}

interface DropdownFiltersProps {
  countries: Country[];
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country) => void;
  isCountryDropdownOpen: boolean;
  setIsCountryDropdownOpen: (open: boolean) => void;
  
  categories: Category[];
  isCategoryDropdownOpen: boolean;
  setIsCategoryDropdownOpen: (open: boolean) => void;
  
  years: Year[];
  selectedYear: Year | null;
  setSelectedYear: (year: Year) => void;
  isYearDropdownOpen: boolean;
  setIsYearDropdownOpen: (open: boolean) => void;
}

export default function DropdownFilters({
  countries,
  selectedCountry,
  setSelectedCountry,
  isCountryDropdownOpen,
  setIsCountryDropdownOpen,
  categories,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  years,
  selectedYear,
  setSelectedYear,
  isYearDropdownOpen,
  setIsYearDropdownOpen,
}: DropdownFiltersProps) {
  const router = useRouter();

  // Helper function to close all dropdowns except the specified one
  const closeOtherDropdowns = (keepOpen: 'category' | 'country' | 'year') => {
    if (keepOpen !== 'category') setIsCategoryDropdownOpen(false);
    if (keepOpen !== 'country') setIsCountryDropdownOpen(false);
    if (keepOpen !== 'year') setIsYearDropdownOpen(false);
  };

  return (
    <>
      {/* Category Dropdown */}
      <div className="relative category-dropdown">
        <button
          onClick={() => {
            closeOtherDropdowns('category');
            setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
          }}
          className="text-sm text-netflix-text-gray hover:text-netflix-white transition-colors font-medium whitespace-nowrap"
        >
          <span className="whitespace-nowrap">Thể loại</span>
        </button>

        <div className={`absolute top-full left-0 mt-1 w-96 bg-netflix-dark border border-netflix-light-gray rounded-md shadow-lg z-50 transition-all duration-200 origin-top ${
          isCategoryDropdownOpen
            ? 'opacity-100 scale-y-100 translate-y-0'
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
        }`}>
          {Array.isArray(categories) && categories.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 p-2">
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => {
                    setIsCategoryDropdownOpen(false);
                    router.push(`/the-loai/${category.slug}`);
                  }}
                  className="text-left px-3 py-1.5 text-xs rounded hover:bg-netflix-gray transition-colors text-netflix-text-gray"
                >
                  {category.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-xs text-netflix-text-gray">
              Đang tải...
            </div>
          )}
        </div>
      </div>

      {/* Country Dropdown */}
      <div className="relative country-dropdown">
        <button
          onClick={() => {
            closeOtherDropdowns('country');
            setIsCountryDropdownOpen(!isCountryDropdownOpen);
          }}
          className="text-sm text-netflix-text-gray hover:text-netflix-white transition-colors font-medium whitespace-nowrap"
        >
          <span className="whitespace-nowrap">Quốc gia</span>
        </button>

        <div className={`absolute top-full left-0 mt-1 w-96 bg-netflix-dark border border-netflix-light-gray rounded-md shadow-lg z-50 transition-all duration-200 origin-top ${
          isCountryDropdownOpen
            ? 'opacity-100 scale-y-100 translate-y-0'
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
        }`}>
          {Array.isArray(countries) && countries.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 p-2">
              {countries.map((country) => (
                <button
                  key={country._id}
                  onClick={() => {
                    setSelectedCountry(country);
                    setIsCountryDropdownOpen(false);
                    router.push(`/quoc-gia/${country.slug}`);
                  }}
                  className={`text-left px-3 py-1.5 text-xs rounded hover:bg-netflix-gray transition-colors ${
                    selectedCountry?._id === country._id ? 'bg-netflix-gray text-netflix-white' : 'text-netflix-text-gray'
                  }`}
                >
                  {country.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-xs text-netflix-text-gray">
              Đang tải...
            </div>
          )}
        </div>
      </div>

      {/* Year Dropdown */}
      <div className="relative year-dropdown">
        <button
          onClick={() => {
            closeOtherDropdowns('year');
            setIsYearDropdownOpen(!isYearDropdownOpen);
          }}
          className="text-sm text-netflix-text-gray hover:text-netflix-white transition-colors font-medium whitespace-nowrap"
        >
          <span className="whitespace-nowrap">Năm phát hành</span>
        </button>

        <div className={`absolute top-full left-0 mt-1 w-96 bg-netflix-dark border border-netflix-light-gray rounded-md shadow-lg z-50 transition-all duration-200 origin-top ${
          isYearDropdownOpen
            ? 'opacity-100 scale-y-100 translate-y-0'
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
        }`}>
          {Array.isArray(years) && years.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 p-2">
              {years.map((year) => (
                <button
                  key={year.year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsYearDropdownOpen(false);
                    router.push(`/nam-phat-hanh/${year.year}`);
                  }}
                  className={`text-left px-3 py-1.5 text-xs rounded hover:bg-netflix-gray transition-colors ${
                    selectedYear?.year === year.year ? 'bg-netflix-gray text-netflix-white' : 'text-netflix-text-gray'
                  }`}
                >
                  {year.year}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-xs text-netflix-text-gray">
              Đang tải...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
