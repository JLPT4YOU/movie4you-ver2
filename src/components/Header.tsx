"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconSearch, IconBell, IconMenu, IconX } from "./icons";
import SearchPopup from "./SearchPopup";
import DropdownFilters from "./DropdownFilters";
import MobileMenu from "./MobileMenu";

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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  // Data states
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  
  // UI states
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesRes = await fetch('/api/ophim/v1/api/quoc-gia');
        const countriesData = await countriesRes.json();
        const countries = countriesData?.data?.items ?? countriesData?.items ?? countriesData?.countries ?? [] as Array<{name: string, slug: string}>;
        if (countriesData.status && countriesData.data) {
          let countriesArray: Country[] = [];
          if (Array.isArray(countriesData.data)) {
            countriesArray = countriesData.data;
          } else if (countriesData.data.items && Array.isArray(countriesData.data.items)) {
            countriesArray = countriesData.data.items;
          } else if (typeof countriesData.data === 'object') {
            countriesArray = Object.values(countriesData.data).filter((item) => {
              const country = item as Record<string, any>;
              return country && typeof country === 'object' && country._id && country.name && country.slug;
            }) as Country[];
          }
          if (countriesArray.length > 0) {
            setCountries(countriesArray);
            const vietnam = countriesArray.find((country: Country) => country.slug === 'viet-nam');
            if (vietnam) setSelectedCountry(vietnam);
          }
        }

        // Fetch categories
        const categoriesRes = await fetch('/api/ophim/v1/api/the-loai');
        const categoriesData = await categoriesRes.json();
        if (categoriesData.status && categoriesData.data) {
          let categoriesArray: Category[] = [];
          if (Array.isArray(categoriesData.data)) {
            categoriesArray = categoriesData.data;
          } else if (categoriesData.data.items && Array.isArray(categoriesData.data.items)) {
            categoriesArray = categoriesData.data.items;
          } else if (typeof categoriesData.data === 'object') {
            categoriesArray = Object.values(categoriesData.data).filter((item) => {
              const category = item as Record<string, any>;
              return category && typeof category === 'object' && category._id && category.name && category.slug;
            }) as Category[];
          }
          if (categoriesArray.length > 0) {
            setCategories(categoriesArray);
          }
        }

        // Fetch years
        const yearsRes = await fetch('/api/ophim/v1/api/nam-phat-hanh');
        const yearsData = await yearsRes.json();
        const genres = yearsData?.data?.items ?? yearsData?.items ?? yearsData?.genres ?? [] as Array<{name: string, slug: string}>;
        if (yearsData.status && yearsData.data && yearsData.data.items && Array.isArray(yearsData.data.items)) {
          const yearsArray: Year[] = yearsData.data.items.filter((item: Record<string, any>) =>
            item && typeof item === 'object' && typeof item.year === 'number' && item.year >= 2010
          );
          if (yearsArray.length > 0) {
            setYears(yearsArray);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.category-dropdown')) setIsCategoryDropdownOpen(false);
      if (!target.closest('.country-dropdown')) setIsCountryDropdownOpen(false);
      if (!target.closest('.year-dropdown')) setIsYearDropdownOpen(false);
      if (!target.closest('.mobile-menu')) setIsMobileMenuOpen(false);
      if (!target.closest('.user-dropdown')) setIsUserDropdownOpen(false);
      if (!target.closest('.search-popup')) setIsSearchOpen(false);
    };

    if (isCategoryDropdownOpen || isCountryDropdownOpen || isYearDropdownOpen || isMobileMenuOpen || isUserDropdownOpen || isSearchOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isCategoryDropdownOpen, isCountryDropdownOpen, isYearDropdownOpen, isMobileMenuOpen, isUserDropdownOpen, isSearchOpen]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors ${
      scrolled ? "bg-netflix-black/95 backdrop-blur-sm" : "bg-gradient-to-b from-netflix-black/90 to-transparent"
    }`}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between text-sm text-netflix-text-gray">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="MOVIE4YOU"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 ml-8">
            <Link href="/category/phim-moi" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">Phim mới</Link>
            <Link href="/category/phim-bo" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">Phim bộ</Link>
            <Link href="/category/phim-le" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">Phim lẻ</Link>
            <Link href="/category/phim-chieu-rap" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">Phim chiếu rạp</Link>
            <Link href="/category/tv-shows" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">TV Shows</Link>
            <Link href="/category/hoat-hinh" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">Hoạt hình</Link>
            
            {/* Separator */}
            <div className="w-px h-4 bg-netflix-light-gray/30 mx-3"></div>
            
            {/* Filter Dropdowns */}
            <DropdownFilters
              countries={countries}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              isCountryDropdownOpen={isCountryDropdownOpen}
              setIsCountryDropdownOpen={setIsCountryDropdownOpen}
              categories={categories}
              isCategoryDropdownOpen={isCategoryDropdownOpen}
              setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
              years={years}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              isYearDropdownOpen={isYearDropdownOpen}
              setIsYearDropdownOpen={setIsYearDropdownOpen}
            />
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4 ml-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Tìm kiếm" 
              className="p-1.5 text-netflix-text-gray hover:text-netflix-white transition-colors"
            >
              <IconSearch className="w-6 h-6" />
            </button>
            <button aria-label="Thông báo" className="p-1.5 text-netflix-text-gray hover:text-netflix-white transition-colors">
              <IconBell className="w-6 h-6" />
            </button>

            {/* User Dropdown */}
            <div className="relative user-dropdown">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-8 h-8 rounded overflow-hidden ring-1 ring-netflix-red/50 hover:ring-netflix-red transition-all"
              >
                <img src="https://i.pravatar.cc/64?img=12" alt="avatar" className="w-full h-full object-cover" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-netflix-dark border border-netflix-light-gray rounded-md shadow-lg z-50">
                  <div className="py-2">
                    <Link
                      href="/lich-su"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-netflix-text-gray hover:text-netflix-white hover:bg-netflix-gray transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Lịch sử xem
                    </Link>
                    <div className="border-t border-netflix-gray my-1"></div>
                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-netflix-text-gray hover:text-netflix-white hover:bg-netflix-gray transition-colors w-full text-left">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Cài đặt
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-netflix-text-gray hover:text-netflix-white hover:bg-netflix-gray transition-colors w-full text-left">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right Side */}
          <div className="flex lg:hidden items-center gap-1">
            <button 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Tìm kiếm" 
              className="p-2 text-netflix-text-gray hover:text-netflix-white transition-colors"
            >
              <IconSearch className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
              className="p-2 text-netflix-text-gray hover:text-netflix-white transition-colors mobile-menu"
            >
              {isMobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          countries={countries}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          isCountryDropdownOpen={isCountryDropdownOpen}
          setIsCountryDropdownOpen={setIsCountryDropdownOpen}
          categories={categories}
          isCategoryDropdownOpen={isCategoryDropdownOpen}
          setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          isYearDropdownOpen={isYearDropdownOpen}
          setIsYearDropdownOpen={setIsYearDropdownOpen}
        />

        {/* Search Popup */}
        <SearchPopup
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>
    </header>
  );
}
