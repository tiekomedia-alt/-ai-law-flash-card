"use client";

import React, { useState } from 'react';
import { ArrowLeft, Search, CheckCircle, Users, Grid, ShieldCheck, Home, History, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function VerifyShuffle() {
  const [serial, setSerial] = useState('TS-260310-A7K2');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<'found' | 'not-found' | null>('found');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      // Mock logic: if it starts with TS-, it's found
      if (serial.toUpperCase().startsWith('TS-')) {
        setResult('found');
      } else {
        setResult('not-found');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#14171e] text-slate-100 font-display flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#14171e]/80 backdrop-blur-md border-b border-[#192643]/30">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto w-full">
          <Link href="/" className="text-slate-100 flex size-10 items-center justify-center rounded-full hover:bg-[#192643]/40 transition-colors">
            <ArrowLeft className="size-6" />
          </Link>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Verify a Shuffle</h1>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 space-y-6">
        {/* Search Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-400 ml-1">Serial Number</label>
          <form onSubmit={handleSearch} className="relative flex w-full items-center">
            <div className="absolute left-4 text-slate-400 flex items-center justify-center pointer-events-none">
              <Search className="size-5" />
            </div>
            <input 
              type="text" 
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              className="block w-full rounded-xl border-none bg-[#192643]/20 py-4 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-[#192643]/50 text-base uppercase" 
              placeholder="Enter serial number (e.g., TS-260310-A7K2)" 
            />
            <button 
              type="submit"
              disabled={isSearching || !serial.trim()}
              className="absolute right-2 bg-[#192643] text-white px-3 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              {isSearching ? 'Checking...' : 'Verify'}
            </button>
          </form>
          <p className="text-[10px] text-slate-500 px-1 italic">Verified status is updated instantly after generation.</p>
        </div>

        {/* Verification Status Card */}
        {result === 'found' && (
          <div className="bg-[#192643]/10 border border-[#192643]/30 rounded-xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex flex-col items-center text-center space-y-4 border-b border-[#192643]/20">
              <div className="size-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                <CheckCircle className="size-12" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Verified Shuffle</h2>
                <p className="text-slate-400 text-sm">Authentic TeamShuffle Generation</p>
              </div>
            </div>

            {/* Details List */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Serial Number</span>
                  <p className="text-sm font-mono font-medium text-slate-100">{serial.toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Date & Time</span>
                  <p className="text-sm font-medium text-slate-100">Mar 10, 2026, 3:45 PM</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Origin</span>
                  <p className="text-sm font-medium text-slate-100 flex items-center gap-1">
                    Nigeria 🇳🇬
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Verification Count</span>
                  <p className="text-sm font-medium text-emerald-400 flex items-center gap-1">
                    1st Lookup
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#192643]/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-[#192643]/30 p-2 rounded-lg text-slate-300">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Players</p>
                    <p className="font-bold">15</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-[#192643]/20"></div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#192643]/30 p-2 rounded-lg text-slate-300">
                    <Grid className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Teams</p>
                    <p className="font-bold">3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {result === 'not-found' && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6 flex flex-col items-center text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle className="text-rose-500 size-10" />
            <div>
              <h3 className="font-bold text-rose-100">Not Found</h3>
              <p className="text-sm text-rose-300">Serial number not found. Check and try again.</p>
            </div>
            <button 
              onClick={() => {
                setSerial('');
                setResult(null);
              }}
              className="bg-rose-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 py-4">
          <ShieldCheck className="text-slate-600 size-5" />
          <span className="text-xs text-slate-600 font-medium uppercase tracking-widest">Secure Verification System</span>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#14171e]/90 backdrop-blur-lg border-t border-[#192643]/30 pb-safe z-50">
        <div className="max-w-md mx-auto flex gap-2 px-4 pb-3 pt-2">
          <Link href="/" className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400">
            <div className="flex h-8 items-center justify-center">
              <Home className="size-6" />
            </div>
            <p className="text-[10px] font-medium">Home</p>
          </Link>
          <Link href="/verify" className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-100">
            <div className="flex h-8 items-center justify-center bg-[#192643]/50 w-12 rounded-full">
              <CheckCircle2 className="size-6" />
            </div>
            <p className="text-[10px] font-bold">Verify</p>
          </Link>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400">
            <div className="flex h-8 items-center justify-center">
              <History className="size-6" />
            </div>
            <p className="text-[10px] font-medium">History</p>
          </button>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400">
            <div className="flex h-8 items-center justify-center">
              <Settings className="size-6" />
            </div>
            <p className="text-[10px] font-medium">Settings</p>
          </button>
        </div>
      </nav>
    </div>
  );
}
