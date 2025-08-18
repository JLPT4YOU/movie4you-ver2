import Link from "next/link";

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
            <li className="text-white">Liên hệ</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Liên hệ MOVIE4YOU</h1>
          <p className="text-sm text-gray-400 mt-2">
            Email hỗ trợ: <a href="mailto:movie4you.owner@gmail.com" className="text-red-300">movie4you.owner@gmail.com</a>
          </p>
        </header>

        {/* Purpose */}
        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">🤝</span> 1. Khi nào nên liên hệ?
          </h2>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            <li>Phản hồi về trải nghiệm sử dụng, tính năng hoặc đề xuất cải tiến.</li>
            <li>Báo lỗi kỹ thuật trong quá trình truy cập hoặc xem nội dung.</li>
            <li>Vấn đề bản quyền/DMCA: vui lòng xem hướng dẫn tại <Link className="text-red-300" href="/dmca">trang DMCA</Link>.</li>
            <li>Câu hỏi liên quan tới quyền riêng tư: xem <Link className="text-red-300" href="/privacy">Chính sách bảo mật</Link> hoặc gửi email cho chúng tôi.</li>
          </ul>
        </section>

        {/* Legal Note */}
        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">📄</span> 2. Lưu ý pháp lý
          </h2>
          <p className="text-sm">
            MOVIE4YOU là nền tảng tổng hợp/tra cứu. Chúng tôi không lưu trữ nội dung phim trên máy chủ của mình. Đối với yêu cầu gỡ bỏ
            nội dung vi phạm bản quyền, vui lòng thực hiện theo quy trình "thông báo và gỡ bỏ" tại trang <Link className="text-red-300" href="/dmca">DMCA</Link>.
          </p>
        </section>

        {/* SLA */}
        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">⏱️</span> 3. Thời gian phản hồi
          </h2>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            <li>Email hỗ trợ chung: trong vòng 1–3 ngày làm việc.</li>
            <li>Yêu cầu DMCA/bản quyền hợp lệ: ưu tiên xử lý sớm nhất có thể.</li>
            <li>Yêu cầu quyền riêng tư (truy cập/xóa dữ liệu...): tối đa 30 ngày làm việc.</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">📧</span> 4. Thông tin liên hệ
          </h2>
          <div className="text-sm space-y-1">
            <p>Email: <a className="text-red-300" href="mailto:movie4you.owner@gmail.com">movie4you.owner@gmail.com</a></p>
            <p>Chính sách bảo mật: <Link className="text-red-300" href="/privacy">/privacy</Link></p>
            <p>DMCA: <Link className="text-red-300" href="/dmca">/dmca</Link></p>
          </div>
        </section>
      </div>
    </div>
  );
}
