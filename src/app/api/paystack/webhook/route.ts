import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Validate webhook signature
  const signature = req.headers.get('x-paystack-signature');
  const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;

  if (webhookSecret) {
    const expectedSignature = crypto
      .createHmac('sha512', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (event.event === 'charge.success') {
    const txData = event.data;
    const reference = txData.reference as string;
    const status = txData.status as string;

    if (status === 'success' && reference) {
      const supabase = createServiceClient();
      await supabase
        .from('tip_transactions')
        .update({
          status: 'success',
          verified_at: new Date().toISOString(),
        })
        .eq('reference', reference)
        .eq('status', 'pending'); // only update if still pending to avoid duplicate writes
    }
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}
