"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

interface FilterBarProps {
  onFilterChange?: (filters: {
    sort_field: string;
    sort_type: string;
    country: string;
    year: string;
    category: string;
  }) => void;
  // Control which filters to show
  showCountryFilter?: boolean;
  showCategoryFilter?: boolean;
  showYearFilter?: boolean;
}

export default function FilterBar({
  onFilterChange,
  showCountryFilter = true,
  showCategoryFilter = true,
  showYearFilter = true
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Current filter values
  const [sortField, setSortField] = useState(searchParams.get('sort_field') || 'modified.time');
  const [sortType, setSortType] = useState(searchParams.get('sort_type') || 'desc');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');

  // Generate years from 1990 to current year + 2
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1988 }, (_, i) => currentYear + 2 - i);

  // Sort options
  // Note: API backend sorts in reverse order, so we need to flip asc/desc
  const sortOptions = [
    { field: 'modified.time', type: 'desc', label: 'Mới nhất' },
    { field: 'modified.time', type: 'asc', label: 'Cũ nhất' },
    { field: 'year', type: 'asc', label: 'Năm mới nhất' },  // Flipped: asc gives newest first
    { field: 'year', type: 'desc', label: 'Năm cũ nhất' },  // Flipped: desc gives oldest first
    { field: '_id', type: 'desc', label: 'ID giảm dần' },
    { field: '_id', type: 'asc', label: 'ID tăng dần' },
  ];

  // Fetch countries and categories
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/ophim/v1/api/quoc-gia');
        const data = await response.json();
        if (data.data?.items) {
          setCountries(data.data.items);
        }
      } catch (error) {
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/ophim/v1/api/the-loai');
        const data = await response.json();
        if (data.data?.items) {
          setCategories(data.data.items);
        }
      } catch (error) {
      }
    };

    if (showCountryFilter) {
      fetchCountries();
    }
    if (showCategoryFilter) {
      fetchCategories();
    }
  }, [showCountryFilter, showCategoryFilter]);

  // Update URL and notify parent when filters change
  const updateFilters = (newFilters: Partial<{
    sort_field: string;
    sort_type: string;
    country: string;
    category: string;
    year: string;
  }>) => {
    const updatedFilters = {
      sort_field: newFilters.sort_field !== undefined ? newFilters.sort_field : sortField,
      sort_type: newFilters.sort_type !== undefined ? newFilters.sort_type : sortType,
      country: newFilters.country !== undefined ? newFilters.country : selectedCountry,
      category: newFilters.category !== undefined ? newFilters.category : selectedCategory,
      year: newFilters.year !== undefined ? newFilters.year : selectedYear,
    };

    // Update local state
    setSortField(updatedFilters.sort_field);
    setSortType(updatedFilters.sort_type);
    setSelectedCountry(updatedFilters.country);
    setSelectedCategory(updatedFilters.category);
    setSelectedYear(updatedFilters.year);

    // Update URL
    const params = new URLSearchParams(searchParams);
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${window.location.pathname}?${params.toString()}`);

    // Notify parent component
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const getCountryName = (slug: string) => {
    const country = countries.find(c => c.slug === slug);
    return country ? country.name : slug;
  };

  const getCategoryName = (slug: string) => {
    const category = categories.find(c => c.slug === slug);
    return category ? category.name : slug;
  };

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.field === sortField && opt.type === sortType);
    return option ? option.label : 'Sắp xếp';
  };

  return (
    <div className="bg-netflix-dark-gray/90 backdrop-blur-sm border border-netflix-light-gray/20 rounded-lg p-4 relative z-10">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-white/70 text-sm font-medium">Lọc và sắp xếp:</span>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSortDropdownOpen(!isSortDropdownOpen);
                setIsCountryDropdownOpen(false);
                setIsCategoryDropdownOpen(false);
                setIsYearDropdownOpen(false);
              }}
              className="flex items-center gap-2 bg-netflix-gray/50 hover:bg-netflix-gray text-white p-2 rounded text-sm transition-colors"
            >
              <span>{getCurrentSortLabel()}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isSortDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-black/95 backdrop-blur-sm border border-netflix-light-gray/30 rounded-md shadow-xl z-[100] min-w-[160px]">
                {sortOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      updateFilters({ sort_field: option.field, sort_type: option.type });
                      setIsSortDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-netflix-gray transition-colors text-white"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Country Dropdown */}
          {showCountryFilter && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsCountryDropdownOpen(!isCountryDropdownOpen);
                  setIsSortDropdownOpen(false);
                  setIsCategoryDropdownOpen(false);
                  setIsYearDropdownOpen(false);
                }}
                className="flex items-center gap-2 bg-netflix-gray/50 hover:bg-netflix-gray text-white p-2 rounded text-sm transition-colors"
              >
                <span>{selectedCountry ? getCountryName(selectedCountry) : 'Quốc gia'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCountryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-black/95 backdrop-blur-sm border border-netflix-light-gray/30 rounded-md shadow-xl z-[100] min-w-[160px] max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      updateFilters({ country: '' });
                      setIsCountryDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-netflix-gray transition-colors text-white/70"
                  >
                    Tất cả quốc gia
                  </button>
                  {countries.map((country) => (
                    <button
                      key={country._id}
                      onClick={() => {
                        updateFilters({ country: country.slug });
                        setIsCountryDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-netflix-gray transition-colors text-white"
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Category Dropdown */}
          {showCategoryFilter && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                  setIsSortDropdownOpen(false);
                  setIsCountryDropdownOpen(false);
                  setIsYearDropdownOpen(false);
                }}
                className="flex items-center gap-2 bg-netflix-gray/50 hover:bg-netflix-gray text-white p-2 rounded text-sm transition-colors"
              >
                <span>{selectedCategory ? getCategoryName(selectedCategory) : 'Thể loại'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-black/95 backdrop-blur-sm border border-netflix-light-gray/30 rounded-md shadow-xl z-[100] min-w-[160px] max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      updateFilters({ category: '' });
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-netflix-gray transition-colors text-white/70"
                  >
                    Tất cả thể loại
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => {
                        updateFilters({ category: category.slug });
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-netflix-gray transition-colors text-white"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Year Dropdown */}
          {showYearFilter && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsYearDropdownOpen(!isYearDropdownOpen);
                  setIsSortDropdownOpen(false);
                  setIsCountryDropdownOpen(false);
                  setIsCategoryDropdownOpen(false);
                }}
                className="flex items-center gap-2 bg-netflix-gray/50 hover:bg-netflix-gray text-white p-2 rounded text-sm transition-colors"
              >
                <span>{selectedYear || 'Năm phát hành'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

            {isYearDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-black/95 backdrop-blur-sm border border-netflix-light-gray/30 rounded-md shadow-xl z-[100] min-w-[140px] max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    updateFilters({ year: '' });
                    setIsYearDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-netflix-gray transition-colors text-white/70"
                >
                  Tất cả năm
                </button>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      updateFilters({ year: year.toString() });
                      setIsYearDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-netflix-gray transition-colors text-white"
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
            </div>
          )}

          {/* Clear Filters */}
          {(selectedCountry || selectedCategory || selectedYear || sortField !== 'modified.time' || sortType !== 'desc') && (
            <button
              onClick={() => updateFilters({ sort_field: 'modified.time', sort_type: 'desc', country: '', category: '', year: '' })}
              className="text-netflix-red hover:text-netflix-red/80 text-sm transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
      </div>
    </div>
  );
}
