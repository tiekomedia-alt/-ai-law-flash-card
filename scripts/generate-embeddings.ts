/**
 * generate-embeddings.ts
 *
 * Step 3 of the AI content pipeline:
 * - Reads document chunks from Supabase Storage
 * - Generates vector embeddings via OpenAI text-embedding-3-small
 * - Stores embeddings in the `embeddings` table (pgvector)
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... OPENAI_API_KEY=... \
 *     deno run --allow-net generate-embeddings.ts
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;
const BATCH_SIZE = 20; // OpenAI allows up to 2048 inputs per request

async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${err}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

/**
 * Chunk text into segments of approximately targetTokens (1 token ≈ 4 chars)
 */
function chunkText(text: string, targetTokens = 750): string[] {
  const targetChars = targetTokens * 4;
  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + para).length > targetChars && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks;
}

async function processDocument(documentId: string) {
  // Get document info
  const { data: doc, error } = await supabase
    .from("documents")
    .select("*, courses(id)")
    .eq("id", documentId)
    .single();

  if (error || !doc) {
    console.error("Document not found:", documentId);
    return;
  }

  // Check for already-embedded chunks
  const { count: existingCount } = await supabase
    .from("embeddings")
    .select("id", { count: "exact", head: true })
    .eq("document_id", documentId);

  if ((existingCount ?? 0) > 0) {
    console.log(`Document ${documentId} already has ${existingCount} embeddings — skipping`);
    return;
  }

  // Download source text from storage
  const { data: fileData, error: dlError } = await supabase.storage
    .from("materials")
    .download(doc.storage_path);

  if (dlError || !fileData) {
    console.error(`Failed to download ${doc.storage_path}:`, dlError?.message);
    return;
  }

  const text = await fileData.text();
  const chunks = chunkText(text);

  console.log(`Processing document: ${doc.title} (${chunks.length} chunks)`);

  let embedded = 0;
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);

    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];
      const chunkIndex = i + j;

      try {
        const embedding = await generateEmbedding(chunk);

        const { error: insertError } = await supabase.from("embeddings").insert({
          document_id: documentId,
          course_id: doc.course_id,
          chunk_index: chunkIndex,
          content: chunk,
          embedding,
          token_count: Math.ceil(chunk.length / 4),
        });

        if (insertError) {
          console.error(`  Chunk ${chunkIndex} insert error:`, insertError.message);
        } else {
          embedded++;
          process.stdout.write(`\r  Embedded ${embedded}/${chunks.length} chunks...`);
        }

        // Rate limiting — OpenAI free tier: 3000 RPM
        await new Promise((r) => setTimeout(r, 50));
      } catch (err) {
        console.error(`  Chunk ${chunkIndex} embedding error:`, err);
      }
    }
  }

  console.log(`\n  ✓ Done: ${embedded}/${chunks.length} chunks embedded for ${doc.title}`);
}

async function main() {
  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY environment variable not set");
    Deno.exit(1);
  }

  // Get all documents without embeddings
  const { data: docs, error } = await supabase
    .from("documents")
    .select("id, title");

  if (error) {
    console.error("Failed to fetch documents:", error.message);
    Deno.exit(1);
  }

  console.log(`Found ${docs?.length ?? 0} documents to process.`);

  for (const doc of docs ?? []) {
    await processDocument(doc.id);
  }

  console.log("\nEmbedding generation complete.");
}

await main();
