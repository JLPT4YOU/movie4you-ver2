import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'This website operates for educational and informational purposes only. By continuing to use it, you accept full responsibility for your actions and outcomes.',
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-36">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 text-center">
            Disclaimer
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 text-center">
            <span>Last updated: September 9, 2025</span>
          </div>
        </header>

        {/* Sections */}
        <div className="space-y-8">
          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">Purpose</h2>
            <p className="text-gray-300 leading-relaxed">
              This website and its content (the "Website") are provided for educational and informational purposes only. The Website, its operators, and contributors (collectively, the "Service Provider") do not make any guarantees regarding accuracy, completeness, suitability, or availability of any content or services provided.
            </p>
          </section>

          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">Educational Use Only</h2>
            <p className="text-gray-300 leading-relaxed">
              All information, materials, and tools on the Website are intended solely for learning, research, and demonstration. They are not intended to be used in production systems, commercial environments, or for any unlawful activity.
            </p>
          </section>

          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">No Responsibility for Use</h2>
            <p className="text-gray-300 leading-relaxed">
              You are solely responsible for how you use the information or services found on the Website. The Service Provider shall not be responsible or liable for any direct, indirect, incidental, consequential, special, exemplary, or punitive damages, or any loss of data, revenue, or profits, arising out of or in connection with your use of the Website or reliance on any content.
            </p>
          </section>

          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">User Assumes All Risk</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or continuing to use the Website, you acknowledge and agree that you use the Website at your own risk and that you are solely responsible for your actions and compliance with all applicable laws and regulations.
            </p>
          </section>

          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">No Warranties</h2>
            <p className="text-gray-300 leading-relaxed">
              The Website is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including but not limited to warranties of accuracy, non-infringement, merchantability, or fitness for a particular purpose. Availability and uninterrupted access are not guaranteed.
            </p>
          </section>

          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Content and Links</h2>
            <p className="text-gray-300 leading-relaxed">
              The Website may include links to or integrations with third-party websites, services, or content. Such inclusion does not constitute endorsement. The Service Provider does not control and is not responsible for third-party content, policies, or practices. You bear all risks associated with accessing or using third-party resources.
            </p>
          </section>

          <section className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-4">Consent</h2>
            <p className="text-gray-300 leading-relaxed">
              By continuing to use the Website, you acknowledge that you have read, understood, and agree to be bound by this Disclaimer. If you do not agree, you must stop accessing and using the Website immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
