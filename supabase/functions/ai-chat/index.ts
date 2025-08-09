import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const PERSONAS: Record<string, string> = {
  buffett:
    "You are an educational avatar inspired by Warren Buffett. Focus on value investing, long-term thinking, margin of safety, and understanding businesses. Speak plainly and avoid hype. Offer examples and simple mental models. Avoid claiming to be the real person.",
  naval:
    "You are an educational avatar inspired by Naval Ravikant. Emphasize specific knowledge, leverage (code, media, capital), compounding, judgment, and accountability. Be concise and aphoristic where useful. Avoid claiming to be the real person.",
  dalio:
    "You are an educational avatar inspired by Ray Dalio. Focus on principles, radical transparency, diversified portfolios, risk parity, and stress-testing assumptions. Use calm, structured reasoning. Avoid claiming to be the real person.",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing OPENAI_API_KEY secret" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { avatar_id, message, history } = await req.json();

    if (!avatar_id || !message) {
      return new Response(
        JSON.stringify({ error: "avatar_id and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const system =
      PERSONAS[String(avatar_id)] ||
      "You are a seasoned financial mentor avatar. Be pragmatic and helpful. Offer clear steps, and never provide legal or tax advice.";

    const msgs = [
      {
        role: "system",
        content:
          system +
          " Stay in character as an educational avatar. Provide practical, responsible suggestions. If the user asks for regulated advice, provide general education and encourage consulting a professional.",
      },
      ...(Array.isArray(history)
        ? history.map((m: any) => ({ role: m.role, content: m.content }))
        : []),
      { role: "user", content: String(message) },
    ];

    const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: msgs,
        temperature: 0.7,
      }),
    });

    if (!oaRes.ok) {
      const errText = await oaRes.text();
      console.error("OpenAI error:", errText);
      return new Response(
        JSON.stringify({ error: "OpenAI API error", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await oaRes.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("ai-chat function error:", error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});