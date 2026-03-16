"use client";

import React, { useState } from 'react';
import { Coffee, Heart, Zap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PaywallPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate checkout process
    setTimeout(() => {
      alert('Redirecting to secure payment gateway... (Stripe integration coming soon)');
      setIsProcessing(false);
    }, 1500);
  };

  const amounts = [
    { value: 3, label: 'Coffee', icon: Coffee, description: 'Fuel a late-night coding session' },
    { value: 5, label: 'High Five', icon: Heart, description: 'Help keep the servers running' },
    { value: 10, label: 'Super Supporter', icon: Zap, description: 'Fund new features & updates' },
  ];

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-200 font-sans selection:bg-[#dc2626]/30 flex flex-col">
      {/* Navigation */}
      <nav className="p-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="size-5" />
          <span className="font-bold">Back to Home</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6 border border-emerald-500/20">
              <Coffee className="size-8" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Support TeamShuffle</h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Choose an amount to drop in the tip jar. Your support keeps our app 100% free and ad-free for everyone.
            </p>
          </div>

          <div className="bg-[#1A202C] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
            <div className="space-y-4 mb-8">
              {amounts.map((tier) => {
                const isSelected = selectedAmount === tier.value;
                const Icon = tier.icon;
                return (
                  <button
                    key={tier.value}
                    onClick={() => {
                      setSelectedAmount(tier.value);
                      setCustomAmount('');
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-slate-700 bg-[#0F1520] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <div className={`font-bold text-lg ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                          {tier.label}
                        </div>
                        <div className="text-sm text-slate-400">{tier.description}</div>
                      </div>
                    </div>
                    <div className={`text-xl font-black ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                      ${tier.value}
                    </div>
                  </button>
                );
              })}

              <div className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                selectedAmount === null 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-slate-700 bg-[#0F1520] hover:border-slate-500'
              }`}>
                <div className="font-bold text-lg text-white">Custom Amount</div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    onFocus={() => setSelectedAmount(null)}
                    className="bg-transparent border-none outline-none text-xl font-black text-white w-24 text-right placeholder:text-slate-600 focus:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-400 justify-center mb-6">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Secure payment processing</span>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isProcessing || (selectedAmount === null && (!customAmount || parseFloat(customAmount) <= 0))}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 py-4 px-8 rounded-xl text-lg font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <Coffee className="size-6" /> 
                    Tip ${selectedAmount || customAmount || '0'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
