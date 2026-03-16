import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ error: 'reference is required' }, { status: 400 });
  }

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: 'no-store',
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      return NextResponse.json({ error: paystackData.message || 'Verification failed' }, { status: 502 });
    }

    const txData = paystackData.data;
    const isSuccess = txData.status === 'success';

    if (isSuccess) {
      const supabase = createServiceClient();
      await supabase
        .from('tip_transactions')
        .update({
          status: 'success',
          verified_at: new Date().toISOString(),
        })
        .eq('reference', reference);
    }

    return NextResponse.json({
      status: txData.status,
      amount: txData.amount,
      currency: txData.currency,
      reference: txData.reference,
      paid_at: txData.paid_at,
    });
  } catch (err) {
    console.error('Paystack verify error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
