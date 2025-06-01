import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const PICA_SECRET_KEY = Deno.env.get("PICA_SECRET_KEY") || "";
const PICA_STRIPE_CONNECTION_KEY =
  Deno.env.get("PICA_STRIPE_CONNECTION_KEY") || "";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { successUrl, cancelUrl } = await req.json();

    if (!successUrl || !cancelUrl) {
      throw new Error("Missing required parameters: successUrl or cancelUrl");
    }

    // Create form data for the request
    const formData = new URLSearchParams();
    formData.append("mode", "subscription");
    formData.append("line_items[0][price]", "price_1OvXXXXXXXXXXXXX"); // Replace with your actual price ID
    formData.append("line_items[0][quantity]", "1");
    formData.append("success_url", successUrl);
    formData.append("cancel_url", cancelUrl);

    // Call Stripe via Pica passthrough
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-pica-secret": PICA_SECRET_KEY,
          "x-pica-connection-key": PICA_STRIPE_CONNECTION_KEY,
          "x-pica-action-id":
            "conn_mod_def::GCmLNSLWawg::Pj6pgAmnQhuqMPzB8fquRg",
        },
        body: formData.toString(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Failed to create checkout session",
      );
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to create checkout session",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
