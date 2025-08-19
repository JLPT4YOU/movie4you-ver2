"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconBell } from './icons';

interface DropdownItem {
  _id: string;
  name: string;
  slug: string;
  year?: number;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {
  // Dropdown states
  const [dropdownStates, setDropdownStates] = useState({
    categories: false,
    countries: false,
    years: false
  });

  // Data states
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const [countries, setCountries] = useState<DropdownItem[]>([]);
  const [years, setYears] = useState<DropdownItem[]>([]);

  // Loading states
  const [loading, setLoading] = useState({
    categories: false,
    countries: false,
    years: false
  });

  // Fetch functions
  const fetchCategories = async () => {
    if (categories.length > 0 || loading.categories) return;

    setLoading(prev => ({ ...prev, categories: true }));
    try {
      const response = await fetch('/api/ophim/v1/api/the-loai');
      if (response.ok) {
        const data = await response.json();
        let itemsArray: DropdownItem[] = [];

        if (data.status && data.data) {
          if (Array.isArray(data.data)) {
            itemsArray = data.data;
          } else if (data.data.items && Array.isArray(data.data.items)) {
            itemsArray = data.data.items;
          } else if (typeof data.data === 'object') {
            itemsArray = Object.values(data.data).filter((item: any) =>
              item && typeof item === 'object' && item._id && item.name && item.slug
            ) as DropdownItem[];
          }
        }

        setCategories(itemsArray);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const fetchCountries = async () => {
    if (countries.length > 0 || loading.countries) return;

    setLoading(prev => ({ ...prev, countries: true }));
    try {
      const response = await fetch('/api/ophim/v1/api/quoc-gia');
      if (response.ok) {
        const data = await response.json();
        let itemsArray: DropdownItem[] = [];

        if (data.status && data.data) {
          if (Array.isArray(data.data)) {
            itemsArray = data.data;
          } else if (data.data.items && Array.isArray(data.data.items)) {
            itemsArray = data.data.items;
          } else if (typeof data.data === 'object') {
            itemsArray = Object.values(data.data).filter((item: any) =>
              item && typeof item === 'object' && item._id && item.name && item.slug
            ) as DropdownItem[];
          }
        }

        setCountries(itemsArray);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(prev => ({ ...prev, countries: false }));
    }
  };

  const fetchYears = async () => {
    if (years.length > 0 || loading.years) return;

    setLoading(prev => ({ ...prev, years: true }));
    try {
      const response = await fetch('/api/ophim/v1/api/nam-phat-hanh');
      if (response.ok) {
        const data = await response.json();
        let itemsArray: DropdownItem[] = [];

        if (data.status && data.data && data.data.items && Array.isArray(data.data.items)) {
          itemsArray = data.data.items.filter((item: any) =>
            item && typeof item === 'object' && typeof item.year === 'number' && item.year >= 2010
          ).map((item: any) => ({
            _id: item.year.toString(),
            name: item.year.toString(),
            slug: item.year.toString(),
            year: item.year
          }));
        }

        setYears(itemsArray);
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    } finally {
      setLoading(prev => ({ ...prev, years: false }));
    }
  };

  // Toggle dropdown and fetch data if needed
  const toggleDropdown = (type: 'categories' | 'countries' | 'years') => {
    const newState = !dropdownStates[type];

    // Close other dropdowns
    setDropdownStates({
      categories: type === 'categories' ? newState : false,
      countries: type === 'countries' ? newState : false,
      years: type === 'years' ? newState : false
    });

    // Fetch data if opening dropdown
    if (newState) {
      switch (type) {
        case 'categories':
          fetchCategories();
          break;
        case 'countries':
          fetchCountries();
          break;
        case 'years':
          fetchYears();
          break;
      }
    }
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

        {/* Filter Dropdowns */}
        <div className="border-t border-netflix-gray px-4 py-3 space-y-3">
          {/* Categories Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown('categories')}
              className="flex items-center justify-between w-full py-2 text-netflix-text-gray hover:text-netflix-white transition-colors font-medium"
            >
              <span>Thể loại</span>
              <svg
                className={`w-4 h-4 transition-transform ${dropdownStates.categories ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownStates.categories && (
              <div className="mt-2 pl-4 space-y-1 max-h-48 overflow-y-auto">
                {loading.categories ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-netflix-gray rounded"></div>
                    ))}
                  </div>
                ) : categories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/the-loai/${category.slug}`}
                        className="block py-1 px-2 text-sm text-netflix-text-gray hover:text-netflix-red hover:bg-netflix-gray/30 rounded transition-colors"
                        onClick={onClose}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-netflix-text-gray">Không có dữ liệu</div>
                )}
              </div>
            )}
          </div>

          {/* Countries Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown('countries')}
              className="flex items-center justify-between w-full py-2 text-netflix-text-gray hover:text-netflix-white transition-colors font-medium"
            >
              <span>Quốc gia</span>
              <svg
                className={`w-4 h-4 transition-transform ${dropdownStates.countries ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownStates.countries && (
              <div className="mt-2 pl-4 space-y-1 max-h-48 overflow-y-auto">
                {loading.countries ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-netflix-gray rounded"></div>
                    ))}
                  </div>
                ) : countries.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1">
                    {countries.map((country) => (
                      <Link
                        key={country._id}
                        href={`/quoc-gia/${country.slug}`}
                        className="block py-1 px-2 text-sm text-netflix-text-gray hover:text-netflix-red hover:bg-netflix-gray/30 rounded transition-colors"
                        onClick={onClose}
                      >
                        {country.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-netflix-text-gray">Không có dữ liệu</div>
                )}
              </div>
            )}
          </div>

          {/* Years Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown('years')}
              className="flex items-center justify-between w-full py-2 text-netflix-text-gray hover:text-netflix-white transition-colors font-medium"
            >
              <span>Năm phát hành</span>
              <svg
                className={`w-4 h-4 transition-transform ${dropdownStates.years ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownStates.years && (
              <div className="mt-2 pl-4 space-y-1 max-h-48 overflow-y-auto">
                {loading.years ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-netflix-gray rounded"></div>
                    ))}
                  </div>
                ) : years.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1">
                    {years.map((year) => (
                      <Link
                        key={year._id}
                        href={`/nam-phat-hanh/${year.slug}`}
                        className="block py-1 px-2 text-sm text-netflix-text-gray hover:text-netflix-red hover:bg-netflix-gray/30 rounded transition-colors text-center"
                        onClick={onClose}
                      >
                        {year.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-netflix-text-gray">Không có dữ liệu</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Section */}
        <div className="border-t border-netflix-gray px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="https://i.pravatar.cc/64?img=12"
              alt="avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full ring-1 ring-netflix-red/50"
            />
            <span className="text-netflix-white font-medium">Người dùng</span>
          </div>

          <Link
            href="/lich-su"
            className="flex items-center gap-3 py-2 text-netflix-text-gray hover:text-netflix-white transition-colors"
            onClick={onClose}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lịch sử xem
          </Link>
        </div>
      </div>
    </div>
  );
}
