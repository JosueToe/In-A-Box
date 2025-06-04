import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, successUrl, cancelUrl } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get environment variables
    const picaSecret = Deno.env.get("PICA_SECRET_KEY");
    const stripeConnectionKey = Deno.env.get("PICA_stripe_CONNECTION_KEY");

    if (!picaSecret || !stripeConnectionKey) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Prepare form data for Stripe API
    const formData = new URLSearchParams();
    formData.append("mode", "subscription");
    formData.append("line_items[0][price_data][currency]", "usd");
    formData.append(
      "line_items[0][price_data][product_data][name]",
      "SoloLaunch Pro - Monthly Subscription",
    );
    formData.append("line_items[0][price_data][unit_amount]", "999"); // $9.99
    formData.append("line_items[0][price_data][recurring][interval]", "month");
    formData.append("line_items[0][quantity]", "1");
    formData.append("customer_email", email);
    formData.append(
      "success_url",
      successUrl ||
        `${new URL(req.url).origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    );
    formData.append(
      "cancel_url",
      cancelUrl || `${new URL(req.url).origin}/pricing`,
    );

    // Call Stripe API via Pica passthrough
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-pica-secret": picaSecret,
          "x-pica-connection-key": stripeConnectionKey,
          "x-pica-action-id":
            "conn_mod_def::GCmLNSLWawg::Pj6pgAmnQhuqMPzB8fquRg",
        },
        body: formData.toString(),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stripe API error:", errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to create checkout session",
          details: errorText,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const session = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          url: session.url,
          sessionId: session.id,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
