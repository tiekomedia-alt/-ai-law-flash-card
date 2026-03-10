import { Shield, Menu, UserPlus, Dices, Share2, Fingerprint, Eye, LayoutDashboard, Globe, ArrowRight, Quote, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F1520] text-slate-100 font-display">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0F1520]/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-10 rounded-lg bg-[#dc2626] text-white">
            <Shield className="size-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">TeamShuffle</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/app" className="bg-[#dc2626] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            Try Now
          </Link>
          <button className="p-2 text-slate-400">
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-12 pb-16 px-6">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 max-w-md mx-auto text-center">
          <h1 className="text-5xl font-black leading-[1.1] tracking-tighter text-white mb-6">
            Fair Teams.<br /><span className="text-[#dc2626]">One Tap.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            The world's most transparent team shuffler. Used by football clubs, schools, and teams in 30+ countries.
          </p>
          <Link to="/app" className="block w-full bg-[#dc2626] hover:bg-red-700 text-white py-4 px-8 rounded-xl text-lg font-extrabold shadow-lg shadow-[#dc2626]/20 transition-all mb-6">
            Shuffle Now — It's Free
          </Link>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#192643]/30 rounded-full border border-[#192643]/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold text-slate-300">12,847 teams shuffled worldwide</span>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="py-12 bg-slate-900/50">
        <h2 className="px-6 text-2xl font-extrabold mb-8 text-white">How It Works</h2>
        <div className="flex overflow-x-auto gap-4 px-6 pb-6 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {/* Step 1 */}
          <div className="min-w-[280px] bg-[#1A202C] p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="size-12 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mb-4">
              <UserPlus className="size-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">1. Add Players</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Input names or import your regular squad list in seconds.</p>
          </div>
          {/* Step 2 */}
          <div className="min-w-[280px] bg-[#1A202C] p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="size-12 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mb-4">
              <Dices className="size-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">2. Tap Shuffle</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Our algorithm ensures zero bias for perfectly fair matches.</p>
          </div>
          {/* Step 3 */}
          <div className="min-w-[280px] bg-[#1A202C] p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="size-12 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mb-4">
              <Share2 className="size-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">3. Share Teams</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Download your branded team cards or share directly to your group.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-6 bg-[#080B12] text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
          <Shield className="size-[200px]" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-10 leading-tight">Every shuffle is verified</h2>
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <Fingerprint className="text-[#dc2626] size-6 shrink-0" />
              <div>
                <p className="font-bold text-lg mb-1">Unique verification ID</p>
                <p className="text-slate-400 text-sm mb-2">Proof of fairness for every draw.</p>
                <code className="bg-white/10 px-3 py-1 rounded text-[#dc2626] font-mono text-sm">TS-260310-A7K2</code>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Eye className="text-[#dc2626] size-6 shrink-0" />
              <div>
                <p className="font-bold text-lg mb-1">Public Shuffle Count</p>
                <p className="text-slate-400 text-sm">Total shuffle count is visible on every result page to prevent re-shuffling bias.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <LayoutDashboard className="text-[#dc2626] size-6 shrink-0" />
              <div>
                <p className="font-bold text-lg mb-1">Real-time Global Dashboard</p>
                <p className="text-slate-400 text-sm text-balance">See shuffles happening worldwide in real-time. Transparency at scale.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Activity Preview */}
      <section className="py-16 px-6">
        <div className="bg-[#1A202C] rounded-3xl p-6 border border-slate-800 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5 grayscale pointer-events-none">
            <img alt="World Map Background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsfP4fAF-u5FBI8TqEyk_j82MFWgObzmDqT_CdD54IrbYjaRDfKCr8C_AZC8ulYEj4VnBnWK2wEDPI2YIAaXSgSVkAQTY2uwy1jAR9DeQ2zG6PCRKUW_2tlzw_c4jfj3v7jdjZ-OGx2yi5sDHqbVnZtOwIUI9sRbJdfvIvwH1jRunZDQVAyvTK3VCQcKjcA1UfFQkw73GRjTD_l-Ft7KE667wOdYPwzEoKRp2-GVio89RgcK9agQEk1nmu4wCA-kTWIUu0dT5EyEQ" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="text-[#dc2626] size-6" />
              Live Activity
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-[#0F1520]/50 rounded-xl">
                <div className="size-8 flex items-center justify-center text-xl">🇳🇬</div>
                <p className="text-sm">A team was shuffled in <span className="font-bold">Lagos, Nigeria</span> <span className="text-slate-500">• 2 min ago</span></p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#0F1520]/50 rounded-xl opacity-70">
                <div className="size-8 flex items-center justify-center text-xl">🇬🇧</div>
                <p className="text-sm">A team was shuffled in <span className="font-bold">London, UK</span> <span className="text-slate-500">• 5 min ago</span></p>
              </div>
            </div>
            <Link to="/global" className="inline-flex items-center gap-2 text-[#dc2626] font-bold hover:gap-3 transition-all">
              View Full Dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 px-6">
        <div className="relative max-w-sm mx-auto">
          <Quote className="text-slate-800 size-16 absolute -top-4 -left-4 z-0 fill-current" />
          <div className="relative z-10">
            <p className="text-lg italic font-medium text-slate-300 mb-6 leading-relaxed">
              "Finally, no more arguments on Tuesday nights! Everyone trusts the app because of the verification ID. It's transformed our match preparation."
            </p>
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-slate-700 overflow-hidden">
                <img alt="SOT FC Member" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7sJ-iYTHWdtCOlOOKK6XCPEPsoxIveFH3xC8974o1ZUDSDJ9i-9jzgxTFIn-7c0hcCiK3ToufYu90AdT4gXAWn5KJ0PTYUFt7YREaFeNBfcVJ8sWK6XteJbCfMXCZ5f8sv85MZbpaC-MqWRIltsu7Y4yphZi9pVRccXKz2dDGn9FCsQ4L31seCQZhDNdHDBNNHpCda8-vzH2J9IQ8ujS8ihDqjtiPk0h5BdFcWMQnD97ji7bg5D-cMcAX__KAgTFhny3IjpfSuIw" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-white">James Wilson 🏴󠁧󠁢󠁥󠁮󠁧󠁿</p>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">SOT FC Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080B12] pt-16 pb-8 px-6 border-t border-slate-800">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center justify-center size-8 rounded bg-[#dc2626] text-white">
              <Shield className="size-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white uppercase">TeamShuffle</span>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/global" className="hover:text-[#dc2626]">Dashboard</Link></li>
                <li><Link to="/verify" className="hover:text-[#dc2626]">Verification</Link></li>
                <li><a href="#" className="hover:text-[#dc2626]">Pricing</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-[#dc2626]">About Us</a></li>
                <li><a href="#" className="hover:text-[#dc2626]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#dc2626]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#dc2626]">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="flex justify-start gap-6 mb-12">
            <a href="#" className="text-slate-400 hover:text-[#dc2626] transition-colors">
              <Twitter className="size-6" />
            </a>
            <a href="#" className="text-slate-400 hover:text-[#dc2626] transition-colors">
              <Instagram className="size-6" />
            </a>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col gap-4">
            <p className="text-xs text-slate-400">© 2026 TeamShuffle. Built by Tieko Media Limited.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
