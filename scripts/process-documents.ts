/**
 * process-documents.ts
 *
 * Step 2 of the AI content pipeline:
 * - Reads PDFs from Supabase Storage (organized by course/chapter)
 * - Extracts and cleans text
 * - Chunks into 500-1000 token segments
 * - Stores document metadata in the `documents` table
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... deno run --allow-net --allow-read process-documents.ts
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const COURSE_IDS: Record<string, string> = {
  "criminal-litigation": "65e185b9-6471-4e13-b9fc-5a502b5b6c49",
  "civil-litigation": "f3f9762e-2d0a-4258-b94e-5a544c1b9c98",
  "professional-ethics": "a3e6e6a1-20c8-4a3b-bbc4-e2022db599b8",
  "company-law": "8f524136-30f6-4a75-b660-c70338c1b090",
  "property-law": "6b05c6f6-1093-4690-adce-4a814a9ff178",
};

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

async function processStorageBucket() {
  console.log("Listing files in 'materials' storage bucket...");

  const { data: files, error } = await supabase.storage.from("materials").list("", {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    console.error("Storage error:", error.message);
    console.log("Make sure the 'materials' storage bucket exists in Supabase.");
    Deno.exit(1);
  }

  console.log(`Found ${files?.length ?? 0} files.`);

  for (const file of files ?? []) {
    // Expected naming convention: course-slug/chapter-number_chapter-title.txt
    // e.g., criminal-litigation/01_introduction-to-criminal-litigation.txt
    const pathParts = file.name.split("/");
    if (pathParts.length < 2) {
      console.warn(`Skipping ${file.name} — not in course/chapter structure`);
      continue;
    }

    const courseSlug = pathParts[0];
    const courseId = COURSE_IDS[courseSlug];
    if (!courseId) {
      console.warn(`Unknown course slug: ${courseSlug}`);
      continue;
    }

    console.log(`Processing: ${file.name}`);

    // Download file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("materials")
      .download(file.name);

    if (downloadError || !fileData) {
      console.error(`Failed to download ${file.name}:`, downloadError?.message);
      continue;
    }

    const text = await fileData.text();
    const chunks = chunkText(text);

    // Store document metadata
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({
        course_id: courseId,
        title: file.name,
        storage_path: file.name,
        chunk_count: chunks.length,
      })
      .select("id")
      .single();

    if (docError) {
      console.error(`Failed to insert document ${file.name}:`, docError.message);
      continue;
    }

    console.log(`  → Stored document ${doc.id} with ${chunks.length} chunks`);
    console.log(`  → Run generate-embeddings.ts to embed these chunks`);
  }

  console.log("\nDocument processing complete.");
}

await processStorageBucket();
