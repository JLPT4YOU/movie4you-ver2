import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
          <ol className="list-reset inline-flex items-center">
            <li>
              <Link href="/" className="hover:text-white">Trang chủ</Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-white">DMCA</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">DMCA - Thông báo và Gỡ bỏ</h1>
          <p className="text-sm text-gray-400 mt-2">Hiệu lực: 18/12/2024 • Liên hệ: <a href="mailto:movie4you.owner@gmail.com" className="text-red-300">movie4you.owner@gmail.com</a></p>
        </header>

        {/* DMCA Protection Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <Image 
              src="https://images.dmca.com/Badges/dmca-badge-w200-5x1-10.png?ID=movie4you" 
              alt="DMCA.com Protection Status" 
              width={200} 
              height={40}
              className="h-auto"
              priority
            />
          </div>
        </div>

        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">ℹ️</span> 1. Giới thiệu
          </h2>
          <p>
            MOVIE4YOU tôn trọng quyền sở hữu trí tuệ. Chúng tôi triển khai cơ chế tiếp nhận thông báo vi phạm theo
            tinh thần của DMCA và các luật tương tự trên toàn cầu ("notice-and-takedown"). Nếu bạn là chủ sở hữu bản quyền
            hoặc đại diện hợp pháp, bạn có thể gửi yêu cầu gỡ bỏ nội dung bị cáo buộc vi phạm theo hướng dẫn dưới đây.
          </p>
        </section>

        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">✉️</span> 2. Cách gửi thông báo vi phạm (Takedown Notice)
          </h2>
          <p className="mb-3">Vui lòng gửi email đến <a className="text-red-300" href="mailto:movie4you.owner@gmail.com">movie4you.owner@gmail.com</a> kèm các thông tin:</p>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            <li>Thông tin liên hệ của bạn: họ tên, tổ chức (nếu có), địa chỉ, email, số điện thoại.</li>
            <li>Mô tả rõ tác phẩm có bản quyền bị xâm phạm (đính kèm bằng chứng sở hữu nếu có).</li>
            <li>URL cụ thể trên MOVIE4YOU nơi nội dung vi phạm xuất hiện (1 URL mỗi dòng).</li>
            <li>Tuyên bố thiện chí: bạn tin rằng việc sử dụng bị khiếu nại không được chủ sở hữu cho phép.</li>
            <li>Tuyên bố chính xác: thông tin trong yêu cầu là đúng, bạn là chủ sở hữu/đại diện được ủy quyền.</li>
            <li>Chữ ký điện tử hoặc bản scan chữ ký (không bắt buộc, nhưng được khuyến nghị).</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-900/20 border border-blue-800 rounded text-sm">
            <p>Lưu ý: Chúng tôi có thể yêu cầu bổ sung thông tin để xác minh và xử lý yêu cầu.</p>
          </div>
        </section>

        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">🔎</span> 3. Quy trình xử lý
          </h2>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            <li>Chúng tôi xem xét tính đầy đủ và hợp lệ của thông báo.</li>
            <li>Nếu hợp lệ, chúng tôi có thể tạm chặn/gỡ nội dung bị cáo buộc vi phạm.</li>
            <li>Thông báo sẽ được chuyển đến bên đăng tải (nếu xác định được) để họ có cơ hội phản hồi.</li>
            <li>Chúng tôi lưu hồ sơ xử lý để phục vụ nghĩa vụ pháp lý và kiểm toán tuân thủ.</li>
          </ul>
        </section>

        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">📨</span> 4. Thông báo phản đối (Counter-Notice)
          </h2>
          <p className="mb-3">
            Nếu bạn tin rằng nội dung bị gỡ là do nhầm lẫn hoặc được cho phép hợp pháp, bạn có thể gửi counter-notice
            đến email trên, bao gồm: thông tin liên hệ, URL đã bị gỡ, tuyên bố thiện chí về việc gỡ nhầm, và chấp nhận
            thẩm quyền giải quyết tranh chấp (nếu có) theo quy định pháp luật liên quan.
          </p>
          <p className="text-xs text-gray-400">Cảnh báo: Gửi thông tin sai sự thật có thể dẫn đến trách nhiệm pháp lý.</p>
        </section>

        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">♻️</span> 5. Người tái phạm
          </h2>
          <p>
            Chúng tôi có thể áp dụng biện pháp ngăn chặn thích hợp đối với người dùng/bên cung cấp nội dung tái phạm nhiều lần
            sau khi đã được cảnh báo và xem xét phù hợp với luật áp dụng.
          </p>
        </section>

        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">📧</span> 6. Liên hệ
          </h2>
          <p>Mọi yêu cầu liên quan tới DMCA, vui lòng gửi đến: <a className="text-red-300" href="mailto:movie4you.owner@gmail.com">movie4you.owner@gmail.com</a></p>
        </section>
      </div>
    </div>
  );
}
