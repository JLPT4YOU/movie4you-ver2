
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-36">
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 text-center">
            Liên hệ MOVIE4YOU
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 text-center">
            <span>Email hỗ trợ:</span>
            <a href="mailto:movie4you.owner@gmail.com" className="text-red-500 hover:text-red-400 transition-colors">
              movie4you.owner@gmail.com
            </a>
          </div>
        </header>

        {/* Purpose */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">🤝</span> 1. Khi nào nên liên hệ?
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>Phản hồi về trải nghiệm sử dụng, tính năng hoặc đề xuất cải tiến.</li>
            <li>Báo lỗi kỹ thuật trong quá trình truy cập hoặc xem nội dung.</li>
            <li>Vấn đề bản quyền: vui lòng gửi email trực tiếp cho chúng tôi với thông tin chi tiết.</li>
            <li>Câu hỏi liên quan tới quyền riêng tư: xem <Link className="text-red-500 hover:text-red-400 transition-colors" href="/privacy">Chính sách bảo mật</Link> hoặc gửi email cho chúng tôi.</li>
          </ul>
        </section>

        {/* Legal Note */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">📄</span> 2. Lưu ý pháp lý
          </h2>
          <p className="text-gray-300 leading-relaxed">
            MOVIE4YOU là nền tảng tổng hợp/tra cứu. Chúng tôi không lưu trữ nội dung phim trên máy chủ của mình. Đối với yêu cầu gỡ bỏ
            nội dung vi phạm bản quyền, vui lòng liên hệ trực tiếp với chúng tôi qua email.
          </p>
        </section>

        {/* SLA */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">⏱️</span> 3. Thời gian phản hồi
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>Email hỗ trợ chung: trong vòng 1–3 ngày làm việc.</li>
            <li>Yêu cầu bản quyền hợp lệ: ưu tiên xử lý sớm nhất có thể.</li>
            <li>Yêu cầu quyền riêng tư (truy cập/xóa dữ liệu...): tối đa 30 ngày làm việc.</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
            <span className="text-red-500 mr-3">📧</span> 4. Thông tin liên hệ
          </h2>
          <div className="text-gray-300 space-y-2">
            <p>Email: <a className="text-red-500 hover:text-red-400 transition-colors" href="mailto:movie4you.owner@gmail.com">movie4you.owner@gmail.com</a></p>
            <p>Chính sách bảo mật: <Link className="text-red-500 hover:text-red-400 transition-colors" href="/privacy">/privacy</Link></p>
            <p>Điều khoản sử dụng: <Link className="text-red-500 hover:text-red-400 transition-colors" href="/terms">/terms</Link></p>
          </div>
        </section>
      </div>
    </div>
  );
}
