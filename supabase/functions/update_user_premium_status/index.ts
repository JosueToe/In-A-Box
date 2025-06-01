import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, isPremium } = await req.json();

    if (!userId || typeof isPremium !== "boolean") {
      return new Response(
        JSON.stringify({ error: "Missing userId or isPremium boolean" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Prepare Clerk API update user request via Pica Passthrough
    const clerkConnectionKey = Deno.env.get("PICA_clerk_CONNECTION_KEY");
    if (!clerkConnectionKey) {
      return new Response(
        JSON.stringify({ error: "Clerk connection key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const picaSecret = Deno.env.get("PICA_SECRET_KEY");
    if (!picaSecret) {
      return new Response(
        JSON.stringify({ error: "Pica secret key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const actionId = "conn_mod_def::GCWHHkXLRJU::twHzier1QIqBeddV5oxMww";
    const path = `/users/${userId}`;

    const response = await fetch(
      `https://api.picaos.com/v1/passthrough${path}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-pica-secret": picaSecret,
          "x-pica-connection-key": clerkConnectionKey,
          "x-pica-action-id": actionId,
        },
        body: JSON.stringify({
          public_metadata: { isPremium },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          error: "Failed to update user premium status",
          details: errorBody,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify({ success: true, user: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
