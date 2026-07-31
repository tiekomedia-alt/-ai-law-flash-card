import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization header" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Verify the JWT and get the user
  const jwt = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Fetch subscription from DB — source of truth (never trust client)
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, grace_period_end")
    .eq("user_id", user.id)
    .single();

  if (subError || !subscription) {
    return new Response(
      JSON.stringify({ is_premium: false, status: "free", user_id: user.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const now = new Date();
  let isPremium = false;
  let effectiveStatus = subscription.status;

  if (subscription.status === "premium") {
    // Check if subscription period is still valid
    const periodEnd = new Date(subscription.current_period_end);
    isPremium = now < periodEnd;
    if (!isPremium) effectiveStatus = "past_due";
  } else if (subscription.status === "past_due") {
    // Check if still within grace period
    if (subscription.grace_period_end) {
      const graceEnd = new Date(subscription.grace_period_end);
      isPremium = now < graceEnd;
    }
    // If grace period expired, revert to free
    if (!isPremium && subscription.grace_period_end) {
      const graceEnd = new Date(subscription.grace_period_end);
      if (now > graceEnd) {
        effectiveStatus = "free";
        // Downgrade in DB
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("user_id", user.id);
        await supabase
          .from("users")
          .update({ subscription_status: "free" })
          .eq("id", user.id);
      }
    }
  }

  return new Response(
    JSON.stringify({
      is_premium: isPremium,
      status: effectiveStatus,
      user_id: user.id,
      period_end: subscription.current_period_end,
      grace_period_end: subscription.grace_period_end ?? null,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
