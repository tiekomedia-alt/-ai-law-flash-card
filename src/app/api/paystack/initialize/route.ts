import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { getExchangeRates, convertToSubunit } from '@/lib/currency';

export async function POST(req: NextRequest) {
  try {
    const { email, amountUSD, currency, countryCode } = await req.json();

    if (!email || !amountUSD || !currency) {
      return NextResponse.json({ error: 'email, amountUSD, and currency are required' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const rates = await getExchangeRates();
    const amountSubunit = convertToSubunit(Number(amountUSD), currency, rates);

    // Generate a unique reference
    const reference = `TS-TIP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountSubunit,
        currency,
        reference,
        metadata: {
          amount_usd: amountUSD,
          country_code: countryCode,
          custom_fields: [
            { display_name: 'App', variable_name: 'app', value: 'TeamShuffle' },
          ],
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      return NextResponse.json({ error: paystackData.message || 'Paystack error' }, { status: 502 });
    }

    // Save pending transaction to Supabase
    const supabase = createServiceClient();
    await supabase.from('tip_transactions').insert({
      reference,
      email,
      amount: amountSubunit,
      amount_usd: Number(amountUSD),
      currency,
      country_code: countryCode || 'US',
      status: 'pending',
    });

    return NextResponse.json({
      access_code: paystackData.data.access_code,
      reference,
    });
  } catch (err) {
    console.error('Paystack initialize error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
