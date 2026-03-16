// Maps ISO country codes to Paystack-supported currencies.
// Paystack supports: NGN, GHS, ZAR, KES, USD, GBP, EGP, RWF, XOF, XAF, ETB
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  NG: 'NGN', // Nigeria
  GH: 'GHS', // Ghana
  ZA: 'ZAR', // South Africa
  KE: 'KES', // Kenya
  EG: 'EGP', // Egypt
  RW: 'RWF', // Rwanda
  // West African CFA (BCEAO)
  CI: 'XOF', SN: 'XOF', ML: 'XOF', BF: 'XOF', TG: 'XOF', BJ: 'XOF', NE: 'XOF', GW: 'XOF',
  // Central African CFA (BEAC)
  CM: 'XAF', CF: 'XAF', TD: 'XAF', CG: 'XAF', CD: 'XAF', GQ: 'XAF',
  ET: 'ETB', // Ethiopia
  GB: 'GBP', // United Kingdom
};

// Currency symbols for display
export const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦', GHS: 'GH₵', ZAR: 'R', KES: 'KSh', USD: '$',
  GBP: '£', EGP: 'E£', RWF: 'RWF', XOF: 'CFA', XAF: 'CFA', ETB: 'Br',
};

// Currency names for display
export const CURRENCY_NAMES: Record<string, string> = {
  NGN: 'Nigerian Naira', GHS: 'Ghanaian Cedi', ZAR: 'South African Rand',
  KES: 'Kenyan Shilling', USD: 'US Dollar', GBP: 'British Pound',
  EGP: 'Egyptian Pound', RWF: 'Rwandan Franc', XOF: 'West African CFA',
  XAF: 'Central African CFA', ETB: 'Ethiopian Birr',
};

export type CurrencyInfo = {
  currency: string;
  symbol: string;
  countryCode: string;
};

/** Detect the user's country + preferred currency via IP geolocation. Falls back to USD. */
export async function detectCurrency(): Promise<CurrencyInfo> {
  try {
    const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
    if (!res.ok) throw new Error('geo failed');
    const data = await res.json();
    const countryCode: string = data.country_code || 'US';
    const currency = COUNTRY_TO_CURRENCY[countryCode] || 'USD';
    return {
      currency,
      symbol: CURRENCY_SYMBOLS[currency] || '$',
      countryCode,
    };
  } catch {
    return { currency: 'USD', symbol: '$', countryCode: 'US' };
  }
}

/** Fetch live exchange rates from USD. Returns rates like { NGN: 1620, GHS: 15.3, ... } */
export async function getExchangeRates(): Promise<Record<string, number>> {
  try {
    // Open Exchange Rates (free, no API key needed for latest.json on open.er-api.com)
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('rates failed');
    const data = await res.json();
    return data.rates as Record<string, number>;
  } catch {
    // Hardcoded fallback rates (approximate, update periodically)
    return {
      NGN: 1620, GHS: 15.3, ZAR: 18.8, KES: 129, EGP: 48.5,
      RWF: 1380, XOF: 620, XAF: 620, ETB: 56, GBP: 0.79, USD: 1,
    };
  }
}

/**
 * Convert a USD amount to the target currency in its subunit (e.g. kobo, cents, pesewas).
 * Paystack always expects amounts in the lowest denomination.
 */
export function convertToSubunit(amountUSD: number, currency: string, rates: Record<string, number>): number {
  const rate = rates[currency] ?? 1;
  const converted = amountUSD * rate;
  // RWF, XOF, XAF have no subunit (no decimal), all others use 100 subunits per unit
  const noDecimalCurrencies = ['RWF', 'XOF', 'XAF'];
  return noDecimalCurrencies.includes(currency)
    ? Math.round(converted)
    : Math.round(converted * 100);
}

/** Format an amount (in major units) for display */
export function formatAmount(amountUSD: number, currency: string, rates: Record<string, number>): string {
  const rate = rates[currency] ?? 1;
  const converted = amountUSD * rate;
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const noDecimalCurrencies = ['RWF', 'XOF', 'XAF'];
  if (noDecimalCurrencies.includes(currency)) {
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
