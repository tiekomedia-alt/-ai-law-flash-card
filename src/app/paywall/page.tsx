"use client";

import React, { useState, useEffect } from 'react';
import { Coffee, Heart, Zap, ArrowLeft, CheckCircle2, Loader2, Globe } from 'lucide-react';
import Link from 'next/link';
import {
  detectCurrency,
  getExchangeRates,
  formatAmount,
  CURRENCY_NAMES,
  type CurrencyInfo,
} from '@/lib/currency';

const BASE_AMOUNTS_USD = [3, 5, 10];

const TIER_META = [
  { icon: Coffee, label: 'Coffee',         description: 'Fuel a late-night coding session' },
  { icon: Heart,  label: 'High Five',      description: 'Help keep the servers running'    },
  { icon: Zap,    label: 'Super Supporter', description: 'Fund new features & updates'      },
];

type PaymentState = 'idle' | 'loading' | 'success' | 'error';

export default function PaywallPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(1); // default $5
  const [customUSD, setCustomUSD] = useState('');
  const [email, setEmail] = useState('');
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Currency detection
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>({ currency: 'USD', symbol: '$', countryCode: 'US' });
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [currencyLoading, setCurrencyLoading] = useState(true);

  useEffect(() => {
    Promise.all([detectCurrency(), getExchangeRates()]).then(([info, fetchedRates]) => {
      setCurrencyInfo(info);
      setRates(fetchedRates);
      setCurrencyLoading(false);
    });
  }, []);

  const selectedAmountUSD =
    selectedIndex !== null ? BASE_AMOUNTS_USD[selectedIndex] : parseFloat(customUSD) || 0;

  const handlePay = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (selectedAmountUSD <= 0) {
      setErrorMsg('Please select or enter an amount.');
      return;
    }

    setErrorMsg('');
    setPaymentState('loading');

    try {
      // 1. Initialize transaction on our backend
      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amountUSD: selectedAmountUSD,
          currency: currencyInfo.currency,
          countryCode: currencyInfo.countryCode,
        }),
      });

      const initData = await initRes.json();

      if (!initRes.ok) {
        throw new Error(initData.error || 'Failed to initialize payment');
      }

      const { access_code, reference } = initData;

      // 2. Open Paystack popup
      const { default: PaystackPop } = await import('@paystack/inline-js');
      const popup = new PaystackPop();

      popup.resumeTransaction(access_code, {
        onSuccess: async () => {
          // 3. Verify on our backend
          const verifyRes = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
          const verifyData = await verifyRes.json();

          if (verifyData.status === 'success') {
            setPaymentState('success');
          } else {
            throw new Error('Payment verification failed. Please contact support.');
          }
        },
        onCancel: () => {
          setPaymentState('idle');
        },
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setPaymentState('idle');
    }
  };

  if (paymentState === 'success') {
    return (
      <div className="min-h-screen bg-[#080B12] text-slate-200 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="size-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Thank You! ☕</h1>
            <p className="text-slate-400">Your tip means the world to us. TeamShuffle stays free because of supporters like you.</p>
          </div>
          <Link href="/" className="block w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 py-4 rounded-xl font-black transition-colors">
            Back to TeamShuffle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-200 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="size-5" />
          <span className="font-bold">Back to Home</span>
        </Link>

        {/* Currency indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Globe className="size-4" />
          {currencyLoading ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <span>{currencyInfo.currency} — {CURRENCY_NAMES[currencyInfo.currency] ?? currencyInfo.currency}</span>
          )}
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6 border border-emerald-500/20">
              <Coffee className="size-8" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Support TeamShuffle</h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Drop a tip to keep the app 100% free and ad-free for everyone.
            </p>
          </div>

          <div className="bg-[#1A202C] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            {/* Amount selection */}
            <div className="space-y-3">
              {TIER_META.map((tier, i) => {
                const isSelected = selectedIndex === i;
                const Icon = tier.icon;
                return (
                  <button
                    key={i}
                    onClick={() => { setSelectedIndex(i); setCustomUSD(''); }}
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
                    <div className={`text-right ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                      <div className="text-xl font-black">
                        {currencyLoading ? '…' : formatAmount(BASE_AMOUNTS_USD[i], currencyInfo.currency, rates)}
                      </div>
                      {currencyInfo.currency !== 'USD' && (
                        <div className="text-xs text-slate-500">${BASE_AMOUNTS_USD[i]} USD</div>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Custom amount */}
              <div className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                selectedIndex === null
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-700 bg-[#0F1520] hover:border-slate-500'
              }`}>
                <span className="font-bold text-lg text-white">Custom Amount</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-bold text-sm">USD $</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    value={customUSD}
                    onChange={(e) => { setCustomUSD(e.target.value); setSelectedIndex(null); }}
                    onFocus={() => setSelectedIndex(null)}
                    className="bg-transparent border-none outline-none text-xl font-black text-white w-20 text-right placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400">Email address for receipt</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F1520] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors"
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-rose-400 font-medium">{errorMsg}</p>
            )}

            {/* Pay button */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-400 justify-center">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Secure payment via Paystack</span>
              </div>

              <button
                onClick={handlePay}
                disabled={paymentState === 'loading' || selectedAmountUSD <= 0 || !email.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 py-4 px-8 rounded-xl text-lg font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {paymentState === 'loading' ? (
                  <><Loader2 className="size-5 animate-spin" /> Processing...</>
                ) : (
                  <>
                    <Coffee className="size-5" />
                    {selectedAmountUSD > 0
                      ? `Tip ${currencyLoading ? `$${selectedAmountUSD}` : formatAmount(selectedAmountUSD, currencyInfo.currency, rates)}`
                      : 'Select an amount'}
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
