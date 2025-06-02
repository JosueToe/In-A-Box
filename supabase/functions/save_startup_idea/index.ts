import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      userId,
      problem,
      audience,
      solution,
      names,
      pitch,
      pitchDeck,
      viralPosts,
    } = await req.json();

    if (!userId || !problem || !audience || !solution) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save startup idea to database
    const { data, error } = await supabase
      .from("startup_ideas")
      .insert([
        {
          user_id: userId,
          problem,
          audience,
          solution,
          names,
          pitch,
          pitch_deck: pitchDeck,
          viral_posts: viralPosts,
        },
      ])
      .select();

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to save startup idea",
          details: error,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
