"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Menu, UserPlus, Dices, Share2, Fingerprint, Eye, LayoutDashboard, Globe, ArrowRight, Quote, Twitter, Instagram, X, Coffee } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


const LOCATIONS = [
  { flag: '🇳🇬', city: 'Lagos', country: 'Nigeria' },
  { flag: '🇬🇧', city: 'London', country: 'UK' },
  { flag: '🇺🇸', city: 'New York', country: 'USA' },
  { flag: '🇧🇷', city: 'São Paulo', country: 'Brazil' },
  { flag: '🇩🇪', city: 'Berlin', country: 'Germany' },
  { flag: '🇮🇳', city: 'Mumbai', country: 'India' },
  { flag: '🇦🇺', city: 'Sydney', country: 'Australia' },
  { flag: '🇿🇦', city: 'Cape Town', country: 'South Africa' },
  { flag: '🇲🇽', city: 'Mexico City', country: 'Mexico' },
  { flag: '🇯🇵', city: 'Tokyo', country: 'Japan' },
  { flag: '🇨🇦', city: 'Toronto', country: 'Canada' },
  { flag: '🇫🇷', city: 'Paris', country: 'France' },
];

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [totalShuffles, setTotalShuffles] = useState(1247);
  const [activities, setActivities] = useState([
    { id: 1, flag: '🇳🇬', city: 'Lagos', country: 'Nigeria', time: 'Just now' },
    { id: 2, flag: '🇬🇧', city: 'London', country: 'UK', time: '2 min ago' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const newActivity = {
        id: Date.now(),
        flag: randomLoc.flag,
        city: randomLoc.city,
        country: randomLoc.country,
        time: 'Just now'
      };
      
      setActivities(prev => {
        const updated = [newActivity, ...prev].slice(0, 2);
        return updated.map((act, i) => i === 0 ? act : { ...act, time: `${i + 1} min ago` });
      });
      
      setTotalShuffles(prev => prev + 1);
    }, 6000); // New shuffle every 6 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1520] text-slate-100 font-display">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0F1520]/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Image 
            src="https://res.cloudinary.com/dspngcwzj/image/upload/v1773368448/enlarged_logo_team_shuf_g1bmvq.png" 
            alt="TeamShuffle Logo" 
            width={40} 
            height={40} 
            className="h-8 w-auto"
            referrerPolicy="no-referrer"
          />
          <span className="text-xl font-extrabold tracking-tight text-white">TeamShuffle</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0F1520]/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Image 
                src="https://res.cloudinary.com/dspngcwzj/image/upload/v1773368448/enlarged_logo_team_shuf_g1bmvq.png" 
                alt="TeamShuffle Logo" 
                width={40} 
                height={40} 
                className="h-8 w-auto"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-extrabold tracking-tight text-white">TeamShuffle</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-full"
            >
              <X className="size-6" />
            </button>
          </div>
          <div className="flex flex-col p-6 gap-6 text-lg font-bold">
            <Link href="/app" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-[#1A202C] rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
              <span>Shuffle App</span>
              <ArrowRight className="size-5 text-slate-500" />
            </Link>
            <Link href="/global" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-[#1A202C] rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
              <span>Global Dashboard</span>
              <ArrowRight className="size-5 text-slate-500" />
            </Link>
            <Link href="/verify" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-[#1A202C] rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
              <span>Verify a Shuffle</span>
              <ArrowRight className="size-5 text-slate-500" />
            </Link>
            
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
              <h4 className="text-sm text-slate-500 uppercase tracking-widest font-bold">More</h4>
              <button onClick={() => { setShowSupportModal(true); setIsMobileMenuOpen(false); }} className="block text-left text-slate-300 hover:text-white transition-colors">Support Us</button>
              <button className="block text-slate-300 hover:text-white transition-colors">About Us</button>
              <button className="block text-slate-300 hover:text-white transition-colors">Contact</button>
              <Link href="/paywall" onClick={() => setIsMobileMenuOpen(false)} className="block text-left w-full text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
                <Coffee className="size-4" /> Tip Jar
              </Link>
            </div>
          </div>
        </div>
      )}

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
          <Link href="/app" className="block w-full bg-[#dc2626] hover:bg-red-700 text-white py-4 px-8 rounded-xl text-lg font-extrabold shadow-lg shadow-[#dc2626]/20 transition-all mb-4">
            Shuffle Now — It's Free
          </Link>
          <Link href="/paywall" className="block w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 py-3 px-8 rounded-xl text-md font-bold transition-all mb-8 flex items-center justify-center gap-2">
            <Coffee className="size-5" /> Tip Jar
          </Link>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#192643]/30 rounded-full border border-[#192643]/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold text-slate-300">{totalShuffles.toLocaleString()} teams shuffled worldwide</span>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="py-12 bg-slate-900/50">
        <h2 className="px-6 text-2xl font-extrabold mb-8 text-white">How It Works</h2>
        {/* Added snap scrolling and removed the hidden scrollbar so it's obvious on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-6 custom-scrollbar">
          {/* Step 1 */}
          <div className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-[#1A202C] p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="size-12 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mb-4">
              <UserPlus className="size-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">1. Add Players</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Input names or import your regular squad list in seconds.</p>
          </div>
          {/* Step 2 */}
          <div className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-[#1A202C] p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="size-12 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mb-4">
              <Dices className="size-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">2. Tap Shuffle</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Our algorithm ensures zero bias for perfectly fair matches.</p>
          </div>
          {/* Step 3 */}
          <div className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-[#1A202C] p-6 rounded-2xl border border-slate-800 shadow-sm">
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
              {activities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className={`flex items-center gap-3 p-3 bg-[#0F1520]/50 rounded-xl transition-all duration-500 ${index === 0 ? 'animate-in fade-in slide-in-from-top-2' : 'opacity-70'}`}
                >
                  <div className="size-8 flex items-center justify-center text-xl">{activity.flag}</div>
                  <p className="text-sm">A team was shuffled in <span className="font-bold">{activity.city}, {activity.country}</span> <span className="text-slate-500">• {activity.time}</span></p>
                </div>
              ))}
            </div>
            <Link href="/global" className="inline-flex items-center gap-2 text-[#dc2626] font-bold hover:gap-3 transition-all">
              View Full Dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080B12] pt-16 pb-8 px-6 border-t border-slate-800">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Image 
              src="https://res.cloudinary.com/dspngcwzj/image/upload/v1773368448/enlarged_logo_team_shuf_g1bmvq.png" 
              alt="TeamShuffle Logo" 
              width={40} 
              height={40} 
              className="h-8 w-auto"
              referrerPolicy="no-referrer"
            />
            <span className="text-lg font-extrabold tracking-tight text-white uppercase">TeamShuffle</span>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/global" className="hover:text-[#dc2626]">Dashboard</Link></li>
                <li><Link href="/verify" className="hover:text-[#dc2626]">Verification</Link></li>
                <li><button onClick={() => setShowSupportModal(true)} className="hover:text-[#dc2626]">Support Us</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button className="hover:text-[#dc2626]">About Us</button></li>
                <li><button className="hover:text-[#dc2626]">Privacy Policy</button></li>
                <li><button className="hover:text-[#dc2626]">Terms of Service</button></li>
                <li><button className="hover:text-[#dc2626]">Contact</button></li>
              </ul>
            </div>
          </div>
          <div className="flex justify-start gap-6 mb-12">
            <a href="https://x.com/tiekomedia" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#dc2626] transition-colors">
              <Twitter className="size-6" />
            </a>
            <a href="https://www.instagram.com/tiekomedia?igsh=YTNmNTAyemFmdzhr" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#dc2626] transition-colors">
              <Instagram className="size-6" />
            </a>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col gap-4">
            <p className="text-xs text-slate-400">© 2026 TeamShuffle. Built by Tieko Media Limited.</p>
          </div>
        </div>
      </footer>

      {/* Support Us Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1A202C] rounded-3xl w-full max-w-2xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Coffee className="size-32 text-emerald-500" />
            </div>
            
            <div className="flex justify-between items-center p-6 border-b border-slate-800 relative z-10 shrink-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold border border-emerald-500/20">
                <Coffee className="size-4" /> Keep TeamShuffle Free
              </div>
              <button 
                onClick={() => setShowSupportModal(false)}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto relative z-10 custom-scrollbar">
              <h2 className="text-3xl font-black text-white mb-6 leading-tight">Why TeamShuffle is Free</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed mb-8">
                <p>
                  At <strong>Tieko Media</strong>, we believe that bringing people together shouldn't come with a price tag. Whether it's for global corporate bonding, team building exercises, weekend game nights, sports tournaments, or classroom activities, fair play is a universal right.
                </p>
                <p>
                  That's why we've decided to make TeamShuffle a <strong>100% free utility for global use</strong>. No paywalls, no hidden fees, and absolutely no annoying ads to interrupt your flow.
                </p>
                <p>
                  However, running real-time global servers, paying our dedicated developers, and continuously improving the app costs money. To keep TeamShuffle free and ad-free forever, we rely entirely on the generosity of our community.
                </p>
                <p className="font-bold text-white">
                  If TeamShuffle has helped your team, please consider dropping a tip in our jar. Your contribution goes a long way in keeping the servers running and the shuffles fair!
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-[#0F1520] shrink-0 relative z-10">
              <Link 
                href="/paywall"
                onClick={() => setShowSupportModal(false)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 py-4 px-8 rounded-xl text-lg font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Coffee className="size-6" /> Drop a Tip in the Jar
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
