'use client';

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const movieCategories = [
    { name: 'Phim Bộ', href: '/phim-bo' },
    { name: 'Phim Lẻ', href: '/phim-le' },
    { name: 'TV Shows', href: '/tv-shows' },
    { name: 'Hoạt Hình', href: '/hoat-hinh' },
    { name: 'Phim Chiếu Rạp', href: '/phim-chieu-rap' },
    { name: 'Phim Vietsub', href: '/phim-vietsub' },
  ];

  const genres = [
    { name: 'Hành Động', href: '/the-loai/hanh-dong' },
    { name: 'Tình Cảm', href: '/the-loai/tinh-cam' },
    { name: 'Hài Hước', href: '/the-loai/hai-huoc' },
    { name: 'Kinh Dị', href: '/the-loai/kinh-di' },
    { name: 'Viễn Tưởng', href: '/the-loai/vien-tuong' },
    { name: 'Võ Thuật', href: '/the-loai/vo-thuat' },
  ];

  const countries = [
    { name: 'Phim Hàn Quốc', href: '/quoc-gia/han-quoc' },
    { name: 'Phim Trung Quốc', href: '/quoc-gia/trung-quoc' },
    { name: 'Phim Âu Mỹ', href: '/quoc-gia/au-my' },
    { name: 'Phim Thái Lan', href: '/quoc-gia/thai-lan' },
    { name: 'Phim Nhật Bản', href: '/quoc-gia/nhat-ban' },
    { name: 'Phim Việt Nam', href: '/quoc-gia/viet-nam' },
  ];

  const quickLinks = [
    { name: 'Phim Mới Cập Nhật', href: '/phim-moi' },
    { name: 'Phim Sắp Chiếu', href: '/phim-sap-chieu' },
    { name: 'Phim Thuyết Minh', href: '/phim-thuyet-minh' },
    { name: 'Phim Bộ Đang Chiếu', href: '/phim-bo-dang-chieu' },
    { name: 'Phim Bộ Hoàn Thành', href: '/phim-bo-hoan-thanh' },
    { name: 'Top Phim Hay', href: '/top-phim-hay' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and About */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Link href="/" className="inline-block">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  MOVIE4YOU
                </h2>
              </Link>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Xem phim online chất lượng cao, phim mới cập nhật liên tục. Kho phim khổng lồ với hàng ngàn bộ phim Vietsub, thuyết minh HD.
            </p>
            <div className="flex space-x-4 mt-6">
              {/* Social Media Icons */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Youtube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Telegram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Danh Mục Phim</h3>
            <ul className="space-y-2">
              {movieCategories.map((category) => (
                <li key={category.href}>
                  <Link 
                    href={category.href} 
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Thể Loại</h3>
            <ul className="space-y-2">
              {genres.map((genre) => (
                <li key={genre.href}>
                  <Link 
                    href={genre.href} 
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Quốc Gia</h3>
            <ul className="space-y-2">
              {countries.map((country) => (
                <li key={country.href}>
                  <Link 
                    href={country.href} 
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    {country.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO Text */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="text-xs text-gray-500 leading-relaxed space-y-2">
            <p>
              <strong className="text-gray-400">MOVIE4YOU</strong> - Website xem phim online miễn phí chất lượng cao với giao diện trực quan, tốc độ tải nhanh. 
              Phim online Vietsub, thuyết minh chất lượng Full HD. Cập nhật phim mới mỗi ngày cùng kho phim với hơn 10.000+ bộ phim và 100.000+ tập phim.
            </p>
            <p>
              Xem phim HD online với đường truyền cao tốc, không giật lag. Tất cả phim đều có độ phân giải cao từ HD 720p, Full HD 1080p đến 4K. 
              Nội dung phim đa dạng: phim bộ Hàn Quốc, phim bộ Trung Quốc, phim chiếu rạp, phim hành động Mỹ, phim Ma Kinh Dị, phim Tâm Lý Tình Cảm và nhiều thể loại khác.
            </p>
            <div className="mt-3 space-y-1 text-[11px] sm:text-xs text-gray-500">
              <p>
                <span className="font-semibold">Liên hệ:</span>
                {" "}Vui lòng thông báo nếu quyền lợi của bạn bị vi phạm, chúng tôi sẽ xóa nội dung vi phạm kịp thời.
              </p>
              <p>
                <span className="font-semibold">Thông tin:</span>
                {" "}Tất cả nội dung được thu thập từ các trang web video trên Internet, không cung cấp phát trực tuyến chính hãng. Cảm ơn sự hợp tác của bạn!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © {currentYear} <span className="text-red-400 font-semibold">MOVIE4YOU</span>. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/dmca" className="text-gray-400 hover:text-white transition-colors">
                DMCA
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Liên hệ
              </Link>
              <Link href="/sitemap.xml" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
