"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconBell } from "./icons";

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

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  
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

export default function MobileMenu({
  isOpen,
  onClose,
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
}: MobileMenuProps) {
  const router = useRouter();

  // Helper function to close all dropdowns except the specified one
  const closeOtherDropdowns = (keepOpen: 'category' | 'country' | 'year') => {
    if (keepOpen !== 'category') setIsCategoryDropdownOpen(false);
    if (keepOpen !== 'country') setIsCountryDropdownOpen(false);
    if (keepOpen !== 'year') setIsYearDropdownOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden mobile-menu">
      <div className="border-t border-netflix-gray bg-netflix-black/95 backdrop-blur-sm">
        {/* Navigation Links */}
        <div className="px-4 py-3 space-y-1">
          <Link
            href="/category/phim-moi"
            className="block py-2 text-netflix-text-gray hover:text-netflix-white transition-colors font-medium"
            onClick={onClose}
          >
            Phim mới
          </Link>
          <Link
            href="/category/phim-bo"
            className="block py-2 text-netflix-text-gray hover:text-netflix-white transition-colors font-medium"
            onClick={onClose}
          >
            Phim bộ
          </Link>
          <Link
            href="/category/phim-le"
            className="block py-2 text-netflix-text-gray hover:text-netflix-white transition-colors font-medium"
            onClick={onClose}
          >
            Phim lẻ
          </Link>
          <Link
            href="/category/phim-chieu-rap"
            className="block py-2 text-netflix-text-gray hover:text-netflix-white transition-colors font-medium"
            onClick={onClose}
          >
            Phim chiếu rạp
          </Link>
          <Link
            href="/category/tv-shows"
            className="block py-2 text-netflix-text-gray hover:text-netflix-white transition-colors font-medium"
            onClick={onClose}
          >
            TV Shows
          </Link>
          <Link
            href="/category/hoat-hinh"
            className="block py-2 text-netflix-text-gray hover:text-netflix-white transition-colors font-medium"
            onClick={onClose}
          >
            Hoạt hình
          </Link>
        </div>

        {/* Mobile Filter Sections with Dropdowns */}
        <div className="border-t border-netflix-gray px-4 py-3 space-y-3">
          {/* Categories Dropdown */}
          <div className="relative category-dropdown">
            <button
              onClick={() => {
                closeOtherDropdowns('category');
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
              }}
              className="w-full py-2 text-sm font-medium text-netflix-white hover:text-netflix-red transition-colors text-left"
            >
              <span>Thể loại</span>
            </button>

            <div className={`mt-2 bg-netflix-gray/50 rounded-md border border-netflix-light-gray/30 transition-all duration-200 origin-top ${
              isCategoryDropdownOpen
                ? 'opacity-100 scale-y-100 translate-y-0'
                : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
            }`}>
                {Array.isArray(categories) && categories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1 p-2 max-h-40 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => {
                          setIsCategoryDropdownOpen(false);
                          onClose();
                          router.push(`/the-loai/${category.slug}`);
                        }}
                        className="text-left px-2 py-1.5 text-xs rounded hover:bg-netflix-red/20 transition-colors text-netflix-text-gray hover:text-netflix-white"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-2 text-xs text-netflix-text-gray">
                    Đang tải...
                  </div>
                )}
            </div>
          </div>

          {/* Countries Dropdown */}
          <div className="relative country-dropdown">
            <button
              onClick={() => {
                closeOtherDropdowns('country');
                setIsCountryDropdownOpen(!isCountryDropdownOpen);
              }}
              className="w-full py-2 text-sm font-medium text-netflix-white hover:text-netflix-red transition-colors text-left"
            >
              <span>Quốc gia</span>
            </button>

            <div className={`mt-2 bg-netflix-gray/50 rounded-md border border-netflix-light-gray/30 transition-all duration-200 origin-top ${
              isCountryDropdownOpen
                ? 'opacity-100 scale-y-100 translate-y-0'
                : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
            }`}>
                {Array.isArray(countries) && countries.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1 p-2 max-h-40 overflow-y-auto">
                    {countries.map((country) => (
                      <button
                        key={country._id}
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsCountryDropdownOpen(false);
                          onClose();
                          router.push(`/quoc-gia/${country.slug}`);
                        }}
                        className={`text-left px-2 py-1.5 text-xs rounded hover:bg-netflix-red/20 transition-colors ${
                          selectedCountry?._id === country._id ? 'bg-netflix-red/20 text-netflix-white' : 'text-netflix-text-gray hover:text-netflix-white'
                        }`}
                      >
                        {country.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-2 text-xs text-netflix-text-gray">
                    Đang tải...
                  </div>
                )}
            </div>
          </div>

          {/* Years Dropdown */}
          <div className="relative year-dropdown">
            <button
              onClick={() => {
                closeOtherDropdowns('year');
                setIsYearDropdownOpen(!isYearDropdownOpen);
              }}
              className="w-full py-2 text-sm font-medium text-netflix-white hover:text-netflix-red transition-colors text-left"
            >
              <span>Năm phát hành</span>
            </button>

            <div className={`mt-2 bg-netflix-gray/50 rounded-md border border-netflix-light-gray/30 transition-all duration-200 origin-top ${
              isYearDropdownOpen
                ? 'opacity-100 scale-y-100 translate-y-0'
                : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
            }`}>
                {Array.isArray(years) && years.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1 p-2 max-h-40 overflow-y-auto">
                    {years.map((year) => (
                      <button
                        key={year.year}
                        onClick={() => {
                          setSelectedYear(year);
                          setIsYearDropdownOpen(false);
                          onClose();
                          router.push(`/nam-phat-hanh/${year.year}`);
                        }}
                        className={`text-left px-2 py-1.5 text-xs rounded hover:bg-netflix-red/20 transition-colors ${
                          selectedYear?.year === year.year ? 'bg-netflix-red/20 text-netflix-white' : 'text-netflix-text-gray hover:text-netflix-white'
                        }`}
                      >
                        {year.year}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-2 text-xs text-netflix-text-gray">
                    Đang tải...
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Mobile User Section */}
        <div className="border-t border-netflix-gray px-4 py-3">
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded overflow-hidden ring-1 ring-netflix-red/50">
                <img src="https://i.pravatar.cc/64?img=12" alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-4">
                <button aria-label="Thông báo" className="p-1.5 text-netflix-text-gray hover:text-netflix-white transition-colors">
                  <IconBell className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User Menu Items */}
            <div className="space-y-1">
              <Link
                href="/lich-su"
                onClick={onClose}
                className="flex items-center gap-3 py-2 text-sm text-netflix-text-gray hover:text-netflix-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Lịch sử xem
              </Link>
              <button className="flex items-center gap-3 py-2 text-sm text-netflix-text-gray hover:text-netflix-white transition-colors w-full text-left">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Cài đặt
              </button>
              <button className="flex items-center gap-3 py-2 text-sm text-netflix-text-gray hover:text-netflix-white transition-colors w-full text-left">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
