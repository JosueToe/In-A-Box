import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, email, firstName, lastName, profileImageUrl } =
      await req.json();

    if (!userId || !email) {
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

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    let result;
    if (!existingUser) {
      // Create new user with default free tier
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            id: userId,
            email,
            first_name: firstName || "",
            last_name: lastName || "",
            profile_image_url: profileImageUrl || "",
            is_premium: false, // Default to free tier
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        return new Response(
          JSON.stringify({
            error: "Failed to create user",
            details: error,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      result = data;
    } else {
      // Update existing user
      const { data, error } = await supabase
        .from("users")
        .update({
          email,
          first_name: firstName || existingUser.first_name,
          last_name: lastName || existingUser.last_name,
          profile_image_url: profileImageUrl || existingUser.profile_image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select();

      if (error) {
        return new Response(
          JSON.stringify({
            error: "Failed to update user",
            details: error,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      result = data;
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
