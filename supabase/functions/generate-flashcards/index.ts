import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FlashcardOutput {
  front_text: string;
  back_text: string;
  difficulty: "basic_recall" | "application" | "analysis";
  tags: string[];
  confidence_score: number;
  source_reference: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { chapter_id, count = 10 } = await req.json();

    if (!chapter_id) {
      return new Response(JSON.stringify({ error: "chapter_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get chapter info
    const { data: chapter, error: chapterError } = await supabase
      .from("chapters")
      .select("*, courses(name)")
      .eq("id", chapter_id)
      .single();

    if (chapterError || !chapter) {
      return new Response(JSON.stringify({ error: "Chapter not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // TODO: Step 1 — generate embedding for chapter title to find relevant chunks
    // const embeddingRes = await fetch("https://api.openai.com/v1/embeddings", {...})

    // TODO: Step 2 — search_embeddings RPC to get relevant document chunks
    // const { data: chunks } = await supabase.rpc("search_embeddings", {...})

    // TODO: Step 3 — call Gemini 3 Flash with chunks as context
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are an expert Nigerian Bar exam tutor. Generate ${count} flashcards for the chapter "${chapter.title}" in the course "${chapter.courses?.name}".

Each flashcard must follow this exact JSON schema:
{
  "front_text": "Question or prompt (max 280 chars)",
  "back_text": "Answer or explanation (max 500 chars)",
  "difficulty": "basic_recall | application | analysis",
  "tags": ["topic", "subtopic"],
  "confidence_score": 0.0 to 1.0,
  "source_reference": "Relevant law, case, or statute"
}

Return a JSON array of ${count} flashcards. Mix difficulties: 40% basic_recall, 40% application, 20% analysis.
Flag any card you are unsure about with confidence_score below 0.80.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      return new Response(JSON.stringify({ error: "Gemini API error", details: err }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    const flashcards: FlashcardOutput[] = JSON.parse(rawText);

    // Insert into database
    const rows = flashcards.map((card) => ({
      chapter_id,
      course_id: chapter.course_id,
      front_text: card.front_text.slice(0, 280),
      back_text: card.back_text.slice(0, 500),
      difficulty: card.difficulty,
      tags: card.tags,
      confidence_score: card.confidence_score,
      source_reference: card.source_reference,
      status: card.confidence_score >= 0.8 ? "pending_review" : "flagged",
      is_ai_generated: true,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("flashcards")
      .insert(rows)
      .select("id, front_text, difficulty, confidence_score, status");

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        chapter: chapter.title,
        generated: inserted?.length ?? 0,
        flagged: inserted?.filter((c) => c.status === "flagged").length ?? 0,
        flashcards: inserted,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
