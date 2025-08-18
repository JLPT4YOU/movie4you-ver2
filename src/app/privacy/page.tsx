'use client';

import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    // Scroll to top on first render
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-36">
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 text-center">
            Chính Sách Bảo Mật
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 text-center">
            <span>Hiệu lực từ : Ngày 18 tháng 8 năm 2025</span>
            <span className="hidden sm:inline">•</span>
            <a href="mailto:movie4you.owner@gmail.com" className="text-red-500 hover:text-red-400 transition-colors">
              movie4you.owner@gmail.com
            </a>
          </div>
        </header>

        {/* SECTION 1 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-4">
            1. Mục đích & Phạm vi áp dụng
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Chính sách này giải thích cách MOVIE4YOU thu thập, sử dụng, lưu trữ, chia sẻ và bảo vệ dữ liệu khi
            bạn truy cập movie4you.net và các dịch vụ liên quan. Chính sách được thiết kế để phù hợp với các
            chuẩn mực quốc tế (ví dụ: GDPR, CCPA, LGPD, APPI...). Bằng việc sử dụng dịch vụ, bạn xác nhận đã
            đọc và đồng ý với các nội dung dưới đây.
          </p>
        </section>

        {/* SECTION 2 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-4">
            2. Tóm tắt nhanh
          </h2>
          <ul className="text-sm space-y-2">
            <li>• Thu thập tối thiểu: log kỹ thuật, cookie cần thiết, phân tích ẩn danh (khi bạn đồng ý).</li>
            <li>• Không thu thập dữ liệu nhạy cảm, không bán dữ liệu, không dùng quảng cáo theo hành vi.</li>
            <li>• Quyền của bạn: truy cập, đính chính, xóa, hạn chế/ phản đối, rút lại đồng ý, khiếu nại.</li>
            <li>• Lưu trữ có thời hạn; tôn trọng tín hiệu GPC/Do-Not-Track cho cookie không thiết yếu.</li>
          </ul>
        </section>

        {/* SECTION 3 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-4">
            3. Danh mục dữ liệu & mục đích xử lý
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-white mb-1">Log kỹ thuật</h3>
              <p className="text-sm">IP, user-agent, loại thiết bị, thởi gian, URL đã truy cập — phục vụ vận hành, bảo mật, chống lạm dụng.</p>
              <p className="text-xs text-gray-500 mt-1">Thời hạn lưu: ~90 ngày (sự cố nghiêm trọng tối đa 180 ngày).</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-white mb-1">Cookie cần thiết</h3>
              <p className="text-sm">Phiên đăng nhập (nếu có), ngôn ngữ, ghi nhớ đồng ý — đảm bảo chức năng cơ bản của website.</p>
              <p className="text-xs text-gray-500 mt-1">Thời hạn: theo vòng đời cookie (tối đa ~12 tháng).</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-white mb-1">Thông tin liên hệ (nếu bạn gửi)</h3>
              <p className="text-sm">Email/nội dung khiếu nại — hỗ trợ người dùng, xử lý yêu cầu bản quyền.</p>
              <p className="text-xs text-gray-500 mt-1">Thời hạn: ~24 tháng; hồ sơ bản quyền tối đa 5 năm.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-white mb-1">Phân tích ẩn danh (tùy chọn)</h3>
              <p className="text-sm">Sự kiện/lượt xem tổng hợp — cải thiện hiệu năng, thống kê.</p>
              <p className="text-xs text-gray-500 mt-1">Thời hạn: 13–24 tháng tùy công cụ.</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded">
            <p className="text-sm">
              <strong>Không thu thập:</strong> dữ liệu nhạy cảm (sức khỏe, tôn giáo...), dữ liệu thanh toán, lịch sử xem cá nhân.
            </p>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-4">
            4. Cookie & Công nghệ tương tự
          </h2>
          <ul className="space-y-2">
            <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Cần thiết: vận hành phiên, cân bằng tải, bảo mật (không thể tắt ở mức hệ thống).</span></li>
            <li className="flex items-start"><span className="text-yellow-500 mr-2">⚡</span><span>Phân tích (tùy chọn): chỉ kích hoạt khi bạn đồng ý; có thể đổi ý bất cứ lúc nào.</span></li>
            <li className="flex items-start"><span className="text-red-500 mr-2">✗</span><span>Quảng cáo: không sử dụng.</span></li>
            <li className="flex items-start"><span className="text-blue-500 mr-2">ℹ️</span><span>Tôn trọng tín hiệu Global Privacy Control (GPC) để từ chối cookie không thiết yếu.</span></li>
          </ul>
        </section>

        {/* SECTION 5 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">🧠</span> 5. Cách chúng tôi sử dụng dữ liệu
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-green-900/20 border border-green-800 rounded">
              <h3 className="font-semibold text-green-400 mb-1">Được sử dụng để:</h3>
              <ul className="list-disc ml-6 space-y-2 text-gray-300">
                <li>• Vận hành và cải thiện dịch vụ</li>
                <li>• Bảo mật và chống lạm dụng</li>
                <li>• Tuân thủ yêu cầu pháp lý hợp lệ</li>
                <li>• Hỗ trợ người dùng</li>
              </ul>
            </div>
            <div className="p-3 bg-red-900/20 border border-red-800 rounded">
              <h3 className="font-semibold text-red-400 mb-1">Không bao gồm:</h3>
              <ul className="list-disc ml-6 space-y-2 text-gray-300">
                <li>• Bán/cho thuê dữ liệu cá nhân</li>
                <li>• Quảng cáo theo hành vi</li>
                <li>• Theo dõi cá nhân ngoài mục đích nêu trên</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 6 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-4">
            6. Chia sẻ dữ liệu với bên thứ ba
          </h2>
          <p className="mb-2">Chúng tôi không bán dữ liệu cá nhân. Dữ liệu có thể được chia sẻ trong các trường hợp sau:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>• Nhà cung cấp hạ tầng/đối tác xử lý theo hợp đồng bảo mật.</li>
            <li>• Cơ quan có thẩm quyền khi có yêu cầu hợp lệ theo pháp luật.</li>
            <li>• Trường hợp chuyển nhượng doanh nghiệp (sẽ thông báo trước, nếu có thể).</li>
          </ul>
        </section>

        {/* SECTION 7 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">🌍</span> 7. Chuyển dữ liệu quốc tế
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Dữ liệu có thể được xử lý/lưu trữ ở nhiều quốc gia. Khi làm vậy, chúng tôi áp dụng biện pháp bảo vệ
            phù hợp (ví dụ: điều khoản hợp đồng tiêu chuẩn, đánh giá mức độ tương đương) theo quy định hiện hành.
            Bạn có thể yêu cầu thêm thông tin qua email liên hệ.
          </p>
        </section>

        {/* SECTION 8 */}
        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            8. Bảo mật thông tin
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-white mb-1">Biện pháp kỹ thuật</h3>
              <ul className="list-disc ml-6 space-y-2 text-gray-300">
                <li>• Mã hóa truyền tải (HTTPS/TLS)</li>
                <li>• Kiểm soát truy cập tối thiểu</li>
                <li>• Ghi nhật ký bảo mật</li>
                <li>• Sao lưu định kỳ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Biện pháp tổ chức</h3>
              <ul className="list-disc ml-6 space-y-2 text-gray-300">
                <li>• Quy trình phản ứng sự cố</li>
                <li>• Đánh giá rủi ro định kỳ</li>
                <li>• Hợp đồng bảo mật với đối tác</li>
                <li>• Đào tạo về bảo mật & riêng tư</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-yellow-400 text-sm">⚠️ Không có hệ thống nào an toàn tuyệt đối. Hãy liên hệ nếu bạn nghi ngờ rủi ro.</p>
        </section>
        
        {/* SECTION 9 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">🧒</span> 9. Quyền riêng tư của trẻ em
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Dịch vụ không hướng tới trẻ em dướ 13 tuổi. Nếu bạn là phụ huynh/người giám hộ và tin rằng trẻ em
            đã cung cấp dữ liệu cho chúng tôi, vui lòng liên hệ để yêu cầu xóa.
          </p>
        </section>

        {/* SECTION 10 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">🧑‍⚖️</span> 10. Quyền của bạn
          </h2>
          <p className="mb-3">Tùy thuộc luật áp dụng (ví dụ: GDPR/CCPA/LGPD/APPI...), bạn có thể:</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Truy cập dữ liệu cá nhân</span></div>
            <div className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Đính chính thông tin sai</span></div>
            <div className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Xóa dữ liệu không cần thiết</span></div>
            <div className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Hạn chế hoặc phản đối xử lý</span></div>
            <div className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Rút lại sự đồng ý đã cấp</span></div>
            <div className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Khiếu nại tới cơ quan quản lý</span></div>
          </div>
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded">
            <p className="text-sm">
              <strong>Cách yêu cầu:</strong> Gửi email đến <a className="text-red-300" href="mailto:movie4you.owner@gmail.com">movie4you.owner@gmail.com</a> với mô tả chi tiết yêu cầu. Chúng tôi sẽ phản hồi trong 30 ngày làm việc.
            </p>
          </div>
        </section>

        {/* SECTION 11 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">📨</span> 11. Khiếu nại bản quyền & dữ liệu phát sinh
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Khi tiếp nhận yêu cầu theo cơ chế notice-and-takedown, chúng tôi có thể xử lý và lưu trữ hồ sơ liên quan
            (nội dung thông báo, thư trao đổi, quyết định gỡ/chặn) để thực hiện nghĩa vụ pháp lý và bảo vệ quyền lợi
            hợp pháp. Hồ sơ này có thể được lưu trữ tối đa 5 năm.
          </p>
        </section>

        {/* SECTION 12 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">⏳</span> 12. Thời hạn lưu trữ
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>• Log kỹ thuật: ~90 ngày; sự cố nghiêm trọng: tối đa 180 ngày.</li>
            <li>• Nhật ký đồng ý cookie: ~24 tháng.</li>
            <li>• Email hỗ trợ/trao đổi: ~24 tháng.</li>
            <li>• Hồ sơ bản quyền: tối đa 5 năm.</li>
          </ul>
        </section>

        {/* SECTION 13 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">🧩</span> 13. Cơ sở pháp lý xử lý dữ liệu
          </h2>
          <ul className="space-y-2">
            <li className="flex items-start"><span className="text-blue-500 mr-2">⚖️</span><span><strong className="text-white">Lợi ích hợp pháp:</strong> vận hành dịch vụ, bảo mật, chống gian lận, thống kê không định danh.</span></li>
            <li className="flex items-start"><span className="text-green-500 mr-2">📋</span><span><strong className="text-white">Nghĩa vụ pháp lý:</strong> phản hồi yêu cầu hợp lệ từ cơ quan có thẩm quyền; lưu trữ hồ sơ bản quyền/đồng ý.</span></li>
            <li className="flex items-start"><span className="text-yellow-500 mr-2">✋</span><span><strong className="text-white">Đồng ý:</strong> chỉ áp dụng cho cookie/phân tích không thiết yếu; bạn có thể rút lại bất cứ lúc nào.</span></li>
          </ul>
        </section>

        {/* SECTION 14 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">🧰</span> 14. Quy trình lựa chọn cookie
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>• Banner cookie hiển thị khi truy cập lần đầu.</li>
            <li>• Bạn có thể chấp nhận/từ chối nhóm cookie không thiết yếu.</li>
            <li>• Trang "Cài đặt Cookie" cho phép thay đổi lựa chọn bất cứ lúc nào.</li>
            <li>• Chúng tôi tôn trọng tín hiệu GPC để tự động tắt cookie không thiết yếu.</li>
          </ul>
        </section>

        {/* SECTION 15 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">🪪</span> 15. Quyền riêng tư & nội dung bên thứ ba
          </h2>
          <p className="text-gray-300 leading-relaxed">
            MOVIE4YOU không lưu trữ dữ liệu nội dung phim thuộc bên thứ ba; việc truy cập/nhúng là do bạn quyết định.
            Khi bạn theo liên kết tới trang hoặc API bên ngoài, chính sách của bên đó sẽ áp dụng. Vui lòng xem xét kỹ
            chính sách cookie/riêng tư của họ.
          </p>
        </section>

        {/* SECTION 16 */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-4">
            16. Thay đổi Chính sách
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Chúng tôi có thể cập nhật Chính sách này để phản ánh thay đổi về pháp luật hoặc dịch vụ. Khi cập nhật, ngày hiệu lực
            sẽ được điều chỉnh và, nếu phù hợp, chúng tôi sẽ thông báo trên trang web. Việc bạn tiếp tục sử dụng dịch vụ sau khi
            Chính sách được cập nhật đồng nghĩa bạn đã chấp nhận thay đổi.
          </p>
        </section>
      </div>
    </div>
  );
}
