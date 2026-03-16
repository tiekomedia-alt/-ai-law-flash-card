import { createClient } from '@supabase/supabase-js';

// Browser-safe client (uses anon key — respects Row Level Security)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-only client (uses service role key — bypasses RLS; never expose to browser)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type TipTransaction = {
  id: string;
  reference: string;
  email: string;
  amount: number;          // amount in currency subunits (e.g. kobo, pesewas, cents)
  amount_usd: number;      // original USD amount selected by user
  currency: string;        // e.g. "NGN", "USD", "GHS"
  country_code: string;    // ISO 3166-1 alpha-2
  status: 'pending' | 'success' | 'failed';
  created_at: string;
  verified_at: string | null;
};
