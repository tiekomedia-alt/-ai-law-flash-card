-- ============================================================
-- LawFlash AI — Full Database Schema Migration
-- Version: 1.1 | March 2026 (Fixed policy syntax)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN CREATE TYPE subscription_status AS ENUM ('free', 'premium', 'cancelled', 'past_due'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE flashcard_difficulty AS ENUM ('basic_recall', 'application', 'analysis'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE flashcard_status AS ENUM ('pending_review', 'approved', 'rejected', 'flagged'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE mcq_difficulty AS ENUM ('easy', 'medium', 'hard'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE mcq_source_type AS ENUM ('ai_generated', 'past_exam', 'curated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE content_status AS ENUM ('pending_review', 'approved', 'rejected', 'flagged'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE file_type AS ENUM ('pdf', 'docx', 'txt', 'image'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE processed_status AS ENUM ('pending', 'processing', 'completed', 'failed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE campus_type AS ENUM ('Abuja', 'Lagos', 'Enugu', 'Yola', 'Kano', 'Yenagoa', 'Other'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE leaderboard_period AS ENUM ('weekly', 'all_time'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  campus campus_type DEFAULT 'Other',
  subscription_status subscription_status DEFAULT 'free',
  streak_count INTEGER DEFAULT 0,
  xp_total INTEGER DEFAULT 0,
  avatar_url TEXT,
  selected_courses TEXT[] DEFAULT '{}',
  daily_card_target INTEGER DEFAULT 25,
  dark_mode BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  status subscription_status DEFAULT 'free',
  start_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  grace_period_end TIMESTAMPTZ,
  paystack_customer_id TEXT,
  paystack_subscription_code TEXT,
  amount_naira INTEGER DEFAULT 5000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'gavel',
  color TEXT DEFAULT '#1a3b70',
  total_chapters INTEGER DEFAULT 25,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.courses (name, description, icon, order_index, total_chapters) VALUES
  ('Criminal Litigation', 'Procedures, offences, sentencing, evidence, and appeals in criminal matters', 'gavel', 1, 25),
  ('Civil Litigation', 'Pleadings, pre-trial, trial, judgment, enforcement, and appeals in civil matters', 'balance', 2, 25),
  ('Professional Ethics', 'Legal Practitioners Act, rules of conduct, and disciplinary procedures', 'verified_user', 3, 25),
  ('Company Law & Practice', 'Incorporation, shares, directors, winding up, and mergers', 'corporate_fare', 4, 25),
  ('Property Law & Practice', 'Land use, conveyancing, tenancy, mortgages, and registration', 'domain', 5, 25)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  total_flashcards INTEGER DEFAULT 0,
  total_mcqs INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  difficulty flashcard_difficulty DEFAULT 'basic_recall',
  tags TEXT[] DEFAULT '{}',
  confidence_score FLOAT,
  status flashcard_status DEFAULT 'pending_review',
  source_reference TEXT,
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mcq_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
  explanation TEXT,
  difficulty mcq_difficulty DEFAULT 'medium',
  statutory_reference TEXT,
  source_type mcq_source_type DEFAULT 'ai_generated',
  status content_status DEFAULT 'pending_review',
  reviewed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  ease_factor FLOAT DEFAULT 2.5,
  interval_days INTEGER DEFAULT 0,
  next_review_date DATE DEFAULT CURRENT_DATE,
  times_reviewed INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  last_rating TEXT CHECK (last_rating IN ('hard', 'good', 'easy')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, flashcard_id)
);

CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 50,
  time_taken_seconds INTEGER,
  answers JSONB,
  topic_breakdown JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  is_complete BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  freeze_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  period leaderboard_period NOT NULL DEFAULT 'weekly',
  xp_earned INTEGER DEFAULT 0,
  rank INTEGER,
  week_start DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period, week_start)
);

CREATE TABLE IF NOT EXISTS public.content_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  flashcard_id UUID REFERENCES public.flashcards(id) ON DELETE CASCADE,
  mcq_id UUID REFERENCES public.mcq_questions(id) ON DELETE CASCADE,
  report_reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id),
  chapter_id UUID REFERENCES public.chapters(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type file_type DEFAULT 'pdf',
  file_size_bytes BIGINT,
  processed_status processed_status DEFAULT 'pending',
  total_chunks INTEGER DEFAULT 0,
  processing_error TEXT,
  uploaded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_flashcards_chapter_id ON public.flashcards(chapter_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_status ON public.flashcards(status);
CREATE INDEX IF NOT EXISTS idx_mcq_questions_chapter_id ON public.mcq_questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_mcq_questions_status ON public.mcq_questions(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_next_review ON public.user_progress(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON public.exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period_week ON public.leaderboard(period, week_start);
CREATE INDEX IF NOT EXISTS idx_chapters_course_id ON public.chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_documents_course_id ON public.documents(course_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_document_id ON public.embeddings(document_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- Note: PostgreSQL does NOT support "CREATE POLICY IF NOT EXISTS"
-- We drop each policy first, then recreate it cleanly.
-- ============================================================

-- users
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- subscriptions
DROP POLICY IF EXISTS "Users can read own subscription" ON public.subscriptions;
CREATE POLICY "Users can read own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- courses (public)
DROP POLICY IF EXISTS "Courses are public" ON public.courses;
CREATE POLICY "Courses are public" ON public.courses FOR SELECT USING (true);

-- chapters (public)
DROP POLICY IF EXISTS "Chapters are public" ON public.chapters;
CREATE POLICY "Chapters are public" ON public.chapters FOR SELECT USING (true);

-- flashcards (approved only, auth required)
DROP POLICY IF EXISTS "Approved flashcards visible to authenticated users" ON public.flashcards;
CREATE POLICY "Approved flashcards visible to authenticated users" ON public.flashcards
  FOR SELECT USING (auth.uid() IS NOT NULL AND status = 'approved');

-- mcq_questions
DROP POLICY IF EXISTS "Approved MCQs visible to authenticated users" ON public.mcq_questions;
CREATE POLICY "Approved MCQs visible to authenticated users" ON public.mcq_questions
  FOR SELECT USING (auth.uid() IS NOT NULL AND status = 'approved');

-- user_progress
DROP POLICY IF EXISTS "Users can read own progress" ON public.user_progress;
CREATE POLICY "Users can read own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- exam_attempts
DROP POLICY IF EXISTS "Users can read own exams" ON public.exam_attempts;
CREATE POLICY "Users can read own exams" ON public.exam_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own exams" ON public.exam_attempts;
CREATE POLICY "Users can insert own exams" ON public.exam_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- streaks
DROP POLICY IF EXISTS "Users can read own streak" ON public.streaks;
CREATE POLICY "Users can read own streak" ON public.streaks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own streak" ON public.streaks;
CREATE POLICY "Users can update own streak" ON public.streaks FOR UPDATE USING (auth.uid() = user_id);

-- xp_transactions
DROP POLICY IF EXISTS "Users can read own XP" ON public.xp_transactions;
CREATE POLICY "Users can read own XP" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);

-- leaderboard (public)
DROP POLICY IF EXISTS "Leaderboard is public" ON public.leaderboard;
CREATE POLICY "Leaderboard is public" ON public.leaderboard FOR SELECT USING (true);

-- content_reports
DROP POLICY IF EXISTS "Users can submit content reports" ON public.content_reports;
CREATE POLICY "Users can submit content reports" ON public.content_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can see own reports" ON public.content_reports;
CREATE POLICY "Users can see own reports" ON public.content_reports FOR SELECT USING (auth.uid() = user_id);

-- documents
DROP POLICY IF EXISTS "Authenticated users can read documents" ON public.documents;
CREATE POLICY "Authenticated users can read documents" ON public.documents FOR SELECT USING (auth.uid() IS NOT NULL);

-- embeddings (no direct client access)
DROP POLICY IF EXISTS "No direct client access to embeddings" ON public.embeddings;
CREATE POLICY "No direct client access to embeddings" ON public.embeddings FOR SELECT USING (false);

-- ============================================================
-- TRIGGER: Auto-create profile + streak + subscription on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.streaks (user_id) VALUES (NEW.id);
  INSERT INTO public.subscriptions (user_id, plan, status) VALUES (NEW.id, 'free', 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- TRIGGER: updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER set_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_flashcards_updated_at ON public.flashcards;
CREATE TRIGGER set_flashcards_updated_at BEFORE UPDATE ON public.flashcards FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER set_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_streaks_updated_at ON public.streaks;
CREATE TRIGGER set_streaks_updated_at BEFORE UPDATE ON public.streaks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- VECTOR SEARCH FUNCTION (for RAG pipeline)
-- ============================================================
CREATE OR REPLACE FUNCTION search_embeddings(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  p_course_id UUID DEFAULT NULL
)
RETURNS TABLE (id UUID, chunk_text TEXT, metadata JSONB, similarity FLOAT)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.chunk_text, e.metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM public.embeddings e
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
    AND (p_course_id IS NULL OR (e.metadata->>'course_id')::UUID = p_course_id)
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================
SELECT 'LawFlash AI schema migration complete! All 14 tables ready.' AS status;
