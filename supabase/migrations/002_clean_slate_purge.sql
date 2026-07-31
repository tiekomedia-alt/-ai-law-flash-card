-- ============================================================
-- LawFlash AI — Data Purge / Clean Slate Migration
-- Version: 1.0 | July 2026
-- Purges test data while leaving table schemas and RLS intact
-- ============================================================

TRUNCATE TABLE public.embeddings CASCADE;
TRUNCATE TABLE public.documents CASCADE;
TRUNCATE TABLE public.flashcards CASCADE;
TRUNCATE TABLE public.mcq_questions CASCADE;
TRUNCATE TABLE public.user_progress CASCADE;
TRUNCATE TABLE public.exam_attempts CASCADE;
TRUNCATE TABLE public.content_reports CASCADE;
TRUNCATE TABLE public.xp_transactions CASCADE;

SELECT 'LawFlash AI data purge complete! All content tables are reset for clean ingestion. 🧹' AS status;
