import { corsHeaders } from "@shared/cors.ts";
import { UserResult } from "@shared/user.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/v1/users/me",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY") || "",
          "x-pica-connection-key":
            Deno.env.get("PICA_CLERK_CONNECTION_KEY") || "",
          "x-pica-action-id": Deno.env.get("PICA_CLERK_ACTION_ID") || "",
        },
      },
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: response.status,
    });
  } catch (error) {
    const errorResult: UserResult = {
      error: "Internal Server Error",
      message: error.message,
    };

    return new Response(JSON.stringify(errorResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
