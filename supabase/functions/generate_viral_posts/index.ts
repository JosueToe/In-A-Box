// Edge function to generate viral post ideas using OpenAI via Pica passthrough

import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { startupIdea } = await req.json();

    if (!startupIdea) {
      return new Response(
        JSON.stringify({ error: "Startup idea is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const prompt = `Based on this startup idea, generate 2 viral post ideas each for X (Twitter), TikTok, and Instagram that will attract early users and attention. Focus on emotional hooks, curiosity, or storytelling.\n\nStartup idea: ${startupIdea}`;

    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY") || "",
          "x-pica-connection-key":
            Deno.env.get("PICA_openai_CONNECTION_KEY") || "",
          "x-pica-action-id":
            "conn_mod_def::GDzgi1QfvM4::4OjsWvZhRxmAVuLAuWgfVA",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          n: 1,
          temperature: 1,
          presence_penalty: 0,
          frequency_penalty: 0,
          stream: false,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to generate viral posts",
          details: data,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status,
        },
      );
    }

    const viralPostsText = data.choices[0].message.content;

    return new Response(JSON.stringify({ viralPosts: viralPostsText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
