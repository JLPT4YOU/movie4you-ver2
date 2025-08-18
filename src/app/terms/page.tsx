'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-400 hover:text-red-500 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-red-500">Điều khoản dịch vụ</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-4">
            Điều Khoản Dịch Vụ
          </h1>
          <p className="text-gray-400">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300">
          {/* Section 1 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">1.</span> Chấp thuận Điều khoản
            </h2>
            <p className="leading-relaxed">
              Bằng việc truy cập hoặc sử dụng MOVIE4YOU tại movie4you.net ("Dịch vụ"), bạn xác nhận đã đọc, 
              hiểu và đồng ý bị ràng buộc bởi Điều khoản Dịch vụ này ("ToS") và Chính sách Quyền riêng tư. 
              Nếu không đồng ý, vui lòng rời khỏi trang ngay.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">2.</span> Định nghĩa
            </h2>
            <div className="space-y-3">
              <p>
                <strong className="text-white">"Nội dung Bên thứ ba":</strong> phim/ảnh/dữ liệu lấy qua API 
                nguồn mở/đối tác, không thuộc sở hữu MOVIE4YOU.
              </p>
              <p>
                <strong className="text-white">"API Bên thứ ba":</strong> bất kỳ API/SDK/nguồn dữ liệu do 
                bên khác cung cấp.
              </p>
              <p>
                <strong className="text-white">"Người dùng":</strong> cá nhân/tổ chức truy cập hoặc sử dụng 
                Dịch vụ.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">3.</span> Điều kiện sử dụng
            </h2>
            <ul className="space-y-2 list-disc list-inside">
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
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">4.</span> Bản chất Dịch vụ & Nội dung Bên thứ ba
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
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">5.</span> Quyền sở hữu trí tuệ
            </h2>
            <ul className="space-y-2">
              <li>• Nhãn hiệu, logo, giao diện, mã nguồn của MOVIE4YOU và các bên cấp quyền được pháp luật 
              bảo hộ.</li>
              <li>• Bạn không được sao chép, dịch ngược, sửa đổi, phân phối, tạo phái sinh từ Dịch vụ nếu 
              không có chấp thuận bằng văn bản.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">6.</span> Tài khoản (nếu áp dụng)
            </h2>
            <ul className="space-y-2">
              <li>• Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh.</li>
              <li>• MOVIE4YOU có thể tạm ngừng/chấm dứt tài khoản khi nghi ngờ vi phạm ToS/pháp luật.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">7.</span> Quy tắc sử dụng chấp nhận được (AUP)
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
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">8.</span> Trách nhiệm người dùng & Bồi thường
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
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">9.</span> Thông báo & Gỡ bỏ về bản quyền
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
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">10.</span> API Bên thứ ba & Liên kết ngoài
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
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">11.</span> Quyền riêng tư & Dữ liệu
            </h2>
            <ul className="space-y-2">
              <li>• Việc xử lý dữ liệu cá nhân tuân theo Chính sách Quyền riêng tư (được dẫn liên kết 
              trên website).</li>
              <li>• Có thể thu thập nhật ký kỹ thuật để bảo mật, chống gian lận và đáp ứng yêu cầu 
              pháp lý.</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">12.</span> Miễn trừ bảo đảm
            </h2>
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-400">
                Dịch vụ được cung cấp "nguyên trạng" (as-is) và "theo khả dụng" (as-available), không có 
                bảo đảm dưới bất kỳ hình thức nào (rõ ràng hay ngụ ý), bao gồm nhưng không giới hạn ở: 
                khả năng thương mại, phù hợp mục đích cụ thể, không vi phạm.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">13.</span> Giới hạn trách nhiệm
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
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">14.</span> Chấm dứt
            </h2>
            <ul className="space-y-2">
              <li>• MOVIE4YOU có thể tạm ngừng/chấm dứt một phần/toàn bộ Dịch vụ bất cứ lúc nào vì lý do 
              hợp pháp (bao gồm vi phạm ToS).</li>
              <li>• Các điều khoản theo bản chất (SHTT, miễn trừ, giới hạn trách nhiệm, luật áp dụng...) 
              vẫn tiếp tục hiệu lực sau chấm dứt.</li>
            </ul>
          </section>

          {/* Section 15 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">15.</span> Thay đổi Điều khoản
            </h2>
            <p>
              MOVIE4YOU có thể cập nhật ToS; bản cập nhật có hiệu lực khi đăng tải. Tiếp tục sử dụng = 
              bạn chấp nhận phiên bản mới.
            </p>
          </section>

          {/* Section 16 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">16.</span> Lực bất khả kháng
            </h2>
            <p>
              MOVIE4YOU không chịu trách nhiệm cho chậm trễ/không thực hiện do sự kiện ngoài tầm kiểm 
              soát hợp lý (thiên tai, chiến tranh, sự cố hạ tầng bên thứ ba, thay đổi pháp luật, v.v.).
            </p>
          </section>

          {/* Section 17 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">17.</span> Luật áp dụng & Giải quyết tranh chấp
            </h2>
            <ul className="space-y-2">
              <li>• ToS chịu sự điều chỉnh của luật pháp quốc tế và luật địa phương áp dụng.</li>
              <li>• Tranh chấp sẽ được giải quyết thông qua hòa giải trước khi đưa ra tòa án có thẩm quyền.</li>
              <li>• Các bên ưu tiên giải quyết tranh chấp một cách thiện chí và hợp tác.</li>
            </ul>
          </section>

          {/* Section 18 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">18.</span> Tính độc lập điều khoản
            </h2>
            <p>
              Nếu một điều khoản bị coi là vô hiệu/không thể thực thi, các phần còn lại của ToS vẫn có 
              hiệu lực.
            </p>
          </section>

          {/* Section 19 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">19.</span> Toàn bộ thỏa thuận - Không chuyển nhượng
            </h2>
            <ul className="space-y-2">
              <li>• ToS (cùng Chính sách Quyền riêng tư) là toàn bộ thỏa thuận giữa bạn và MOVIE4YOU về 
              Dịch vụ.</li>
              <li>• Bạn không được chuyển nhượng/ủy quyền quyền/nghĩa vụ theo ToS nếu không có chấp thuận 
              bằng văn bản của MOVIE4YOU.</li>
            </ul>
          </section>

          {/* Section 20 */}
          <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-500 mr-3">20.</span> Liên hệ
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
