"""
LawFlash AI — RAG Content Generator (Flashcards & MCQs)
Version 1.0 | 2026

Takes cleaned legal text files from pipeline/extract.py, chunks them into 800-token sections,
and generates recall-optimized Flashcards and MCQs using Gemini 2.0 Flash API.

Features:
- Enforces strict legal guardrails (NO author names, NO note-writer credits, NO preface/TOC cards)
- Requires explicit statutory references (e.g. S. 35(1) 1999 Constitution) and case citations
- Inserts output directly into Supabase 'flashcards' and 'mcq_questions' tables with status = 'pending_review'

Usage:
    python pipeline/generate_content.py --input pipeline/output/sample_cleaned.txt --chapter_id <UUID>
"""

import os
import json
import argparse
from typing import List, Dict, Any

from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai
from supabase import create_client, Client

# Configure Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


FLASHCARD_SYSTEM_PROMPT = """
You are an expert Nigerian Law School Bar Final examiner and professor.
Your task is to generate high-yield, recall-optimized study flashcards from the provided Nigerian legal text.

CRITICAL GUARDRAILS:
1. STRICT ANONYMITY: Do NOT include author names, note-writer names, lecturer names, or personal credits (e.g. "Notes by...", "Dr. X mentioned...", "LL.B Class").
2. SUBSTANCE ONLY: Only generate cards for core legal principles, statutory provisions, procedural rules, or judicial precedents (case ratios).
3. NO NOISE: Ignore prefaces, table of contents, publisher notices, page numbers, and introductory chatter. If the chunk contains no substantive legal rule, output an empty array `[]`.
4. FORMAT: Front (question/prompt, max 280 chars) + Back (answer/explanation, max 500 chars).
5. CITATIONS: Include statutory sections or leading case names where applicable (e.g. Section 35 1999 Constitution; Miranda v. Arizona; R. v. Turnball).

Output JSON array format:
[
  {
    "front_text": "What is the consequence of failing to serve a Originating Process under Civil Procedure rules?",
    "back_text": "Failure to serve an originating process goes to the jurisdiction of the court and renders all subsequent proceedings null and void. Authority: Skenconsult v. Ukey (1981).",
    "difficulty": "application",
    "tags": ["Civil Litigation", "Service of Process", "Jurisdiction"],
    "confidence_score": 0.95,
    "source_reference": "Skenconsult v. Ukey (1981) 1 SC 6"
  }
]
"""

MCQ_SYSTEM_PROMPT = """
You are an expert Nigerian Law School Bar Final examiner.
Generate 59-minute Bar Final standard Multiple Choice Questions (MCQs) from the provided legal text.

CRITICAL GUARDRAILS:
1. STRICT ANONYMITY: Do NOT include author names, note-writer credits, lecturer intros, or personal tags.
2. SUBSTANCE ONLY: Questions must test application of Nigerian statutes (CAMA 2020, 1999 Constitution, ACJA 2015, RPC, Evidence Act 2011) or leading case law.
3. NO NOISE: Ignore prefaces, table of contents, publisher notices, page numbers, and introductory chatter. If the chunk contains no substantive legal rule, output an empty array `[]`.
4. OPTIONS: Exactly 4 options (A, B, C, D). Only one option is correct.
5. EXPLANATION: Clear, concise explanation detailing why the correct answer is right and citing the relevant Act or Case.

Output JSON array format:
[
  {
    "question_text": "Under the Administration of Criminal Justice Act (ACJA) 2015, within what timeframe must a suspect arrested without a warrant be charged to court?",
    "options": {
      "a": "24 hours or a reasonable time",
      "b": "48 hours or as soon as practicable",
      "c": "7 days",
      "d": "14 days"
    },
    "correct_answer": "a",
    "explanation": "Section 30 of ACJA 2015 and Section 35(5) of the 1999 Constitution require a suspect arrested without a warrant to be brought to court within 24 hours (or 48 hours where a court of competent jurisdiction is not accessible within 40km).",
    "difficulty": "medium",
    "statutory_reference": "S. 30 ACJA 2015; S. 35(5) CFRN 1999"
  }
]
"""


