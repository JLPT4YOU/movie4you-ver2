"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconSearch, IconBell, IconMenu, IconX } from "./icons";
import SearchPopup from "./SearchPopup";
import LazyDropdown from "./LazyDropdown";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/contexts/AuthContext";

// Interfaces moved to LazyDropdown component

export default function Header() {
  const { user, userProfile, isPremium, isAdmin, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  
  // Data states - removed, now handled by LazyDropdown
  
  // UI states
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Data fetching removed - now handled by LazyDropdown components

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
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity min-w-0" aria-label="Trang chủ MOVIE4YOU">
            <Image
              src="/logo.png"
              alt="MOVIE4YOU"
              width={210}
              height={48}
              className="h-auto w-24 sm:w-28 md:w-32 lg:w-40 xl:w-48"
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, (max-width: 1280px) 160px, 192px"
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
            
            {/* Lazy Filter Dropdowns - chỉ load khi click */}
            <LazyDropdown
              title="Thể loại"
              apiEndpoint="/api/ophim/v1/api/the-loai"
              urlPrefix="/the-loai"
              isOpen={isCategoryDropdownOpen}
              onToggle={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            />

            <LazyDropdown
              title="Quốc gia"
              apiEndpoint="/api/ophim/v1/api/quoc-gia"
              urlPrefix="/quoc-gia"
              isOpen={isCountryDropdownOpen}
              onToggle={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            />

            <LazyDropdown
              title="Năm phát hành"
              apiEndpoint="/api/ophim/v1/api/nam-phat-hanh"
              urlPrefix="/nam-phat-hanh"
              isOpen={isYearDropdownOpen}
              onToggle={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
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

            {user ? (
              /* User Dropdown */
              <div className="relative user-dropdown">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-8 h-8 rounded overflow-hidden ring-1 ring-netflix-red/50 hover:ring-netflix-red transition-all"
                >
                  <Image src="https://i.pravatar.cc/64?img=12" alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-netflix-dark border border-netflix-light-gray rounded-md shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs border-b border-netflix-gray">
                        <div className="text-netflix-text-gray">{user.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isAdmin 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                              : isPremium 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' 
                              : 'bg-gray-600 text-gray-300'
                          }`}>
                            {isAdmin ? 'Admin' : isPremium ? 'Premium' : 'Free'}
                          </span>
                        </div>
                      </div>
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
                      <button 
                        onClick={() => {
                          signOut();
                          setIsUserDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-netflix-text-gray hover:text-netflix-white hover:bg-netflix-gray transition-colors w-full text-left"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button */
              <Link
                href="/login"
                className="px-4 py-2 bg-netflix-red hover:bg-netflix-red/80 text-white rounded-md transition-colors font-medium"
              >
                Đăng nhập
              </Link>
            )}
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

        {/* Mobile Menu - simplified props */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
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
