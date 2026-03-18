import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MCQOutput {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "a" | "b" | "c" | "d";
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
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

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are an expert Nigerian Bar exam question writer. Generate ${count} multiple-choice questions (MCQs) for the chapter "${chapter.title}" in the course "${chapter.courses?.name}".

Each MCQ must follow this exact JSON schema:
{
  "question_text": "The question (max 500 chars)",
  "option_a": "First option",
  "option_b": "Second option",
  "option_c": "Third option",
  "option_d": "Fourth option",
  "correct_answer": "a | b | c | d",
  "explanation": "Why this answer is correct, citing relevant law/case (max 600 chars)",
  "difficulty": "easy | medium | hard",
  "tags": ["topic", "subtopic"],
  "confidence_score": 0.0 to 1.0,
  "source_reference": "Relevant statute, rule, or case"
}

Return a JSON array of ${count} MCQs. Mix difficulties: 30% easy, 50% medium, 20% hard.
Base questions on real Nigerian law, statutes, and bar exam patterns.
Ensure plausible distractors — wrong answers should be common misconceptions, not obviously wrong.`;

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
    const mcqs: MCQOutput[] = JSON.parse(rawText);

    const rows = mcqs.map((q) => ({
      chapter_id,
      course_id: chapter.course_id,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: q.tags,
      confidence_score: q.confidence_score,
      source_reference: q.source_reference,
      source_type: "ai_generated",
      is_flagged: q.confidence_score < 0.8,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("mcq_questions")
      .insert(rows)
      .select("id, question_text, difficulty, confidence_score, is_flagged");

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
        flagged: inserted?.filter((q) => q.is_flagged).length ?? 0,
        mcqs: inserted,
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
