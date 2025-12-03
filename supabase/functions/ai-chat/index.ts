import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

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

  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing GEMINI_API_KEY secret" }),
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

    // Convert messages to Gemini format
    const contents = [];
    
    // Add system instruction as first user message if no history exists
    if (!Array.isArray(history) || history.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: system + " Stay in character as an educational avatar. Provide practical, responsible suggestions. If the user asks for regulated advice, provide general education and encourage consulting a professional." }]
      });
      contents.push({
        role: "model",
        parts: [{ text: "I understand. I'll stay in character and provide helpful educational guidance." }]
      });
    }

    // Add history
    if (Array.isArray(history)) {
      for (const m of history) {
        contents.push({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        });
      }
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: String(message) }]
    });

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
        systemInstruction: {
          parts: [{ text: system + " Stay in character as an educational avatar. Provide practical, responsible suggestions. If the user asks for regulated advice, provide general education and encourage consulting a professional." }]
        }
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", errText);
      return new Response(
        JSON.stringify({ error: "Gemini API error", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

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