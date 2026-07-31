/**
 * process-documents.ts
 *
 * Step 2 of the AI content pipeline:
 * - Reads ALL files from both Supabase Storage buckets:
 *     1. course-materials/  (handbook, student-notes, statutes)
 *     2. past-questions/    (past exam questions with answer keys)
 * - Detects course and file_type from folder path
 * - Stores document metadata in the `documents` table
 * - Skips files already processed (safe to re-run)
 *
 * Usage (run from your local terminal):
 *   npm run process-documents
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Course slug to UUID mapping
const COURSE_IDS: Record<string, string> = {
  "criminal-litigation":  "65e185b9-6471-4e13-b9fc-5a502b5b6c49",
  "civil-litigation":     "f3f9762e-2d0a-4258-b94e-5a544c1b9c98",
  "professional-ethics":  "a3e6e6a1-20c8-4a3b-bbc4-e2022db599b8",
  "company-law":          "8f524136-30f6-4a75-b660-c70338c1b090",
  "property-law":         "6b05c6f6-1093-4690-adce-4a814a9ff178",
};

type FileType = "pdf" | "docx" | "txt" | "image";
type ProcessedStatus = "pending" | "processing" | "completed" | "failed";

// Chunk text into segments of approximately targetTokens
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

// Parse file path into metadata
function parsePath(filePath: string) {
  const parts = filePath.split("/").filter(Boolean);
  const fileName = parts[parts.length - 1];
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const fileType: FileType = (["pdf", "docx", "txt", "image"].includes(ext) ? ext : "pdf") as FileType;
  const courseSlug = parts[0] ?? null;

  return {
    courseSlug,
    courseId: courseSlug ? (COURSE_IDS[courseSlug] ?? null) : null,
    fileType,
    fileName,
  };
}

// List all files in a bucket recursively
async function listAllFiles(bucket: string): Promise<string[]> {
  const allFiles: string[] = [];

  async function listFolder(prefix: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: 1000, sortBy: { column: "name", order: "asc" } });

    if (error) {
      console.error(`  Storage error listing ${bucket}/${prefix}:`, error.message);
      return;
    }

    for (const item of data ?? []) {
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.metadata) {
        // It's a file
        const ext = item.name.split(".").pop()?.toLowerCase();
        if (ext === "pdf" || ext === "docx" || ext === "txt") {
          allFiles.push(fullPath);
        }
      } else {
        // It's a folder — recurse into it
        await listFolder(fullPath);
      }
    }
  }

  await listFolder("");
  return allFiles;
}

// Process a single file
async function processFile(bucket: string, filePath: string): Promise<boolean> {
  const { courseSlug, courseId, fileType, fileName } = parsePath(filePath);

  if (!courseId) {
    console.warn(`  ⚠ Unknown course in path: ${filePath} — skipping`);
    return false;
  }

  // Check if already processed
  const { count } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("file_url", filePath);

  if ((count ?? 0) > 0) {
    console.log(`  → Already processed: ${fileName} — skipping`);
    return false;
  }

  // Download file
  const { data: fileData, error: dlError } = await supabase.storage
    .from(bucket)
    .download(filePath);

  if (dlError || !fileData) {
    console.error(`  ✗ Failed to download ${filePath}:`, dlError?.message);
    return false;
  }

  // Extract text (.txt works directly; PDFs still get registered as pending for later OCR)
  let text = "";
  let processedStatus: ProcessedStatus = "pending";

  try {
    text = await fileData.text();
    if (text.trim().length < 50) {
      console.warn(`  ⚠ File appears empty or binary (likely scanned PDF): ${fileName}`);
      text = "";
    }
  } catch {
    console.warn(`  ⚠ Could not read text from ${fileName}`);
    processedStatus = "failed";
  }

  const chunks = text.trim().length >= 50 ? chunkText(text) : [];

  // Insert into documents table with correct column names
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({
      course_id: courseId,
      file_name: fileName,
      file_url: filePath,
      file_type: fileType,
      total_chunks: chunks.length,
      processed_status: processedStatus,
    })
    .select("id")
    .single();

  if (docError) {
    console.error(`  ✗ DB insert failed for ${fileName}:`, docError.message);
    return false;
  }

  console.log(`  ✓ ${fileName} | course: ${courseSlug} | type: ${fileType} | ${chunks.length} chunks | status: ${processedStatus} | id: ${doc.id}`);
  return true;
}

// Main
async function main() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY not set in .env file");
    process.exit(1);
  }

  console.log("🚀 LawFlash Document Processor Starting...\n");

  const buckets = ["course-materials", "past-questions"];
  let totalProcessed = 0;
  let totalSkipped = 0;

  for (const bucket of buckets) {
    console.log(`\n📂 Bucket: ${bucket}`);
    console.log("─".repeat(50));

    const files = await listAllFiles(bucket);

    if (files.length === 0) {
      console.log(`  No files found in this bucket`);
      continue;
    }

    console.log(`  Found ${files.length} files\n`);

    for (const filePath of files) {
      console.log(`Processing: ${filePath}`);
      const success = await processFile(bucket, filePath);
      if (success) totalProcessed++;
      else totalSkipped++;
    }
  }

  console.log("\n" + "═".repeat(50));
  console.log(`✅ Complete!`);
  console.log(`   Processed: ${totalProcessed} documents`);
  console.log(`   Skipped:   ${totalSkipped}`);
  console.log(`\n👉 Next step: npm run generate-embeddings`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