def chunk_text(text: str, chunk_size: int = 1500) -> List[str]:
    """Splits text into ~1500 character chunks for LLM processing."""
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = []
    current_len = 0
    
    for p in paragraphs:
        if current_len + len(p) > chunk_size and current_chunk:
            chunks.append('\n\n'.join(current_chunk))
            current_chunk = [p]
            current_len = len(p)
        else:
            current_chunk.append(p)
            current_len += len(p)
            
    if current_chunk:
        chunks.append('\n\n'.join(current_chunk))
        
    return chunks


def call_gemini(prompt: str, content: str) -> List[Dict[str, Any]]:
    """Calls Gemini 2.0 Flash to generate structured JSON."""
    if not GEMINI_API_KEY:
        print("⚠️ GEMINI_API_KEY missing in .env — skipping LLM call")
        return []
        
    model = genai.GenerativeModel("gemini-2.0-flash")
    full_prompt = f"{prompt}\n\nTEXT CONTENT:\n{content}\n\nReturn ONLY a valid JSON array. No markdown code blocks."
    
    try:
        response = model.generate_content(full_prompt)
        text_resp = response.text.strip()
        
        # Clean markdown wrappers if present
        if text_resp.startswith("```json"):
            text_resp = text_resp[7:]
        if text_resp.startswith("```"):
            text_resp = text_resp[3:]
        if text_resp.endswith("```"):
            text_resp = text_resp[:-3]
            
        return json.loads(text_resp.strip())
    except Exception as e:
        print(f"   ❌ LLM Error: {e}")
        return []


def process_and_upload(input_file: str, chapter_id: str):
    """Processes cleaned file and inserts generated flashcards and MCQs into Supabase."""
    print(f"🚀 Processing: {input_file} for Chapter ID: {chapter_id}")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        text = f.read()
        
    chunks = chunk_text(text)
    print(f"📦 Total Chunks: {len(chunks)}")
    
    total_cards = 0
    total_mcqs = 0
    
    for idx, chunk in enumerate(chunks):
        print(f"   Processing Chunk {idx+1}/{len(chunks)}...")
        
        # Generate Flashcards
        cards = call_gemini(FLASHCARD_SYSTEM_PROMPT, chunk)
        for card in cards:
            if not card.get("front_text") or not card.get("back_text"):
                continue
                
            payload = {
                "chapter_id": chapter_id,
                "front_text": card["front_text"][:280],
                "back_text": card["back_text"][:500],
                "difficulty": card.get("difficulty", "basic_recall"),
                "tags": card.get("tags", []),
                "confidence_score": card.get("confidence_score", 0.90),
                "status": "pending_review",
                "source_reference": card.get("source_reference", "")
            }
            res = supabase.table("flashcards").insert(payload).execute()
            if res.data:
                total_cards += 1
                
        # Generate MCQs
        mcqs = call_gemini(MCQ_SYSTEM_PROMPT, chunk)
        for mcq in mcqs:
            if not mcq.get("question_text") or not mcq.get("options"):
                continue
                
            payload = {
                "chapter_id": chapter_id,
                "question_text": mcq["question_text"][:500],
                "options": mcq["options"],
                "correct_answer": mcq.get("correct_answer", "a"),
                "explanation": mcq.get("explanation", "")[:500],
                "difficulty": mcq.get("difficulty", "medium"),
                "statutory_reference": mcq.get("statutory_reference", ""),
                "source_type": "ai_generated",
                "status": "pending_review"
            }
            res = supabase.table("mcq_questions").insert(payload).execute()
            if res.data:
                total_mcqs += 1
                
    print(f"\n🎉 DONE! Generated and uploaded:")
    print(f"   ✅ Flashcards (Pending Review): {total_cards}")
    print(f"   ✅ MCQs (Pending Review): {total_mcqs}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="LawFlash AI - RAG Content Generator")
    parser.add_argument("--input", required=True, help="Path to cleaned input text file")
    parser.add_argument("--chapter_id", required=True, help="Supabase Chapter UUID")
    
    args = parser.parse_args()
    process_and_upload(args.input, args.chapter_id)
