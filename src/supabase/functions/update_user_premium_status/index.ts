import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";

const PICA_SECRET_KEY = Deno.env.get("PICA_SECRET_KEY") || "";
const PICA_STRIPE_CONNECTION_KEY =
  Deno.env.get("PICA_STRIPE_CONNECTION_KEY") || "";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, sessionId } = await req.json();

    if (!userId || !sessionId) {
      throw new Error("Missing required parameters: userId or sessionId");
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the session with Stripe via Pica passthrough
    const formData = new URLSearchParams();
    const response = await fetch(
      `https://api.picaos.com/v1/passthrough/v1/checkout/sessions/${sessionId}`,
      {
        method: "GET",
        headers: {
          "x-pica-secret": PICA_SECRET_KEY,
          "x-pica-connection-key": PICA_STRIPE_CONNECTION_KEY,
          "x-pica-action-id":
            "conn_mod_def::GCmLNSLWawg::Pj6pgAmnQhuqMPzB8fquRg",
        },
      },
    );

    const session = await response.json();

    if (!response.ok) {
      throw new Error(
        session.error?.message || "Failed to verify checkout session",
      );
    }

    // Check if payment was successful
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Update user's premium status in Supabase
    const { data, error } = await supabase
      .from("users")
      .update({ is_premium: true })
      .eq("clerk_id", userId)
      .select();

    if (error) {
      throw new Error(`Failed to update user premium status: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: { isPremium: true },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error updating user premium status:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to update user premium status",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
