import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!paystackSecret) {
    console.error("PAYSTACK_SECRET_KEY not configured");
    return new Response("Server error", { status: 500 });
  }

  // Verify HMAC signature — CRITICAL security check
  const signature = req.headers.get("x-paystack-signature");
  const rawBody = await req.text();

  const expectedSig = createHmac("sha512", paystackSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSig) {
    console.warn("Invalid Paystack signature — possible forgery attempt");
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);
  console.log("Paystack event:", event.event);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const data = event.data;

  switch (event.event) {
    case "charge.success": {
      // Payment successful — activate or renew subscription
      const email = data.customer?.email;
      const reference = data.reference;
      const amountKobo = data.amount; // amount in kobo (₦1 = 100 kobo)
      const metadata = data.metadata ?? {};
      const userId = metadata.user_id;

      if (!userId) {
        console.warn("No user_id in Paystack metadata for reference:", reference);
        return new Response("Missing user_id", { status: 400 });
      }

      const renewalDate = new Date();
      renewalDate.setMonth(renewalDate.getMonth() + 1);

      const { error } = await supabase
        .from("subscriptions")
        .upsert(
          {
            user_id: userId,
            status: "premium",
            plan: "monthly",
            amount: amountKobo / 100, // convert to naira
            currency: "NGN",
            paystack_reference: reference,
            current_period_start: new Date().toISOString(),
            current_period_end: renewalDate.toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("Failed to update subscription:", error.message);
        return new Response("DB error", { status: 500 });
      }

      // Also update the users table
      await supabase
        .from("users")
        .update({ subscription_status: "premium" })
        .eq("id", userId);

      console.log(`Premium activated for user ${userId}, ref ${reference}`);
      break;
    }

    case "subscription.disable":
    case "invoice.payment_failed": {
      // Payment failed — start grace period (3 days)
      const email = data.customer?.email;

      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (!user) break;

      const graceEnd = new Date();
      graceEnd.setDate(graceEnd.getDate() + 3);

      await supabase
        .from("subscriptions")
        .update({
          status: "past_due",
          grace_period_end: graceEnd.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      console.log(`Grace period started for user ${user.id} until ${graceEnd.toISOString()}`);
      break;
    }

    case "subscription.not_renew":
    case "customeridentification.failed": {
      // Subscription cancelled — revert to free (preserve progress)
      const email = data.customer?.email;

      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (!user) break;

      await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      await supabase
        .from("users")
        .update({ subscription_status: "free" })
        .eq("id", user.id);

      console.log(`Subscription cancelled for user ${user.id} — reverted to free`);
      break;
    }

    default:
      console.log("Unhandled Paystack event:", event.event);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
