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
  const [scrolled, setScrolled] = useState(false);
  const { user, supabaseUser, signOut } = useAuth();
  
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
          <Link href="/home" className="flex items-center hover:opacity-80 transition-opacity min-w-0" aria-label="Trang chủ MOVIE4YOU">
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
            <Link href="/home/category/phim-moi" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">Phim mới</Link>
            <Link href="/home/category/phim-bo" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">Phim bộ</Link>
            <Link href="/home/category/phim-le" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">Phim lẻ</Link>
            <Link href="/home/category/phim-chieu-rap" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">Phim chiếu rạp</Link>
            <Link href="/home/category/tv-shows" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">TV Shows</Link>
            <Link href="/home/category/hoat-hinh" className="whitespace-nowrap hover:text-netflix-white transition-colors font-medium">Hoạt hình</Link>
            
            {/* Separator */}
            <div className="w-px h-4 bg-netflix-light-gray/30 mx-3"></div>
            
            {/* Lazy Filter Dropdowns - chỉ load khi click */}
            <LazyDropdown
              title="Thể loại"
              apiEndpoint="/api/ophim/v1/api/the-loai"
              urlPrefix="/home/the-loai"
              isOpen={isCategoryDropdownOpen}
              onToggle={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            />

            <LazyDropdown
              title="Quốc gia"
              apiEndpoint="/api/ophim/v1/api/quoc-gia"
              urlPrefix="/home/quoc-gia"
              isOpen={isCountryDropdownOpen}
              onToggle={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            />

            <LazyDropdown
              title="Năm phát hành"
              apiEndpoint="/api/ophim/v1/api/nam-phat-hanh"
              urlPrefix="/home/nam-phat-hanh"
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

            {/* User Dropdown */}
            <div className="relative user-dropdown">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-8 h-8 rounded overflow-hidden ring-1 ring-netflix-red/50 hover:ring-netflix-red transition-all"
              >
                <Image src="https://i.pravatar.cc/64?img=12" alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-netflix-dark border border-netflix-light-gray rounded-md shadow-lg z-50">
                  <div className="py-2">
                    {/* User info */}
                    <div className="px-4 pb-2 pt-2">
                      <div className="text-sm text-white truncate font-medium">
                        {user?.email || supabaseUser?.email || 'Người dùng'}
                      </div>
                      <div className="text-xs text-gray-400">
                        Vai trò: {user?.role ?? '—'}
                      </div>
                    </div>
                    <div className="border-t border-netflix-gray my-1"></div>
                    <Link
                      href="/home/lich-su"
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
                    <button
                      onClick={async () => {
                        setIsUserDropdownOpen(false);
                        try { await signOut(); } catch { /* silent */ }
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
