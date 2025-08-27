'use client';

import { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-36">
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 text-center">
            Điều Khoản Dịch Vụ
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 text-center">
            <span>Hiệu lực từ : Ngày 18 tháng 8 năm 2025</span>
            <span className="hidden sm:inline">•</span>
            <a href="mailto:movie4you.owner@gmail.com" className="text-red-500 hover:text-red-400 transition-colors">
              movie4you.owner@gmail.com
            </a>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Chấp thuận Điều khoản
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Bằng việc truy cập hoặc sử dụng MOVIE4YOU tại movie4you.net (&quot;Dịch vụ&quot;), bạn xác nhận đã đọc, 
              hiểu và đồng ý bị ràng buộc bởi Điều khoản Dịch vụ này (&quot;ToS&quot;) và Chính sách Quyền riêng tư. 
              Nếu không đồng ý, vui lòng rời khỏi trang ngay.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Định nghĩa
            </h2>
            <div className="space-y-3">
              <p>
                <strong className="text-white">&quot;Nội dung Bên thứ ba&quot;:</strong> phim/ảnh/dữ liệu lấy qua API 
                nguồn mở/đối tác, không thuộc sở hữu MOVIE4YOU.
              </p>
              <p>
                <strong className="text-white">&quot;API Bên thứ ba&quot;:</strong> bất kỳ API/SDK/nguồn dữ liệu do 
                bên khác cung cấp.
              </p>
              <p>
                <strong className="text-white">&quot;Người dùng&quot;:</strong> cá nhân/tổ chức truy cập hoặc sử dụng 
                Dịch vụ.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Điều kiện sử dụng
            </h2>
            <ul className="space-y-2 list-disc list-inside text-gray-300">
              <li>
                Bạn phải đủ độ tuổi hợp lệ theo pháp luật nơi cư trú (nếu là vị thành niên: cần sự đồng ý 
                hợp lệ của người giám hộ).
              </li>
              <li>
                Bạn chỉ sử dụng Dịch vụ cho mục đích hợp pháp, tuân thủ mọi luật/quy định/quyền của bên 
                thứ ba.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Bản chất Dịch vụ & Nội dung Bên thứ ba
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <p>MOVIE4YOU không lưu trữ, không sở hữu, không kiểm soát nội dung phim; Dịch vụ hoạt động 
                như công cụ tìm/nhúng/hiển thị từ API Bên thứ ba/nguồn mở.</p>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <p>MOVIE4YOU không xác nhận, không bảo đảm tính hợp pháp, đầy đủ hoặc chính xác của 
                Nội dung Bên thứ ba.</p>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <p>Mọi truy cập, tải, phát lại, sử dụng Nội dung Bên thứ ba là do bạn tự quyết và tự 
                chịu rủi ro.</p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">ℹ️</span>
                <p>Bộ nhớ đệm (cache) kỹ thuật, nếu có, chỉ nhằm hiệu năng và mang tính tạm thời, không 
                đồng nghĩa với lưu trữ/phân phối nội dung.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Quyền sở hữu trí tuệ
            </h2>
            <ul className="space-y-2">
              <li>• Nhãn hiệu, logo, giao diện, mã nguồn của MOVIE4YOU và các bên cấp quyền được pháp luật 
              bảo hộ.</li>
              <li>• Bạn không được sao chép, dịch ngược, sửa đổi, phân phối, tạo phái sinh từ Dịch vụ nếu 
              không có chấp thuận bằng văn bản.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Tài khoản (nếu áp dụng)
            </h2>
            <ul className="space-y-2">
              <li>• Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh.</li>
              <li>• MOVIE4YOU có thể tạm ngừng/chấm dứt tài khoản khi nghi ngờ vi phạm ToS/pháp luật.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Quy tắc sử dụng chấp nhận được (AUP)
            </h2>
            <div className="space-y-4">
              <p className="font-semibold text-white">Nghiêm cấm:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Tải lên/chia sẻ/cho phép truy cập nội dung xâm phạm bản quyền, bí mật kinh doanh, 
                  nhãn hiệu, quyền riêng tư.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Né DRM, vượt rào kỹ thuật, can thiệp/giả mạo lưu lượng, lạm dụng băng thông, 
                  hotlinking trái điều khoản.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Sử dụng Dịch vụ cho mục đích thương mại khi chưa được phép; chạy bot/crawler 
                  vượt mức hợp lý.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Vi phạm điều khoản của API Bên thứ ba hoặc pháp luật (bao gồm luật bản quyền 
                  quốc tế và nơi cư trú của bạn).</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Trách nhiệm người dùng & Bồi thường
            </h2>
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-400">
                ⚠️ Bạn hoàn toàn chịu trách nhiệm về hành vi, dữ liệu và cách sử dụng Dịch vụ/Nội dung 
                Bên thứ ba của mình.
              </p>
            </div>
            <p>
              Bạn đồng ý bồi thường và giữ cho [Chủ sở hữu MOVIE4YOU], nhân viên, đối tác, nhà cung cấp 
              được miễn trừ trách nhiệm trước mọi khiếu nại, yêu cầu, khoản phạt, thiệt hại, chi phí 
              (bao gồm phí luật sư hợp lý) phát sinh từ:
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>(a) hành vi/nội dung của bạn</li>
              <li>(b) vi phạm ToS</li>
              <li>(c) vi phạm luật/quyền của bên thứ ba</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Thông báo & Gỡ bỏ về bản quyền
            </h2>
            <div className="space-y-3">
              <p>MOVIE4YOU thực hiện quy trình tiếp nhận thông báo vi phạm và gỡ bỏ hợp lý, phù hợp 
              với các quy định pháp luật quốc tế về bản quyền.</p>
              <p>Chủ sở hữu quyền gửi thông báo tới <strong className="text-white">movie4you.owner@gmail.com</strong> gồm:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>(i) thông tin người thông báo</li>
                <li>(ii) mô tả tác phẩm</li>
                <li>(iii) URL/vị trí nội dung</li>
                <li>(iv) tuyên thệ thiện chí</li>
                <li>(v) chữ ký (tay/điện tử)</li>
              </ul>
              <p className="text-yellow-400">⚠️ Gửi thông báo sai sự thật có thể kéo theo trách nhiệm pháp lý.</p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. API Bên thứ ba & Liên kết ngoài
            </h2>
            <ul className="space-y-2">
              <li>• Dịch vụ phụ thuộc vào API nguồn mở/nhà cung cấp thứ ba; bạn đồng ý tuân theo điều 
              khoản của họ.</li>
              <li>• MOVIE4YOU không chịu trách nhiệm về tính sẵn sàng, độ tin cậy, chính xác, tính pháp 
              lý của dữ liệu/dịch vụ bên ngoài.</li>
              <li>• Nếu API thay đổi/gián đoạn, Dịch vụ có thể bị ảnh hưởng mà không có nghĩa vụ bồi thường.</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Quyền riêng tư & Dữ liệu
            </h2>
            <ul className="space-y-2">
              <li>• Việc xử lý dữ liệu cá nhân tuân theo Chính sách Quyền riêng tư (được dẫn liên kết 
              trên website).</li>
              <li>• Có thể thu thập nhật ký kỹ thuật để bảo mật, chống gian lận và đáp ứng yêu cầu 
              pháp lý.</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              12. Miễn trừ bảo đảm
            </h2>
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-400">
                Dịch vụ được cung cấp &quot;nguyên trạng&quot; (as-is) và &quot;theo khả dụng&quot; (as-available), không có 
                bảo đảm dưới bất kỳ hình thức nào (rõ ràng hay ngụ ý), bao gồm nhưng không giới hạn ở: 
                khả năng thương mại, phù hợp mục đích cụ thể, không vi phạm.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              13. Giới hạn trách nhiệm
            </h2>
            <p>Trong phạm vi tối đa pháp luật cho phép, MOVIE4YOU không chịu trách nhiệm với:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>(a) thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hệ quả</li>
              <li>(b) mất lợi nhuận/dữ liệu/uy tín</li>
              <li>(c) chi phí thay thế dịch vụ</li>
            </ul>
            <p className="mt-3">
              Tổng trách nhiệm, nếu có, không vượt quá số tiền bạn đã trả cho MOVIE4YOU trong 3 tháng 
              trước sự kiện (Dịch vụ hiện miễn phí, nên thông thường là 0).
            </p>
          </section>

          {/* Section 14 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              14. Chấm dứt
            </h2>
            <ul className="space-y-2">
              <li>• MOVIE4YOU có thể tạm ngừng/chấm dứt một phần/toàn bộ Dịch vụ bất cứ lúc nào vì lý do 
              hợp pháp (bao gồm vi phạm ToS).</li>
              <li>• Các điều khoản theo bản chất (SHTT, miễn trừ, giới hạn trách nhiệm, luật áp dụng...) 
              vẫn tiếp tục hiệu lực sau chấm dứt.</li>
            </ul>
          </section>

          {/* Section 15 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              15. Thay đổi Điều khoản
            </h2>
            <p>
              MOVIE4YOU có thể cập nhật ToS; bản cập nhật có hiệu lực khi đăng tải. Tiếp tục sử dụng = 
              bạn chấp nhận phiên bản mới.
            </p>
          </section>

          {/* Section 16 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              16. Lực bất khả kháng
            </h2>
            <p>
              MOVIE4YOU không chịu trách nhiệm cho chậm trễ/không thực hiện do sự kiện ngoài tầm kiểm 
              soát hợp lý (thiên tai, chiến tranh, sự cố hạ tầng bên thứ ba, thay đổi pháp luật, v.v.).
            </p>
          </section>

          {/* Section 17 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              17. Luật áp dụng & Giải quyết tranh chấp
            </h2>
            <ul className="space-y-2">
              <li>• ToS chịu sự điều chỉnh của luật pháp quốc tế và luật địa phương áp dụng.</li>
              <li>• Tranh chấp sẽ được giải quyết thông qua hòa giải trước khi đưa ra tòa án có thẩm quyền.</li>
              <li>• Các bên ưu tiên giải quyết tranh chấp một cách thiện chí và hợp tác.</li>
            </ul>
          </section>

          {/* Section 18 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              18. Tính độc lập điều khoản
            </h2>
            <p>
              Nếu một điều khoản bị coi là vô hiệu/không thể thực thi, các phần còn lại của ToS vẫn có 
              hiệu lực.
            </p>
          </section>

          {/* Section 19 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              19. Toàn bộ thỏa thuận - Không chuyển nhượng
            </h2>
            <ul className="space-y-2">
              <li>• ToS (cùng Chính sách Quyền riêng tư) là toàn bộ thỏa thuận giữa bạn và MOVIE4YOU về 
              Dịch vụ.</li>
              <li>• Bạn không được chuyển nhượng/ủy quyền quyền/nghĩa vụ theo ToS nếu không có chấp thuận 
              bằng văn bản của MOVIE4YOU.</li>
            </ul>
          </section>

          {/* Section 20 */}
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              20. Liên hệ
            </h2>
            <p>
              Mọi câu hỏi/khiếu nại pháp lý: 
              <a href="mailto:movie4you.owner@gmail.com" className="text-red-400 hover:text-red-300 ml-2">
                movie4you.owner@gmail.com
              </a>
            </p>
          </section>
        </div>

        {/* Back to top button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Lên đầu trang
          </button>
        </div>
      </div>
    </div>
  );
}
