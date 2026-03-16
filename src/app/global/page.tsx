"use client";

import { Shuffle, Bell, TrendingUp, Globe, ChevronRight, Users, User, LayoutDashboard, History, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function GlobalDashboard() {
  return (
    <div className="min-h-screen bg-[#14171e] text-slate-100 font-display flex flex-col pb-24">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#14171e]/80 backdrop-blur-md border-b border-[#192643]/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="https://res.cloudinary.com/dspngcwzj/image/upload/v1773368448/enlarged_logo_team_shuf_g1bmvq.png" 
              alt="TeamShuffle Logo" 
              width={30} 
              height={30} 
              className="h-6 w-auto"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider text-slate-300">TeamShuffle</h1>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold leading-none">Global Dashboard</h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500 tracking-tighter uppercase">Live</span>
                </div>
              </div>
            </div>
          </div>
          <button className="flex items-center justify-center size-10 rounded-full bg-[#192643]/20 text-slate-400">
            <Bell className="size-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3 p-4">
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-[#192643] text-white shadow-lg">
            <p className="text-xs font-medium text-slate-300 uppercase tracking-tight">Total Shuffles</p>
            <p className="text-2xl font-bold leading-tight">1,284,502</p>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
              <TrendingUp className="size-3" />
              <span>+12% vs LY</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-[#192643]/20 border border-[#192643]/40">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">Today</p>
            <p className="text-2xl font-bold leading-tight">12,403</p>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 font-bold">
              <span>Target: 15k</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-[#192643]/20 border border-[#192643]/40">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">This Week</p>
            <p className="text-2xl font-bold leading-tight text-slate-100">84,210</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-[#192643]/20 border border-[#192643]/40">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">Countries</p>
            <p className="text-2xl font-bold leading-tight text-slate-100">142</p>
          </div>
        </section>

        {/* Activity Map */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Globe className="text-slate-400 size-5" />
              World Activity Map
            </h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Updating Realtime</span>
          </div>
          <div className="relative w-full aspect-[16/9] bg-[#192643]/10 rounded-xl overflow-hidden border border-[#192643]/30">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAL8-WHdDSV1K45CE7Rjddpbb2gsBkiSll3yAgrwJDtLx7-un-pdzUhxkyaGOMxKjKuKB-Ue-RT8bkDOw2FtDii_zoMp4IDp3Ak02_vUSMoxyvTI1VKsE3oxwwRpvKBC3JLm-UZv4ieoRutY99mFXUmIZ070vAH8yUH_zXmK7hnj0c6c--ORmx99Wei07CcxvVxMJMkqksP5QXidrvAkxo2r_crJCbJgsfU3KfSHzpp53Tdm76IwuEfNeShyiYiTnO9RxMFuWIZ7Q" 
              alt="World Map" 
              className="w-full h-full object-cover opacity-40" 
            />
            {/* Simulated Pins */}
            <div className="absolute top-[40%] left-[20%] size-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <div className="absolute top-[60%] left-[45%] size-3 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse"></div>
            <div className="absolute top-[35%] left-[75%] size-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <div className="absolute bottom-[20%] left-[30%] size-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          </div>
        </section>

        {/* Live Activity Feed */}
        <section className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold">Live Activity Feed</h3>
            <button className="text-xs font-semibold text-slate-400 flex items-center">
              View All <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { flag: '🇳🇬', country: 'Nigeria', serial: 'TS-260310-A7K2', time: '2 MIN AGO', teams: 3, players: 15 },
              { flag: '🇧🇷', country: 'Brazil', serial: 'TS-260310-B3M9', time: '5 MIN AGO', teams: 2, players: 10 },
              { flag: '🇬🇧', country: 'United Kingdom', serial: 'TS-260310-X9P1', time: '12 MIN AGO', teams: 5, players: 24 },
            ].map((activity) => (
              <div key={activity.serial} className="p-3 bg-[#192643]/10 rounded-lg border border-[#192643]/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{activity.flag}</span>
                    <div>
                      <h4 className="text-sm font-bold">{activity.country}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{activity.serial}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{activity.time}</span>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs">
                    <Users className="size-4 text-slate-400" />
                    <span className="font-bold">{activity.teams} Teams</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <User className="size-4 text-slate-400" />
                    <span className="font-bold">{activity.players} Players</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Country Leaderboard */}
        <section className="px-4 py-4">
          <h3 className="text-base font-bold mb-4">Country Leaderboard (24h)</h3>
          <div className="bg-[#192643]/10 rounded-xl overflow-hidden border border-[#192643]/20">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#192643]/30 text-[10px] font-bold uppercase text-slate-400">
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2">Country</th>
                  <th className="px-4 py-2 text-right">Shuffles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#192643]/20">
                {[
                  { rank: '1.', country: 'Nigeria', flag: '🇳🇬', count: '4,120' },
                  { rank: '2.', country: 'Brazil', flag: '🇧🇷', count: '3,850' },
                  { rank: '3.', country: 'USA', flag: '🇺🇸', count: '3,120' },
                  { rank: '4.', country: 'Japan', flag: '🇯🇵', count: '2,980' },
                ].map((item) => (
                  <tr key={item.country} className="text-sm">
                    <td className="px-4 py-3 font-bold text-slate-300">{item.rank}</td>
                    <td className="px-4 py-3 font-semibold flex items-center gap-2">{item.country} <span>{item.flag}</span></td>
                    <td className="px-4 py-3 text-right font-bold">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Section */}
        <section className="p-6 text-center">
          <h4 className="text-lg font-bold mb-2">Ready to shuffle your team?</h4>
          <p className="text-sm text-slate-400 mb-6">Join thousands of teams worldwide in fair play.</p>
          <Link href="/app" className="w-full py-4 bg-[#192643] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#192643]/20 hover:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <Shuffle className="size-6" />
            Shuffle Now
          </Link>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#14171e] border-t border-[#192643]/30 z-50">
        <div className="flex gap-2 px-4 pb-6 pt-2">
          <Link href="/global" className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-1 text-slate-100">
            <LayoutDashboard className="size-6" />
            <p className="text-[10px] font-bold uppercase tracking-tight">Dashboard</p>
          </Link>
          <Link href="/app" className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-1 text-slate-400">
            <Users className="size-6" />
            <p className="text-[10px] font-bold uppercase tracking-tight">Teams</p>
          </Link>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-1 text-slate-400">
            <History className="size-6" />
            <p className="text-[10px] font-bold uppercase tracking-tight">History</p>
          </button>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-1 text-slate-400">
            <User className="size-6" />
            <p className="text-[10px] font-bold uppercase tracking-tight">Profile</p>
          </button>
        </div>
      </nav>
    </div>
  );
}
